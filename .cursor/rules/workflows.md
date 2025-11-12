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
   - ✅ Stage 3: Generate SEO information (optional, only if about.yaml exists)
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

**Information Source Priority:**
1. about.yaml (site configuration sheet) ← Top priority
2. page.tsx, components, layout.tsx (code files) ← Fallback
3. Existing metadata (minimum fallback) ← Last resort

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
- `memories/form_workflow.yaml`
- `FORM実装/FORMREADME.md`
- `FORM実装/FORMTODO.md`

### Critical Rules

#### Rule 1: Always Load Workflow File
When executing contact form implementation workflow, **always read `memories/form_workflow.yaml` first**.

This file contains:
- ✅ 5-step workflow for form implementation
- ✅ JSON generation for admin panel registration
- ✅ Next.js component auto-generation
- ✅ Security measures (XSS, HTML tag removal, validation)

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
- Site ID (lowercase, numbers, hyphens only)
- Company name (from app/page.tsx h1 or metadata.title)
- Admin email address (from Footer or contact page)
- Production domain (from vercel.json BASE_URL)
- Form fields definition (inferred from business type)

#### Rule 3: Automatic File Generation & Modification
1. **Generate JSON for admin panel:**
   - Use write tool or display in chat
   - User will paste this JSON into admin panel

2. **Modify existing Next.js component (🚨 IMPORTANT):**
   - 🚨 **Use search_replace to modify existing app/contact/page.tsx** (do NOT use write tool to create new file)
   - **Preserve existing design, layout, and className**
   - Add only API integration code
   
   **7 modifications using search_replace (in order):**
   1. Add "use client" directive
   2. Add imports (useState, useEffect, Script)
   3. Add useState (state management)
   4. Add security functions (escapeHtml, sanitizeInput, validateForm)
   5. Add useEffect + initializeFormHandler (API integration)
   6. Modify <form> tag (add id="contactForm" and onSubmit={handleSubmit})
   7. Add status message + Script tag
   
   **🚨 CRITICAL - FormHandler.init() Configuration:**
   - **First argument:** site_id (determined in step_1)
   - **Second argument options (REQUIRED):**
     - **apiBaseUrl: "https://universal-form-api.vercel.app"** (MANDATORY, form submission will fail without this)
     - beforeSend, onSuccess, onError callbacks
   
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

### Integration with Other Workflows
- Use vercel.json's BASE_URL for productionDomain
- Use about.yaml's contact_defaults.email for adminEmail
- Consistent with domain connection workflow

---

## 🖼️ Image Fetch Workflow

**実行方法:** `/image-fetch` コマンドを使用してください

### Context Files
- `memories/image_fetch_workflow.yaml`

### Critical Rules

#### Rule 1: Always Load Workflow File
When executing image fetch workflow, **always read `memories/image_fetch_workflow.yaml` first**.

This file contains:
- ✅ Step 0: OS selection (Mac/Windows)
- ✅ Step 1: Batch fetch image lists from Google Drive
- ✅ Step 2: Image selection (photos, backgrounds)
- ✅ Step 3: selected.json validation
- ✅ Step 4: Image download execution

#### Rule 2: OS Selection (CRITICAL)
- 🚨 **MUST** ask user for OS (Mac or Windows) at the beginning
- Use OS-specific commands:
  - Mac/Linux: bash commands
  - Windows: PowerShell commands

#### Rule 3: Filename Exact Match (🚨 CRITICAL)
**Absolute rules for filename handling:**
- 🚨 Read *_index.json files completely as JSON arrays
- 🚨 Copy each filename exactly as-is (do NOT modify even 1 character)
- 🚨 **NEVER** infer or construct filenames from grep results or partial matches
- 🚨 After selection, verify each filename exists in original JSON using grep -F (exact match)

**Forbidden:**
- ❌ Inferring filenames from partial matches
- ❌ Constructing filenames
- ❌ Modifying filenames in any way

#### Rule 4: Structured JSON Output
- Output format: `{ "photos": [...], "backgrounds": [...], "illusts": [] }`
- If selected.json exists, read it and update only the relevant key
- Preserve other keys unchanged
- No explanations, code blocks, or comments

#### Rule 5: Exclusion Rules
- Exclude filenames containing ", " (comma + space)
- Exclude filenames with special characters (comma, semicolon, etc.)

### Background Filename Pattern
Backgrounds use structured naming:
`bg--vibe--pattern_type--repeatability--palette--brightness--contrast--busyness--gradient_axis--size.ext`

Example: `bg--simple--gradient--non-tile--warm--light--mid--calm--vertical--1920x1080.png`

