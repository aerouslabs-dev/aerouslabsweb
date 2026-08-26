export type Tool = {
  id: number
  name: string
  color: string
}

export type AppAllocation = {
  toolId: number
  percentage: number
}

export type ShowcaseApp = {
  id: number
  name: string
  tagline: string
  category: string
  status: string
  nature: string
  version: string
  imageKey: string | null
  link: string | null
  sortOrder: number
  allocations: AppAllocation[]
}

export type RoadmapItem = {
  id: number
  title: string
  description: string
  version: string
  status: string
  sortOrder: number
}

export type SiteSettings = {
  id: number
  heroTitle: string
  heroSubtitle: string
  bannerText: string
  bannerLink: string | null
  bannerEnabled: boolean
  statusLabel: string
}

export type MatrixEntry = {
  toolId: number
  name: string
  color: string
  weightedPercentage: number
}

export type Matrix = {
  hasData: boolean
  entries: MatrixEntry[]
  appCount: number
}

export type PublicData = {
  settings: SiteSettings
  apps: ShowcaseApp[]
  tools: Tool[]
  roadmap: RoadmapItem[]
  matrix: Matrix
}

export const APP_STATUSES = ['Production', 'Beta', 'In Development'] as const
export const APP_NATURES = ['Dummy', 'Beta', 'Web APK', 'Release App', 'APK'] as const
export const ROADMAP_STATUSES = ['Planned', 'In Progress', 'Completed'] as const
