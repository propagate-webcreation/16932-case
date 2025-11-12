# Google Submission

Google提出ワークフローを実行します（altタグ + metadata + sitemap + robots + URLスラッグ）。

## Context Files

- `memories/submit_google.yaml`
- `.cursor/rules/workflows.md` （Google Submission Workflow セクション）

## Instructions

**🚨 重要: このコマンドファイルは指示のみです。詳細なワークフロー（5つのワークフロー）は yaml ファイルに記載されています。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む（読まずに実行することは禁止）:**
   - `memories/submit_google.yaml` （詳細ワークフロー・789行・本体）
   - `.cursor/rules/workflows.md` の Google Submission Workflow セクション（重要なルール）
2. **yaml ファイルを読み込んでから、5つのワークフローを順番に実行し、絶対にスキップしない**

## Critical Rules

### Workflow 1: Alt Tag Setup (MANDATORY Quality Check)
- 🚨 **multiline モード使用**（複数行にまたがる Image タグも検出）
- 🚨 **品質チェック必須**（status: MANDATORY, skip_allowed: false）
- 🚨 **不適切な alt を自動改善**
  - Forbidden words: "画像", "写真", "イメージ", "test", "sample"
  - Forbidden patterns: "〜用の", "〜のための", "の画像", "の写真"
  - Check: 文字数（20字以内）、冗長語（7パターン）、具体性
- ❌ **Do NOT** just check if alt exists → MUST check quality
- 推奨検索パターン: `"Image"` または `'src="'` （シンプルで確実）
- ❌ 避けるパターン: `'<Image|<img'` （失敗する）

### Workflow 2: Metadata Setup
- Utilize existing metadata (domain connection で設定済みの場合)
- Generate title (28-32 chars), description (90-120 chars), keywords (5)
- Add openGraph and twitter
- Update app/layout.tsx using search_replace

### Workflow 3: Sitemap Creation (🚨 CRITICAL)
- 🚨 **CRITICAL: Detect only page.tsx from filesystem**
- ❌ **Do NOT** detect links in code (`<a href="...">`, `<Link href="...">`)
- ❌ **Do NOT** include external URLs
- 🚨 **CRITICAL: Exclude redirect-only pages (duplicate content prevention)**
  - Read each page.tsx and check for redirect(), permanentRedirect(), notFound()
  - Exclude redirect-only pages from sitemap
  - Example: app/page.tsx with redirect('/home') → exclude / from sitemap, include /home/ only
- status: CRITICAL, skip_allowed: false
- 外部URL混入と重複コンテンツを絶対に防ぐ

### Workflow 4: Robots.txt Creation
- Reuse BASE_URL from workflow_3
- Use write tool to create public/robots.txt
- Sitemap URL must match sitemap.ts

### Workflow 5: URL Slug Optimization
- Detect Japanese directories
- Read page.tsx to analyze content
- Suggest English slugs (manual rename required)

## Execution Example

**User:** `/google-submit`

**AI Action:**
```
[1/5] altタグを設定します...
  → multiline: true で Image を検索
  → alt属性を確認（存在だけでなく品質もチェック）
  → 不適切なalt（"画像", "写真"など）を自動改善
  ✅ 画像に alt 属性を設定しました

[2/5] metadata を設定します...
  → 既存metadata活用 or 新規生成
  → openGraph, twitter を追加
  ✅ app/layout.tsx に metadata を設定しました

[3/5] sitemap.ts を作成します...
  → ファイルシステムのみ検出（外部URL除外）
  ✅ app/sitemap.ts を作成しました

[4/5] robots.txt を作成します...
  ✅ public/robots.txt を作成しました

[5/5] URLスラッグを最適化します...
  ✅ URLスラッグを最適化しました

🎉 Google提出の準備が完了しました！
```

