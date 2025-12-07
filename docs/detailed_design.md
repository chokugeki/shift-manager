# 詳細設計書

## 1. コンポーネント設計
### 1.1 ディレクトリ構成
```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # トップページ
│   ├── schedule/         # シフト管理画面
│   ├── requests/         # 休日希望入力画面
│   └── admin/            # 管理画面
├── components/           # UIコンポーネント
│   ├── GanttChart.tsx    # ガントチャート表示
│   └── ...
├── context/              # 状態管理
│   └── ShiftContext.tsx  # グローバルステート
├── types/                # 型定義
└── utils/                # ユーティリティ関数
```

### 1.2 主要コンポーネント詳細
#### `ShiftContext` (Provider)
- **役割**: アプリケーション全体のデータ（職員、シフト、業務割り当て等）を一元管理する。
- **主なState**:
  - `staff`: 職員リスト
  - `shifts`: シフト情報の配列
  - `assignments`: 業務割り当ての配列
  - `requests`: 休日希望の配列
- **主なメソッド**:
  - `updateShift`: シフト情報の更新
  - `addAssignment`: 業務割り当ての追加
  - `saveToCloud`: JSONBinへのデータ保存

#### `GanttChart`
- **役割**: 指定された日付の業務割り当てを可視化・編集する。
- **Props**: `date` (対象日), `shifts` (当日のシフト情報)
- **機能**:
  - 30分単位のグリッド表示 (7:00 - 20:00)
  - クリックによる業務割り当て追加・削除
  - 業務重複チェックロジック

## 2. ロジック詳細
### 2.1 業務重複チェック
`GanttChart` コンポーネント内で、新規割り当て追加時に以下の条件で既存割り当てとの重複を確認する。
```typescript
(StartA < EndB) && (EndA > StartB)
```
重複がある場合はアラートを表示し、登録をブロックする。

### 2.2 シフト集計ロジック
`SchedulePage` にて、`getDailyCounts` および `getStaffMonthlyCounts` 関数を使用。
- **日次集計**: 日付ごとに各シフト区分（早番、遅番等）の人数をカウント。
- **個人集計**: 職員ごとに月間の各シフト区分の回数をカウント。

### 2.3 データ永続化
- **読み込み**: アプリ起動時 (`useEffect`) に `localStorage` から各キー (`shift_manager_staff` 等) のデータを読み込む。
- **保存**: データ更新メソッド（`addStaff`, `updateShift` 等）の実行時に、即座に `localStorage` へ書き込む。

## 3. スタイル設計
- **フレームワーク**: Tailwind CSS
- **カラーパレット**:
  - シフト区分:
    - 日勤: 白 (#ffffff)
    - 公休: グレー (#e2e8f0)
    - 早番: 薄黄 (#fef9c3)
    - 遅番: 薄橙 (#ffedd5)
    - 夜勤: 薄青 (#e0e7ff)
  - 業務区分: ユーザー定義色を使用

## 4. 印刷設計
- **CSS Media Query**: `@media print` を使用。
- **制御**:
  - 不要な要素（ヘッダー、ボタン、リンク）を `display: none` で非表示。
  - 用紙サイズに合わせてレイアウト調整（A4横向き推奨）。
  - `print-monthly` クラス付与時に月間シフト表のみ表示。
  - `print-gantt` クラス付与時にガントチャートのみ表示。
