# 新規サイト追加手順 - Universal Form API

## 概要

このドキュメントは、Universal Form API に新しいサイトを登録するための手順を説明します。
サイト登録は、主に管理画面から JSON データを入力することで行います。

## 目次

1. [事前準備](#1-事前準備)
2. [Supabase のテーブル確認](#2-supabaseのテーブル確認)
3. [管理画面でのサイト登録](#3-管理画面でのサイト登録)
   - 3.1. 管理画面にログイン
   - 3.2. JSON で一括登録
   - 3.3. JSON のフォーマット
   - 3.4. メールテンプレートの登録
4. [フロントエンド実装](#4-フロントエンド実装)
   - 4.1. Next.js コンポーネントの作成
   - 4.2. 重要なポイント
   - 4.3. セキュリティ対策のポイント
   - 4.4. 認証方式（Token 認証 vs Origin 認証）
5. [テスト](#5-テスト)
6. [トラブルシューティング](#6-トラブルシューティング)
   - 6.1. 認証エラーの確認
   - 6.2. サイト設定の確認（check-config API）
7. [チェックリスト](#7-チェックリスト)

---

## 1. 事前準備

- **Supabase プロジェクト**: API のバックエンドとして機能する Supabase プロジェクト。
- **管理者アカウント**: Supabase の`admins`テーブルに登録されているメールアドレスとパスワード。

---

## 2. Supabase のテーブル確認

サイト情報を保存するために、Supabase データベースに以下のテーブルが存在することを確認してください。

- `sites`: サイトの基本情報を格納します。
  - `api_token`: API トークン（Token 認証用）
  - `require_token`: Token 認証を使用するかどうか（boolean）
  - `token_created_at`: トークン作成日時
- `site_fields`: サイトごとのフォームフィールド定義を格納します。
- `allowed_origins`: フォーム送信を許可するドメインを格納します（Origin 認証用）。
- `email_templates`: （オプション）HTML メールテンプレートを格納します。

---

## 3. 管理画面でのサイト登録

### 3.1. 管理画面にログイン

1. デプロイされている管理画面 URL にアクセスします。（`https://universal-form-api.vercel.app/auth/`）
2. 管理者アカウントでログインします。（ユーザ名：info メールアドレス、パスワード：アメリカン\*\*\*\*@）

### 管理画面の機能

管理画面では以下の機能が使用できます：

- **ダッシュボード**: サイト一覧・追加・編集・（削除）
- **テンプレート管理**: メールテンプレートの作成・編集・削除
- **一括登録（JSON）**: JSON 形式でのサイト追加
- **サイト編集**:
  - **認証方法設定**: Token 認証 / Origin 認証の切り替え
  - **API トークン管理**: トークンの表示・コピー・再生成（Token 認証時）
  - **フィールド設定**: サイトごとのフォームフィールドの管理
  - **ドメイン管理**: 許可ドメインの設定（Origin 認証時）
  - **データ確認**: 送信されたフォームデータの閲覧

### 3.2. JSON で一括登録

1. ダッシュボード画面で、「一括登録 (JSON)」ボタンをクリックします。
2. 表示されたモーダルに、登録したいサイトの情報を JSON 形式で入力します。
3. 「登録する」ボタンをクリックすると、サイトが一括で登録されます。

### 3.3. JSON のフォーマット

入力する JSON は、以下の構造を持つオブジェクトの配列です。インデントに注意してください。

```json
[
  {
    "id": "nextmaison",
    "siteName": "株式会社ネクストメゾン",
    "adminEmail": "info@propagete.inc",
    "emailFromName": "株式会社ネクストメゾン",
    "emailSubject": "【ネクストメゾン】新しいお問い合わせ",
    "emailTemplateId": "nextmaison_admin",
    "requireToken": true,
    "fields": [
      {
        "name": "name",
        "label": "お名前",
        "type": "text",
        "required": true
      },
      {
        "name": "email",
        "label": "メールアドレス",
        "type": "email",
        "required": true
      },
      {
        "name": "category",
        "label": "お問い合わせ種別",
        "type": "text",
        "required": false
      },
      {
        "name": "grade",
        "label": "学年",
        "type": "text",
        "required": false
      },
      {
        "name": "message",
        "label": "メッセージ",
        "type": "textarea",
        "required": true
      }
    ]
  }
]
```

| キー               | 説明                                                                                                                    | 型        | 必須     |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------- | :-------- | :------- |
| `id`               | サイトを一意に識別する ID。英小文字、数字、アンダースコア(\_)のみ。テーブル名として使用されるため、ハイフンは使用不可。 | `string`  | ✅       |
| `siteName`         | サイト名。通知メールの件名などで使用されます。                                                                          | `string`  | ✅       |
| `adminEmail`       | 管理者通知メールの送信先アドレス。複数の場合はカンマ区切りで指定（例: `admin@example.com, manager@example.com`）。（はじめはテスト用に info にしておく）                                                | `string`  | ✅       |
| `emailFromName`    | 通知メールの送信者名。                                                                                                  | `string`  |          |
| `emailSubject`     | 通知メールの件名。                                                                                                      | `string`  |          |
| `emailTemplateId`  | 使用するメールテンプレートの ID（Supabase の`email_templates`テーブルの ID）。                                          | `string`  |          |
| `requireToken`     | API トークン認証を使用するかどうか。`true`の場合は Token 認証、`false`の場合は Origin 認証。デフォルトは`true`。        | `boolean` |          |
| `productionDomain` | フォームが設置される本番サイトのドメイン。`requireToken`が`false`の場合のみ必須。                                       | `string`  | 条件付き |
| `fields`           | フォームのフィールド定義の配列。                                                                                        | `array`   | ✅       |

#### `fields`オブジェクトの構造

| キー       | 説明                                                                                                               | 型        | 必須 |
| :--------- | :----------------------------------------------------------------------------------------------------------------- | :-------- | :--- |
| `name`     | フォーム要素の`name`属性と一致させます。                                                                           | `string`  | ✅   |
| `label`    | フィールドの表示名。                                                                                               | `string`  | ✅   |
| `type`     | フィールドのタイプ (`text`, `email`, `textarea`など)。**注**: `<select>`要素を使う場合も`type`は`"text"`にします。 | `string`  |      |
| `required` | 必須項目にするかどうか。                                                                                           | `boolean` |      |

> **画像添付を追加したい場合**: [docs/image-attachment.md](docs/image-attachment.md) を参照してください。

> **ファイル添付を追加したい場合**: [docs/file-attachment.md](docs/file-attachment.md) を参照してください。

### 3.4. メールテンプレートの登録

メールテンプレートを登録することで、フォーム送信時に送信される通知メールを HTML で美しくデザインできます。

1. **テンプレート管理画面にアクセス**

   - 管理画面のサイドバーから「テンプレート管理」をクリックします。

2. **新しいテンプレートを追加**

   - 「＋ テンプレート追加」ボタンをクリックします。
   - 以下の情報を入力します：
     - **テンプレート ID**: 英数字とアンダースコア(\_)のみ使用可能（例: `contact_admin`, `inquiry_notification`）
     - **テンプレート名**: 管理画面で表示される名前（例: `お問い合わせ通知`）
     - **HTML コンテンツ**: メールの HTML テンプレート

3. **プレースホルダーと条件分岐の使用**

   **基本的なプレースホルダー**

   - テンプレート内で `{{field_name}}` の形式でプレースホルダーを使用できます。
   - フォーム送信時に、対応するフィールドの値に置換されます。
   - 例: `{{name}}`, `{{email}}`, `{{message}}`

   **条件分岐機能**

   - フィールドに値がある場合のみ表示: `{{#if field}}...{{/if}}` または `{{#field}}...{{/field}}`
   - フィールドが空の場合のみ表示: `{{^field}}...{{/field}}`
   - 例:

     ```html
     {{#if company}}
     <div>会社名: {{company}}</div>
     {{/if}} {{#phone}}
     <div>電話番号: {{phone}}</div>
     {{/phone}} {{^phone}}
     <div>※ 電話番号は未入力です</div>
     {{/phone}}
     ```

4. **テンプレート例**

   **基本テンプレート（条件分岐なし）**

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="UTF-8" />
       <title>お問い合わせ通知</title>
       <style>
         body {
           font-family: Arial, sans-serif;
           line-height: 1.6;
           color: #333;
         }
         .header {
           background-color: #f4f4f4;
           padding: 20px;
           text-align: center;
         }
         .field {
           margin-bottom: 15px;
           padding: 10px;
           background-color: #f9f9f9;
         }
         .label {
           font-weight: bold;
           color: #555;
         }
       </style>
     </head>
     <body>
       <div class="header">
         <h2>新しいお問い合わせがありました</h2>
       </div>
       <div class="field">
         <div class="label">お名前</div>
         <div>{{name}}</div>
       </div>
       <div class="field">
         <div class="label">メールアドレス</div>
         <div>{{email}}</div>
       </div>
       <div class="field">
         <div class="label">お問い合わせ内容</div>
         <div>{{message}}</div>
       </div>
     </body>
   </html>
   ```

   **条件分岐対応テンプレート**

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="UTF-8" />
       <title>お問い合わせ通知</title>
       <style>
         body {
           font-family: Arial, sans-serif;
           line-height: 1.6;
           color: #333;
         }
         .header {
           background-color: #f4f4f4;
           padding: 20px;
           text-align: center;
         }
         .field {
           margin-bottom: 15px;
           padding: 10px;
           background-color: #f9f9f9;
         }
         .label {
           font-weight: bold;
           color: #555;
         }
         .note {
           color: #999;
           font-size: 12px;
         }
       </style>
     </head>
     <body>
       <div class="header">
         <h2>新しいお問い合わせがありました</h2>
       </div>
       <div class="field">
         <div class="label">お名前</div>
         <div>{{name}}</div>
       </div>
       <div class="field">
         <div class="label">メールアドレス</div>
         <div>{{email}}</div>
       </div>
       {{#if company}}
       <div class="field">
         <div class="label">会社名</div>
         <div>{{company}}</div>
       </div>
       {{/if}} {{#phone}}
       <div class="field">
         <div class="label">電話番号</div>
         <div>{{phone}}</div>
       </div>
       {{/phone}} {{#if grade}}
       <div class="field">
         <div class="label">学年</div>
         <div>{{grade}}</div>
       </div>
       {{/if}}
       <div class="field">
         <div class="label">お問い合わせ内容</div>
         <div>{{message}}</div>
       </div>
       {{^phone}}
       <div class="note">※ 電話番号は入力されませんでした</div>
       {{/phone}}
     </body>
   </html>
   ```

5. **サイトでテンプレートを使用**
   - サイト登録時またはサイト編集時に、作成したテンプレートを選択します。
   - JSON で一括登録する場合は、`emailTemplateId`フィールドにテンプレート ID を指定します。

---

## 4. フロントエンド実装

Next.js を使用したフォーム実装の手順を説明します。

### 4.1. Next.js コンポーネントの作成

以下の例を参考にして、`fields`で定義した`name`属性を持つフォームを作成します。
フォームの id は必ず「contactForm」としてください。

**完全なコンポーネント例：**

```tsx
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ContactForm() {
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formHandlerLoaded, setFormHandlerLoaded] = useState(false);

  useEffect(() => {
    // FormHandlerが読み込まれているかチェック
    if ((window as any).FormHandler) {
      setFormHandlerLoaded(true);
      initializeFormHandler();
    }
  }, []);

  // XSS対策: テキストをエスケープする関数
  function escapeHtml(text: string) {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  // 入力値サニタイズ関数
  function sanitizeInput(value: any): any {
    if (typeof value !== "string") return value;

    // HTMLタグを除去し、最大長制限
    const cleanValue = value.trim().replace(/<[^>]*>/g, "");
    return cleanValue.length > 5000
      ? cleanValue.substring(0, 5000) + "..."
      : cleanValue;
  }

  // フォーム送信前のバリデーション
  function validateForm(formData: { [key: string]: any }) {
    const errors = [];

    // 必須フィールドチェック（フィールド名は登録した内容に合わせて調整）
    if (!formData.name || formData.name.trim() === "") {
      errors.push("お名前は必須です");
    }
    if (!formData.email || formData.email.trim() === "") {
      errors.push("メールアドレスは必須です");
    }
    if (!formData.message || formData.message.trim() === "") {
      errors.push("メッセージは必須です");
    }

    // メールアドレス形式チェック
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push("メールアドレスの形式が正しくありません");
    }

    return errors;
  }

  function initializeFormHandler() {
    if (typeof window === "undefined" || !(window as any).FormHandler) return;

    // Token認証を使用する場合（推奨）
    // "your-site-id" を登録したサイトIDに置き換えてください
    // "your-api-token" を管理画面で生成したAPIトークンに置き換えてください
    (window as any).FormHandler.init("your-site-id", "your-api-token", {
      apiBaseUrl: "https://universal-form-api.vercel.app",
      // 送信前処理
      beforeSend: function (formData: { [key: string]: any }) {
        // データサニタイズ
        const sanitizedData: { [key: string]: any } = {};
        Object.keys(formData).forEach((key) => {
          sanitizedData[key] = sanitizeInput(formData[key]);
        });

        // バリデーション
        const errors = validateForm(sanitizedData);
        if (errors.length > 0) {
          setStatus({
            type: "error",
            message: `エラー: ${escapeHtml(errors.join(", "))}`,
          });
          setIsSubmitting(false);
          return false; // 送信中止
        }

        return sanitizedData; // サニタイズ済みデータを送信
      },

      onSuccess: function (response: any) {
        console.log("送信成功:", response);
        setIsSubmitting(false);
        setStatus({
          type: "success",
          message: "送信完了しました。ありがとうございます。",
        });

        // フォームをリセット
        const form = document.getElementById("contactForm") as HTMLFormElement;
        if (form) {
          form.reset();
        }
      },

      onError: function (error: string) {
        console.error("送信エラー:", error);
        setIsSubmitting(false);
        setStatus({
          type: "error",
          message: `送信エラー: ${escapeHtml(error)}`,
        });
      },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    // FormHandlerに処理を任せるため、デフォルトの送信は抑制しない
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">お問い合わせフォーム</h2>

      <form id="contactForm" onSubmit={handleSubmit}>
        {/* お名前 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            お名前 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            maxLength={100}
            pattern="[^<>&quot;']+"
            title="HTMLタグや特殊文字は使用できません"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* メールアドレス */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            メールアドレス *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            maxLength={255}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* お問い合わせ種別（オプション） */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            お問い合わせ種別
          </label>
          <input
            type="text"
            id="category"
            name="category"
            maxLength={100}
            pattern="[^<>&quot;']+"
            title="HTMLタグや特殊文字は使用できません"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 学年（プルダウン例） */}
        <div className="mb-4">
          <label htmlFor="grade" className="block text-sm font-medium mb-2">
            学年
          </label>
          <select
            id="grade"
            name="grade"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            <option value="1年生">1年生</option>
            <option value="2年生">2年生</option>
            <option value="3年生">3年生</option>
          </select>
        </div>

        {/* メッセージ */}
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            メッセージ *
          </label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={5000}
            rows={5}
            title="HTMLタグは自動的に除去されます"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "送信中..." : "送信"}
        </button>
      </form>

      {/* ステータスメッセージ */}
      {status.type && (
        <div
          className={`mt-6 p-4 rounded-md border ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <pre className="whitespace-pre-wrap">{status.message}</pre>
        </div>
      )}

      {/* FormHandler SDK読み込み */}
      <Script
        src="https://universal-form-api.vercel.app/form-handler.js"
        onLoad={() => {
          setFormHandlerLoaded(true);
          initializeFormHandler();
        }}
      />
    </div>
  );
}
```

### 4.2. 重要なポイント

#### サイト ID とトークンの設定

`initializeFormHandler`関数内の`FormHandler.init()`を、登録した認証方式に応じて設定してください。

**Token 認証の場合（推奨）:**

```tsx
// 第2引数にAPIトークンを指定
(window as any).FormHandler.init(
  "your-site-id",
  process.env.NEXT_PUBLIC_FORM_API_TOKEN,
  {
    apiBaseUrl: "https://universal-form-api.vercel.app",
    // ...その他のオプション
  }
);
```

**Origin 認証の場合（後方互換性）:**

```tsx
// APIトークンなし
(window as any).FormHandler.init("your-site-id", {
  apiBaseUrl: "https://universal-form-api.vercel.app",
  // ...その他のオプション
});
```

#### プルダウン（select 要素）の注意点

**重要**: `<select>`要素を使用する場合、フォーム送信時には`<option>`の**`value`属性の値**がデータベースに保存され、メールで送信されます。

```tsx
<select name="grade">
  <option value="">選択してください</option>
  <option value="1年生">1年生</option>
  <option value="2年生">2年生</option>
</select>
```

上記の例で「 1 年生」が選択された場合、送信されるデータは：

```json
{
  "grade": "1年生"
}
```

**ベストプラクティス**:

- `value`属性には、保存・送信したい値を設定する
- 表示テキスト（`<option>`タグ内のテキスト）と`value`は同じ値にするのが推奨
- 空の選択肢（「選択してください」など）には`value=""`を設定する

### 4.3. セキュリティ対策のポイント

#### フォーム要素側

- **maxLength**: 文字数制限でデータ量を制御
- **pattern**: 正規表現で危険な文字を制限（`[^\<\>\&\"\']+"` で`<`, `>`, `&`, `"`, `'`を禁止）
- **title**: ユーザーに入力規則を明示
- **required**: 必須フィールドの指定

#### TypeScript/JavaScript 側

- **HTML エスケープ**: XSS 攻撃を防ぐため、出力時に`escapeHtml()`関数でエスケープ
- **入力サニタイズ**: `sanitizeInput()`関数で HTML タグ除去と文字数制限
- **バリデーション**: `validateForm()`関数で送信前の必須項目・形式チェック
- **型安全性**: TypeScript を使用して型エラーを防止

### 4.4. 認証方式（Token 認証 vs Origin 認証）

Universal Form API は、2 つの認証方式をサポートしています。

#### Token 認証（推奨）

**特徴:**

- API トークンを使用した認証方式
- サーバーサイドからの API アクセスに最適
- より高いセキュリティレベル
- Origin（ドメイン）制限が不要

**使用方法:**

1. **管理画面でサイト作成時に Token 認証を有効化**

   - 「新規サイト登録」画面で「API トークン認証を必須にする」にチェック
   - サイト作成後、生成された API トークンを安全に保管

2. **環境変数として設定**

   ```bash
   # .env.local
   FORM_API_TOKEN=ufa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Next.js 実装例**

   **Server Component（推奨）:**

   ```tsx
   // app/contact/actions.ts
   "use server";

   export async function submitContactForm(formData: FormData) {
     const data = {
       site_id: "your-site-id",
       formData: {
         name: formData.get("name"),
         email: formData.get("email"),
         message: formData.get("message"),
       },
     };

     const response = await fetch(
       "https://universal-form-api.vercel.app/api/submit",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${process.env.FORM_API_TOKEN}`,
         },
         body: JSON.stringify(data),
       }
     );

     return await response.json();
   }
   ```

   **Client Component（環境変数経由）:**

   ```tsx
   // FormHandlerを使用する場合
   (window as any).FormHandler.init(
     "your-site-id",
     process.env.NEXT_PUBLIC_FORM_API_TOKEN,
     {
       apiBaseUrl: "https://universal-form-api.vercel.app",
       // ...
     }
   );
   ```

**セキュリティのポイント:**

- ✅ トークンは環境変数として保存
- ✅ `.env.local`を Git にコミットしない
- ✅ Server Component で使用する場合は`NEXT_PUBLIC_`プレフィックスは不要
- ✅ Client Component で使用する場合のみ`NEXT_PUBLIC_`プレフィックスを使用
- ⚠️ トークンが漏洩した場合は、管理画面の「編集」タブ →「API トークン管理」セクションから再生成可能

#### Origin 認証（従来方式）

**特徴:**

- リクエスト送信元の Origin（ドメイン）で認証
- クライアントサイド（ブラウザ）からの直接アクセスに対応
- ドメインごとに許可設定が必要

**使用方法:**

1. **管理画面で Origin 認証を設定**

   - サイト作成時に「API トークン認証を必須にする」のチェックを外す
   - または、既存サイトの「編集」タブ → 「認証方法設定」でチェックを外す
   - 「編集」タブ → 「許可ドメイン管理」セクションで許可するドメインを追加

2. **Next.js 実装例**
   ```tsx
   // APIトークンなしでの使用（後方互換性）
   (window as any).FormHandler.init("your-site-id", {
     apiBaseUrl: "https://universal-form-api.vercel.app",
     // ...
   });
   ```

**制限事項:**

- ブラウザからの直接リクエストのみ対応
- CORS 設定が必要
- Server Component からは使用不可（origin ヘッダーがない）

#### どちらを選ぶべきか？

| 使用ケース                | 推奨認証方式                               |
| ------------------------- | ------------------------------------------ |
| Server Component から使用 | ✅ Token 認証（必須）                      |
| セキュリティを重視        | ✅ Token 認証                              |
| 既存実装の移行            | 🔄 Origin 認証（Token 認証への移行を推奨） |
| ブラウザから直接アクセス  | Origin 認証 または Token 認証              |

---

## 5. テスト

1. フロントエンドのフォームからテスト送信を行います。
2. 該当サイトの「データ確認」に追加されているか確認します。
3. サイト設定で指定した`adminEmail`に通知メールが届くことを確認します。

---

## 6. トラブルシューティング

### 6.1. 認証エラーの確認

#### Token 認証エラー

**症状**: `Invalid API token` または `Unauthorized` エラーが発生する

**確認事項**:

- [ ] 管理画面の「編集」タブで「API トークン認証を使用する」がチェックされているか確認
- [ ] API トークンが正しく設定されているか確認（環境変数やコード内）
- [ ] トークンが最近再生成された場合、新しいトークンに更新されているか確認
- [ ] Authorization ヘッダーが正しく設定されているか確認（`Bearer トークン`形式）

**解決方法**:

1. 管理画面の「編集」タブを開く
2. 「API トークン管理」セクションでトークンを確認
3. トークンをコピーして、環境変数またはコード内を更新
4. トークンが漏洩した場合は「トークンを再生成」ボタンで再生成

#### Origin 認証エラー

**症状**: `Origin not allowed` または CORS エラーが発生する

**確認事項**:

- [ ] 管理画面の「編集」タブで「API トークン認証を使用する」のチェックが外れているか確認
- [ ] リクエスト送信元のドメインが許可リストに登録されているか確認
- [ ] プロトコル（http/https）が一致しているか確認
- [ ] ポート番号が含まれる場合、ポート番号も一致しているか確認

**解決方法**:

1. 管理画面の「編集」タブを開く
2. 「許可ドメイン管理」セクションで、送信元ドメインが登録されているか確認
3. 未登録の場合は「+ ドメイン追加」ボタンから追加
4. 開発環境の場合は `http://localhost:3000` を追加

### 6.2. サイト設定の確認（check-config API）

サイトでエラーが発生した際に、現在登録されている設定を確認するための API エンドポイントが用意されています。

#### 使用シナリオ

- フォーム送信エラーが発生した際に、設定内容を確認したい
- 一括登録した JSON の内容が正しく反映されているか確認したい
- フィールド設定やドメイン設定を再確認したい

#### エンドポイント

```
POST https://universal-form-api.vercel.app/api/check-config
```

#### リクエストパラメータ

| パラメータ    | 説明                               | 型       | 必須 |
| :------------ | :--------------------------------- | :------- | :--- |
| `site_id`     | 確認したいサイトの ID              | `string` | ✅   |
| `admin_email` | 登録されている管理者メールアドレス | `string` | ✅   |

**セキュリティ注意事項**:

- `site_id` と `admin_email` の両方が一致する必要があります
- HTTPS 通信により、メールアドレスは暗号化されて送信されます
- ただし、サーバーログやネットワークログには記録される可能性があるため、機密情報として扱ってください

#### curl コマンド例

```bash
curl -X POST https://universal-form-api.vercel.app/api/check-config \
  -H "Content-Type: application/json" \
  -d '{
    "site_id": "your-site-id",
    "admin_email": "example@gmail.com"
  }'
```

#### レスポンス例

**Token 認証を使用している場合:**

```json
{
  "success": true,
  "config": {
    "id": "test",
    "siteName": "APIテストサイト",
    "emailFromName": "Universal Form API",
    "emailSubject": "新しいお問い合わせ",
    "emailTemplateId": "test_admin",
    "requireToken": true,
    "apiToken": "ufa_1234567890abcdef...",
    "fields": [
      {
        "name": "name",
        "label": "お名前",
        "type": "text",
        "required": true
      },
      {
        "name": "email",
        "label": "メールアドレス",
        "type": "email",
        "required": true
      },
      {
        "name": "message",
        "label": "メッセージ",
        "type": "textarea",
        "required": true
      }
    ]
  }
}
```

**Origin 認証を使用している場合:**

```json
{
  "success": true,
  "config": {
    "id": "test",
    "siteName": "APIテストサイト",
    "emailFromName": "Universal Form API",
    "emailSubject": "新しいお問い合わせ",
    "emailTemplateId": "test_admin",
    "requireToken": false,
    "productionDomain": "https://example.com",
    "fields": [
      {
        "name": "name",
        "label": "お名前",
        "type": "text",
        "required": true
      },
      {
        "name": "email",
        "label": "メールアドレス",
        "type": "email",
        "required": true
      },
      {
        "name": "message",
        "label": "メッセージ",
        "type": "textarea",
        "required": true
      }
    ]
  }
}
```

#### エラーレスポンス例

**site_id が未指定の場合:**

```json
{
  "success": false,
  "message": "site_id is required"
}
```

**admin_email が未指定の場合:**

```json
{
  "success": false,
  "message": "admin_email is required"
}
```

**admin_email が一致しない場合:**

```json
{
  "success": false,
  "message": "Forbidden: Invalid admin_email"
}
```

**サイトが見つからない、または無効な場合:**

```json
{
  "success": false,
  "message": "Site not found or inactive"
}
```

#### 活用方法

1. **設定確認**: レスポンスの `config` オブジェクトが、一括登録時の JSON と同じ形式になっています
2. **フィールド比較**: フロントエンドのフォームの `name` 属性と `fields` の `name` が一致しているか確認
3. **ドメイン確認**: `productionDomain` が正しく設定されているか確認
4. **再登録**: 必要に応じて、取得した JSON を修正して管理画面から再登録可能

---

## 7. チェックリスト

### 基本設定

- [ ] Supabase に必要なテーブルが準備されている。
- [ ] 管理画面にログインできる。
- [ ] （必要に応じて）メールテンプレートを作成した。
- [ ] JSON データを用意し、管理画面からサイトを登録した。
- [ ] Next.js コンポーネントを作成し、`"use client"`ディレクティブを追加した。
- [ ] フォームの`name`属性と JSON の`fields.name`が一致している。

### 認証設定（Token 認証を使用する場合）

- [ ] 管理画面の「編集」タブで「API トークン認証を使用する」にチェックを入れた。
- [ ] 生成された API トークンを安全に保管した。
- [ ] API トークンを環境変数（`.env.local`）に設定した。
- [ ] `.env.local`を`.gitignore`に追加し、Git にコミットしないようにした。
- [ ] `FormHandler.init()`の第 2 引数に API トークンを設定した（Client Component の場合）。
- [ ] Server Component の場合、Authorization ヘッダーにトークンを設定した。

### 認証設定（Origin 認証を使用する場合）

- [ ] 管理画面の「編集」タブで「API トークン認証を使用する」のチェックを外した。
- [ ] 「許可ドメイン管理」セクションで本番ドメインを追加した。
- [ ] 開発環境のドメイン（`http://localhost:3000`など）を追加した。
- [ ] `FormHandler.init()`の第 1 引数にサイト ID のみを設定した（トークンなし）。

### セキュリティ対策（Next.js/TypeScript）

- [ ] フォーム要素に`maxLength`属性を設定した。
- [ ] テキスト入力に`pattern`属性で危険な文字を制限した。
- [ ] TypeScript で`escapeHtml()`関数を実装した。
- [ ] `sanitizeInput()`関数で HTML タグ除去を実装した。
- [ ] `validateForm()`関数で送信前バリデーションを実装した。
- [ ] React の状態管理（`useState`）で安全にテキストを表示している。
- [ ] `innerHTML`の使用を避けている。

### 動作確認

- [ ] テスト送信を行い、データ保存とメール受信を確認した。
- [ ] XSS 攻撃テスト（`<script>alert('test')</script>`等）で適切にブロックされることを確認した。

---

## Appendix

**管理者向け機能**

- 別途 `admin.md` を参照してください。
- サイト追加時には必要ありません。
