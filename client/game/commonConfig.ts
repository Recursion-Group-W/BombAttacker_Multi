// サーバースクリプトとクライアントで共通の設定クラス
export class CommonConfig {
  // フィールドサイズ
  // ※背景タイル画像のトリム処理未実装のため、
  // 「FIELD_WIDTHは、FIELDTILE_WIDTHの定数倍」「FIELD_HEIGHTは、FIELDTILE_HEIGHTの定数倍」にする必要あり。
  static FIELD_WIDTH = 1024.0;
  static FIELD_HEIGHT = 1024.0;
}
