# Our Wallet - 開発者オンボーディングガイド

新規参画の開発者向けに、ローカル環境のセットアップから開発開始までの手順をまとめたガイドです。

---

## 1. プロジェクト概要

**Our Wallet** は、個人およびグループでの家計管理・予算追跡を行うWebアプリケーションです。

### 主要機能

| 機能 | 説明 |
|------|------|
| 支出記録 | 日付・金額・カテゴリー・内容を入力して支出を記録 |
| カテゴリー別集計 | 食費、住居費、光熱費、日用品など7カテゴリーで分類 |
| 月別ナビゲーション | 月ごとの支出一覧・集計を表示 |
| グループ共有 | 招待コードでグループを作成し、複数人で家計を共有 |
| 決算機能 | グループメンバー間の精算金額を計算 |

### 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **データベース**: PostgreSQL (本番: Neon, ローカル: Docker)
- **ORM**: Prisma 7
- **認証**: Clerk
- **スタイリング**: Tailwind CSS 4
- **デプロイ**: Vercel

---

## 2. 必須ツール

開発を始める前に、以下のツールをインストールしてください。

| ツール | 推奨バージョン | 確認コマンド |
|--------|---------------|-------------|
| Node.js | 20.x 以上 | `node -v` |
| npm | 10.x 以上 | `npm -v` |
| Git | 2.x 以上 | `git --version` |
| Docker | 最新版 | `docker --version` |
| Docker Compose | 最新版（Docker に同梱） | `docker compose version` |

> **💡 ヒント**: Node.js のバージョン管理には [nvm](https://github.com/nvm-sh/nvm) や [volta](https://volta.sh/) の使用を推奨します。

---

## 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の環境変数を設定します。

```bash
# .env.example をコピーして .env を作成
cp .env.example .env
```

### 必要な環境変数一覧

| 変数名 | 説明 | 取得先 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL接続文字列 | ローカル: 下記参照 / 本番: Neonコンソール |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk公開キー | [Clerkダッシュボード](https://dashboard.clerk.com/) → API Keys |
| `CLERK_SECRET_KEY` | Clerkシークレットキー | 同上 |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | サインインページのパス | 固定値: `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | サインイン後のリダイレクト先 | 固定値: `/` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | サインアップ後のリダイレクト先 | 固定値: `/` |

### ローカル開発用の `.env` サンプル

```env
# Database (Docker PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/our_wallet_db?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

> **⚠️ 重要**: `.env` ファイルは **絶対にGitにコミットしないでください**。`.gitignore` に含まれていることを確認してください。

---

## 4. セットアップ手順

### Step 1: リポジトリのクローン

```bash
git clone https://github.com/your-org/our-wallet-log-demo.git
cd our-wallet-log-demo
```

### Step 2: 依存関係のインストール

```bash
npm install
```

### Step 3: 環境変数の設定

上記「環境変数の設定」セクションを参照し、`.env` ファイルを作成してください。

### Step 4: PostgreSQLの起動（Docker）

```bash
# コンテナをバックグラウンドで起動
docker compose up -d

# 起動確認
docker compose ps
```

以下のような出力が表示されれば成功です：

```
NAME                  STATUS    PORTS
our-wallet-postgres   running   0.0.0.0:5432->5432/tcp
```

### Step 5: データベースのマイグレーション

```bash
# マイグレーションを適用
npx prisma migrate dev

# Prisma Clientを生成（通常は自動で実行されます）
npx prisma generate
```

### Step 6: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開き、アプリケーションが表示されれば成功です。

---

## 5. ディレクトリ構成

```
our-wallet-log-demo/
├── src/
│   ├── app/                    # Next.js App Router ページ
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # トップページ
│   │   ├── personal/           # 個人支出ページ
│   │   ├── group/              # グループ支出ページ
│   │   ├── settings/           # 設定ページ
│   │   └── sign-in/            # Clerk認証ページ
│   │
│   ├── backend/                # バックエンドロジック
│   │   ├── actions/            # Server Actions（CRUD操作）
│   │   ├── auth/               # 認証ユーティリティ
│   │   ├── db.ts               # Prismaクライアント初期化
│   │   └── services/           # ビジネスロジック
│   │
│   ├── components/             # Reactコンポーネント
│   │   ├── ui/                 # 汎用UIコンポーネント
│   │   ├── expense/            # 支出関連コンポーネント
│   │   └── settings/           # 設定関連コンポーネント
│   │
│   ├── hooks/                  # カスタムフック
│   ├── lib/                    # ユーティリティ・バリデーション
│   ├── context/                # Reactコンテキスト
│   └── types/                  # TypeScript型定義
│
├── prisma/
│   ├── schema.prisma           # Prismaスキーマ
│   └── migrations/             # マイグレーションファイル
│
├── prisma.config.ts            # Prisma設定（datasource URL）
├── docker-compose.yml          # PostgreSQLコンテナ設定
└── package.json
```

### 重要なファイル

| ファイル | 役割 |
|----------|------|
| `src/backend/db.ts` | Prismaクライアントのシングルトン初期化 |
| `src/backend/actions/expenses.ts` | 支出のCRUD Server Actions |
| `src/components/expense/ExpenseForm.tsx` | 支出入力フォーム（react-hook-form + zod） |
| `prisma/schema.prisma` | データベーススキーマ定義 |
| `prisma.config.ts` | Prisma 7のdatasource設定 |

---

## 6. よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# PostgreSQL起動/停止
docker compose up -d
docker compose down

# Prismaスタジオ（DBブラウザ）
npx prisma studio

# マイグレーションリセット
npx prisma migrate reset

# マイグレーション作成・適用
npx prisma migrate dev --name <migration_name>

# スキーマ変更をDBに反映（開発時のみ）
npx prisma db push

# Prisma Client再生成
npx prisma generate

# 型チェック
npx tsc --noEmit

# リント
npm run lint
```

---

## 7. よくあるトラブルシューティング

### データベース接続エラー

**症状**: `Can't reach database server` や `Connection refused`

**確認ポイント**:

1. Dockerコンテナが起動しているか確認
   ```bash
   docker compose ps
   ```

2. `.env` の `DATABASE_URL` が正しいか確認
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/our_wallet_db?schema=public"
   ```

3. ポート5432が他のプロセスで使用されていないか確認
   ```bash
   lsof -i :5432
   ```

### Clerk認証エラー

**症状**: `ClerkInstanceContext not found` や `Invalid API Key`

**確認ポイント**:

1. `.env` に `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` と `CLERK_SECRET_KEY` が設定されているか
2. キーが正しくコピーされているか（前後の空白に注意）
3. 開発サーバーを再起動する（環境変数の変更は再起動が必要）

### Prisma関連エラー

**症状**: `PrismaClientInitializationError` や `Schema validation error`

**確認ポイント**:

1. Prisma Clientを再生成
   ```bash
   npx prisma generate
   ```

2. マイグレーションを再適用
   ```bash
   npx prisma migrate dev
   ```

3. DBをリセット（データが消えます）
   ```bash
   npx prisma migrate reset
   ```

### ポートが既に使用されている

**症状**: `Port 3000 is in use` や `Port 5432 is in use`

**解決方法**:

```bash
# 使用中のプロセスを確認
lsof -i :3000
lsof -i :5432

# プロセスを終了
kill -9 <PID>
```

---

## 8. 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 9. 困ったときは

1. **このドキュメント**を再確認
2. **プロジェクト内の他のドキュメント**を参照
   - `ARCHITECTURE.md` - アーキテクチャ詳細
   - `DEPLOYMENT.md` - デプロイ手順
   - `ENVIRONMENT_GUIDE.md` - 環境設定の詳細
3. **チームメンバーに質問**

---

Happy Coding! 🎉
