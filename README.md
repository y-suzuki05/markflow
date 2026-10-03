# MarkFlow

気になる記事や、もう一度読みたい記事を、タイトル・URL・一言メモとともに保存する個人用ブックマークアプリ。

**[公開アプリを開く](https://markflow-vert-omega.vercel.app/)**

## 制作目的

あとで見返したいWeb記事を、保存した理由や要点と一緒に残せるようにするために制作した。

Next.js App Router の理解を深める個人開発として、画面の実装からDB保存、入力検証、エラー処理、キャッシュ、本番環境へのデプロイまでを扱っている。

公開アプリは認証のないデモで、登録内容は利用者間で共有される。動作を試す際は、公開してよい記事URLやメモを使用する。

## 機能

- ブックマークの一覧表示（登録日時の新しい順）・詳細表示
- タイトル・URL・一言メモの登録と入力検証
- 元記事を別タブで開く、URLのクリップボードコピーと結果通知
- 入力エラー、404、取得エラー、読み込み中のUI
- 一覧・詳細取得のキャッシュと、登録後の一覧再検証
- PC・スマートフォン向けの表示

## 技術構成

| 分類                  | 技術                                   |
| --------------------- | -------------------------------------- |
| フレームワーク        | Next.js 16.3.6 / App Router            |
| UI                    | React 19 / Chakra UI v3                |
| 言語                  | TypeScript                             |
| 入力検証              | Zod                                    |
| ORM・マイグレーション | Drizzle ORM / Drizzle Kit              |
| DB                    | PostgreSQL / [Neon](https://neon.com/) |
| パッケージ管理        | pnpm                                   |

公開先は [Vercel](https://vercel.com/)、DBはNeonを利用している。開発・本番ビルドにはWebpackを使用し、Cache Components は `next.config.ts` で有効にしている。

## アプリケーション構成

```mermaid
flowchart LR
    Browser[ブラウザ] --> App[Next.js / Vercel]
    App --> Read[Server Components / 一覧・詳細取得]
    App --> Action[Server Action / 入力検証・登録]
    Read --> ORM[Drizzle ORM]
    Action --> ORM
    ORM --> DB[(PostgreSQL / Neon)]
```

ブラウザからDBへ直接接続せず、Next.jsのサーバー側からDrizzle ORMで読み取り・登録を行う。登録フォームの状態管理とURLコピーはClient Componentに分けている。

### 開発環境と本番環境

Neonのプロジェクトを2つ用意し、開発用と本番用のデータを分離している。両方に同じマイグレーションを適用し、接続先は環境変数で切り替える。

| 環境 | アプリの実行場所  | DB接続先               | 接続情報の設定場所                        |
| ---- | ----------------- | ---------------------- | ----------------------------------------- |
| 開発 | ローカルのNext.js | 開発用Neonプロジェクト | `.env.local` の `DATABASE_URL`            |
| 本番 | Vercel Production | 本番用Neonプロジェクト | VercelのProduction環境変数 `DATABASE_URL` |

本番用DBの初期構築には `.env.migrate.production` を使って既存のマイグレーションを適用した。開発用データをコピーする処理は含まない。環境変数ファイルはGit管理の対象外としている。

## 実装で意識したこと

- **サーバーとクライアントの責務を分ける**：DB取得はServer Components、フォーム操作とClipboard APIはClient Componentsで扱う。
- **サーバー側で入力を検証する**：Server ActionでZod検証を行い、成功したデータだけを保存する。検証エラー時は入力値を保持し、項目ごとにメッセージを表示する。
- **取得失敗・データ不存在・待機中を分ける**：`error.tsx`、`not-found.tsx`、`loading.tsx`を使い、再試行や一覧へ戻る導線を用意する。
- **キャッシュと更新を組み合わせる**：一覧・詳細の取得に `use cache` を使い、登録後は `revalidatePath` で一覧を再検証してからリダイレクトする。
- **画面幅に合わせて表示を変える**：SPでは余白・文字サイズ・ボタン配置を調整する。Chakraのトークンとremを基本に、長いタイトルやURLの折り返しにも対応する。

実装範囲は一覧・登録・詳細の基本操作に絞っている。認証、編集・削除、検索、タグ、ページネーションは実装していない。

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

## 要件定義・学習メモ

- [簡易要件定義・学習設計書](docs/bookmark_app_requirements_learning_spec.md)
- [一覧画面・DBの学習メモ](docs/bookmarks-list-learning-notes.md)
- [詳細画面の学習メモ](docs/bookmark-detail-learning-notes.md)
- [登録画面の学習メモ](docs/bookmark-registration-learning-notes.md)
- [404・エラー・ローディング・キャッシュの学習メモ](docs/bookmark-error-loading-cache-learning-notes.md)
