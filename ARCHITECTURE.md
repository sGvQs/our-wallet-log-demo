# アプリケーション設計・実装解説書

このアプリケーションは、Next.js (App Router) の機能をフル活用し、フロントエンドとバックエンドを単一のフレームワークで完結させる構成（フルスタックNext.js）で構築されています。

## 1. 全体アーキテクチャ

従来のような「React（フロント） + Express/Go（バックエンド）」という分離構成ではなく、Next.jsの **Server Actions** 機能を利用することで、バックエンドロジックをコンポーネントに近い場所で関数として定義・実行しています。

- **Frontend**: React Server Components (RSC) を基本とし、インタラクティブな部分（フォーム入力など）のみ Client Components (`use client`) を使用。
- **Backend / API**: `/src/app/actions/` 配下に定義された非同期関数（Server Actions）がAPIエンドポイントの役割を果たします。
- **Database**: SQLite を採用し、Prisma ORM で操作します。

## 2. データベース設計 (Prisma)

`/prisma/schema.prisma` で定義されています。

- **User**: ユーザー情報。パスワードはハッシュ化して保存。
- **Group**: 家計簿を共有するグループ（例: 「○○家」）。`inviteCode`（招待コード）を持ちます。
- **GroupMember**: UserとGroupの中間テーブル。ユーザーがどのグループに所属しているかを管理します。
- **Expense**: 支出データ。`payerId`（支払った人）と `groupId`（所属グループ）を持ちます。

この設計により、「誰が」「どのグループで」「いくら払ったか」を追跡可能です。

## 3. 認証の仕組み (Authentication)

あえてAuth0やNextAuthなどの外部ライブラリを使わず、仕組みを理解しやすいようにシンプルな独自実装を行いました。

1.  **JWT生成**: `jose` ライブラリを使用し、ユーザーIDを含むJSON Web Tokenを作成。
2.  **セッション管理**: 生成したトークンを暗号化し、HTTP-only Cookie (`session`) に保存（`src/lib/session.ts`）。
3.  **ミドルウェア保護**: `src/middleware.ts` がリクエストごとにCookieを確認。
    - `/dashboard` へのアクセス時にセッションがなければ `/login` へリダイレクトします。

## 4. UI/デザイン設計

「モダンでプレミアムなデザイン」を実現するため、CSSフレームワーク（Tailwind等）を使わず、**Vanilla CSS (CSS Modules + CSS Variables)** で構築しました。

- **色空間**: `oklch()` を使用し、鮮やかで自然な色合いを実現（`src/app/variables.css`）。
- **コンポーネント化**: `Button`, `Input`, `Card` などの共通部品を `/src/components/ui` に作成し、デザインの統一性を担保しています。

## 5. 主要な処理フロー

### グループ作成・参加
1.  **作成**: `GroupManager` コンポーネントから `createGroup` アクションを呼び出し。ランダムな招待コードを生成してDBに保存します。
2.  **参加**: ユーザーが招待コードを入力すると、`joinGroup` アクションが一致するグループを探し、`GroupMember` にレコードを追加します。

### 支出の記録
1.  **データ取得**: ダッシュボード表示時 (`DashboardPage`)、サーバー側で `getGroupExpenses` を呼び出し、DBから直接データを取得してHTMLを生成します（SSR）。
2.  **追加**: `AddExpenseForm` から `addExpense` アクションを実行。成功すると `revalidatePath('/dashboard')` が走り、画面が自動で最新化されます。
