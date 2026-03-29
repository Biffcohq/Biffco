CREATE TABLE "pens" (
	"id" text PRIMARY KEY NOT NULL,
	"facility_id" text NOT NULL,
	"zone_id" text,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"capacity" text,
	"current_occupancy" text DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" text PRIMARY KEY NOT NULL,
	"facility_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"capacity" text,
	"polygon" jsonb,
	"gfw_status" text DEFAULT 'pending' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "parcels" CASCADE;--> statement-breakpoint
ALTER TABLE "pens" ADD CONSTRAINT "pens_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pens" ADD CONSTRAINT "pens_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pens" ADD CONSTRAINT "pens_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pens_workspace_id" ON "pens" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_pens_facility_id" ON "pens" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "idx_pens_zone_id" ON "pens" USING btree ("zone_id");--> statement-breakpoint
CREATE INDEX "idx_zones_workspace_id" ON "zones" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_zones_facility_id" ON "zones" USING btree ("facility_id");