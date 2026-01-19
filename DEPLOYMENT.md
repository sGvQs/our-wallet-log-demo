# デプロイガイド & 認証の仕組み解説

## 1. 認証の「発行元（認証局）」について

ご質問いただいた「誰が認証局（CA）なのか」という点について解説します。

今回の独自認証（JWT + Cookie）では、**「あなたのNext.jsアプリケーション自身」が認証局の役割を果たしています。**

### 仕組みの図解
1.  **署名 (Signing)**: ユーザーがログインすると、サーバー（Next.js）はユーザーIDを「秘密鍵（`JWT_SECRET`）」で署名し、暗号化された文字列（トークン）を作ります。
2.  **Cookie保存**: そのトークンをブラウザのCookieに保存します。
3.  **検証 (Verification)**: 次のリクエストの際、サーバーはブラウザから送られてきたトークンを、**手元にある同じ「秘密鍵」**を使って検証します。

> [!IMPORTANT]
> この「秘密鍵（`JWT_SECRET`）」を知っているのは世界であなたのサーバーだけなので、第三者が偽造することはできません。これが信頼の根拠（Trust Anchor）になります。

---

## 2. Vercelでの動作とDBの注意点

**結論：そのままデプロイしても、データベース（SQLite）が動きません。**

### なぜ動かないのか？
Vercelのサーバーは「サーバーレス（ランタイムが実行のたびに生成・破棄される）」であり、書き込み可能なハードディスクがありません。
- SQLiteファイル（`dev.db`）にデータを書き込んでも、数分後には消えてしまいます。
- また、そもそもVercel上のルートディレクトリは読み取り専用です。

### 解決策
本番環境では、外部のマネージドデータベースサービスを利用する必要があります。
-   **Neon** (Postgres): 設定が非常に簡単で、Vercelと相性が良いです。
-   **Turso** (SQLite over HTTP): 今のソースコードに近い形でSQLiteを使い続けたい場合に最適です。

---

## 3. 本番デプロイ手順 (Vercel + Neonの場合)

### Step 1: データベースの準備 (Neon)
1. [Neon](https://neon.tech/) にサインアップし、新しいプロジェクトを作成します。
2. 表示される `DATABASE_URL` (postgresql://...) をコピーします。

### Step 2: ソースコードの修正 (Postgres化)
SQLiteからPostgreSQLに切り替えるには、`prisma/schema.prisma` を以下のように書き換えてからデプロイします。

```prisma
datasource db {
  provider = "postgresql" // sqlite から postgresql に変更
  url      = env("DATABASE_URL")
}
```

### Step 3: Vercelへのデプロイ
1. GitHubにリポジトリを push します。
2. Vercelのダッシュボードで `Add New Project` を選択。
3. **Environment Variables** に以下を設定します：
    - `DATABASE_URL`: Step 1 でコピーしたURL
    - `JWT_SECRET`: 適当な長いランダムな文字列（例：`openssl rand -base64 32` で生成したもの）
4. `Deploy` をクリック。

### Step 4: データベースのマイグレーション
Vercelの `Settings` > `Integrations` またはコマンドラインで、本番DBにテーブルを作成する必要があります。
```bash
npx prisma migrate deploy
```
（Vercelの Build Command を `npx prisma generate && npx prisma migrate deploy && next build` に設定するのが一般的です）
