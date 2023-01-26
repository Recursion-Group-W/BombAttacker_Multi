import { CharacterDto } from './character.dto';

export interface PlayerDto extends CharacterDto {
  clientId: string;
  userName: string;
  attackPlayer: number;
  attackNpc: number;
}
