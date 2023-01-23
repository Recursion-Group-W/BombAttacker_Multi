import { CharacterDto } from './character.dto';

export interface PlayerDto extends CharacterDto {
  clientId: string;
  userName: string;
  score: number;
}
