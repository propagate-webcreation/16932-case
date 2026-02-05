# Spreadsheet Form API（作成・接続）

お問い合わせフォームを Google スプレッドシート API に接続し、フォームの回答をスプレッドシートに保存できるようにします。API ルートの作成・フォームとの接続・タブ名設定を一括で行います。

## Context Files

- `memories/spreadsheet_form_api.yaml`
- `app/api/contact/route.ts` （存在する場合は参照・更新）
- お問い合わせフォームを含むコンポーネント（例: `app/components/ContactForm.tsx` や `app/contact/page.tsx`）

## 理想的なユーザー入力

```
/spreadsheet-form-api タブ名は "実際のタブ名に入れ替え"
```

例: `タブ名は "フォーム送信"` / `タブ名は "問い合わせ"` / `タブ名は 'シミュレーション'`

## Instructions

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む:**
   - `memories/spreadsheet_form_api.yaml` （ワークフロー全体・API 仕様・接続手順）
   - プロジェクト内でお問い合わせフォームがどこにあるか特定する（`app/api/contact/route.ts` の有無、フォームコンポーネントの場所）

2. **ユーザー入力を解析する**
   - コマンドに続く `タブ名は "..."` 形式からシートタブ名を抽出する
   - 引用符は `"` または `'` のどちらでも可。引用符がない場合はコマンド直後の1単語をタブ名とする

3. **メモリのワークフローに従い、以下を実行する（スキップ禁止）:**
   - **API ルート:** `app/api/contact/route.ts` が無ければ作成、あればタブ名をユーザー指定に更新。Google Sheets API で POST  body を受け取り、指定タブの最下行に追記する実装にする。
   - **フォーム接続:** お問い合わせフォームの送信時（または Universal Form API の onSuccess 内）で `POST /api/contact` を呼び出し、フォームの name / email / phone 等を JSON で送るよう接続する。
   - **環境変数:** `GOOGLE_SPREADSHEET_API`（サービスアカウント JSON）と `SPREADSHEET_KEY`（スプレッドシート ID）の説明を .env.example に追記するか、ユーザーに設定手順を伝える。

4. **完了報告**
   - 実施した変更と、ユーザーが行うこと（スプレッドシート側でシート作成・共有、.env.local に環境変数設定）をまとめて報告する。

## 入力パース例

| ユーザー入力 | 抽出するタブ名 |
|-------------|----------------|
| `タブ名は "問い合わせ"` | 問い合わせ |
| `タブ名は 'フォーム送信'` | フォーム送信 |
| `タブ名は 送信ログ` | 送信ログ |

## Critical Rules

- **目的:** フォーム回答をスプレッドシートに保存するために「API の作成・フォームとの接続・タブ名設定」をまとめて行う。タブ名の変更だけにとどめない。
- **API ルート:** `app/api/contact/route.ts` で POST を受け取り、`GOOGLE_SPREADSHEET_API` と `SPREADSHEET_KEY` を使って Google Sheets に追記。range に使うタブ名はユーザー指定の名前にする（2箇所: `〇〇!A:A` と `〇〇!A${nextRow}`）。
- **フォーム接続:** フォーム送信後に必ず `fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, ... }) })` が呼ばれるようにする。既存の Universal Form API の onSuccess 内で呼ぶ形でも可。
- **環境変数:** コード内に秘密を書かず、.env.local 用の説明または .env.example に `GOOGLE_SPREADSHEET_API` と `SPREADSHEET_KEY` を記載する。

## Execution Example

**User:** `/spreadsheet-form-api タブ名は "フォーム送信"`

**AI Action:**
```
[1] memories/spreadsheet_form_api.yaml を読み込み、app/api/contact/route.ts とフォームコンポーネントを確認しました
[2] タブ名を解析: "フォーム送信"
[3] app/api/contact/route.ts を確認しました。タブ名を「フォーム送信」に設定済みです（既存のため置換不要）
[4] ContactForm.tsx の onSuccess 内で POST /api/contact が呼ばれることを確認しました。接続済みです
[5] .env.example に GOOGLE_SPREADSHEET_API と SPREADSHEET_KEY の説明を追記しました
✅ お問い合わせフォームは Google スプレッドシートに回答を保存する状態です。スプレッドシートに「フォーム送信」タブを作成し、サービスアカウントに編集権限を付与してください。.env.local に GOOGLE_SPREADSHEET_API と SPREADSHEET_KEY を設定してください。
```

## Notes

- スプレッドシート側に、指定した名前のシート（タブ）を作成し、サービスアカウントのメールに編集権限を付与する必要があります。
- 初回セットアップ時は API ルートの新規作成とフォームへの fetch 追加を行う場合があります。
