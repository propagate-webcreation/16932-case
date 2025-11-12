# Domain Connection

ドメイン接続ワークフローを実行します（vercel.json生成 + SEO設定 + canonical link）。

## Context Files

- `memories/connect_domain.yaml`
- `.cursor/rules/workflows.md` （Domain Connection Workflow セクション）

## Instructions

**🚨 重要: このコマンドファイルは指示のみです。詳細なワークフロー（全ステップ）は yaml ファイルに記載されています。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む（読まずに実行することは禁止）:**
   - `memories/connect_domain.yaml` （詳細ワークフロー・1,499行・本体）
   - `.cursor/rules/workflows.md` の Domain Connection Workflow セクション（重要なルール）
2. **yaml ファイルを読み込んでから、ワークフローの全ステップを順番に実行し、絶対にスキップしない**
3. **重要なルール（🚨 CRITICAL）:**
   - **write ツールで vercel.json を自動作成**（チャット出力のみは禁止）
   - **ドメイン正規化を必ず実施**（小文字化、Punycode、プロトコル除去、末尾スラッシュ除去）
   - **バリデーション**（redirects のみ、重複source禁止、自己リダイレクト禁止）
   - **SEO情報を layout.tsx に自動書き込み**（オプショナル、about.yamlがある場合）
   - **canonical link を自動設定**（alternates.canonical）

## Critical Rules

### Pattern Selection
- **pattern_B（host条件版）を推奨**
- Vercelの自動HTTPS変換を活用（リダイレクト1つのみ）
- wwwなし → wwwあり のリダイレクトのみ

### Domain Normalization (MANDATORY)
1. プロトコル除去（http://, https://）
2. 末尾スラッシュ除去（/）
3. 小文字化（Example.JP → example.jp）
4. IDN正規化（日本語.jp → xn--wgv71a119e.jp）

### Validation (MANDATORY)
- JSON root must contain only `redirects` key
- No duplicate `source` entries
- No self-redirects (https://{WWW_DOMAIN} → https://{WWW_DOMAIN})
- Each redirect's `source` must be unique

### SEO & Canonical
- Generate title (28-32 characters), description (90-120 characters), keywords (5 keywords)
- Automatically write to app/layout.tsx
- Set alternates.canonical to https://{WWW_DOMAIN}
- Prevents duplicate content issues

## Execution Example

**User:** `/domain-connect`

**AI Action:**
1. Read `memories/connect_domain.yaml`
2. Get APEX_DOMAIN and WWW_DOMAIN from domain_config
3. Normalize domains (lowercase, remove protocol, etc.)
4. Generate vercel.json using pattern_B (1 redirect only)
5. Create vercel.json using write tool
6. Generate SEO information (optional, if about.yaml exists)
7. Write metadata + canonical to app/layout.tsx (optional)
8. Output completion report

