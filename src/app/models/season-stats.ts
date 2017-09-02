export class SeasonStats {
  playerId: string;
  plateAppearences: number;
  atBats: number;
  singles: number;
  doubles: number;
  triples: number;
  homeruns: number;
  hits: number;
  walks: number;
  strikeouts: number;
  sacrificeFlies: number
  average: number;
  obp: number;
  slg: number;
  babip: number;
  woba: number;

  constructor(playerId: string, plateAppearences: number, 
    singles: number, doubles: number, triples: number, homeruns: number,
    walks: number, strikeouts: number, sacrificeFlies: number) {
    this.playerId = playerId,
    this.plateAppearences = plateAppearences,
    this.singles = singles,
    this.doubles = doubles,
    this.triples = triples,
    this.homeruns = homeruns,
    this.walks = walks,
    this.strikeouts = strikeouts,
    this.sacrificeFlies = sacrificeFlies,
    this.atBats = plateAppearences - walks,
    this.hits = singles + doubles + triples + homeruns
    this.average = Math.round(this.hits / this.atBats * 1000) / 1000,
    this.obp = Math.round((this.hits + walks) / this.atBats * 1000) / 1000,
    this.slg = Math.round((singles + doubles * 2 + triples * 3 + homeruns * 4) / this.atBats * 1000) / 1000,
    this.babip = Math.round((this.hits - homeruns) / (this.atBats - strikeouts - homeruns + sacrificeFlies) * 1000) / 1000,
    this.woba = Math.round((.7 * walks + .9 * singles + 1.25 * doubles + 1.6 * triples + 2 * homeruns) / plateAppearences * 1000) / 1000 
  }
}