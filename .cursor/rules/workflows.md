# Automated Workflows

This file defines the critical automated workflows for this project.

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

This file contains 6 workflows:
0. **Verification file creation (DNS不要)** ← NEW in v2.5.0
1. alt tag setup
2. metadata setup (title, description, keywords, openGraph, twitter)
3. sitemap.ts creation
4. robots.txt creation
5. URL slug optimization

#### Rule 2: Execute All Workflows in Order
Execute each workflow in sequence without skipping (except workflow_0 if user chooses to skip).

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

#### Rule 4: URL Prefix Option (v2.4.0)

**Google Search Console の「URL プレフィックス プロパティ」対応:**

1. **Usage:**
   - `/google-submit --prefix /blog`
   - `/google-submit prefix=/services`

2. **Behavior when prefix is specified:**
   - workflow_1 (alt): Only target components under the specified path
   - workflow_2 (metadata): Update layout.tsx under the specified path (fallback to app/layout.tsx)
   - workflow_3 (sitemap): Only include page.tsx under the specified path
   - workflow_4 (robots): No change (robots.txt applies to entire site)
   - workflow_5 (URL slug): Only target directories under the specified path

3. **Behavior when prefix is NOT specified:**
   - Default behavior (entire site)
   - Backward compatible

4. **Examples:**
   | Command | Scope |
   |---------|-------|
   | `/google-submit` | Entire site (/, /about/, /contact/, etc.) |
   | `/google-submit --prefix /blog` | /blog/ only (/blog/, /blog/post-1/, etc.) |
   | `/google-submit prefix=/services` | /services/ only |

#### Rule 5: Registration Method Selection (v2.5.0)

**最初にユーザーに登録方式を選択させる（2つの方式から選択可能）:**

1. **Options:**
   | 方式 | 説明 | DNS必要？ | 推奨 |
   |------|------|----------|------|
   | **A: ドメインプロパティ** | DNS TXT レコードで確認 | ✅ 必要 | 自社ドメイン向け |
   | **B: URL プレフィックス** | HTML ファイルで確認 | ❌ 不要 | ✅ 顧客ドメイン向け |

2. **Option A: ドメインプロパティ（DNS方式）**
   - Google Search Console で「ドメイン」を選択
   - DNS TXT レコードを追加して所有権確認
   - ⚠️ 顧客ドメインの場合、顧客側での DNS 設定が必要

3. **Option B: URL プレフィックス（HTML ファイル方式）✅ 推奨**
   - Google Search Console で「URL プレフィックス」を選択
   - HTML ファイルを `public/` に配置して所有権確認
   - ✅ DNS 設定不要、デプロイするだけで完結
   - ✅ 顧客ドメインでも自分側だけで対応可能

4. **File format (Option B):**
   - Filename: `google1234567890abcdef.html`
   - Content: `google-site-verification: google1234567890abcdef.html`
   - Location: `public/google1234567890abcdef.html`

5. **Skip option:**
   - ユーザーが「スキップ」と入力した場合のみスキップ可能
   - すでに所有権確認済みの場合

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

## 📊 Spreadsheet Form API Workflow（作成・接続）

**実行方法:** `/spreadsheet-form-api タブ名は "実際のタブ名に入れ替え"` コマンドを使用してください

### Purpose

お問い合わせフォームを **作成・接続** し、フォームの回答を Google スプレッドシートに保存できるようにします。API ルートの作成または更新、フォームから `/api/contact` への接続、タブ名の設定を一括で行います。タブ名の変更だけではなく「フォーム → スプレッドシート保存」までを実現するワークフローです。

### Context Files
- `memories/spreadsheet_form_api.yaml` （v2.0.0）
- `app/api/contact/route.ts` （存在する場合は参照・更新）
- お問い合わせフォームを含むコンポーネント（例: `app/components/ContactForm.tsx`、`app/contact/page.tsx`）

### 理想的なユーザー入力

```
/spreadsheet-form-api タブ名は "実際のタブ名に入れ替え"
```

例: `タブ名は "フォーム送信"` / `タブ名は "問い合わせ"` / `タブ名は 'シミュレーション'`

### Workflow (6 Steps)

#### Step 1: メモリ読み込みと現状把握
- `memories/spreadsheet_form_api.yaml` を読み込む
- `app/api/contact/route.ts` の有無を確認
- お問い合わせフォームがどのコンポーネントにあるか特定
- 既にフォームから `/api/contact` が呼ばれているか確認

#### Step 2: ユーザー入力からタブ名を解析
- コマンドに続く `タブ名は "..."` または `タブ名は '...'` からタブ名を抽出
- 引用符がない場合はコマンド直後の1トークンをタブ名とする

#### Step 3: API ルートの作成または更新
- **存在しない場合:** `app/api/contact/route.ts` を新規作成。POST で name / email / phone 等を受け取り、Google Sheets API で指定タブの最下行に追記。環境変数 `GOOGLE_SPREADSHEET_API`・`SPREADSHEET_KEY` を使用。range にユーザー指定タブ名を2箇所使用（`〇〇!A:A` と `` 〇〇!A${nextRow} ``）
- **存在する場合:** range に含まれるタブ名をユーザー指定のタブ名に `search_replace` で2箇所とも置換

#### Step 4: フォームから /api/contact への接続
- フォーム送信成功時（または Universal Form API の onSuccess 内）に `POST /api/contact` が呼ばれるようにする
- 呼ばれていない場合は、`fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, phone, ... }) })` を追加
- 送信フィールドは API の期待（name, email, phone 必須。region, monthlyBill 等は任意）と一致させる

#### Step 5: 環境変数の説明
- `.env.example` に `GOOGLE_SPREADSHEET_API`（サービスアカウント JSON）と `SPREADSHEET_KEY`（スプレッドシート ID）の説明を追記するか、完了報告でユーザーに設定手順を伝える

#### Step 6: 完了報告とユーザーが行うこと
- 実施した変更を簡潔に報告
- ユーザーへ: スプレッドシートに指定タブ名のシートを作成し、サービスアカウントに編集権限を付与すること
- ユーザーへ: `.env.local` に `GOOGLE_SPREADSHEET_API` と `SPREADSHEET_KEY` を設定すること

### Critical Rules

#### Rule 1: Always Load Workflow File
- **必ず** `memories/spreadsheet_form_api.yaml` を読み込んでから実行する
- 目的は「タブ名だけ変更」ではなく「フォーム回答をスプレッドシートに保存するための作成・接続」である

#### Rule 2: API ルートとフォーム接続の両方を行う
- API ルートが無ければ作成、あればタブ名を反映。さらにフォームから `POST /api/contact` が確実に呼ばれるように接続する
- 既存プロジェクトでは、Universal Form API の onSuccess 内で `/api/contact` を呼ぶパターンがある

#### Rule 3: 禁止事項
- 実際の API キーやスプレッドシート ID をコードにハードコードしない（.env.example の説明のみ可）
- range の列指定（`A:A`, `A${nextRow}`）を無断で変更しない

### When to Use

- ✅ お問い合わせフォームを新規に作り、回答をスプレッドシートに保存したいとき
- ✅ 既存フォームにスプレッドシート保存を追加・接続したいとき
- ✅ フォーム送信先のスプレッドシートのタブ名を変更し、接続を維持したいとき

---

## 🎨 Design Recommend Workflow

**実行方法:** `/design-recommend [target-component]` コマンドを使用してください

### Context Files
- `memories/design_recommend_workflow.yaml` （v1.0.0）

### Purpose

デザインストックからリファレンスコンポーネントを選定し、ターゲットコンポーネントに統合するワークフロー。
プロジェクトのビジュアルスタイルを維持しながら、リファレンスのレイアウト原則やスタイルを適用します。

### Commands
- **`/design-recommend [target]`** - デザイン推奨ワークフローを実行

### キーワードトリガー（コンポーネントストック適用）

「**{参考} を {ターゲット} に適用してください**」のように依頼された場合も、同様の「既存情報を保持しつつ参考デザインを適応する」ルールを適用する。

- **参照ルール**: `.cursor/rules/24-design-apply-stock.mdc`
- **例**: 「Feature100 を HomeFeatures に適用してください」「About3000 を AboutMission に適用」
- 参考＝適用元（デザインストック）、ターゲット＝適用先（既存コンポーネント）。ターゲットのコンテンツは保持し、レイアウト・スタイルを参考に統一して適応する。

### Usage Examples
```
/design-recommend HomeHero
/design-recommend app/components/home/HomeFeatures.tsx
/design-recommend AboutMission
/design-recommend ContactForm
```

### Workflow Overview (6 Steps)

#### Step 0: コマンド解析
- ターゲットコンポーネント名またはパスを抽出
- 存在確認（app/components/配下を検索）

#### Step 1: インデックスファイル取得
- デザインストックのインデックスをダウンロード
- `curl -o scripts/_index.json "https://gist.githubusercontent.com/propagate1/5567ced2819730057503417bd35ee7cc/raw/_index.json"`

#### Step 2: ターゲット分析
- ターゲットコンポーネントのソースコードを読み込み
- セクションタイプ、レイアウト、コンテンツ構成を分析
- 同じページの他セクションも確認してプロジェクト全体のスタイルを把握

#### Step 3: 候補絞り込み（5-6件）
- インデックスから最適な候補を選出
- category、tags.style、tags.industry、designAnalysisを考慮

#### Step 4: 対話による最終選定
- 上位2件を提示し、特徴を説明
- ユーザーに質問して意図を明確化
- 最終1件を決定

#### Step 5: リファレンス取得
- shadcnコマンドでコンポーネントを取得
- `npx shadcn@latest add "https://gist.githubusercontent.com/propagate1/5567ced2819730057503417bd35ee7cc/raw/{id}.json"`
- 🚨 **idは小文字を使用**: about3000, feature100, hero5001（PascalCaseではない）

#### Step 6: 統合実装 (🚨 CRITICAL)
- リファレンスデザインをターゲットに統合
- **必ず `.cursor/rules/24-design-apply-stock.mdc` を読み、そのルールに従って適用する**
- 保持（Preserve）・採用（Adopt）・適応（Adapt）・禁止事項は 24-design-apply-stock.mdc に一元化

### Critical Rules

#### Rule 1: Always Load Workflow File
When executing design recommend workflow, **always read `memories/design_recommend_workflow.yaml` first**.

This file contains:
- ✅ 6-step detailed workflow
- ✅ Category mapping (Hero, About, Feature, CTA, etc.)
- ✅ Style mapping (やさしい・ナチュラル, 上品・高級感, etc.)
- ✅ Step 6 では 24-design-apply-stock.mdc を参照
- ✅ Troubleshooting

#### Rule 2: Never Skip User Interaction (Step 4)
❌ Violation:
  User: "/design-recommend HomeHero"
  AI: "About3000を適用します" (no choices)

✅ Correct:
  User: "/design-recommend HomeHero"
  AI: "候補を5件選出しました。上位2件について..."
  AI: "どちらのスタイルが好みですか？"

#### Rule 3: Step 6 — Apply Design from Stock Rule (🚨 CRITICAL)
統合実装時は **必ず `.cursor/rules/24-design-apply-stock.mdc` を参照し、その「保持するもの」「参考から採用するもの」「プロジェクトに合わせて調整するもの」「禁止事項」「実行の流れ」に従う。同一内容の重複ルールはここには記載しない。

#### Rule 4: Index Structure Understanding

インデックスファイルの構造:
```json
{
  "version": "1.0",
  "components": [
    {
      "id": "about3000",
      "name": "About3000",
      "category": "About",
      "fileName": "About3000.tsx",
      "tags": {
        "main": ["About"],
        "style": ["やさしい・ナチュラル"],
        "industry": ["福祉・介護"],
        "pageType": ["CP"],
        "plan": ["BASIC"]
      },
      "designAnalysis": {
        "visualSummary": "...",
        "colorMood": { "palette": "...", "feeling": "..." },
        "typography": { "style": "...", "hierarchy": "...", "personality": "..." },
        "layout": { "pattern": "...", "spacing": "...", "density": "..." },
        "integrationGuidelines": {
          "pairsWith": ["..."],
          "avoidWith": ["..."],
          "keyElements": "..."
        },
        "distinctiveFeatures": ["..."]
      }
    }
  ]
}
```

### Category Mapping

| Category | Keywords | Typical Components |
|----------|----------|-------------------|
| Hero | hero, メインビジュアル, ファーストビュー | HomeHero, PageHeader |
| About | about, 私たちについて, mission | AboutMission, CompanyMission |
| Feature | feature, 特徴, 強み, サービス | HomeFeatures, WorksServices |
| CTA | cta, お問い合わせ, contact | CTA |
| Works | works, 実績, 事例, gallery | HomeWorks, WorksGallery |
| Contact | contact, form, フォーム | ContactForm |
| Company | company, 会社, 企業情報 | CompanyProfile |
| Staff | staff, スタッフ, チーム, greeting | HomeGreeting |
| News | news, お知らせ, media | MediaContent |

### Style Mapping

| Style | Characteristics | Compatible Industries |
|-------|----------------|----------------------|
| やさしい・ナチュラル | 柔らかい色調, 丸みのある要素 | 福祉・介護, 教育 |
| 上品・高級感 | 落ち着いた配色, 洗練されたタイポグラフィ | ホテル・旅館, 飲食店 |
| カッコいい | コントラストの強い配色, ダイナミック | IT・テクノロジー, 製造業 |
| シンプル | 最小限の装飾, クリーンなレイアウト | 全業種 |
| 和風 | 日本的な色使い, 縦書き要素 | 旅館, 和食, 伝統工芸 |

### Complete Workflow Example

```
User: /design-recommend HomeFeatures

AI: [Step 1] インデックスファイルを取得しています...
    ✅ 取得完了（150コンポーネント）

AI: [Step 2] ターゲット分析中...
    - セクションタイプ: Feature
    - 現在のレイアウト: 3カラムグリッド
    - プロジェクトスタイル: シンプル・モダン

AI: [Step 3] 候補を選出しました（5件）:
    1. Feature100 - シンプル・カード型
    2. Feature200 - アイコン強調型
    3. Feature300 - 画像+テキスト交互配置
    4. Feature400 - 数字強調型
    5. Feature500 - タイムライン型

AI: [Step 4] 上位2件の詳細:
    
    **1. Feature100**
    - レイアウト: 3カラムカード
    - 特徴: ミニマルで読みやすい
    
    **2. Feature200**
    - レイアウト: アイコン中心の4カラム
    - 特徴: 視覚的インパクト
    
    質問: 現在のコンテンツ量を考えると、
    シンプルなカード型と、アイコン強調型、
    どちらが好みですか？

User: シンプルなカード型でお願いします

AI: [Step 5] feature100を取得しています...
    コマンド: npx shadcn@latest add ".../feature100.json"
    ✅ 取得完了

AI: [Step 6] 統合を開始します...
    
    適用した変更:
    - グリッド構造をFeature100のパターンに変更
    - カード内の余白比率を調整
    - 視覚的階層を改善
    
    保持した要素:
    - 既存のテキストコンテンツ
    - プロジェクトのカラー変数
    - ワークスペースルールのフォントサイズ
    
    ✅ 統合完了
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

### Troubleshooting

#### 認証エラー: `invalid_grant`

**原因:**
Google認証トークンが無効化された（期限切れ、設定変更、長期間未使用など）

**解決方法:**

**Step 1: 既存のトークンを削除（AIが実行）**

AIが自動的に以下のコマンドを実行します：

**macOS/Linux:**
```bash
rm ~/.config/drive-img-cli/token.json
```

**Windows:**
```powershell
Remove-Item "$env:USERPROFILE\.config\drive-img-cli\token.json"
```

**Step 2: 再認証を実行（🚨 ユーザー操作が必要）**

以下のコマンドを**ご自身で**ターミナル（Mac）またはPowerShell（Windows）で実行してください：

**macOS/Linux:**
```bash
node ~/tools/drive-img-cli/drive-images.js auth
```

**Windows:**
```powershell
node $env:USERPROFILE\tools\drive-img-cli\drive-images.js auth
```

**ブラウザでの操作手順:**

1. コマンド実行後、ブラウザが自動的に開きます
2. 🚨 **CRITICAL: 必ず「propagate.ai.webcreation2@gmail.com」アカウントを選択してください**
3. 「このアプリは Google で確認されていません」と表示された場合:
   - 「詳細」→「（安全ではないページ）に移動」をクリック
4. 「Google Drive API にアクセスしようとしています」と表示されたら「許可」をクリック
5. 「認証に成功しました」と表示されたら完了

**重要な注意事項:**
- 🚨 **必ず「propagate.ai.webcreation2@gmail.com」アカウントで認証してください**
- 別のアカウントで認証すると、画像にアクセスできません
- 認証完了後、ブラウザを閉じてターミナルに戻ってください

**📚 詳細マニュアル:**

`info@propagateinc.com` にログインしているブラウザで以下のリンクを開くと、詳細マニュアルを確認できます：

[Google認証の詳しい手順（Step 4）](https://docs.google.com/document/d/1hgDO3eBQY5QZmzvp3JGjDD-2rcWdtfeLcCYsOXtZoLM/edit?tab=t.kyj50sgkmpw7)

**「Step 4: Google認証（初回あるいはトークン期限切れの時）」の内容:**
1. ターミナルで認証コマンドを実行
2. ブラウザが自動的に開く
3. Googleアカウント選択画面で「propagate.ai.webcreation2@gmail.com」を選択
4. 「このアプリは Google で確認されていません」と表示された場合:
   - 「詳細」をクリック
   - 「（安全ではないページ）に移動」をクリック
5. 「Google Drive API にアクセスしようとしています」画面で「許可」をクリック
6. 「認証に成功しました」と表示されたら完了

ドキュメントには画面キャプチャ付きで詳しく説明されています。

**Step 3: 再度リスト取得を実行**

認証完了後、チャットで「認証完了しました」とお知らせください。AIが `/image-fetch-list` を再実行します。

**予防策:**
- システム時刻が正しく設定されているか確認する
- 常に正しいアカウント（`propagate.ai.webcreation2@gmail.com`）で認証する

**違うアカウントで認証してしまった場合:**

上記の Step 1 と Step 2 を実行し、必ず正しいアカウント（`propagate.ai.webcreation2@gmail.com`）で再認証してください。

---

