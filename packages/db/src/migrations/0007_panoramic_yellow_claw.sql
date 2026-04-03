CREATE TYPE "public"."transfer_status" AS ENUM('DRAFT_DISPATCH', 'PENDING_CARRIER_ACCEPTANCE', 'IN_TRANSIT', 'COMPLETED', 'REJECTED', 'DISPUTED');--> statement-breakpoint
CREATE TABLE "asset_transfers" (
	"id" text PRIMARY KEY NOT NULL,
	"sender_workspace_id" text NOT NULL,
	"carrier_workspace_id" text,
	"receiver_workspace_id" text NOT NULL,
	"asset_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "transfer_status" DEFAULT 'DRAFT_DISPATCH' NOT NULL,
	"resolution_chain_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dispatched_at" timestamp with time zone,
	"carrier_accepted_at" timestamp with time zone,
	"received_at" timestamp with time zone,
	"rejected_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "asset_transfers" ADD CONSTRAINT "asset_transfers_sender_workspace_id_workspaces_id_fk" FOREIGN KEY ("sender_workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_transfers" ADD CONSTRAINT "asset_transfers_carrier_workspace_id_workspaces_id_fk" FOREIGN KEY ("carrier_workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_transfers" ADD CONSTRAINT "asset_transfers_receiver_workspace_id_workspaces_id_fk" FOREIGN KEY ("receiver_workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_transfers_sender" ON "asset_transfers" USING btree ("sender_workspace_id");--> statement-breakpoint
CREATE INDEX "idx_transfers_carrier" ON "asset_transfers" USING btree ("carrier_workspace_id");--> statement-breakpoint
CREATE INDEX "idx_transfers_receiver" ON "asset_transfers" USING btree ("receiver_workspace_id");--> statement-breakpoint
CREATE INDEX "idx_transfers_status" ON "asset_transfers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_transfers_chain" ON "asset_transfers" USING btree ("resolution_chain_id");