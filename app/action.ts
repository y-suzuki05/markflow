"use server";

import { db } from "@/lib/db";
import { bookmarksTable } from "@/lib/db/schema";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ActionState = {
  errors?: {
    title?: string[];
    url?: string[];
    memo?: string[];
  };
};

const bookmarkSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(200, "200文字以内で入力してください"),
  url: z.httpUrl("http/https のURLを入力してください"),
  memo: z
    .string()
    .min(1, "メモを入力してください")
    .max(300, "300文字以内で入力してください"),
});

export async function addBookmark(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = bookmarkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    memo: formData.get("memo"),
  });

  if (!result.success) {
    const errors: NonNullable<ActionState["errors"]> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === "title" || field === "url" || field === "memo") {
        errors[field] ??= [];
        errors[field].push(issue.message);
      }
    }

    return { errors };
  }

  await db.insert(bookmarksTable).values(result.data);

  revalidatePath("/bookmarks");
  redirect("/bookmarks");
}
