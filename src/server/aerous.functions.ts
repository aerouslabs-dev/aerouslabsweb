import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import * as data from './data.server.js'
import { verifyAdminCredentials, isValidAdminToken } from './data.server.js'
import { saveImage, deleteImage } from './image.server.js'

async function requireAdmin(token: string | undefined) {
  const ok = await isValidAdminToken(token)
  if (!ok) throw new Error('Unauthorized')
}

// ---------- Public ----------

export const getPublicData = createServerFn({ method: 'GET' }).handler(async () => {
  const [settings, appsList, toolsList, roadmap, matrix] = await Promise.all([
    data.getSiteSettings(),
    data.listAppsWithAllocations(),
    data.listTools(),
    data.listRoadmap(),
    data.getTransparencyMatrix(),
  ])
  return { settings, apps: appsList, tools: toolsList, roadmap, matrix }
})

export const submitFeedback = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().max(120).default(''),
      email: z.string().max(200).default(''),
      message: z.string().min(1).max(2000),
    }),
  )
  .handler(async ({ data: input }) => {
    return data.submitFeedback(input)
  })

// ---------- Auth ----------

export const adminLogin = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data: input }) => {
    const token = await verifyAdminCredentials(input.username, input.password)
    if (!token) return { success: false as const }
    return { success: true as const, token }
  })

// ---------- Admin: settings ----------

export const adminGetAll = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    const [settings, appsList, toolsList, roadmap, feedbackList] = await Promise.all([
      data.getSiteSettings(),
      data.listAppsWithAllocations(),
      data.listTools(),
      data.listRoadmap(),
      data.listFeedback(),
    ])
    return { settings, apps: appsList, tools: toolsList, roadmap, feedback: feedbackList }
  })

export const adminUpdateSettings = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      token: z.string(),
      heroTitle: z.string().min(1),
      heroSubtitle: z.string().min(1),
      bannerText: z.string(),
      bannerLink: z.string().nullable().optional(),
      bannerEnabled: z.boolean(),
      statusLabel: z.string(),
    }),
  )
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    const { token, ...values } = input
    return data.updateSiteSettings(values)
  })

// ---------- Admin: tools ----------

export const adminCreateTool = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string(), name: z.string().min(1), color: z.string().min(1) }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    return data.createTool(input.name, input.color)
  })

export const adminDeleteTool = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string(), id: z.number() }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    return data.deleteTool(input.id)
  })

// ---------- Admin: apps ----------

const AppInputSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().default(''),
  category: z.string().default('App'),
  status: z.string().default('In Development'),
  nature: z.string().default('Beta'),
  version: z.string().default('v0.1.0'),
  imageKey: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  sortOrder: z.number().default(0),
  allocations: z.array(z.object({ toolId: z.number(), percentage: z.number() })).default([]),
})

export const adminCreateApp = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string() }).extend({ app: AppInputSchema }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    return data.createApp(input.app)
  })

export const adminUpdateApp = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string(), id: z.number(), app: AppInputSchema }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    return data.updateApp(input.id, input.app)
  })

export const adminDeleteApp = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string(), id: z.number(), imageKey: z.string().nullable().optional() }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    if (input.imageKey) await deleteImage(input.imageKey)
    return data.deleteApp(input.id)
  })

export const adminUploadImage = createServerFn({ method: 'POST' })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data: formData }) => {
    const token = formData.get('token') as string
    await requireAdmin(token)
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')
    const buffer = await file.arrayBuffer()
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`
    await saveImage(key, buffer, file.type || 'image/png')
    return { key, url: `/api/image/${key}` }
  })

// ---------- Admin: roadmap ----------

const RoadmapInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  version: z.string().default('v1.0'),
  status: z.string().default('Planned'),
  sortOrder: z.number().default(0),
})

export const adminCreateRoadmapItem = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string(), item: RoadmapInputSchema }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    return data.createRoadmapItem(input.item)
  })

export const adminUpdateRoadmapItem = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string(), id: z.number(), item: RoadmapInputSchema }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    return data.updateRoadmapItem(input.id, input.item)
  })

export const adminDeleteRoadmapItem = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string(), id: z.number() }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    return data.deleteRoadmapItem(input.id)
  })

export const adminDeleteFeedback = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string(), id: z.number() }))
  .handler(async ({ data: input }) => {
    await requireAdmin(input.token)
    return data.deleteFeedback(input.id)
  })
