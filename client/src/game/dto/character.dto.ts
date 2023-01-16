import { GameObjectDto } from './gameObject.dto';

export interface CharacterDto extends GameObjectDto {
  userName: string;
  life: number;
  direction: number;
  animation: string;
}
