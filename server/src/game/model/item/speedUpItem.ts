import { Player } from '../player/player';
import { GenericItem } from './genericItem';

export class SpeedUpItem extends GenericItem {
  static readonly SPRITE_KEY = 'yellowBean';
  // コンストラクタ
  constructor(id: number, x: number, y: number) {
    super(id, x, y, SpeedUpItem.SPRITE_KEY);
  }
  toJSON() {
    return Object.assign(super.toJSON(), {});
  }
  public effect(player: Player): void {
    console.log('スピードアップ！');
    if (player.getSpeed >= 150) return;
    player.setSpeed = player.getSpeed + 10;
  }
}
