import { sql } from "drizzle-orm";
import {
  check,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const bookmarksTable = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    memo: text("memo").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    check("bookmarks_memo_length_check", sql`char_length(${table.memo}) <= 300`),
  ],
);