CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"memo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
