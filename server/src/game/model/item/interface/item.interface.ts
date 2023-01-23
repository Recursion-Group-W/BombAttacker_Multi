import { Player } from '../../player/player';

export interface Item {
  effect(player: Player): void;
}
