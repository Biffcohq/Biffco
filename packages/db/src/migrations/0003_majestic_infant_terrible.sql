CREATE TABLE "anchored_events" (
	"event_id" text NOT NULL,
	"anchor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "anchors_log" ADD COLUMN "network" text DEFAULT 'polygon-amoy' NOT NULL;--> statement-breakpoint
ALTER TABLE "anchors_log" ADD COLUMN "status" text DEFAULT 'confirmed' NOT NULL;--> statement-breakpoint
ALTER TABLE "anchored_events" ADD CONSTRAINT "anchored_events_event_id_domain_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."domain_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anchored_events" ADD CONSTRAINT "anchored_events_anchor_id_anchors_log_id_fk" FOREIGN KEY ("anchor_id") REFERENCES "public"."anchors_log"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_anchored_events_anchor" ON "anchored_events" USING btree ("anchor_id");