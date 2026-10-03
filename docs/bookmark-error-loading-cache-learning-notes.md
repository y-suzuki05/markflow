# 404・エラー・ローディング・キャッシュで学んだこと

ブックマークアプリに共通の404画面、エラー画面、読み込み中の画面を追加した。DB取得にはキャッシュを導入し、登録後に一覧へ最新データが反映されることを確認した。詳細への画面遷移で出た警告を通して、データのキャッシュとローディングの配置は別の役割を持つことも学んだ。

このメモは、現在のプロジェクトで使っている Next.js 16.3.6 の実装を前提にしている。

## 1. 404と処理エラーの違い

| 状況 | 扱い | 今回のファイル |
| --- | --- | --- |
| IDが不正、または該当データがない | `notFound()` で404用UIに切り替える | `app/not-found.tsx` |
| DB接続障害などで取得処理が失敗した | 未処理の例外を Error Boundary で捕まえる | `app/error.tsx` |
| データの取得を待っている | ローディングを表示する | `app/loading.tsx` など |

404は「問い合わせはできたが、探したものがない」という状態。処理エラーは「問い合わせ自体に失敗し、存在するかどうかを確認できない」という状態。不正なIDはDBへ問い合わせる前に404へ分岐する。

DB取得全体を `try/catch` で囲み、すべての失敗を404へ変換すると、この違いが失われる。

## 2. `notFound()` と共通404画面

詳細ページでは、次の2か所で `notFound()` を呼ぶ。

```tsx
import { notFound } from "next/navigation";

if (!Number.isInteger(id) || id < 1) {
  notFound();
}

const bookmark = await getBookmark(id);

if (!bookmark) {
  notFound();
}
```

`notFound()` は処理を中断するため、`return notFound()` と書く必要はない。Next.jsが近い階層の `not-found.tsx` を使って404用UIを表示する。内部では例外を投げるので、周囲の `catch` で握りつぶさないようにする。

今回は詳細専用の404画面を作らず、`app/not-found.tsx` に汎用の画面を置いた。詳細のデータ不存在にも、`/unknown` のような存在しないURLにも、同じ「ページが見つかりません」という画面を使う。

表示とリンクだけなので、`not-found.tsx` に `"use client"` は不要。共通レイアウトのヘッダーも引き続き表示される。

404用UIが表示されることと、HTTPステータスが404になることは分けて考える。ストリーミング開始後に `notFound()` が呼ばれる場合、レスポンスのステータスは200のままになることがある。Next.jsは検索エンジン向けに `noindex` を付ける。

## 3. `error.tsx` と Error Boundary

**Error Boundary** は、配下の描画中に起きた例外を捕まえ、通常の画面をエラー用UIへ切り替える仕組み。

`error.tsx` を配置すると、Next.jsがその境界を自動で用意する。ページ側からエラー画面をインポートしたり、通常のDB取得をすべて `try/catch` で囲んだりする必要はない。

今回は `app/error.tsx` に置き、一覧・詳細など配下のページを共通の画面で扱う。Error Boundary として使うファイルなので、`"use client"` が必要になる。

```tsx
"use client";

export default function Error({ retry }: { retry: () => void }) {
  return (
    <div>
      <p>読み込みに失敗しました。</p>
      <button onClick={() => retry()}>もう一度試す</button>
    </div>
  );
}
```

`retry` はNext.jsがpropsとして渡す関数。呼び出すと、エラーになった範囲のデータ取得・描画をやり直す。自分で関数の中身を作る必要はない。型の `() => void` は、引数を取らず、戻り値を使わない関数という意味。

一時的な障害が解消していれば通常の画面へ戻り、障害が続いていれば再びエラー画面になる。Next.js 16.3.6 では `retry` が使える。古い例にある `reset` は、データの再取得を行わずに境界のエラー状態をリセットするため、今回の再試行では `retry` を使う。

同じ階層の `app/layout.tsx` 自体のエラーは、`app/error.tsx` の対象外。ルートレイアウトのエラーには `global-error.tsx` が必要だが、今回は追加していない。また、URLコピーなどのイベント処理の失敗は、その処理内で `try/catch` を使って扱う。

動作確認では、ページ関数内に一時的な `throw new Error(...)` を置いてエラー画面を表示できる。開発用のエラーオーバーレイが出る場合は、閉じて画面を確認する。確認用の例外が残っている間は、再試行しても同じエラーになる。

## 4. `loading.tsx` と Suspense

**Suspense** は、非同期の処理を待っている間に仮表示を出し、準備ができたら本来の内容へ切り替える仕組み。

`loading.tsx` を置くと、Next.jsがページと配下のルートを自動でSuspenseの境界で囲む。自分で読み込み状態を `useState` に保存する必要はなく、`"use client"` も不要。

今回は `app/loading.tsx` にChakra UIのSkeletonを置いた。空の `<Skeleton />` は中身も高さもないので、見える領域ができない。高さを指定して使う。

```tsx
<Skeleton height="8" width={{ base: "70%", md: "60" }} />
<Skeleton height="7.5rem" />
```

`8`、`60` はChakraのサイズトークン。標準テーマではそれぞれ `2rem`、`15rem` に対応する。Skeletonは準備中の見出しや本文の形を表し、Spinnerは回転アイコンで待機を示す。

取得が速い場合や先読み済みの場合、ローディングは見えないこともある。表示確認にはDB取得前に一時的な待ち時間を入れられるが、確認後は削除する。

## 5. `use cache` によるDB取得結果の再利用

キャッシュは、取得結果を保存して次の呼び出しで再利用する仕組み。DBへの問い合わせを減らせるが、保存後の更新方法も考える必要がある。

`next.config.ts` で Cache Components を有効にし、取得関数の先頭に `"use cache"` を置く。

```tsx
// next.config.ts の設定
cacheComponents: true,

// 一覧取得
async function getBookmarks() {
  "use cache";
  return db
    .select()
    .from(bookmarksTable)
    .orderBy(desc(bookmarksTable.createdAt));
}
```

現在は詳細の `getBookmark(id)` にも `"use cache"` を入れている。引数がキャッシュのキーに含まれるため、詳細の取得結果はIDごとに分かれる。一覧の `getBookmarks()` と詳細の `getBookmark(id)` は別の関数であり、キャッシュも別になる。

キャッシュには有効期間があり、再検証や開発中のコード変更などでも更新される。キャッシュがあるから永続的にDB取得がなくなるわけではない。

## 6. 登録後の再検証とリダイレクト

登録後も古い一覧を再利用すると、新しいブックマークが表示されない。そこで、DBへの保存成功後に一覧のキャッシュを無効化し、最新の取得結果を使えるようにする。

```tsx
await db.insert(bookmarksTable).values(result.data);

revalidatePath("/bookmarks");
redirect("/bookmarks");
```

`revalidatePath` は指定したパスのキャッシュを再検証するための処理。`redirect` は一覧への移動を指示する処理であり、キャッシュを更新する処理とは役割が異なる。

今回の一覧更新には `revalidatePath("/bookmarks")` を使っている。これは詳細の全IDのキャッシュをまとめて更新する指定ではない。今後、編集・削除を追加する場合は、該当する詳細パスの再検証や、`cacheTag` と `updateTag` などを検討する。

## 7. ログによるキャッシュの確認

取得関数の `"use cache"` 直後に一時的なログを置き、一覧の再訪と新規登録を確認した。

```tsx
console.log("[getBookmarks] DBから一覧を取得します");
```

開発環境では、キャッシュされたログが `Cache` 付きで再表示されることがある。ログが見えるたびにDBへの問い合わせが実行された、とは限らない。先読みでクリック前に実行されることもあり、応答時間や表示内容も合わせて確認する。

今回の確認では、一覧の初回表示が約3秒、再訪時が約52msとなり、再訪時のログには `Cache` が付いていた。また、新規登録後に一覧へ戻ると、登録したデータがすぐに反映された。キャッシュの再利用と、登録後の再検証に整合する動作を確認できた。

確認中のコード変更はキャッシュを無効にするため避け、確認用ログは作業後に削除する。

## 8. uncached data と runtime data の警告

Cache Components を有効にすると、開発中に画面遷移を妨げる処理が警告として表示される。ここでいう「すぐ表示できる」は、すべてのデータを即座に取得することではなく、遷移先の内容や仮表示を待たせずに出せること。

| 警告 | 意味 | 今回の確認箇所 |
| --- | --- | --- |
| `uncached data during a navigation` | キャッシュしていないデータ取得などが画面遷移を待たせている | 詳細のDB取得 |
| `runtime data during a navigation` | アクセス時に決まる情報の読み取りが画面遷移を待たせている | `await params` が候補 |

詳細のDB取得をキャッシュしても、URLからIDを受け取る処理は残る。キャッシュは取得結果の再利用、Suspenseは待機中の表示を担当するので、両方を考える。

`app/loading.tsx` があっても、クライアント側の画面遷移では共有レイアウトより下の部分だけが描画対象になるため、すべての遷移を同じ境界で扱えるとは限らない。詳細の近くに `app/bookmarks/[id]/loading.tsx` を追加したところ、警告が出なくなった。

詳細用のファイルは、共通ローディングを再エクスポートしている。

```tsx
export { default } from "@/app/loading";
```

この1行で共通のSkeletonを再利用できる。表示内容は同じでも、詳細ルートにファイルを置くことで、その階層にローディングの境界ができる。

## 9. 本番ビルドとChakraProviderの配置

本番ビルドで `/_global-error` の事前生成が失敗し、ChakraProviderが見つからないというエラーが出た。Next.js 16.3.6 の生成処理では、この内部ルートから通常のルートレイアウトが外れる一方、共通の `app/loading.tsx` は読み込まれる。そのため、レイアウト内のProviderに依存したSkeletonを描画できなかった。

共通ローディングを `ChakraProvider value={defaultSystem}` で囲み、レイアウトがなくても単独で描画できるようにした。テーマ初期化を行うため、このファイルには `"use client"` も付けた。通常のローディングに必須という意味ではなく、今回のChakraのProvider構成に合わせた指定。

開発時に表示できていても、本番ビルドでは内部ルートの事前生成で別の条件が使われる。型チェックや開発画面の確認に加えて、本番ビルドも必要であることを確認した。

## 仕様との照合・確認状況

共通404画面、エラー画面、Skeletonの表示を確認した。一覧のキャッシュ再利用と登録後の即時反映、詳細ルートのローディング追加後に警告が出なくなることも確認した。

開発環境での確認に加えて、上記のProvider対応後に本番ビルドの全ページ事前生成も成功した。本番モードでのキャッシュ・画面遷移の確認と、公開環境での確認は別に行う。

## 関連メモ・参照

- [詳細画面の学習メモ](./bookmark-detail-learning-notes.md)
- [登録画面の学習メモ](./bookmark-registration-learning-notes.md)
- [Next.js同梱ガイド：notFound](../node_modules/next/dist/docs/01-app/03-api-reference/04-functions/not-found.md)
- [Next.js同梱ガイド：error.tsx](../node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md)
- [Next.js同梱ガイド：loading.tsx](../node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md)
- [Next.js同梱ガイド：use cache](../node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md)
- [Next.js同梱ガイド：revalidatePath](../node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidatePath.md)
- [Next.js同梱ガイド：Instant Navigation](../node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md)
