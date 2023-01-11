import { RectBound } from "../../types/rectBound.type";

// 干渉するかテストする静的関数群クラス
export class OverlapTester {
  static overlapRects(rect1: RectBound, rect2: RectBound) {
    // 矩形１の左端と矩形２の右端を比べて、矩形１の左端の方が右にあるなら、重ならない。
    if (rect1.left > rect2.right) {
      return false;
    }
    // 矩形１の右端と矩形２の左端を比べて、矩形１の右端の方が左にあるなら、重ならない。
    if (rect1.right < rect2.left) {
      return false;
    }
    // 矩形１の下端と矩形２の上端を比べて、矩形１の下端の方が上にあるなら、重ならない。
    if (rect1.bottom > rect2.top) {
      return false;
    }
    // 矩形１の上端と矩形２の下端を比べて、矩形１の上端の方が下にあるなら、重ならない。
    if (rect1.top < rect2.bottom) {
      return false;
    }
    // 上記以外は重なる。
    return true;
  }

  static pointInRect(rect: RectBound, point: any) {
    return (
      rect.left <= point.x &&
      rect.right >= point.x &&
      rect.bottom <= point.y &&
      rect.top >= point.y
    );
  }
}