CREATE TABLE IF NOT EXISTS "hero_powers" (
	"hero_id" integer NOT NULL,
	"power_id" integer NOT NULL,
	CONSTRAINT "hero_powers_hero_id_power_id_pk" PRIMARY KEY("hero_id","power_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "powers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"founded_year" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "superheroes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"alias" varchar(100) NOT NULL,
	"power_level" integer DEFAULT 1 NOT NULL,
	"publisher_id" integer,
	"team_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_powers" ADD CONSTRAINT "hero_powers_hero_id_superheroes_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."superheroes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_powers" ADD CONSTRAINT "hero_powers_power_id_powers_id_fk" FOREIGN KEY ("power_id") REFERENCES "public"."powers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "superheroes" ADD CONSTRAINT "superheroes_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."publishers"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "superheroes" ADD CONSTRAINT "superheroes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "powers_name_idx" ON "powers" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "publishers_name_idx" ON "publishers" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "superheroes_alias_idx" ON "superheroes" USING btree ("alias");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "teams_name_idx" ON "teams" USING btree ("name");