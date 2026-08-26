CREATE TABLE "app_tool_allocations" (
	"id" serial PRIMARY KEY,
	"app_id" integer NOT NULL,
	"tool_id" integer NOT NULL,
	"percentage" real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "apps" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'App' NOT NULL,
	"status" text DEFAULT 'In Development' NOT NULL,
	"nature" text DEFAULT 'Beta' NOT NULL,
	"version" text DEFAULT 'v0.1.0' NOT NULL,
	"image_key" text,
	"link" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY,
	"name" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roadmap_items" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"version" text DEFAULT 'v1.0' NOT NULL,
	"status" text DEFAULT 'Planned' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1,
	"hero_title" text DEFAULT 'ENGINEERING THE FUTURE OF LOCAL INTELLIGENCE.' NOT NULL,
	"hero_subtitle" text DEFAULT 'Aerous Labs designs and ships privacy-first, on-device intelligent software — crafted with obsessive precision and shipped at studio speed.' NOT NULL,
	"banner_text" text DEFAULT '🚀 Walletly v1.0 Android APK Released' NOT NULL,
	"banner_link" text,
	"banner_enabled" boolean DEFAULT true NOT NULL,
	"status_label" text DEFAULT 'Aerous Systems 100% Operational' NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"color" text DEFAULT '#00F2FE' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "app_tool_allocations" ADD CONSTRAINT "app_tool_allocations_app_id_apps_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "app_tool_allocations" ADD CONSTRAINT "app_tool_allocations_tool_id_tools_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE;