# DefaultSetting

Webサイト制作用の初期設定環境テンプレートです。

## 概要

このプロジェクトは、日本語Webサイト制作を効率化するための初期設定環境です。他のプロジェクトからコンポーネントを持ち込んで組み合わせることで、迅速にWebサイトを構築できます。

## 技術スタック

- **Next.js 15.5.3** - React フレームワーク
- **React 19.1.0** - UI ライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS v4** - スタイリング
- **shadcn/ui** - コンポーネントライブラリ
- **Framer Motion** - アニメーション
- **Lucide React** - アイコン

## 使用開始手順

### GitHub Template Repositoryから作成する場合（推奨）

1. **GitHubで "Use this template" ボタンをクリック**
2. **新しいリポジトリ名を入力して作成**
3. **作成されたリポジトリをクローン**
   ```bash
   git clone <新しいリポジトリのURL>
   cd <新しいプロジェクト名>
   ```

4. **プロジェクト名の変更**
   ```bash
   # ディレクトリ名から自動的にpackage.jsonのnameを設定
   npm pkg set name=$(basename "$PWD" \
     | tr '[:upper:]' '[:lower:]' \
     | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
   npm pkg get name
   ```

5. **依存関係のインストール & 開発開始**
   ```bash
   npm install
   npm run dev
   ```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

### 通常のクローンから作成する場合

1. **プロジェクトのクローン**
   ```bash
   git clone <このリポジトリのURL>
   cd DefaultSetting
   ```

2. **Git履歴のリセット**
   ```bash
   rm -rf .git
   git init
   ```

3. **新しいリモートリポジトリの設定**
   ```bash
   git remote add origin <新しいプロジェクトのリポジトリURL>
   ```

4. **プロジェクト名の変更**
   ```bash
   # ディレクトリ名から自動的にpackage.jsonのnameを設定
   npm pkg set name=$(basename "$PWD" \
     | tr '[:upper:]' '[:lower:]' \
     | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
   npm pkg get name
   ```

5. **初回コミット & プッシュ**
   ```bash
   git add .
   git commit -m "Initial commit from DefaultSetting template"
   git branch -M main
   git push -u origin main
   ```

6. **依存関係のインストール & 開発開始**
   ```bash
   npm install
   npm run dev
   ```

## 主な機能

- ✅ **日本語対応**: `lang="ja"`設定済み
- ✅ **レスポンシブ対応**: viewport メタタグ設定済み
- ✅ **モバイルファースト**: Tailwind CSS でレスポンシブ設計
- ✅ **コンポーネント管理**: shadcn/ui + simple-shadcn-cli
- ✅ **高速ビルド**: Turbopack 対応
- ✅ **型安全性**: TypeScript 完全対応

## ディレクトリ構成

```
DefaultSetting/
├── app/
│   ├── components/     # プロジェクト固有コンポーネント
│   ├── globals.css     # グローバルスタイル（最小限）
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # ホームページ
├── lib/
│   └── utils.ts        # ユーティリティ関数
├── public/             # 静的ファイル
└── components.json     # shadcn/ui 設定
```

## コンポーネント管理

### shadcn/ui コンポーネントの追加
```bash
npx simple-shadcn-cli add button
npx simple-shadcn-cli add card
```

### 他プロジェクトからのコンポーネント移植
1. `app/components/` にセクション単位でコピー
2. 必要に応じてスタイルを調整
3. `page.tsx` でインポート・使用

## 開発ガイドライン

- **グローバルCSS禁止**: 競合を避けるため、グローバルスタイルは最小限に
- **モバイルファースト**: 768px をメインブレークポイントとして設計
- **コンポーネント志向**: 再利用可能なコンポーネントで構築
- **TypeScript必須**: 型安全性を重視した開発

## スクリプト

```bash
npm run dev      # 開発サーバー起動（Turbopack）
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

## ライセンス

MIT License

---

**注意**: このテンプレートを使用する際は、必ず新しいGitリポジトリを作成し、上記の手順に従ってセットアップしてください。