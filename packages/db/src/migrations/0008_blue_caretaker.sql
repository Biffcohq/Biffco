ALTER TABLE "workspaces" ADD COLUMN "roles" jsonb DEFAULT '["PRODUCER"]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "alias" text;--> statement-breakpoint
CREATE INDEX "idx_workspace_alias" ON "workspaces" USING btree ("alias");--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_alias_unique" UNIQUE("alias");