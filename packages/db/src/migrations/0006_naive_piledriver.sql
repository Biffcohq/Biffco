ALTER TABLE "assets" ADD COLUMN "parent_ids" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_assets_parent_ids" ON "assets" USING gin ("parent_ids");