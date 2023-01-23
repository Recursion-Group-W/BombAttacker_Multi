import { BombUpItem } from '../../model/item/bombUpItem';
import { FireUpItem } from '../../model/item/fireUpItem';
import { SpeedUpItem } from '../../model/item/speedUpItem';

export class ItemFactory {
  createSpeedUpItem(id: number, x: number, y: number) {
    return new SpeedUpItem(id, x, y);
  }
  createFireUpItem(id: number, x: number, y: number) {
    return new FireUpItem(id, x, y);
  }
  createBombUpItem(id: number, x: number, y: number) {
    return new BombUpItem(id, x, y);
  }
}
