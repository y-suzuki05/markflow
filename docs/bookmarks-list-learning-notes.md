# ブックマーク一覧で学んだこと

ブックマーク一覧を作る過程で、TypeScript で DB の形を定義し、変更をマイグレーションとして記録して Neon に反映し、Next.js の Server Component から読み取って表示する流れを実装した。

## 1. Drizzle のスキーマ定義

**スキーマ**は、データベースにどんなテーブルや列があり、どんな値を保存できるかを定めた設計図。

`lib/db/schema.ts` に Drizzle ORM の PostgreSQL 向け API を使って `bookmarks` テーブルを定義した。

- `pgTable` でテーブルを定義する。
- `serial`、`text`、`timestamp` で列の型を表す。
- `.primaryKey()`、`.notNull()`、`.defaultNow()` で主キー、必須、初期値を指定する。
- `check` 制約で `memo` の文字数を300文字以下にするルールを DB に定義した。

TypeScript のプロパティ名（例：`createdAt`）と DB の列名（`created_at`）は別々に指定できる。スキーマは DB の設計をコードで表したもので、編集しただけでは実際の DB は変わらない。

## 2. マイグレーションと Neon への反映

**マイグレーション**は、データベースの構造をある状態から次の状態へ変える手順を、再実行・共有できる形で記録したもの。

Drizzle Kit は Drizzle スキーマと前回の状態を比較し、DB に加える変更を SQL ファイルとして `drizzle/` に生成する。これをマイグレーションと呼ぶ。変更内容を順番に記録でき、別の環境でも同じ DB 構造を再現しやすくなる。

- `pnpm exec drizzle-kit generate`：スキーマ変更から SQL マイグレーションを生成する。
- `pnpm exec drizzle-kit migrate`：未適用のマイグレーションを接続先 DB に適用する。

Neon への反映では、`drizzle.config.ts` が `.env.local` の `DATABASE_URL` を読み、Drizzle Kit がその接続先へ SQL を実行した。これにより Neon 上にテーブルと制約が作られる。スキーマファイルや SQL ファイルを作っただけでは反映されず、migrate の実行が必要。

マイグレーション SQL と `drizzle/meta/` のスナップショット・ジャーナルは Git 管理する。接続 URL などの秘密情報を含む `.env.local` はコミットしない。

## 3. DB 接続

`lib/db/index.ts` で Neon Serverless Driver と Drizzle を組み合わせ、アプリ用の `db` を用意した。`server-only` を付け、DB 接続をブラウザ側のコードから誤って読み込まないようにしている。接続 URL は環境変数から取得する。

## 4. Server Component から一覧を取得

`app/bookmarks/page.tsx` は App Router のページで、デフォルトでは Server Component になる。ページ内の `getBookmarks` が `db.select().from(bookmarksTable)` で Drizzle の SELECT クエリを実行し、取得結果をページで表示する。

現在は `orderBy(desc(bookmarksTable.createdAt))` を指定し、新しいブックマークを先に表示する。DB の行順は指定しなければ保証されないため、要件に合う順序をクエリで明示する。

SELECT の結果は配列で、該当行がない場合は `[]` が返る。DB エラーとは区別し、0件は正常な状態としてページ側で空状態の案内を表示する。

## 5. DB の制約とアプリの入力検証

DB の `CHECK` 制約は、SQL Editor や別の処理から書き込む場合も含め、DB に不正な値が保存されるのを防ぐ。アプリ側の Zod 検証は、入力時に利用者へ分かりやすいエラーを返す役割を持つ。両者は目的が異なるため、登録機能を作る際は Zod の検証も実装する。

## 6. SQL Editor での確認・操作

Neon の SQL Editor では、SQL を直接実行してデータを確認・追加・更新できる。今回のように `SELECT` で状態を確認したり、一覧表示確認用のダミーデータを `INSERT` / `UPDATE` したりするのは、開発や調査でよく使う方法。

一方、アプリや環境の DB 構造を変更するときは、SQL Editor で場当たり的に変更するより、スキーマとマイグレーションに変更を記録して適用するのが基本。チームで変更履歴を共有し、開発・本番など複数環境へ同じ変更を再現できる。手動 SQL はデータの調査や一時的な開発データの操作に便利だが、重要な変更を行った場合は手順を記録し、他環境とのずれを避ける。

## 次に関連する学習

- 一覧の DB 取得エラーを `error.tsx` で扱う。
- 読み込み中 UI を `loading.tsx` で用意する。
- 登録の Server Action で INSERT し、Zod 検証とキャッシュ再検証を行う。
- 詳細ページで Dynamic Route の ID を使って1件取得し、存在しない場合に `notFound()` を呼ぶ。
