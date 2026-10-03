# MarkFlow

気になる記事や、もう一度読みたい記事を、タイトル・URL・一言メモとともに保存する個人用ブックマークアプリ。

Next.js App Router の復習を目的に、Server Components、Client Components、Server Actions、エラー処理、キャッシュと再検証を実装した。

## 機能

- ブックマークの一覧表示（登録日時の新しい順）・詳細表示
- タイトル・URL・一言メモの登録と入力検証
- 元記事を別タブで開く、URLのクリップボードコピーと結果通知
- 入力エラー、404、取得エラー、読み込み中のUI
- 一覧・詳細取得のキャッシュと、登録後の一覧再検証
- PC・スマートフォン向けの表示

認証・複数ユーザー対応、編集・削除、検索、タグ、ページネーションは今回の対象外。

## 技術構成

| 分類                  | 技術                                  |
| --------------------- | ------------------------------------- |
| フレームワーク        | Next.js 16.3.6 / App Router           |
| UI                    | React 19 / Chakra UI v3               |
| 言語                  | TypeScript                            |
| 入力検証              | Zod                                   |
| ORM・マイグレーション | Drizzle ORM / Drizzle Kit             |
| DB                    | PostgreSQL / Neon                     |
| パッケージ管理        | pnpm（`package.json` の指定は12.6.0） |

開発・本番ビルドにはWebpackを使用する。Cache Components は `next.config.ts` で有効にしている。

## ローカルでのセットアップ

### 1. 依存パッケージのインストール

Node.jsと、このプロジェクトの指定に対応するpnpmを用意し、リポジトリのルートで実行する。

```bash
pnpm install
```

### 2. 環境変数の設定

NeonのPostgreSQLデータベースを用意し、接続文字列をルートの `.env.local` に設定する。

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

上記は書式例。実際の値はNeonで取得した接続文字列を使う。`.env.local` はGit管理の対象外で、接続情報はコミットしない。

アプリのDB接続とDrizzle Kitの両方が `DATABASE_URL` を使う。Drizzle Kitは `drizzle.config.ts` から `.env.local` を読み込む。

### 3. DBマイグレーションの適用

```bash
pnpm exec drizzle-kit migrate
```

`drizzle/` にある未適用のマイグレーションを接続先DBに反映する。初回は `bookmarks` テーブルとメモの文字数制約を作成する。

### 4. 開発サーバーの起動

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開く。

## 本番モードでの確認

```bash
pnpm build
pnpm start
```

ビルド成功後に本番サーバーを起動する。開発サーバーが同じポートで動いている場合は、先に停止する。

一覧取得をキャッシュし、ビルド時にも事前生成するため、**ビルド時に `DATABASE_URL` とDBへの接続が必要**。先にマイグレーションを適用しておく。

## 開発用コマンド

| コマンド                         | 内容                                   |
| -------------------------------- | -------------------------------------- |
| `pnpm dev`                       | 開発サーバーの起動                     |
| `pnpm build`                     | 本番ビルド                             |
| `pnpm start`                     | 本番ビルド済みのアプリを起動           |
| `pnpm lint`                      | ESLintによる確認                       |
| `pnpm exec tsc --noEmit`         | TypeScriptの型チェック                 |
| `pnpm format`                    | `app/` 配下のTS・TSX・CSSを整形        |
| `pnpm exec drizzle-kit generate` | スキーマ変更からマイグレーションを生成 |
| `pnpm exec drizzle-kit migrate`  | マイグレーションをDBに適用             |

DB構造を変更する場合は、`lib/db/schema.ts` を編集して `generate` を実行し、生成されたSQLを確認してから `migrate` する。SQLと `drizzle/meta/` はGit管理する。

## 画面と入力ルール

| パス              | 内容                       |
| ----------------- | -------------------------- |
| `/`               | アプリの説明と一覧への入口 |
| `/bookmarks`      | ブックマーク一覧           |
| `/bookmarks/new`  | 新規登録                   |
| `/bookmarks/[id]` | ブックマーク詳細           |

| 項目     | ルール               |
| -------- | -------------------- |
| タイトル | 必須、1〜200文字     |
| URL      | 必須、HTTP/HTTPS形式 |
| 一言メモ | 必須、1〜300文字     |

Server ActionでZodによる検証を行い、成功時だけDBへ保存する。登録後は `revalidatePath("/bookmarks")` を呼び、一覧へリダイレクトする。

## 主なファイル

| ファイル・ディレクトリ                | 役割                                   |
| ------------------------------------- | -------------------------------------- |
| `app/layout.tsx`、`app/providers.tsx` | 共通レイアウト、ChakraProvider、通知UI |
| `app/action.ts`                       | 登録・入力検証・一覧の再検証           |
| `app/not-found.tsx`、`app/error.tsx`  | 共通404、取得エラー・再試行            |
| `app/loading.tsx`                     | 共通Skeleton                           |
| `app/bookmarks/[id]/loading.tsx`      | 詳細ルートで共通ローディングを再利用   |
| `app/components/`                     | 登録フォーム、URLコピーボタン          |
| `lib/db/`                             | DB接続・スキーマ                       |
| `drizzle/`                            | マイグレーション                       |
| `docs/`                               | 要件定義・学習メモ                     |

共通ローディングは、内部エラーページの事前生成時にも単独で描画できるよう、自身のChakraProviderを持つ。

## 確認状況

本番ビルドと本番モードでの操作確認は完了。開発中に404・エラー・Skeletonの表示、一覧のキャッシュ再利用、登録後の即時反映も確認した。テストコードは今回の対象外とし、手動で確認している。

変更後は、必要に応じて次の操作を確認する。

- トップ・一覧・登録・詳細の画面遷移
- 登録後の一覧と詳細への反映、入力エラー表示
- 元記事を開く、URLコピー
- 不正ID・存在しないID・存在しないURLでの404表示
- 取得エラー時の表示と、障害解消後の再試行
- PC・スマートフォンでの余白、折り返し、ボタン配置

## 公開方針

VercelとNeonの無料枠で公開する予定。公開前に利用条件・無料枠を確認し、課金が必要になる場合は公開しない。

公開準備では、Vercelのビルド・実行環境に `DATABASE_URL` を設定し、接続先DBへマイグレーションを適用する。認証は実装していないため、公開すると第三者も一覧・詳細の閲覧や登録ができる。機密情報は保存しない。

公開URL：未記載（デプロイ後に追記）

## 要件定義・学習メモ

- [簡易要件定義・学習設計書](docs/bookmark_app_requirements_learning_spec.md)
- [一覧画面・DBの学習メモ](docs/bookmarks-list-learning-notes.md)
- [詳細画面の学習メモ](docs/bookmark-detail-learning-notes.md)
- [登録画面の学習メモ](docs/bookmark-registration-learning-notes.md)
- [404・エラー・ローディング・キャッシュの学習メモ](docs/bookmark-error-loading-cache-learning-notes.md)
