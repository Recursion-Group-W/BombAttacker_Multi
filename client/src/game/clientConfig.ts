export class ClientConfig {
  static SKIN = {
    PLAYER: '',
  };

  // 背景タイルのサイズ
  static FIELDTILE_WIDTH = 1024;
  static FIELDTILE_HEIGHT = 1024;

  // フィールド
  static FIELD_LINECOLOR = 'blue';
  static FIELD_LINEWIDTH = 5;

  // 処理時間
  static PROCESSINGTIME_FONT = '30px Bold Arial';
  static PROCESSINGTIME_COLOR = 'black';

  // ライフ
  static get LIFE_REMAINING_COLOR() {
    return 'green';
  }
  static get LIFE_MISSING_COLOR() {
    return 'red';
  }

  // スコア
  static get SCORE_FONT() {
    return '30px Bold Arial';
  }
  static get SCORE_COLOR() {
    return 'black';
  }

  // ニックネーム
  static get NICKNAME_FONT() {
    return '30px Bold Arial';
  }
  static get NICKNAME_COLOR() {
    return 'blue';
  }
}
