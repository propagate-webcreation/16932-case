# Font Setup

フォント設定ワークフローを実行します。

## Context Files

- `memories/font_workflow.yaml`
- `.cursor/rules/workflows.md` （Font Setup Workflow セクション）

## Instructions

**🚨 重要: このコマンドファイルは指示のみです。詳細なワークフロー（全6ステップ）は yaml ファイルに記載されています。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む（読まずに実行することは禁止）:**
   - `memories/font_workflow.yaml` （詳細ワークフロー・951行・本体）
   - `.cursor/rules/workflows.md` の Font Setup Workflow セクション（重要なルール）
2. **yaml ファイルを読み込んでから、ワークフローの全6ステップを順番に実行し、絶対にスキップしない**
3. **特に重要なステップ（🚨 CRITICAL）:**
   - Step 2（フォント選択肢の提示）: skip_allowed: false
   - Step 3（ユーザーの選択）: skip_allowed: false
   - Step 6（再発防止チェック）: skip_allowed: false
4. **すべてのステップで status: MANDATORY, skip_allowed: false を尊重**

## Triggers

このコマンドは以下のキーワードで使用されることを想定:
- フォント
- かわいい
- 上品
- 和風
- font
- elegant
- cute

## Important Notes

- globals.css の :root セクション自動更新（v3.2.0）
- 複数ページ問題の完全自動解決
- @utility の廃止（Tailwind CSS v4 対応）

## Execution Example

**User:** `/font-setup` または 「上品なフォントにして」

**AI Action:**
1. Read `memories/font_workflow.yaml`
2. Present font choices to user (Step 2, MANDATORY)
3. Wait for user selection (Step 3, MANDATORY)
4. Execute setup
5. Validate
6. Prevention checklist (Step 6, MANDATORY)

