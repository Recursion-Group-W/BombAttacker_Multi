import { Player } from '../player/player';
import { GenericItem } from './genericItem';

export class BombUpItem extends GenericItem {
  static readonly SPRITE_KEY = 'blueBean';
  // コンストラクタ
  constructor(id: number, x: number, y: number) {
    super(id, x, y, BombUpItem.SPRITE_KEY);
  }
  toJSON() {
    return Object.assign(super.toJSON(), {});
  }
  public effect(player: Player): void {
    console.log('ボムアップ！');
    if (player.getBombCountMax >= 10) return;
    player.setBombCountMax = player.getBombCountMax + 1;
  }
}
