# 開発環境ガイド

このドキュメントでは、本プロジェクトのローカル開発環境と本番環境（Main）の違い、およびデータベースのセットアップ手順について説明します。

## 環境構成の概要

本プロジェクトでは、開発効率とパフォーマンスの両立のため、環境に応じて異なるデータベースエンジンを使用しています。

| 項目 | ローカル開発環境 (Local) | 本番環境 (Main/Production) |
| :--- | :--- | :--- |
| **データベース** | SQLite | PostgreSQL (Neon) |
| **Prisma アダプター** | `@prisma/adapter-better-sqlite3` | `@prisma/adapter-neon` |
| **スキーマファイル** | `prisma/sqlite/schema.prisma` | `prisma/schema.prisma` |
| **接続 URL 例** | `file:./dev.db` | `postgresql://...` |

### 切り替えの仕組み
`prisma.config.ts` および `src/backend/db.ts` が、環境変数 `DATABASE_URL` のプレフィックス（`file:` か `postgres:` か）を判別して、自動的にスキーマファイルとアダプターを切り替えます。

---

## ローカル開発のセットアップ手順

新規参画した方は、以下の手順でローカル環境を構築してください。

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env` ファイルを作成し、必要な変数を設定してください。
※ SQLite を使用する場合、`DATABASE_URL` は `file:./dev.db` を指定します。

### 3. データベースの初期化とマイグレーション
ローカル用の SQLite スキーマを使用して、データベースファイルを作成し、マイグレーションを適用します。
```bash
npm run db:sqlite:migrate -- --name init
```

### 4. 開発サーバーの起動
SQLite モードで開発サーバーを起動します。
```bash
npm run dev:sqlite
```
このコマンドを実行すると、自動的に Prisma Client の生成（SQLite 用）と Next.js の起動が行われます。

---

## 主要なコマンド一覧

| コマンド | 内容 |
| :--- | :--- |
| `npm run dev:sqlite` | **[推奨]** SQLite を使用してローカルサーバーを起動 |
| `npm run db:sqlite:migrate` | SQLite スキーマの変更をデータベースに反映（新しい migration を作成） |
| `npm run db:sqlite:generate` | SQLite 用の Prisma Client を手動で再生成 |
| `npm run dev` | デフォルトの `next dev`（`.env` の設定に従う。主に Postgres local 用） |

---

## 注意事項

- **スキーマの変更**: スキーマを変更する場合は、`prisma/schema.prisma`（Postgres）と `prisma/sqlite/schema.prisma`（SQLite）の両方を同期させる必要があります。現在は手動で同期を行う運用です。
- **マイグレーションの分離**: SQLite 用のマイグレーションファイルは `prisma/sqlite/migrations` に、Postgres 用は `prisma/migrations` に保存されます。これらは互換性がないため、混ぜないように注意してください。
- **アダプターの制約**: Prisma 7 の制約により、`prisma.config.ts` を使用する場合はドライバアダプターの利用が必須となっています。
