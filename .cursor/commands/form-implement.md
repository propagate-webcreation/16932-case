# Form Implementation

お問い合わせフォーム実装ワークフローを実行します（Universal Form API - Token認証）。

## Context Files

- `memories/form_workflow.yaml` （v2.0.0 - Token認証対応・完全な仕様を含む）
- `.cursor/rules/workflows.md` （Contact Form Implementation Workflow セクション）

## Instructions

**🚨 重要: このコマンドファイルは指示のみです。詳細なワークフロー（全7ステップ）は yaml ファイルに記載されています。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む（読まずに実行することは禁止）:**
   - `memories/form_workflow.yaml` （詳細ワークフロー・v2.0.0・Token認証対応・完全な仕様を含む）
   - `.cursor/rules/workflows.md` の Contact Form Implementation Workflow セクション（重要なルール）
2. **yaml ファイルを読み込んでから、7つのステップを順番に実行し、絶対にスキップしない**

**注意:** `README (3).md` は参照不要です。すべての必要な情報は `memories/form_workflow.yaml` に含まれています。

## Critical Rules

### Information Collection
1. **app/ のファイル（実際のページ）から情報を収集（優先）:**
   - app/**/*.page.tsx を検索
   - 各ページを読み込んで内容を分析
   - h1, h2, metadata, サービス説明から会社名・業種を特定
   - Footer から連絡先メールアドレスを取得
   - vercel.json から BASE_URL を取得
   - 業種に応じて適切なフォームフィールドを推測
     - BtoB企業: 会社名、部署名
     - 予備校・教育: 学年、学校名
     - 不動産: 物件種別、希望エリア
     - 一般企業: 会社名、電話番号

2. **about.yaml（補完的・基本情報のみ）:**
   - app/ で情報が不足する場合に使用
   - **⚠️ フォームフィールド情報は取得しない**（デザイン完成後に修正されている可能性があるため）
   - 会社名、メールアドレスなどの基本情報のみ

3. **ユーザーに確認:**
   - app/ と about.yaml のどちらからも情報が取得できない場合
   - サイトID、会社名、メールアドレス
   - フィールド定義は app/contact/ の既存フォームが最優先

### JSON Generation (Token認証)
- 管理画面登録用のJSONを生成
- **site_id: 英小文字・数字・アンダースコア(_)のみ（ハイフン使用不可、テーブル名として使用されるため）**
- **requireToken: true** （Token認証を使用）
- **productionDomain: 不要**（Token認証のため）
- fields: 各フィールドの name, label, type, required

### Email Template Generation (新規)
- HTMLメールテンプレートを生成
- 必須フィールド: 常に表示
- 任意フィールド: 条件分岐で表示（`{{#if field}}...{{/if}}`）
- 未入力メッセージ: 任意フィールドが空の場合（`{{^field}}...{{/field}}`）
- テンプレートID: `{site_id}_admin`

### Component Modification (既存フォームを修正 - Token認証対応)
- **🚨 重要: 既存の app/contact/page.tsx を search_replace で修正（write で新規作成ではない）**
- **既存のデザイン・レイアウト・className を保持**
- API連携に必要な部分のみを追加

**8箇所を順番に search_replace で修正:**
1. "use client" ディレクティブ追加
2. import 文追加（useState, useEffect, Script）
3. useState 追加（状態管理）
4. セキュリティ関数追加（3つ: escapeHtml, sanitizeInput, validateForm）
5. useEffect + initializeFormHandler 追加（API連携・Token認証対応）
6. <form> タグ修正（id="contactForm" と onSubmit={handleSubmit} 追加）
7. <button> タグ修正（disabled={isSubmitting}, テキスト変更）
8. ステータスメッセージ + Script タグ追加

**FormHandler.init() の設定（Token認証）:**
  - 第1引数: site_id（step_1で決定）
  - **第2引数: APIトークン（process.env.NEXT_PUBLIC_FORM_API_TOKEN）** ← 新規追加
  - 第3引数のオプション:
    - **apiBaseUrl: "https://universal-form-api.vercel.app"** （🚨 必須）
    - beforeSend, onSuccess, onError

**重要なポイント:**
- **pattern属性:** 既存フォームの pattern はそのまま保持（修正しない）
- **SDK URL:** `https://universal-form-api.vercel.app/form-handler.js` （form-handler.js、sdk.js ではない）
- フォームの id 属性: "contactForm"
- **画像・ファイル添付:** `<input type="file">` を追加するだけで有効化（フィールド設定不要）
- **beforeSend:** `_attachments` キーはそのまま維持（削除しない）

### Security Measures (🚨 MANDATORY)
**All generated forms MUST include:**
- ✅ **maxLength attribute** (文字数制限)
- ✅ **pattern attribute** (危険な文字制限: `pattern="[^\<\>\&\&quot;\']+"` ダブルクォートは &quot;)
- ✅ **escapeHtml() function** (XSS対策)
- ✅ **sanitizeInput() function** (HTMLタグ除去)
- ✅ **validateForm() function** (送信前バリデーション)

**Never skip security implementation.**

### Validation Generation
- required: true のフィールドに対して必須チェックを生成
- メールアドレス形式チェック
- すべてのバリデーションを validateForm() に実装

## Default Fields

標準的なお問い合わせフォームのデフォルトフィールド:
- name (お名前) - required: true
- email (メールアドレス) - required: true
- company (会社名) - required: false
- phone (電話番号) - required: false
- message (お問い合わせ内容) - required: true, type: textarea

**⚠️ 重要: `<select>`要素を使う場合**
- JSON の fields 配列では `type: "text"` と指定
- フロントエンドでは `<select>` タグを使用してOK
- 理由: API側でのバリデーションのため

## Optional Fields (画像・ファイル添付)

必要に応じて追加できるフィールド:

### 画像添付
```html
<input
  type="file"
  name="images"
  accept="image/jpeg,image/png,image/gif,image/webp"
  multiple
/>
<p>JPEG, PNG, GIF, WebP対応 / 最大5枚, 合計4MBまで</p>
```

### ファイル添付
```html
<input
  type="file"
  name="attachments"
  accept=".pdf,.txt,.zip"
  multiple
/>
<p>.pdf/.txt/.zip対応 / 最大5ファイル, 合計4MBまで</p>
```

**⚠️ 重要:**
- フィールド設定（JSON）への追加は**不要**
- `form-handler.js` が `<input type="file">` を自動検出
- DBにはメタデータのみ保存（ファイルデータは保存されない）
- メールに直接添付される
- API側で制限（サイト側で変更不可）

## Integration (Token認証)

- **requireToken: true** （必須）
- **APIトークン: 管理画面で生成後、環境変数に設定**
- admin_email: about.yaml の contact_defaults.email（複数の場合はカンマ区切り）
- site_name: about.yaml の site.name
- **環境変数:**
  - **Client Component:** `NEXT_PUBLIC_FORM_API_TOKEN` （ブラウザに公開される）
  - **Server Component:** `FORM_API_TOKEN` （サーバー側のみ、より安全）

## Execution Example

**User:** `/form-implement`

**AI Action:**
```
[1/7] サイト情報を収集します...
  → about.yaml から情報を抽出
  → site_id: "mediaproof"
  → site_name: "株式会社メディアプルーフ"
  → admin_email: "rinnari777@gmail.com"

[2/7] 管理画面登録用JSONを生成します（Token認証）...
  ✅ JSON生成完了（requireToken: true）

[3/7] HTMLメールテンプレートを生成します...
  ✅ メールテンプレート生成完了（条件分岐対応）

[4/7] Next.jsコンポーネントを修正します（Token認証対応）...
  ✅ app/contact/page.tsx にAPI連携を追加しました

[5/7] 環境変数ファイル（.env.local）を自動作成します...
  AI: APIトークンを貼り付けてください
  User: ufa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  AI: （write ツールで自動作成）
  ✅ .env.local ファイルを作成しました

[6/7] セキュリティ対策を確認します...
  ✅ すべてのセキュリティ対策が実装されています

[7/7] 完了報告とテスト手順を提示します...
  ✅ お問い合わせフォームの実装が完了しました！
```

## Next Steps

1. **管理画面でメールテンプレート登録**
   - テンプレート管理 → テンプレート追加
   - テンプレートID: `{site_id}_admin`
   
2. **管理画面でサイト登録**
   - 一括登録 (JSON) → JSONペースト

3. **APIトークンをコピー**
   - 編集タブ → APIトークン管理

4. **環境変数設定（自動完了）**
   - ✅ `.env.local` は Step 5 で自動作成済み
   - ✅ `NEXT_PUBLIC_FORM_API_TOKEN` 設定済み

5. **ローカルでテスト送信**

6. **本番環境展開**
   - Vercel環境変数に `NEXT_PUBLIC_FORM_API_TOKEN` を追加

