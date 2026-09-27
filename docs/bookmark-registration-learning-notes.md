# ブックマーク登録画面で学んだこと

登録画面では、フォーム送信を Server Action で受け取り、サーバー側で Zod 検証を行い、Drizzle で Neon の PostgreSQL に保存する流れを実装した。入力やエラー表示に必要な範囲だけを Client Component にしている。

## 1. Server Action とフォーム送信

**Server Action** は、フォームなどから呼び出してサーバー上で実行する関数。フォームの `action` に渡すと、入力値を含む `FormData` を受け取れる。

`app/action.ts` の `addBookmark` は、フォームデータを検証し、DB に登録する。`"use server"` によってサーバー専用の Action として定義している。外部 API を作る Route Handler と違い、今回は画面内のフォーム送信から直接呼び出す。

各入力の `name` が FormData から値を取り出すキーになる。

```ts
formData.get("title")
```

`FormData.get()` の値は文字列とは限らず、未入力やファイルの場合もある。受け取ったデータを信頼せず、サーバー側で検証してから保存する。

## 2. Zod によるサーバー側検証

Zod は入力値がアプリのルールを満たすかを実行時に検証するライブラリ。今回のスキーマではタイトルとメモの必須・最大文字数、URL の HTTP/HTTPS 形式を確認する。

`safeParse()` は検証に成功したデータか、失敗した内容を返す。成功時だけ `result.data` を Drizzle の INSERT に渡す。クライアント側の `required` や `type="url"` は入力時の補助であり、サーバー側の検証の代わりにはならない。

## 3. `useActionState` と Action の状態

`useActionState` は Server Action をフォームへつなぎ、Action が返した状態と送信中かどうかを Client Component で受け取る React Hook。

```tsx
const [state, formAction, pending] = useActionState(
  addBookmark,
  initialState,
);
```

- `initialState` は最初のフォーム状態。今はエラーがない状態。
- `formAction` は `<form action={formAction}>` に渡す送信処理。
- `pending` は送信中かどうか。
- `state` は Action が返した結果。今回の型 `ActionState` では項目ごとのエラーを持つ。

`useActionState` を使う Action は、前回の状態と `FormData` を受け取る。検証エラーは `{ errors: { title: ["..."] } }` のような単純なデータとして返し、画面側で `Field.ErrorText` に表示する。Zod の Error インスタンスそのものではなく、文字列・配列・オブジェクトに変換して返すことで、サーバーとクライアントの境界を安全に越えられる。

## 4. Client Component と入力値の保持

`app/bookmarks/new/page.tsx` は Server Component のままにし、入力操作と `useActionState` を使う `BookmarkForm` だけを Client Component に切り出した。

入力値はフォーム側の `useState` で保持し、各入力に `value` と `onChange` を設定している。これにより、Action が Zod のエラーを返して再描画しても、入力中の値はそのまま残る。入力値の state と Action の state は役割が異なり、前者は編集中の値、後者は送信結果（エラー）を持つ。

エラー表示用の領域には最低限の高さを設け、エラーメッセージが出ても後続のフォーム要素がずれにくくした。`aria-live="polite"` は更新されたエラーを支援技術にも伝える。

## 5. INSERT・キャッシュ再検証・リダイレクト

検証に成功したデータを `db.insert(bookmarksTable).values(result.data)` で保存する。`id` と `created_at` は DB 側で自動設定するため、INSERT の値には含めない。

登録後は `revalidatePath("/bookmarks")` で一覧の表示を更新対象にし、`redirect("/bookmarks")` で一覧へ移動する。`redirect()` は Next.js の制御フローとして処理を終えるため、成功後に呼び出す。

## 仕様との照合

仕様書の「HTML form → Server Action → Zod → DB INSERT → キャッシュ更新 → redirect」という登録の流れを実装した。入力エラーはフォーム上に項目別で表示し、送信中はボタンを無効化して状態を示す。
