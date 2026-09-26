# ブックマークアプリ

## 簡易要件定義・学習設計書

Next.js App Router の復習を目的とした小規模フルスタックアプリ。

| **アプリ種別** | 個人用ブックマークアプリ                   |
|----------------|--------------------------------------------|
| **主目的**     | App Router の知識を実装して定着させる      |
| **公開方針**   | 無料で公開できる場合のみ Vercel にデプロイ |
| **DB**         | PostgreSQL / Neon                          |
| **Version**    | 1.0（2026-09-22）                          |

※ 本書は実装前の判断基準を固定するための軽量仕様書。商用開発向けの網羅的な要件定義書ではない。

# 1. 目的と前提

あとで見返したい Web 記事を、タイトル・URL・一言メモとともに保存し、一覧・詳細から参照できる個人用ブックマークアプリを作る。アプリ自体を高機能化することよりも、Next.js App Router の主要概念を自分で実装して確認することを優先する。

**プロダクト上の目的：**参考記事を簡単に登録し、後から見返せること。

**学習上の目的：**Server Components、Client Components、Dynamic Routes、Server Actions、データ取得、エラー処理、静的／動的レンダリング、キャッシュを一連のアプリで復習すること。

**スコープの考え方：**DB 設計や認証などを主題にせず、App Router の学習を妨げない最小構成にする。

> 設計上の原則：機能追加より「学習対象を自然に1回ずつ使う」ことを優先する。実装途中で機能を増やす場合も、この目的に寄与するかを判断基準にする。

# 2. 技術スタック

| **分類**       | **採用技術**             | **役割**                                 |
|----------------|--------------------------|------------------------------------------|
| フレームワーク | Next.js App Router       | フロントエンド／バックエンドを一体で実装 |
| 言語           | TypeScript               | アプリケーション全体の型付け             |
| UI             | Chakra UI v3             | 画面・フォーム・フィードバック UI        |
| バリデーション | Zod                      | Server Action で受け取る入力値を検証     |
| ORM            | Drizzle ORM              | TypeScript から PostgreSQL を操作        |
| DB             | PostgreSQL               | ブックマークデータを永続化               |
| DBホスティング | Neon                     | PostgreSQL を無料枠でホスティング        |
| ホスティング   | Vercel                   | Next.js アプリを無料枠で公開             |
| パッケージ管理 | pnpm                     | 依存パッケージ管理                       |
| Lint           | Next.js のデフォルト構成 | 静的解析                                 |
| テスト         | なし                     | 今回は App Router 復習に集中             |

# 3. 機能スコープ

## 3.1 今回実装する機能

- ブックマーク一覧を表示する。

- タイトル・URL・一言メモを入力してブックマークを登録する。

- ブックマークの詳細を表示する。

- 詳細画面から元記事を別タブで開く。

- 詳細画面で URL をクリップボードにコピーする（Client Component の学習用最小機能）。

- 入力値を Zod で検証し、エラー時はフォーム上にメッセージを表示する。

- 存在しないブックマーク ID では 404 UI を表示する。

- DB 取得時の待機 UI と想定外エラー UI を用意する。

## 3.2 今回は実装しないもの

- ユーザー認証・複数ユーザー対応

- タグ・カテゴリ・お気に入り

- 編集・削除

- 検索・並び替え・ページネーション

- OGP や記事本文の自動取得

- 画像アップロード

- テストコード

- 有料サービス・有料プランの利用

# 4. 画面構成・遷移

```text
/                     # 静的トップ
└─ /bookmarks          # 一覧
   ├─ /bookmarks/new   # 新規登録
   └─ /bookmarks/[id]  # 詳細
      └─ 元記事URL      # 外部サイト
```

特殊ファイルとして、loading.tsx、error.tsx、not-found.tsx を適切な Route Segment に配置する。これらも今回の学習対象に含める。

# 5. 画面別仕様と学習ポイント

## 5.1 トップ /

| **目的**             | アプリの説明とブックマーク一覧への入口。DB は参照しない。                                           |
|----------------------|-----------------------------------------------------------------------------------------------------|
| **主な表示**         | アプリ名／短い説明／「ブックマークを見る」リンク                                                    |
| **主な操作**         | 一覧画面へ遷移                                                                                      |
| **使う技術**         | Server Component、Link、静的レンダリング                                                            |
| **学べること**       | DB やリクエスト時データに依存しないページが静的に生成できることを確認し、動的な一覧画面と比較する。 |
| **レンダリング方針** | 静的                                                                                                |

## 5.2 ブックマーク一覧 /bookmarks

| **目的**             | 保存済みブックマークを新しい順に一覧表示する。                                                                                                           |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **主な表示**         | タイトル／一言メモ／登録日時／詳細へのリンク／新規登録へのリンク                                                                                         |
| **主な操作**         | 詳細画面へ遷移、新規登録画面へ遷移                                                                                                                       |
| **使う技術**         | Server Component、Drizzle ORM、PostgreSQL、loading.tsx、error.tsx、キャッシュ                                                                            |
| **学べること**       | Server Component から DB を直接読み取る。最初は動的データとして動作を確認し、その後 use cache 等を使ったキャッシュを学習し、登録後の再検証まで確認する。 |
| **レンダリング方針** | サーバー側でデータを取得。キャッシュ有無の違いも確認する。                                                                                               |

## 5.3 ブックマーク登録 /bookmarks/new

| **目的**             | タイトル・URL・一言メモを入力して保存する。                                                                                                                                                              |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **主な表示**         | タイトル入力／URL入力／一言メモ入力／登録ボタン／バリデーションエラー                                                                                                                                    |
| **主な操作**         | フォーム送信、登録成功後に一覧へ遷移                                                                                                                                                                     |
| **使う技術**         | Server Action、Zod、Drizzle ORM、PostgreSQL、redirect、キャッシュ再検証、必要最小限の Client Component                                                                                                   |
| **学べること**       | HTML form → Server Action → Zod → DB INSERT → キャッシュ更新 → redirect というフルスタックの一連の流れを確認する。エラー表示で useActionState を利用する場合、フォーム部分だけ Client Component にする。 |
| **レンダリング方針** | サーバー側でデータを取得。キャッシュ有無の違いも確認する。                                                                                                                                               |

## 5.4 ブックマーク詳細 /bookmarks/\[id\]

| **目的**             | 1件のブックマーク情報を表示し、元記事を参照できるようにする。                                                                                                                    |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **主な表示**         | タイトル／URL／一言メモ／登録日時／元記事を開くリンク／URLコピーボタン                                                                                                           |
| **主な操作**         | 外部サイトを別タブで開く、URL をコピー、一覧へ戻る                                                                                                                               |
| **使う技術**         | Dynamic Routes、Server Component、params、Drizzle ORM、notFound()、not-found.tsx、Client Component（URLコピー）                                                                  |
| **学べること**       | URL パラメータを受け取り DB から1件取得する。該当データがなければ notFound() によって 404 UI へ分岐する。ブラウザ API が必要なコピー操作だけを Client Component として切り出す。 |
| **レンダリング方針** | サーバー側でデータを取得。キャッシュ有無の違いも確認する。                                                                                                                       |

# 6. App Router の特殊 UI

| **ファイル**  | **配置例**                         | **役割**                                | **学習ポイント**                                                   |
|---------------|------------------------------------|-----------------------------------------|--------------------------------------------------------------------|
| loading.tsx   | app/bookmarks/loading.tsx          | 一覧・詳細の読み込み中 UI               | Route Segment 単位の Suspense / Streaming の基本を確認する。       |
| error.tsx     | app/bookmarks/error.tsx            | DB 障害など想定外エラーのフォールバック | Error Boundary。error.tsx が Client Component になる点も確認する。 |
| not-found.tsx | app/bookmarks/\[id\]/not-found.tsx | 存在しない ID の 404 UI                 | notFound() と 404 UI の連携を確認する。                            |

# 7. データ設計

DB 学習を主目的にしないため、テーブルは1つだけとする。以下の制約値は学習用の暫定仕様であり、実装時に微調整してよい。

| **カラム** | **型イメージ**   | **必須** | **制約・初期値**       | **用途**               |
|------------|------------------|----------|------------------------|------------------------|
| id         | integer / serial | Yes      | Primary Key / 自動採番 | Dynamic Route の識別子 |
| title      | text             | Yes      | 1〜200文字             | 記事タイトル           |
| url        | text             | Yes      | http/https の妥当なURL | 元記事リンク           |
| memo       | text             | Yes      | 1〜300文字             | 一言メモ               |
| created_at | timestamp        | Yes      | default now()          | 登録日時               |

```text
bookmarks
├─ id          PK
├─ title       NOT NULL
├─ url         NOT NULL
├─ memo        NOT NULL
└─ created_at  NOT NULL DEFAULT now()
```

# 8. 機能要件

| **ID** | **要件**             | **正常時**                             | **異常時**                     |
|--------|----------------------|----------------------------------------|--------------------------------|
| FR-01  | ブックマーク一覧取得 | 登録済みデータを新しい順に表示         | DB 取得失敗時は error.tsx      |
| FR-02  | ブックマーク登録     | 3項目を保存し一覧へ遷移                | Zod エラーはフォーム上に表示   |
| FR-03  | ブックマーク詳細取得 | 指定 ID のデータを表示                 | 存在しない場合は not-found.tsx |
| FR-04  | 元記事を開く         | URL を別タブで開く                     | URL は登録時に妥当性検証       |
| FR-05  | URLコピー            | クリップボードへコピーし成功を通知     | 失敗時は簡易エラー表示         |
| FR-06  | キャッシュ更新       | 登録直後に一覧で新規データを確認できる | 再検証処理を見直す             |

# 9. 学習項目マッピング

| **学習項目**                | **実装箇所**                      | **確認すること**                                                               |
|-----------------------------|-----------------------------------|--------------------------------------------------------------------------------|
| App Router / Route Segments | app 配下全体                      | フォルダ構成が URL とレイアウト境界になること。                                |
| Dynamic Routes              | /bookmarks/\[id\]                 | params から id を受け取り1件取得すること。                                     |
| Server Components           | /、一覧、詳細                     | DB アクセスをクライアントへ公開せずサーバー側で行えること。                    |
| Client Components           | 登録フォームの状態表示、URLコピー | インタラクションが必要な部分だけ use client にすること。                       |
| Server Actions              | /bookmarks/new                    | フォームからサーバー処理を直接呼び、DB 更新まで完結させること。                |
| Zod                         | Server Action                     | FormData を信頼せず、サーバー側で入力値を検証すること。                        |
| loading.tsx                 | /bookmarks                        | 読み込み中 UI と Streaming の挙動。                                            |
| error.tsx                   | /bookmarks                        | 予期しない例外を Route Segment 単位で扱うこと。                                |
| not-found.tsx               | /bookmarks/\[id\]                 | 「例外」と「データ不存在」を分けること。                                       |
| Static Rendering            | /                                 | DB を使わない静的画面の生成。                                                  |
| Dynamic Rendering           | /bookmarks、/\[id\]               | DB の最新状態をサーバーで取得する画面との違い。                                |
| Caching / Revalidation      | 一覧取得 + 登録 Server Action     | use cache 等でキャッシュし、登録後に tag/path を再検証して更新を反映する流れ。 |

> キャッシュは最初から複雑にしない。①まずキャッシュなしで正常動作 → ②一覧取得をキャッシュ → ③登録後の再検証、の順に実装して挙動差を確認する。Next.js 16 では `use cache` が現行のキャッシュモデルの中心。

# 10. 想定ディレクトリ構成

```text
app/
├─ layout.tsx
├─ page.tsx                     # 静的トップ
├─ providers.tsx                # Chakra UI Provider
└─ bookmarks/
   ├─ page.tsx                  # 一覧（Server Component）
   ├─ loading.tsx
   ├─ error.tsx
   ├─ new/
   │  ├─ page.tsx               # 登録ページ
   │  └─ bookmark-form.tsx      # 必要なら Client Component
   └─ [id]/
      ├─ page.tsx               # 詳細（Server Component）
      ├─ not-found.tsx
      └─ copy-url-button.tsx     # Client Component

lib/
├─ db/
│  ├─ index.ts                  # Neon / Drizzle 接続
│  └─ schema.ts                 # bookmarks 定義
├─ bookmarks.ts                 # SELECT 系のデータアクセス
└─ actions.ts                   # Server Actions

drizzle.config.ts
```

# 11. 非機能要件・運用方針

- 費用：公開を含めて 0 円を条件とする。無料枠を超えて課金が必要になる場合は公開しない。

- 利用者：本人のみを想定。ただし認証は実装しないため、公開時は第三者からアクセス可能な前提で機密情報を保存しない。

- レスポンシブ：PC とスマートフォンの両方で基本操作ができる程度に対応する。

- アクセシビリティ：label、button、link 等の標準的なセマンティクスを守る。

- セキュリティ：Server Action 側で Zod バリデーションを行い、DB 接続情報は環境変数で管理する。

- パフォーマンス：今回は最適化自体を目的化しない。キャッシュ学習に必要な範囲だけ扱う。

# 12. 実装順序

| **Step** | **実装内容**                                            | **主な学習対象**                                  |
|----------|---------------------------------------------------------|---------------------------------------------------|
| 1        | create-next-app / Chakra UI / Neon / Drizzle の初期設定 | App Router の基本構成、環境変数                   |
| 2        | DB スキーマ作成・マイグレーション                       | PostgreSQL / Drizzle の最小操作                   |
| 3        | 静的トップ画面                                          | Static Rendering、Server Component                |
| 4        | 一覧画面                                                | Server Component から DB データ取得               |
| 5        | 詳細画面                                                | Dynamic Routes、notFound()                        |
| 6        | 登録画面                                                | Server Actions、Zod、DB INSERT、redirect          |
| 7        | loading / error / not-found UI                          | App Router のエラーハンドリングと Streaming       |
| 8        | Client Component の最小導入                             | useActionState または Clipboard API               |
| 9        | キャッシュと再検証                                      | use cache、cacheTag / revalidateTag・updateTag 等 |
| 10       | Vercel + Neon で公開                                    | 本番環境変数、無料公開                            |

# 13. 完成条件（Definition of Done）

- トップ → 一覧 → 登録／詳細の画面遷移ができる。

- タイトル・URL・一言メモを登録できる。

- 登録したデータが一覧と詳細に表示される。

- Zod の入力エラーがユーザーに表示される。

- 存在しない ID にアクセスすると 404 UI が表示される。

- DB 取得エラー時に error.tsx の UI を確認できる。

- loading.tsx の表示を開発環境で確認できる。

- Server Component と Client Component の責務を説明できる。

- 静的画面と動的な DB 参照画面の違いを説明できる。

- キャッシュ前後、および登録後の再検証の挙動を説明できる。

- 無料枠だけで Vercel + Neon へ公開できる場合はデプロイする。

# 14. 暫定仕様・実装時に変更可能な点

以下はユーザー要件として確定していないため、本書では学習用の仮定として置いている。App Router の学習目的を損なわない範囲で実装時に変更してよい。

- ルート名は /articles ではなく、用途に合わせて /bookmarks とする。

- 一言メモは必須、最大 300 文字とする。

- タイトルは最大 200 文字とする。

- URL は http/https のみを許可する。

- 一覧は created_at の降順で表示する。

- Client Component の学習用に URL コピーボタンを追加する。

- キャッシュ学習では Next.js 16 の Cache Components / use cache を利用する想定とする。

# 参考：Next.js 公式ドキュメント

**App Router / Learn:** https://nextjs.org/learn/dashboard-app

**Updating Data / Server Actions:** https://nextjs.org/docs/app/getting-started/updating-data

**Error Handling:** https://nextjs.org/learn/dashboard-app/error-handling

**use cache:** https://nextjs.org/docs/app/api-reference/directives/use-cache

**Revalidating:** https://nextjs.org/docs/app/getting-started/revalidating
