import { GameObjectDto } from './gameObject.dto';

export interface CharacterDto extends GameObjectDto {
  
  life: number;
  direction: number;
  animation: string;
}
