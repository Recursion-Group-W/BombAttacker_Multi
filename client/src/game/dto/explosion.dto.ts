import { GameObjectDto } from './gameObject.dto';

export interface ExplosionDto extends GameObjectDto {
  id: number;
  animation: string;
}
