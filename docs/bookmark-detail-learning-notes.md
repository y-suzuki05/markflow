# ブックマーク詳細画面で学んだこと

詳細画面では、URL の ID を使って DB から1件を取得し、Server Component で表示した。URL コピーに必要なブラウザ API だけを Client Component に分けた。

## 1. Dynamic Route と `params`

`app/bookmarks/[id]/page.tsx` の `[id]` は動的ルートセグメントで、`/bookmarks/4` の `4` が `params.id` として渡る。Next.js 16 では `params` は Promise なので、`await params` で値を取り出す。

URL の値は文字列なので、DB の整数 ID と比較する前に `Number()` で数値に変換する。`Number.isInteger(id)` と `id < 1` の確認を DB 検索より先に行い、不正な ID でクエリを実行しないようにした。

## 2. Drizzle の `where` と1件取得

Drizzle の `where` は検索条件を受け取る。`eq(bookmarksTable.id, id)` は「bookmarks テーブルの id 列が、指定した id と等しい」という条件を表す。

```ts
db.select().from(bookmarksTable).where(eq(bookmarksTable.id, id))
```

`select()` の結果は配列。ID は主キーなので該当行は最大1件だが、存在しない場合は0件もあり得る。取得関数内で `rows[0]` を返すと、呼び出し側では1件または `undefined` として扱え、表示コードがすっきりする。

```ts
const rows = await db.select().from(bookmarksTable).where(...);
return rows[0];
```

## 3. 存在しない ID と404

不正な形式の ID と、形式は正しいが DB に存在しない ID は、どちらも詳細ページを表示できない状態。現在は簡易メッセージを表示している。仕様では `notFound()` を呼び、`app/bookmarks/[id]/not-found.tsx` の404 UIへ分岐する想定。これは次に仕上げる項目。

## 4. Server Component と Client Component の境界

詳細ページはデフォルトの Server Component として DB クエリを実行する。DB 接続情報や取得処理をブラウザへ送らずに済む。

クリップボード操作には `navigator.clipboard` というブラウザ API が必要なので、`"use client"` を付けた `UrlCopyButton` に切り出した。サーバー側から Client Component へ `url` を props として渡す。ここでは文字列だけを渡しており、シリアライズ可能な値なので境界を越えて受け渡せる。

## 5. Clipboard API と Toast

`navigator.clipboard.writeText(url)` はクリップボードへの書き込みを非同期で行う。成功・失敗を `try/catch` で分け、Chakra UI v3 の toaster に通知を出す。Clipboard API はユーザー操作に応じて呼び出し、安全なコンテキスト（HTTPS または localhost）で利用する。

Toaster の表示領域は `Providers` 内に一度配置し、アプリ全体から共有する。コピー用ボタン側は `toaster.create(...)` で通知を追加する。

## 仕様との照合・残作業

仕様書の詳細画面にある、動的ルート、Server Component からの Drizzle 取得、URL コピー、外部サイトを別タブで開く機能を実装した。存在しない ID で `notFound()` に分岐する404処理は未完了。
