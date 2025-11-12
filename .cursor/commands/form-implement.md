# Form Implementation

お問い合わせフォーム実装ワークフローを実行します（Universal Form API）。

## Context Files

- `memories/form_workflow.yaml`
- `.cursor/rules/workflows.md` （Contact Form Implementation Workflow セクション）
- `/Users/horiuchiharu/Library/Mobile Documents/.Trash/FORM実装/FORMREADME.md` （正しいサンプルコード、特に469行目と506行目のpattern属性）

## Instructions

**🚨 重要: このコマンドファイルは指示のみです。詳細なワークフロー（全5ステップ）は yaml ファイルに記載されています。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む（読まずに実行することは禁止）:**
   - `memories/form_workflow.yaml` （詳細ワークフロー・613行・本体）
   - `.cursor/rules/workflows.md` の Contact Form Implementation Workflow セクション（重要なルール）
   - `FORM実装/FORMREADME.md` （Universal Form API の仕様）
2. **yaml ファイルを読み込んでから、5つのステップを順番に実行し、絶対にスキップしない**

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

### JSON Generation
- 管理画面登録用のJSONを生成
- site_id: 英小文字・数字・ハイフンのみ
- productionDomain: https:// を含む完全なURL（vercel.json から取得）
- fields: 各フィールドの name, label, type, required

### Component Modification (既存フォームを修正)
- **🚨 重要: 既存の app/contact/page.tsx を search_replace で修正（write で新規作成ではない）**
- **既存のデザイン・レイアウト・className を保持**
- API連携に必要な部分のみを追加

**7箇所を順番に search_replace で修正:**
1. "use client" ディレクティブ追加
2. import 文追加（useState, useEffect, Script）
3. useState 追加（状態管理）
4. セキュリティ関数追加（3つ: escapeHtml, sanitizeInput, validateForm）
5. useEffect + initializeFormHandler 追加（API連携）
6. <form> タグ修正（id="contactForm" と onSubmit={handleSubmit} 追加）
7. ステータスメッセージ + Script タグ追加

**FormHandler.init() の設定:**
  - 第1引数: site_id（step_1で決定）
  - 第2引数のオプション:
    - **apiBaseUrl: "https://universal-form-api.vercel.app"** （🚨 必須）
    - beforeSend, onSuccess, onError

**重要なポイント:**
- **pattern属性:** 既存フォームの pattern はそのまま保持（修正しない）
- **SDK URL:** `https://universal-form-api.vercel.app/form-handler.js` （form-handler.js、sdk.js ではない）
- フォームの id 属性: "contactForm"

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

## Integration

- productionDomain: vercel.json の BASE_URL と統一
- admin_email: about.yaml の contact_defaults.email
- site_name: about.yaml の site.name

## Execution Example

**User:** `/form-implement`

**AI Action:**
```
[1/5] サイト情報を収集します...
  → about.yaml から情報を抽出
  → site_id: "mediaproof"
  → site_name: "株式会社メディアプルーフ"
  → admin_email: "rinnari777@gmail.com"
  → productionDomain: "https://www.example.jp"

[2/5] 管理画面登録用JSONを生成します...
  ✅ JSON生成完了（管理画面にペーストしてください）

[3/5] Next.jsコンポーネントを生成します...
  ✅ app/contact/page.tsx を作成しました

[4/5] セキュリティ対策を確認します...
  ✅ すべてのセキュリティ対策が実装されています

[5/5] 完了報告とテスト手順を提示します...
  ✅ お問い合わせフォームの実装が完了しました！
```

## Next Steps

1. 管理画面でJSON登録
2. ローカルでテスト送信
3. データ確認
4. 本番環境展開

