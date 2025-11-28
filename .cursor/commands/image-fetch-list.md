# Image Fetch List

Google Drive から画像リストを一括取得します（Step 1 専用コマンド）。

## Context Files

- `memories/image_fetch_workflow.yaml` （v2.0.0 - Step 1 セクション）
- `.cursor/rules/workflows.md` （Image Fetch Workflow セクション）

## Instructions

**このコマンドは Step 1（リスト一括取得）のみを実行します。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む:**
   - `memories/image_fetch_workflow.yaml` の Step 0 と Step 1 セクション
2. **OS選択 → リスト取得の順で実行**
3. **🚨 エラー検出時の自動対応:**
   - コマンド実行結果に `invalid_grant` が含まれる場合
   - 自動的に以下の対応を実行:
     1. トークン削除コマンドを実行（run_terminal_cmd）
     2. 「Troubleshooting」セクションの手順をユーザーに案内
     3. ユーザーに再認証を促す（下記のテンプレートを使用）

## Error Response Template

**`invalid_grant` エラー検出時に表示するメッセージ:**

```
❌ 認証エラーが発生しました

【原因】
Google認証トークンが無効化されました（期限切れ、設定変更、長期間未使用など）

【Step 1: トークン削除（完了）】
✅ 既存のトークンを削除しました

【Step 2: 再認証（ユーザー操作が必要）】
以下のコマンドをターミナル（Mac）またはPowerShell（Windows）で実行してください：

macOS/Linux:
node ~/tools/drive-img-cli/drive-images.js auth

Windows:
node $env:USERPROFILE\tools\drive-img-cli\drive-images.js auth

【ブラウザでの操作手順】
1. コマンド実行後、ブラウザが自動的に開きます
2. 🚨 必ず「propagate.ai.webcreation2@gmail.com」アカウントを選択
3. 「このアプリは Google で確認されていません」→「詳細」→「（安全ではないページ）に移動」
4. 「許可」をクリック
5. 「認証に成功しました」と表示されたら完了

🚨 重要: 必ず「propagate.ai.webcreation2@gmail.com」で認証してください
別のアカウントで認証すると、画像にアクセスできません。

📚 詳細マニュアル:
info@propagateinc.com にログインしているブラウザで以下のリンクを開くと、詳細マニュアルを確認できます：
https://docs.google.com/document/d/1hgDO3eBQY5QZmzvp3JGjDD-2rcWdtfeLcCYsOXtZoLM/edit?tab=t.kyj50sgkmpw7

「Step 4: Google認証（初回あるいはトークン期限切れの時）」に以下の内容が記載されています：
1. ターミナルで認証コマンドを実行
2. ブラウザが自動的に開く
3. Googleアカウント選択画面で「propagate.ai.webcreation2@gmail.com」を選択
4. 「このアプリは Google で確認されていません」→「詳細」→「（安全ではないページ）に移動」
5. 「Google Drive API にアクセスしようとしています」→「許可」
6. 「認証に成功しました」と表示されたら完了

ドキュメントには画面キャプチャ付きで詳しく説明されています。

【Step 3: 再実行】
認証完了後、「認証完了しました」とお知らせください。
リスト取得を再実行します。
```


## Workflow

### Step 0: OS選択（CRITICAL）
- 最初に必ずユーザーのOSを確認（Mac または Windows）
- OS に応じたコマンドを使用

### Step 1: リスト取得（CRITICAL）
- Google Drive から photos と backgrounds のリストを一括取得
- run_terminal_cmd で **1コマンド**を実行
- scripts/photos_index.json と scripts/backgrounds_index.json を生成

## Output Files

- `scripts/photos_index.json` - 写真リスト（JSON配列形式）
- `scripts/backgrounds_index.json` - 背景リスト（JSON配列形式）

## Next Step

リスト取得完了後、以下のコマンドで画像選定を行ってください：

```
/image-select
```

## Execution Example

**User:** `/image-fetch-list`

**AI Action:**
```
[Step 0] OS選択
AI: 使用しているOSを教えてください: Mac または Windows
User: Mac

[Step 1] リスト一括取得（1コマンド）
  → Mac版コマンド実行
  ✅ scripts/photos_index.json 作成
  ✅ scripts/backgrounds_index.json 作成

✅ リスト取得が完了しました！

次のステップ:
画像を選定するには `/image-select` を実行してください。
```

## Troubleshooting

### 認証エラー: `invalid_grant`

**原因:**
Google認証トークンが無効化された（期限切れ、設定変更、長期間未使用など）

**解決方法:**

#### Step 1: 既存のトークンを削除（AIが実行）

AIが自動的に以下のコマンドを実行します：

**macOS/Linux:**
```bash
rm ~/.config/drive-img-cli/token.json
```

**Windows:**
```powershell
Remove-Item "$env:USERPROFILE\.config\drive-img-cli\token.json"
```

#### Step 2: 再認証を実行（🚨 ユーザー操作が必要）

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

**詳細な認証手順:**
[Google認証の詳しい手順（Step 4）](https://docs.google.com/document/d/1hgDO3eBQY5QZmzvp3JGjDD-2rcWdtfeLcCYsOXtZoLM/edit?tab=t.kyj50sgkmpw7)

#### Step 3: 再度リスト取得を実行

認証完了後、チャットで「認証完了しました」とお知らせください。AIが `/image-fetch-list` を再実行します。

**予防策:**
- システム時刻が正しく設定されているか確認する
- 常に正しいアカウント（`propagate.ai.webcreation2@gmail.com`）で認証する

**違うアカウントで認証してしまった場合:**

上記の Step 1 と Step 2 を実行し、必ず正しいアカウント（`propagate.ai.webcreation2@gmail.com`）で再認証してください。

