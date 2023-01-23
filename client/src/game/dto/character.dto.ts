import { GameObjectDto } from './gameObject.dto';

export interface CharacterDto extends GameObjectDto {
  life: number;
  initLife: number;
  direction: number;
  animation: string;
}
