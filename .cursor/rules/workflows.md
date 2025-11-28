# Automated Workflows

This file defines three critical automated workflows for this project.

---

## 🔤 Font Setup Workflow

### Triggers
- フォント
- かわいい
- 上品
- 和風
- font
- cute
- elegant

### Context Files
- `memories/font_workflow.yaml`

### Critical Rules

#### Rule 1: Always Load Workflow File
When font-related keywords are detected, **always read `memories/font_workflow.yaml` first**.

This file contains:
- ✅ 6-step detailed workflow (CRITICAL/MANDATORY)
- ✅ Specific implementation methods for each step
- ✅ Troubleshooting (including multi-page issues)
- ✅ Prevention checklist

#### Rule 2: Never Skip Step 2 and Step 3
❌ Violation:
  User: "上品なフォントにしたい"
  AI: "Noto Serif JPをセットアップします" (no choices)

✅ Correct:
  User: "上品なフォントにしたい"
  AI: "見出し用フォントを選んでください：1. cormorant... 2. noto-serif..."

#### Rule 3: Respect metadata.enforcement: MANDATORY
- Do not ignore step_2.skip_allowed: false
- Do not ignore step_3.skip_allowed: false
- Do not ignore step_6.skip_allowed: false (v3.2.0~)

### Reference Files
1. **`memories/font_workflow.yaml`**
   - Complete workflow definition (6 steps)
   - Troubleshooting (issue_4: multi-page problem)
   - Prevention checklist (step_6)

2. **`SETUP_GUIDE.md`**
   - Setup procedures
   - Common errors and solutions

3. **`CHANGELOG.md`**
   - v3.2.0 changes
   - Automation improvements

### Important Changes (v3.2.0, 2025-10-29)
- ✅ Automatic update of globals.css :root section
- ✅ Complete automation of multi-page problem resolution
- ✅ Removal of @utility (Tailwind CSS v4 compatibility)

---

## 🌐 Domain Connection Workflow

**実行方法:** `/domain-connect` コマンドを使用してください

### Context Files
- `memories/connect_domain.yaml`

### Critical Rules

#### Rule 1: Always Load Workflow File
When executing domain connection workflow, **always read `memories/connect_domain.yaml` first**.

This file contains:
- ✅ Domain settings (APEX_DOMAIN, WWW_DOMAIN)
- ✅ vercel.json generation templates (2 patterns)
- ✅ Strict output format rules
- ✅ SEO information generation (from about.yaml, optional)
- ✅ Troubleshooting

#### Rule 2: Automatic File Creation (🚨 CRITICAL)

**Absolute rules when creating vercel.json:**

1. **Create vercel.json automatically using write tool**
   - ✅ Use write tool
   - ✅ File is created automatically
   - ✅ No user copy-paste required

2. **Select from YAML's output_templates**
   - pattern_A (URL direct specification, not recommended)
   - pattern_B (host condition version, **recommended**, leverages Vercel's auto HTTPS)
   - Choose one and replace placeholders with actual values
   - 💡 pattern_B uses only 1 redirect (wwwなし → wwwあり) because Vercel automatically converts HTTP to HTTPS

3. **Completion report + SEO info generation + Auto implementation**
   - ✅ Stage 1: Create vercel.json using write tool
   - ✅ Stage 2: Output completion report
   - ✅ Stage 3: Generate SEO information (read all pages + all components, integrate with about.yaml if exists)
   - ✅ Stage 4: Automatically write metadata to layout.tsx (optional)

4. **Domain Normalization (Required Processing)**
   - 🚨 Always normalize APEX_DOMAIN and WWW_DOMAIN before use
   - Remove protocol (`http://`, `https://`)
   - Remove trailing slash (`/`)
   - Convert to lowercase (`Example.JP` → `example.jp`)
   - Convert IDN (Japanese domains, etc.) to Punycode (`日本語.jp` → `xn--wgv71a119e.jp`)

5. **Validation (Required Checks)**
   - 🚨 JSON root must contain only `redirects` key
   - 🚨 Do not include extra keys like `headers`, `rewrites`, `env`
   - 🚨 Do not include duplicate `source` redirects
   - 🚨 Do not include self-redirects (`https://{WWW_DOMAIN}` → `https://{WWW_DOMAIN}` is forbidden)
   - Each redirect's `source` must be unique

### SEO Information Generation and Auto Implementation
When connecting domain, generate optimized SEO information (keywords, title, description) and automatically write to app/layout.tsx.

**Information Source Strategy:**
🚨 **Important**: At domain connection time, the site always exists, so always read the implementation code.

**Priority 1 (Recommended):**
- All pages (app/**/page.tsx) - Required
- All components (app/components/**/*.tsx) - Required
- layout.tsx - Required
- about.yaml - Optional (if exists, integrate with implementation code)
- **Implementation code is primary, about.yaml is supplementary**

**Priority 2 (Fallback):**
- All pages + All components + layout.tsx only (no about.yaml)
- Only difference from Priority 1 is the absence of about.yaml

**Priority 3 (Last resort):**
- Existing metadata (minimum fallback) - Only if site is unreadable (rare)

**Generated Content:**
- Perform market analysis and select search keywords (5 keywords)
- Generate title tag (28-32 characters, with CTA)
- Generate meta description (90-120 characters)
- Display with character count

**Auto Implementation:**
- Automatically write generated metadata to app/layout.tsx
- Replace existing metadata or create new
- Automatically add import { Metadata } from 'next' (if needed)
- Automatically add canonical link (正規URL)

**Canonical Link:**
- Set alternates.canonical to https://{WWW_DOMAIN}
- Prevents duplicate content issues
- Consolidates SEO evaluation to the canonical URL
- Example: canonical: "https://www.example.jp"

**Skip Condition:**
- Skip only if all information sources are unreadable (no error)

**Integration with Google Submission:**
- Domain connection: Set title, description, keywords, canonical
- Google submission: Add openGraph, twitter (utilize existing metadata)

---

## 🔍 Google Submission Workflow

**実行方法:** `/google-submit` コマンドを使用してください

### Context Files
- `memories/submit_google.yaml`

### Critical Rules

#### Rule 1: Always Load Workflow File
When executing Google submission workflow, **always read `memories/submit_google.yaml`**.

This file contains 5 workflows:
1. alt tag setup
2. metadata setup (title, description, keywords, openGraph, twitter)
3. sitemap.ts creation
4. robots.txt creation
5. URL slug optimization

#### Rule 2: Execute All Workflows in Order
Execute each workflow in sequence without skipping.

#### Rule 3: Never Skip Quality Checks (🚨 CRITICAL)

**Absolute rules for workflow execution:**

1. **Alt tag workflow (workflow_1):**
   - ❌ Do NOT just check if alt attributes exist
   - ✅ MUST perform quality check (forbidden words, length, specificity)
   - ✅ MUST auto-fix inappropriate alt attributes
   - Examples of inappropriate alt: "画像", "写真", "test", "sample", "〜用の画像"

2. **Sitemap workflow (workflow_3):**
   - 🚨 CRITICAL: Detect only page.tsx from filesystem
   - ❌ Do NOT detect links in code (<a href="...">, <Link href="...">)
   - ❌ Do NOT include external URLs
   - 🚨 **CRITICAL: Exclude redirect-only pages (duplicate content prevention)**
     - Read each detected page.tsx file
     - Check if it contains redirect(), permanentRedirect(), or notFound()
     - Exclude redirect-only pages from sitemap
     - Example: app/page.tsx with redirect('/home') → exclude / from sitemap
     - Include only actual content pages (/home/, /about/, etc.)
   - This is status: CRITICAL, skip_allowed: false
   - If this rule is violated:
     - External URLs will contaminate sitemap.xml
     - Duplicate content will harm SEO (Google may penalize)

3. **All workflows:**
   - Read `memories/submit_google.yaml` and follow ALL steps defined
   - Do NOT skip quality checks or validation steps
   - Do NOT skip steps marked as status: MANDATORY or status: CRITICAL
   - Do NOT skip steps marked as skip_allowed: false
   - Skipping mandatory steps is a workflow violation

---

## 📝 Contact Form Implementation Workflow

**実行方法:** `/form-implement` コマンドを使用してください

### Context Files
- `memories/form_workflow.yaml` （v2.0.0 - Token認証対応・完全な仕様を含む）

**注意:** すべての必要な情報は `memories/form_workflow.yaml` に含まれています。外部ファイルへの参照は不要です。

### Critical Rules

#### Rule 1: Always Load Workflow File
When executing contact form implementation workflow, **always read `memories/form_workflow.yaml` first**.

This file contains:
- ✅ 7-step workflow for form implementation (Token認証対応)
- ✅ JSON generation for admin panel registration (requireToken: true)
- ✅ HTML email template generation (条件分岐対応)
- ✅ Next.js component modification (Token認証コード追加)
- ✅ .env.local file auto-creation (環境変数自動作成・write ツール使用・required_permissions: ['all'])
- ✅ Security measures (XSS, HTML tag removal, validation)
- ✅ Image/File attachment support (画像・ファイル添付機能)

#### Rule 2: Information Collection
Collect information from:
1. **app/contact/page.tsx (existing form)** ← TOP Priority
   - Check if app/contact/page.tsx exists
   - If exists, extract field configuration directly from the form:
     - Extract name attributes from <input>, <select>, <textarea>
     - Extract label text
     - Check required attribute
     - Check type attribute
   - **⚠️ Form fields MUST come from existing form code, NOT from about.yaml**

2. **app/ files (if no existing form)**
   - Analyze app/page.tsx and other pages
   - Identify business type and service content
   - Infer appropriate form fields based on business type

3. **about.yaml (supplementary, basic info only)**
   - Use ONLY for basic information (company name, email)
   - **Do NOT use for form field information** (may be outdated after design completion)

4. **User input (last resort)**
   - If app/ and about.yaml provide insufficient information

Required information:
- **Site ID (lowercase, numbers, underscores only - NO HYPHENS, used as table name)**
- Company name (from app/page.tsx h1 or metadata.title)
- Admin email address (from Footer or contact page)
- **requireToken: true** (Token認証を使用)
- Form fields definition (inferred from business type)
- Optional: Image/File attachment fields (自動検出、フィールド設定不要)

#### Rule 3: Automatic File Generation & Modification
1. **Generate JSON for admin panel (Token認証):**
   - Use write tool or display in chat
   - **requireToken: true** に設定
   - **productionDomain は不要**（Token認証のため）
   - User will paste this JSON into admin panel

2. **Generate HTML email template:**
   - 必須フィールド: 常に表示
   - 任意フィールド: 条件分岐で表示（`{{#if field}}...{{/if}}`）
   - 未入力メッセージ: `{{^field}}...{{/field}}`
   - テンプレートID: `{site_id}_admin`

3. **Modify existing Next.js component (🚨 IMPORTANT - Token認証対応):**
   - 🚨 **Use search_replace to modify existing app/contact/page.tsx** (do NOT use write tool to create new file)
   - **Preserve existing design, layout, and className**
   - Add only API integration code
   
   **8 modifications using search_replace (in order):**
   1. Add "use client" directive
   2. Add imports (useState, useEffect, Script)
   3. Add useState (state management)
   4. Add security functions (escapeHtml, sanitizeInput, validateForm)
   5. Add useEffect + initializeFormHandler (API integration, Token認証対応)
   6. Modify <form> tag (add id="contactForm" and onSubmit={handleSubmit})
   7. Modify <button> tag (add disabled={isSubmitting}, text change)
   8. Add status message + Script tag

4. **Create .env.local file automatically (🚨 CRITICAL - Sandbox restriction):**
   - 🚨 **Use write tool with required_permissions: ['all']**
   - .env.local is in .gitignore, so sandbox must be disabled
   - AI asks user for API token
   - User pastes token (starts with `ufa_`)
   - AI creates .env.local automatically using write tool
   - **Never ask user to create manually**
   - Handle existing .env.local (read → merge → write)
   - Check .gitignore (add if not present)
   
   **🚨 CRITICAL - FormHandler.init() Configuration (Token認証):**
   - **First argument:** site_id (determined in step_1)
   - **Second argument:** API Token (`process.env.NEXT_PUBLIC_FORM_API_TOKEN`)
   - **Third argument options (REQUIRED):**
     - **apiBaseUrl: "https://universal-form-api.vercel.app"** (MANDATORY, form submission will fail without this)
     - beforeSend, onSuccess, onError callbacks
     - **beforeSend:** `_attachments` キーを保持（画像・ファイル添付用、削除しない）
   
   **🚨 CRITICAL - Pattern Attribute (User Verified Solution):**
   - **Correct value:** `pattern="[^\<\>\&\&quot;\']+"` (use &quot; for double quote)
   - **Solution:** Replace " with HTML entity &quot; to avoid smart quote conversion
   - **Verified:** User tested and confirmed this works without errors
   - **Wrong:** `pattern="[^\<\>\&\"\']+"` (normal quote converts to smart quote)
   - **Method:** Use HTML entities for quotes in pattern attribute
   
   **🚨 CRITICAL - SDK URL:**
   - **Correct:** `https://universal-form-api.vercel.app/form-handler.js`
   - **Wrong:** `https://universal-form-api.vercel.app/sdk.js`
   
   **Process:**
   1. Read FORMREADME.md (lines 318-585 for complete sample code)
   2. Extract pattern attribute from line 469: `pattern="[^\<\>\&\"\']+""`
   3. Use this exact value (do NOT modify or convert characters)
   4. Generate component based on step_1 fields

#### Rule 4: Security Measures (MANDATORY)
All generated forms MUST include:
- ✅ maxLength attribute (character limit)
- ✅ pattern attribute (dangerous character restriction: `pattern="[^\<\>\&\&quot;\']+"` with &quot;)
- ✅ escapeHtml() function (XSS prevention)
- ✅ sanitizeInput() function (HTML tag removal)
- ✅ validateForm() function (pre-submit validation)

**Never skip security implementation.**

#### Rule 5: ESLint Error Prevention (🚨 CRITICAL)
All generated code MUST include ESLint suppressions to avoid build errors:

**Required suppressions:**
1. **`// eslint-disable-next-line @typescript-eslint/no-explicit-any`**
   - Add before ALL `(window as any)` usage (3 locations)
   - Lines: useEffect check, initializeFormHandler check, FormHandler.init call
   - Reason: FormHandler is external library without type definitions

2. **`// eslint-disable-next-line @typescript-eslint/no-unused-vars`**
   - Add before `const [formHandlerLoaded, setFormHandlerLoaded] = useState(false);`
   - Reason: Used in Script onLoad callback, ESLint cannot detect usage

**Without these suppressions, `npm run build` will fail with:**
- `Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any`
- `Warning: 'formHandlerLoaded' is assigned a value but never used. @typescript-eslint/no-unused-vars`

#### Rule 5: Image/File Attachment Support (Optional)

**画像添付:**
```html
<input
  type="file"
  name="images"
  accept="image/jpeg,image/png,image/gif,image/webp"
  multiple
/>
<p>JPEG, PNG, GIF, WebP対応 / 最大5枚, 合計4MBまで</p>
```

**ファイル添付:**
```html
<input
  type="file"
  name="attachments"
  accept=".pdf,.txt,.zip"
  multiple
/>
<p>.pdf/.txt/.zip対応 / 最大5ファイル, 合計4MBまで</p>
```

**⚠️ 重要な仕様:**
- フィールド設定（JSON）への追加は**不要**
- `form-handler.js` が `<input type="file">` を自動検出
- DBにはメタデータのみ保存（ファイルデータは保存されない）
- メールに直接添付される
- API側で制限（サイト側で変更不可）
- **beforeSend で `_attachments` を保持**（削除しない）

**制限事項:**
| 項目 | 画像 | ファイル |
|------|------|---------|
| 対応形式 | JPEG, PNG, GIF, WebP | PDF, TXT, ZIP |
| 最大数 | 5枚 | 5ファイル |
| 合計サイズ | 4MB | 4MB |

### Integration with Other Workflows
- **requireToken: true** に設定（Token認証）
- **productionDomain は不要**（Token認証のため）
- Use about.yaml's contact_defaults.email for adminEmail（複数の場合はカンマ区切り）
- **Environment variables:**
  - **Client Component:** `NEXT_PUBLIC_FORM_API_TOKEN` （ブラウザに公開される）
  - **Server Component:** `FORM_API_TOKEN` （サーバー側のみ、より安全）
- **select要素:** JSON では `type: "text"` と指定（フロントエンドでは `<select>` 使用可）
- Consistent with domain connection workflow

---

## 🔍 Form Check Config Workflow

**実行方法:** `/form-check-config` コマンドを使用してください

### Purpose

フォーム送信エラーが発生した際に、Universal Form API に登録されている設定内容を確認し、エラー原因を特定します。

### Context Files
- `memories/form_check_config.yaml` （v1.0.0）

### When to Use

このコマンドは以下の場合に使用します：
- ✅ フォーム送信エラーが発生した
- ✅ 一括登録したJSONが正しく反映されているか確認したい
- ✅ フィールド設定やドメイン設定を再確認したい
- ✅ APIトークンが正しいか確認したい

### Workflow (4 Steps)

#### Step 1: サイト情報の収集
- AI がユーザーに site_id と admin_email を聞く
- ユーザーが入力

#### Step 2: check-config API の実行
- `run_terminal_cmd` で curl コマンドを実行
- `required_permissions: ['network']` を指定
- API エンドポイント: `https://universal-form-api.vercel.app/api/check-config`

#### Step 3: 結果の分析とエラー診断
- API レスポンスを分析
- 設定内容を表示
- エラーがある場合は原因を特定し、解決策を提示

#### Step 4: フロントエンドとの比較（オプション）
- `app/contact/page.tsx` を読み込み
- フォームの `name` 属性と API の `fields.name` を比較
- 不一致があれば指摘

### Critical Rules

#### Rule 1: Network Permission Required
- curl コマンド実行時に `required_permissions: ['network']` を必須指定
- ネットワークアクセスが必要

#### Rule 2: Security Note
- API レスポンスに APIトークンが含まれる（Token認証の場合）
- セキュリティに注意して取り扱う

#### Rule 3: Error Diagnosis
エラーメッセージに応じて適切な解決策を提示：

| エラーメッセージ | 原因 | 解決策 |
|----------------|------|--------|
| `site_id is required` | site_id 未指定 | site_id を指定して再実行 |
| `admin_email is required` | admin_email 未指定 | admin_email を指定して再実行 |
| `Forbidden: Invalid admin_email` | admin_email 不一致 | 管理画面で確認 |
| `Site not found or inactive` | サイト未登録 | site_id を確認 |

### Output Example

**成功時:**
```
✅ サイト設定を取得しました

【基本情報】
- サイトID: mediaproof
- サイト名: 株式会社メディアプルーフ
- 認証方式: Token認証

【APIトークン】
- ufa_1234567890abcdef...

【フィールド設定】
1. name (お名前) - type: text, required: true
2. email (メールアドレス) - type: email, required: true
3. message (メッセージ) - type: textarea, required: true

【診断結果】
✅ 設定に問題はありません
```

---

## 🖼️ Image Fetch Workflow

**実行方法:** 3つのコマンドに分けて実行してください

### Commands (v2.1.0)
1. **`/image-fetch-list`** - Step 1: リスト一括取得
2. **`/image-select`** - Step 2: AI対話形式での画像選定 ⭐ 重要（重複チェック機能付き）
3. **`/image-download`** - Step 3: ダウンロード実行 + Step 4: 履歴記録（自動）

**理由:** コマンドを分けることで、Step 2（画像選定）でAIが手を抜かないようにします。
**v2.1.0:** 重複防止機能により、同じ画像を二重にダウンロードすることを防止します。

### Context Files
- `memories/image_fetch_workflow.yaml` （v2.1.0）

### Workflow Overview

#### Command 1: `/image-fetch-list` (Step 1)
**目的:** Google Drive から画像リストを取得

**実行内容:**
- OS選択（Mac/Windows）
- photos と backgrounds のリストを一括取得（1コマンド）
- `scripts/photos_index.json` と `scripts/backgrounds_index.json` を生成

**Next:** `/image-select` を実行

#### Command 2: `/image-select` (Step 2) ⭐ 最重要
**目的:** AI対話形式で画像を選定（重複チェック機能付き）

**実行内容:**
- 必須ファイルを読み込む（photos_index.json, backgrounds_index.json）
- **重複チェック:** `scripts/prev_selected.json` を確認（存在する場合）
  - 存在する → 既存ファイルを除外して重複選定を防止
  - 存在しない → 初回なので除外なし
- AIが質問: **「どのような画像を選定しますか？」**
- ユーザーの回答を待つ
- 回答に基づいて画像を選定（必須ルールに従う + 重複回避）
- `scripts/selected.json` に保存

**Next:** `/image-download` を実行

#### Command 3: `/image-download` (Step 3 + Step 4)
**目的:** 選定した画像をダウンロード + 履歴記録

**実行内容:**
- OS確認（Mac/Windows）
- `selected.json` に基づいてダウンロード（1コマンド）
- `public/img/photos/` と `public/img/backgrounds/` に保存
- **ダウンロード履歴の記録（自動）:**
  - 初回: `selected.json` を `prev_selected.json` にコピー
  - 2回目以降: 既存履歴とマージして更新

### Critical Rules

#### Rule 1: Always Load Workflow File
When executing any image fetch command, **always read `memories/image_fetch_workflow.yaml` first**.

This file contains:
- ✅ Step 0: OS selection (Mac/Windows)
- ✅ Step 1: Batch fetch image lists from Google Drive (1 command)
- ✅ Step 2: AI-interactive image selection (with duplicate prevention)
- ✅ Step 3: Image download execution (1 command, photos + backgrounds)
- ✅ Step 4: Download history recording (automatic)

#### Rule 2: Execute Commands in Order
🚨 **MUST** execute commands in this order:
1. `/image-fetch-list` (リスト取得)
2. `/image-select` (画像選定)
3. `/image-download` (ダウンロード)

**Do NOT skip steps or execute out of order.**

#### Rule 3: OS Selection (CRITICAL)
- 🚨 **MUST** ask user for OS (Mac or Windows) in `/image-fetch-list` and `/image-download`
- Use OS-specific commands:
  - Mac/Linux: bash commands
  - Windows: PowerShell commands

#### Rule 4: AI-Interactive Selection (`/image-select` - 🚨 CRITICAL)
**This command is designed to prevent AI from cutting corners:**

**AI's Role:**
1. **Check for duplicate prevention (FIRST STEP):**
   - Read `scripts/prev_selected.json` if it exists
   - If exists: Load previously downloaded files to exclude from selection
   - If not exists: Initial selection, no exclusions needed

2. **Read required files using sequential browsing (NOT grep search):**
   - **❌ FORBIDDEN: Using grep to filter photos_index.json**
   - **✅ REQUIRED: Sequential reading with offset/limit**
   - **Dynamic batching**: 250 lines per batch, calculate required batches
   - Process:
     1. Check total lines (e.g., 935 lines)
     2. Calculate batches: `ceil(total_lines ÷ 250)` (e.g., ceil(935÷250) = 4 batches)
     3. Read each batch:
        - Batch 1: offset=1,           limit=250
        - Batch 2: offset=251,         limit=250
        - Batch N: offset=(N-1)*250+1, limit=250 or remaining lines
   - `scripts/backgrounds_index.json` - read entirely (typically small)
   - User-specified YAML files (about.yaml, design.yaml, etc.)

3. **Ask user:** "どのような画像を選定しますか？"

4. **Wait for user response** (examples below)

5. **Execute selection carefully** based on user's requirements and following CRITICAL rules
   - **Exclude files already in prev_selected.json** (if exists)

**User Response Examples:**
- "about.yaml の要件に合う写真をお願いします"
- "〇〇セクションに合うような画像"
- "ヒーローセクション用の画像を選んでください"
- "design.yaml に基づいて背景素材を選定してください"

**Why grep is forbidden:**
- Grep filtering causes 80% of photos to be missed (747 out of 933 photos)
- Keywords like "media-", "publishing-", "library-", "research-" are overlooked
- Sequential reading ensures ALL photos are reviewed

#### Rule 5: Filename Exact Match (🚨 CRITICAL - Prevents Command Errors)
**These rules are CRITICAL to prevent `/image-download` command errors:**

**Absolute rules for filename handling:**
- 🚨 Read *_index.json files completely as JSON arrays
- 🚨 Copy each filename exactly as-is (do NOT modify even 1 character)
- 🚨 **NEVER** infer or construct filenames from grep results or partial matches
- 🚨 After selection, verify each filename exists in original JSON using grep -F (exact match)

**Forbidden:**
- ❌ Inferring filenames from partial matches
- ❌ Constructing filenames
- ❌ Modifying filenames in any way

**Reason:** If filenames are incorrect, `/image-download` command will fail with errors.

#### Rule 6: Structured JSON Output (🚨 CRITICAL - Prevents Command Errors)
**These rules are CRITICAL to prevent `/image-download` command errors:**

- Output format: `{ "photos": [...], "backgrounds": [...], "illusts": [] }`
- If selected.json exists, read it and update only the relevant key
- Preserve other keys unchanged
- **No explanations, code blocks, or comments** (pure JSON only)

**Reason:** If JSON format is incorrect, `/image-download` command will fail with errors.

#### Rule 7: Exclusion Rules
- Exclude filenames containing ", " (comma + space)
- Exclude filenames with special characters (comma, semicolon, etc.)
- **Exclude files already in `scripts/prev_selected.json`** (duplicate prevention)

#### Rule 8: Download History Recording & Cleanup (🚨 AUTOMATIC in `/image-download`)
**After successful download, automatically record history and clean up:**

**Process:**
1. Check if `scripts/prev_selected.json` exists
2. If NOT exists (initial run):
   - Copy: `cp scripts/selected.json scripts/prev_selected.json`
   - Delete: `rm scripts/selected.json`
   - Output: "✅ ダウンロード履歴を記録しました（初回）"
   - Output: "📝 selected.json を削除しました（次回は新規選定が必要）"
3. If exists (subsequent runs):
   - Merge: Combine existing history with new downloads
   - Update: `prev_selected.json` with cumulative record
   - Delete: `rm scripts/selected.json`
   - Output: "✅ ダウンロード履歴を更新（累計: N件）"
   - Output: "📝 selected.json を削除しました（次回は新規選定が必要）"

**Commands:**
- Mac/Linux: Use `cp` + `rm` for initial, Node.js merge script + `rm` for subsequent
- Windows: Use `Copy-Item` + `Remove-Item` for initial, Node.js merge script + `Remove-Item` for subsequent

**Why important:**
- Prevents downloading the same image twice
- Saves storage and bandwidth
- Enables automatic duplicate detection in future selections
- **Deletes `selected.json` to prevent accidental re-downloads with old selections**
- Forces fresh selection on next run

### Background Filename Pattern
Backgrounds use structured naming:
`bg--vibe--pattern_type--repeatability--palette--brightness--contrast--busyness--gradient_axis--size.ext`

Example: `bg--simple--gradient--non-tile--warm--light--mid--calm--vertical--1920x1080.png`

### Complete Workflow Example (v2.1.0)

```
User: /image-fetch-list
AI: [Step 1 実行] ✅ リスト取得完了

User: /image-select
AI: [重複チェック] scripts/prev_selected.json の存在確認
    → 存在しない → 初回選定なので除外なし
AI: どのような画像を選定しますか？
User: about.yaml の要件に合う写真をお願いします
AI: [Step 2 実行] ✅ 画像選定完了

User: /image-download
AI: [Step 3 実行] ✅ ダウンロード完了
AI: [Step 4 実行] ✅ ダウンロード履歴を記録（初回）
```

**2回目以降の実行:**
```
User: /image-select
AI: [重複チェック] scripts/prev_selected.json を読み込み
    → 既存15件を除外して新規ファイルのみ選定
AI: どのような画像を選定しますか？
User: 追加で〇〇セクション用の画像をお願いします
AI: [Step 2 実行] ✅ 画像選定完了（新規5件のみ）

User: /image-download
AI: [Step 3 実行] ✅ ダウンロード完了（新規5件）
AI: [Step 4 実行] ✅ ダウンロード履歴を更新（累計: 20件）
```

