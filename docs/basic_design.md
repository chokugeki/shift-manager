# 基本設計書

## 1. システムアーキテクチャ
本システムは、Next.js (React) を用いたシングルページアプリケーション (SPA) として構築する。
主なロジックはクライアントサイドで実行され、データはブラウザのLocalStorageに保存される。
オプションとしてJSONBinを用いたクラウド同期機能を備える。

### 構成図
```mermaid
graph TD
    User[ユーザー] --> Browser[Webブラウザ]
    subgraph Client [クライアントサイド (Next.js)]
        UI[UIコンポーネント]
        Context[ShiftContext (状態管理)]
        Storage[LocalStorage (永続化)]
    end
    Browser --> UI
    UI --> Context
    Context --> Storage
    Context --> API[JSONBin API (クラウド保存)]
```

## 2. 画面遷移図
```mermaid
graph LR
    Home[トップページ] --> Schedule[シフト作成・管理画面]
    Home --> Requests[休日希望入力画面]
    Home --> AdminStaff[職員登録画面]
    Home --> AdminTasks[業務内容登録画面]
    Schedule --> Gantt[日次業務割り当て (モーダル/展開)]
```

## 3. 機能一覧
| 機能ID | 機能名 | 概要 |
| :--- | :--- | :--- |
| F01 | トップページ | メニュー表示、各機能へのリンク |
| F02 | シフト作成 | 月間カレンダー形式でのシフト入力、集計表示 |
| F03 | 休日希望入力 | 職員による希望休の登録 |
| F04 | 業務割り当て | 日次ガントチャートによるタスク配置 |
| F05 | 職員管理 | 職員情報の追加・編集・削除 |
| F06 | 業務管理 | 業務マスタの追加・編集 |
| F07 | データ同期 | クラウドへのデータ保存・読み込み |
| F08 | 印刷出力 | シフト表・ガントチャートの印刷用表示 |

## 4. データモデル
### 4.1 Staff (職員)
| フィールド名 | 型 | 説明 |
| :--- | :--- | :--- |
| id | string | 職員ID (UUID等) |
| name | string | 氏名 |
| role | string | 職種/役割 |

### 4.2 Shift (シフト)
| フィールド名 | 型 | 説明 |
| :--- | :--- | :--- |
| id | string | シフトID |
| staffId | string | 職員ID |
| date | string | 日付 (YYYY-MM-DD) |
| shiftType | enum | シフト区分 (Day, Off, Early, Late, Night) |

### 4.3 TaskType (業務マスタ)
| フィールド名 | 型 | 説明 |
| :--- | :--- | :--- |
| id | string | 業務ID |
| name | string | 業務名称 (例: 入浴介助) |
| color | string | 表示色 (HEX) |
| duration | number | 所要時間 (分) |

### 4.4 TaskAssignment (業務割り当て)
| フィールド名 | 型 | 説明 |
| :--- | :--- | :--- |
| id | string | 割り当てID |
| date | string | 日付 |
| staffId | string | 職員ID |
| taskTypeId | string | 業務ID |
| startTime | string | 開始時刻 (HH:mm) |
| endTime | string | 終了時刻 (HH:mm) |

### 4.5 ShiftRequest (休日希望)
| フィールド名 | 型 | 説明 |
| :--- | :--- | :--- |
| id | string | 希望ID |
| staffId | string | 職員ID |
| date | string | 日付 |
| reason | string | 理由 (任意) |
