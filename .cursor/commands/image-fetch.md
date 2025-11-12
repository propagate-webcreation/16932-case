# Image Fetch

画像自動取得ワークフローを実行します（Google Drive から画像を選定・ダウンロード）。

## Context Files

- `memories/image_fetch_workflow.yaml`
- `.cursor/rules/workflows.md` （Image Fetch Workflow セクション）

## Instructions

**🚨 重要: このコマンドファイルは指示のみです。詳細なワークフロー（全5ステップ）は yaml ファイルに記載されています。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む（読まずに実行することは禁止）:**
   - `memories/image_fetch_workflow.yaml` （詳細ワークフロー・437行・本体）
   - `.cursor/rules/workflows.md` の Image Fetch Workflow セクション（重要なルール）
2. **yaml ファイルを読み込んでから、5つのステップを順番に実行し、絶対にスキップしない**

## Critical Rules

### Step 0: OS選択（CRITICAL）
- 最初に必ずユーザーのOSを確認（Mac または Windows）
- OS に応じたコマンドを使用

### Step 1: リスト取得（CRITICAL）
- Google Drive から photos と backgrounds のリストを一括取得
- run_terminal_cmd でコマンドを実行
- scripts/photos_index.json と scripts/backgrounds_index.json を生成

### Step 2: 画像選定（CRITICAL）
**Photos選定:**
- scripts/photos_index.json を完全に読み込む
- ファイル名を1文字も変更せず、そのままコピー
- grep結果や部分一致からファイル名を推測・構築することは絶対禁止
- 選定後、grep完全一致検索（-F）で確認

**Backgrounds選定:**
- scripts/backgrounds_index.json を完全に読み込む
- ファイル名の命名規則を理解（bg--vibe--pattern_type--...）
- ファイル名を1文字も変更せず、そのままコピー
- 選定後、grep完全一致検索（-F）で確認

### Step 3: selected.json 確認（MANDATORY）
- 構造化JSON形式
- photos と backgrounds キーが存在
- ファイル名が完全一致

### Step 4: ダウンロード実行（CRITICAL）
- run_terminal_cmd で実行
- OS に応じたコマンドを使用
- public/img/photos/ と public/img/backgrounds/ に保存

## Important Notes

- 現在は photos と backgrounds のみ対応
- illusts は今回は使用しない
- ファイル名の完全一致が最重要
- 推測・構築は絶対禁止

## Execution Example

**User:** `/image-fetch`

**AI Action:**
```
[Step 0] OS選択
AI: 使用しているOSを教えてください: Mac または Windows
User: Mac

[Step 1] リスト一括取得
  → Mac版コマンド実行
  ✅ scripts/photos_index.json 作成
  ✅ scripts/backgrounds_index.json 作成

[Step 2] 画像選定
  → about.yaml を読み込む
  → photos_index.json から写真を選定
  → backgrounds_index.json から背景を選定
  ✅ scripts/selected.json 生成

[Step 3] selected.json 確認
  ✅ 形式OK、ファイル名完全一致

[Step 4] ダウンロード実行
  → Mac版コマンド実行
  ✅ public/img/photos/ に保存
  ✅ public/img/backgrounds/ に保存

✅ 画像自動取得が完了しました！
```

