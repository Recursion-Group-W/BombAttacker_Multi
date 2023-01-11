// 干渉するかテストする静的関数群クラス
export class OverlapTester {
  static overlapRects(rect1: any, rect2: any) {
    // 矩形１の左端と矩形２の右端を比べて、矩形１の左端の方が右にあるなら、重ならない。
    if (rect1.fLeft > rect2.fRight) {
      return false;
    }
    // 矩形１の右端と矩形２の左端を比べて、矩形１の右端の方が左にあるなら、重ならない。
    if (rect1.fRight < rect2.fLeft) {
      return false;
    }
    // 矩形１の下端と矩形２の上端を比べて、矩形１の下端の方が上にあるなら、重ならない。
    if (rect1.fBottom > rect2.fTop) {
      return false;
    }
    // 矩形１の上端と矩形２の下端を比べて、矩形１の上端の方が下にあるなら、重ならない。
    if (rect1.fTop < rect2.fBottom) {
      return false;
    }
    // 上記以外は重なる。
    return true;
  }

  static pointInRect(rect: any, point: any) {
    return (
      rect.fLeft <= point.x &&
      rect.fRight >= point.x &&
      rect.fBottom <= point.y &&
      rect.fTop >= point.y
    );
  }
}
