import { Player } from '../player/player';
import { GenericItem } from './genericItem';

export class FireUpItem extends GenericItem {
  static readonly SPRITE_KEY = 'orangeBean';
  // コンストラクタ
  constructor(id: number, x: number, y: number) {
    super(id, x, y, FireUpItem.SPRITE_KEY);
  }
  toJSON() {
    return Object.assign(super.toJSON(), {});
  }
  public effect(player: Player): void {
    console.log('ファイヤーアップ！');
    if (player.getBombStrength >= 10) return;
    player.setBombStrength = player.getBombStrength + 1;
  }
}
