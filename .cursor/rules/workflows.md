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

### Triggers
- ドメイン接続

⚠️ Note: To prevent false triggers, only "ドメイン接続" triggers this workflow.
- ❌ Words like "vercel.json" or "redirect" alone won't trigger
- ✅ "ドメイン接続" + action keywords (e.g., "作成して") will trigger

### Context Files
- `memories/connect_domain.yaml`

### Critical Rules

#### Rule 1: Always Load Workflow File
When "**ドメイン接続**" keyword is detected, **always read `memories/connect_domain.yaml` first**.

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
   - pattern_A (URL direct specification)
   - pattern_B (host condition version, recommended)
   - Choose one and replace placeholders with actual values

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

#### Rule 3: Trigger Condition Check
Execute only when **all** of the following conditions are met:

✅ Execute when:
1. User message contains "**ドメイン接続**"
2. User message contains action keywords ("作成して", "生成して", "出力して", "書いて", "作って", etc.)
   ⚠️ Note: Generic words like "して", "お願い" are excluded to prevent false triggers
3. Exclude keywords ("必要ですか", "ありますか", "方法", "教えて", "説明", "どう", "？", etc.) are NOT present

❌ Do not execute:
- "ドメイン接続の方法は？" → Exclude keywords: "方法", "？"
- "ドメイン接続は必要ですか？" → Exclude keywords: "必要ですか", "？"
- "ドメイン接続について教えて" → Exclude keywords: "教えて"
- "ドメイン接続について説明して" → Exclude keywords: "説明"
- "ドメイン接続をどうして" → Exclude keywords: "どう"
- "ドメイン接続をお願い" → No action keywords ("お願い" is too generic)
- "vercel.jsonを作成して" → No main keyword "ドメイン接続"
- "リダイレクト設定を作成して" → No main keyword "ドメイン接続"

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

**Skip Condition:**
- Skip only if all information sources are unreadable (no error)

**Integration with Google Submission:**
- Domain connection: Set title, description, keywords
- Google submission: Add openGraph, twitter (utilize existing metadata)

---

## 🔍 Google Submission Workflow

### Triggers
- Google提出

### Context Files
- `memories/submit_google.yaml`

### Critical Rules

#### Rule 1: Always Load Workflow File
When "**Google提出**" keyword is detected, **always read `memories/submit_google.yaml`**.

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
   - This is status: CRITICAL, skip_allowed: false
   - If this rule is violated, external URLs will contaminate sitemap.xml

3. **All workflows:**
   - Read `memories/submit_google.yaml` and follow ALL steps defined
   - Do NOT skip quality checks or validation steps
   - Do NOT skip steps marked as status: MANDATORY or status: CRITICAL
   - Do NOT skip steps marked as skip_allowed: false
   - Skipping mandatory steps is a workflow violation

### Trigger Conditions
Execute only when all of the following conditions are met:
1. User message contains "Google提出"
2. User message contains action keywords ("して", "お願い", etc.)
3. Exclude keywords ("必要ですか", "方法", "？", etc.) are NOT present

### Execution Example

**User:** "Google提出して"

**AI Action:**
```
[1/5] altタグを設定します...
✅ 画像に alt 属性を追加しました

[2/5] metadata を設定します...
✅ app/layout.tsx に metadata を設定しました

[3/5] sitemap.ts を作成します...
✅ app/sitemap.ts を作成しました

[4/5] robots.txt を作成します...
✅ public/robots.txt を作成しました

[5/5] URLスラッグを最適化します...
✅ URLスラッグを最適化しました

🎉 Google提出の準備が完了しました！
```

