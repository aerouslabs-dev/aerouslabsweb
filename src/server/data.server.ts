import { eq, asc } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { apps, appToolAllocations, tools, roadmapItems, siteSettings, feedback } from '../../db/schema.js'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'adminaera56917'
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'aerous-labs-obsidian-hexagon-secret'

async function hmac(input: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(input))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyAdminCredentials(username: string, password: string) {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) return null
  return hmac(`${ADMIN_USERNAME}:session`)
}

export async function isValidAdminToken(token: string | undefined | null) {
  if (!token) return false
  const expected = await hmac(`${ADMIN_USERNAME}:session`)
  return token === expected
}

async function ensureSettingsRow() {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1))
  if (rows[0]) return rows[0]
  const [created] = await db.insert(siteSettings).values({ id: 1 }).returning()
  return created
}

export async function getSiteSettings() {
  return ensureSettingsRow()
}

export async function updateSiteSettings(values: Partial<typeof siteSettings.$inferInsert>) {
  await ensureSettingsRow()
  const [updated] = await db
    .update(siteSettings)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(siteSettings.id, 1))
    .returning()
  return updated
}

export async function listTools() {
  return db.select().from(tools).orderBy(asc(tools.name))
}

export async function createTool(name: string, color: string) {
  const [created] = await db.insert(tools).values({ name, color }).returning()
  return created
}

export async function deleteTool(id: number) {
  await db.delete(appToolAllocations).where(eq(appToolAllocations.toolId, id))
  await db.delete(tools).where(eq(tools.id, id))
  return { success: true }
}

export async function listAppsWithAllocations() {
  const allApps = await db.select().from(apps).orderBy(asc(apps.sortOrder), asc(apps.id))
  const allAllocations = await db.select().from(appToolAllocations)
  return allApps.map((app) => ({
    ...app,
    allocations: allAllocations
      .filter((a) => a.appId === app.id)
      .map((a) => ({ toolId: a.toolId, percentage: a.percentage })),
  }))
}

export type AppInput = {
  name: string
  tagline: string
  category: string
  status: string
  nature: string
  version: string
  imageKey?: string | null
  link?: string | null
  sortOrder?: number
  allocations: Array<{ toolId: number; percentage: number }>
}

export async function createApp(input: AppInput) {
  const [created] = await db
    .insert(apps)
    .values({
      name: input.name,
      tagline: input.tagline,
      category: input.category,
      status: input.status,
      nature: input.nature,
      version: input.version,
      imageKey: input.imageKey ?? null,
      link: input.link ?? null,
      sortOrder: input.sortOrder ?? 0,
    })
    .returning()
  await syncAllocations(created.id, input.allocations)
  return created
}

export async function updateApp(id: number, input: AppInput) {
  const [updated] = await db
    .update(apps)
    .set({
      name: input.name,
      tagline: input.tagline,
      category: input.category,
      status: input.status,
      nature: input.nature,
      version: input.version,
      imageKey: input.imageKey ?? null,
      link: input.link ?? null,
      sortOrder: input.sortOrder ?? 0,
      updatedAt: new Date(),
    })
    .where(eq(apps.id, id))
    .returning()
  await syncAllocations(id, input.allocations)
  return updated
}

async function syncAllocations(appId: number, allocations: Array<{ toolId: number; percentage: number }>) {
  await db.delete(appToolAllocations).where(eq(appToolAllocations.appId, appId))
  const valid = allocations.filter((a) => a.percentage > 0)
  if (valid.length > 0) {
    await db.insert(appToolAllocations).values(
      valid.map((a) => ({ appId, toolId: a.toolId, percentage: a.percentage })),
    )
  }
}

export async function deleteApp(id: number) {
  await db.delete(appToolAllocations).where(eq(appToolAllocations.appId, id))
  await db.delete(apps).where(eq(apps.id, id))
  return { success: true }
}

export async function getTransparencyMatrix() {
  const allApps = await db.select().from(apps)
  const allTools = await listTools()
  const allAllocations = await db.select().from(appToolAllocations)

  if (allApps.length === 0 || allTools.length === 0) {
    return { hasData: false, entries: [], appCount: allApps.length }
  }

  const entries = allTools.map((tool) => {
    const total = allApps.reduce((sum, app) => {
      const allocation = allAllocations.find((a) => a.appId === app.id && a.toolId === tool.id)
      return sum + (allocation ? allocation.percentage : 0)
    }, 0)
    const weighted = total / allApps.length
    return { toolId: tool.id, name: tool.name, color: tool.color, weightedPercentage: weighted }
  })

  const hasAnyAllocation = allAllocations.length > 0
  return { hasData: hasAnyAllocation, entries, appCount: allApps.length }
}

export async function listRoadmap() {
  return db.select().from(roadmapItems).orderBy(asc(roadmapItems.sortOrder), asc(roadmapItems.id))
}

export async function createRoadmapItem(input: {
  title: string
  description: string
  version: string
  status: string
  sortOrder: number
}) {
  const [created] = await db.insert(roadmapItems).values(input).returning()
  return created
}

export async function updateRoadmapItem(
  id: number,
  input: { title: string; description: string; version: string; status: string; sortOrder: number },
) {
  const [updated] = await db.update(roadmapItems).set(input).where(eq(roadmapItems.id, id)).returning()
  return updated
}

export async function deleteRoadmapItem(id: number) {
  await db.delete(roadmapItems).where(eq(roadmapItems.id, id))
  return { success: true }
}

export async function submitFeedback(input: { name: string; email: string; message: string }) {
  const [created] = await db.insert(feedback).values(input).returning()
  return created
}

export async function listFeedback() {
  const rows = await db.select().from(feedback)
  return rows.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
}

export async function deleteFeedback(id: number) {
  await db.delete(feedback).where(eq(feedback.id, id))
  return { success: true }
}
