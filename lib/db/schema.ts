import { serial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const bookmarksTable = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  memo: text("memo").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
