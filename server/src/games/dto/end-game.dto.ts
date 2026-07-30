import { IsInt, Max, Min } from 'class-validator';

export class EndGameDto {
  // Borne haute = valeur de calibration (dépend du barème et de la durée).
  // À affiner avec produit/QA.
  @IsInt()
  @Min(0)
  @Max(300)
  score!: number;
}
