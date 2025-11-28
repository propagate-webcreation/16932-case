# Form Check Config

フォームAPIの登録内容を確認します（エラー診断用）。

## Context Files

- `memories/form_check_config.yaml`
- `.cursor/rules/workflows.md` （Form Check Config Workflow セクション）

## Instructions

**このコマンドは、フォーム送信エラーが発生した際に、Universal Form API に登録されている設定内容を確認するためのものです。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む:**
   - `memories/form_check_config.yaml` （詳細ワークフロー）
   - `.cursor/rules/workflows.md` の Form Check Config Workflow セクション

2. **ユーザーに site_id と admin_email を聞く**

3. **check-config API を実行**

4. **結果を分析してエラー原因を特定**

## Usage Scenario

このコマンドは以下の場合に使用します：

- ✅ フォーム送信エラーが発生した
- ✅ 一括登録したJSONが正しく反映されているか確認したい
- ✅ フィールド設定やドメイン設定を再確認したい
- ✅ APIトークンが正しいか確認したい

## Workflow

### Step 1: サイト情報を聞く

AI: 以下の情報を教えてください：
1. サイトID（例: mediaproof）
2. 管理者メールアドレス（例: info@example.com）

### Step 2: check-config API を実行

```bash
curl -X POST https://universal-form-api.vercel.app/api/check-config \
  -H "Content-Type: application/json" \
  -d '{
    "site_id": "{site_id}",
    "admin_email": "{admin_email}"
  }'
```

### Step 3: 結果を分析

**成功時:**
- 登録内容を表示
- フィールド設定を確認
- 認証方式を確認（Token / Origin）
- APIトークンを表示（Token認証の場合）

**エラー時:**
- エラー原因を特定
- 解決策を提示

## Output Example

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
1. name (お名前) - required: true
2. email (メールアドレス) - required: true
3. message (メッセージ) - required: true

【診断結果】
✅ 設定に問題はありません
```

**エラー時:**
```
❌ エラーが発生しました

エラー: Forbidden: Invalid admin_email

【原因】
- admin_email が登録内容と一致していません

【解決策】
1. 管理画面で登録したメールアドレスを確認
2. 正しいメールアドレスで再実行
```

## Execution Example

**User:** `/form-check-config`

**AI Action:**
```
[Step 1] サイト情報を聞く
AI: 以下の情報を教えてください：
    1. サイトID
    2. 管理者メールアドレス

User: mediaproof, info@example.com

[Step 2] check-config API を実行
  → curl コマンドで API リクエスト
  → レスポンスを取得

[Step 3] 結果を分析
  → 登録内容を表示
  → エラー原因を特定（該当する場合）
  → 解決策を提示

✅ サイト設定の確認が完了しました
```

## Important Notes

- このコマンドは**診断専用**です（設定変更は行いません）
- APIトークンが表示されるため、セキュリティに注意
- エラーが発生した場合は、管理画面での修正が必要

