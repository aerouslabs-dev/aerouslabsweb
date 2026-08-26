import { pgTable, serial, text, integer, timestamp, boolean, real } from 'drizzle-orm/pg-core'

export const tools = pgTable('tools', {
  id: serial().primaryKey(),
  name: text().notNull(),
  color: text('color').notNull().default('#00F2FE'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const apps = pgTable('apps', {
  id: serial().primaryKey(),
  name: text().notNull(),
  tagline: text().notNull().default(''),
  category: text().notNull().default('App'),
  status: text().notNull().default('In Development'), // Production | Beta | In Development
  nature: text().notNull().default('Beta'), // Dummy | Beta | Web APK | Release App | APK
  version: text().notNull().default('v0.1.0'),
  imageKey: text('image_key'),
  link: text(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const appToolAllocations = pgTable('app_tool_allocations', {
  id: serial().primaryKey(),
  appId: integer('app_id').notNull().references(() => apps.id, { onDelete: 'cascade' }),
  toolId: integer('tool_id').notNull().references(() => tools.id, { onDelete: 'cascade' }),
  percentage: real().notNull().default(0),
})

export const roadmapItems = pgTable('roadmap_items', {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull().default(''),
  version: text().notNull().default('v1.0'),
  status: text().notNull().default('Planned'), // Planned | In Progress | Completed
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const siteSettings = pgTable('site_settings', {
  id: integer().primaryKey().default(1),
  heroTitle: text('hero_title').notNull().default('ENGINEERING THE FUTURE OF LOCAL INTELLIGENCE.'),
  heroSubtitle: text('hero_subtitle').notNull().default(
    'Aerous Labs designs and ships privacy-first, on-device intelligent software — crafted with obsessive precision and shipped at studio speed.',
  ),
  bannerText: text('banner_text').notNull().default('🚀 Walletly v1.0 Android APK Released'),
  bannerLink: text('banner_link'),
  bannerEnabled: boolean('banner_enabled').notNull().default(true),
  statusLabel: text('status_label').notNull().default('Aerous Systems 100% Operational'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const feedback = pgTable('feedback', {
  id: serial().primaryKey(),
  name: text().notNull().default(''),
  email: text().notNull().default(''),
  message: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
