CREATE TABLE "facilities" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"location" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_facilities_workspace_id" ON "facilities" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_employees_workspace_id" ON "employees" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_teams_workspace_id" ON "teams" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_workspace_members_workspace_id" ON "workspace_members" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_asset_groups_workspace_id" ON "asset_groups" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_asset_groups_vertical_id" ON "asset_groups" USING btree ("vertical_id");--> statement-breakpoint
CREATE INDEX "idx_assets_workspace_id" ON "assets" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_assets_group_id" ON "assets" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "idx_assets_vertical_id" ON "assets" USING btree ("vertical_id");--> statement-breakpoint
CREATE INDEX "idx_assets_status" ON "assets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_assets_location_id" ON "assets" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "idx_anchors_log_workspace_id" ON "anchors_log" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_asset_certifications_asset_id" ON "asset_certifications" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_asset_certifications_certifier" ON "asset_certifications" USING btree ("certifier_id");--> statement-breakpoint
CREATE INDEX "idx_domain_events_workspace_id" ON "domain_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_domain_events_stream" ON "domain_events" USING btree ("stream_id","global_id");--> statement-breakpoint
CREATE INDEX "idx_holds_asset_id" ON "holds" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_holds_workspace_id" ON "holds" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_transfer_offers_from_workspace" ON "transfer_offers" USING btree ("from_workspace_id");--> statement-breakpoint
CREATE INDEX "idx_transfer_offers_to_workspace" ON "transfer_offers" USING btree ("to_workspace_id");--> statement-breakpoint
CREATE INDEX "idx_transfer_offers_asset_id" ON "transfer_offers" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_transfer_offers_status" ON "transfer_offers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_parcels_workspace_id" ON "parcels" USING btree ("workspace_id");