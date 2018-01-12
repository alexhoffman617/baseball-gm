import { Injectable } from '@angular/core';
import { Player, PitchingSkillset, BatterSeasonStats, PitcherSeasonStats } from '../models/player';

@Injectable()
export class SharedFunctionsService {

  constructor() {}

  era(pss: PitcherSeasonStats) { return !pss ? null : Math.round(9 * pss.earnedRuns / pss.innings * 1000) / 1000 }
  whip(pss: PitcherSeasonStats) { return !pss ? null : Math.round((pss.walks + pss.hits) / pss.innings * 1000) / 1000 }
  pitchbabip(pss: PitcherSeasonStats) { return !pss ? null : 0 }
  walksPerNine(pss: PitcherSeasonStats) { return !pss ? null : 9 * pss.walks / pss.innings }
  strikeoutsPerNine(pss: PitcherSeasonStats) { return !pss ? null : 9 * pss.strikeouts / pss.innings }


  walkPercentage(bss: BatterSeasonStats) { return !bss ? null : bss.walks / bss.plateAppearences }
  strikeoutPercentage(bss: BatterSeasonStats) { return !bss ? null : bss.strikeouts / bss.plateAppearences }
  atBats(bss: BatterSeasonStats) { return !bss ? null : bss.plateAppearences - bss.walks }
  hits(bss: BatterSeasonStats) { return !bss ? null : bss.singles + bss.doubles + bss.triples + bss.homeruns }
  average(bss: BatterSeasonStats) { return !bss ? null : Math.round( this.hits(bss) / this.atBats(bss) * 1000) / 1000 }
  obp(bss: BatterSeasonStats) { return !bss ? null : Math.round((this.hits(bss) + bss.walks) / bss.plateAppearences * 1000) / 1000 }
  slg(bss: BatterSeasonStats) { return !bss ? null : Math.round((bss.singles + bss.doubles * 2 + bss.triples * 3 + bss.homeruns * 4)
    / this.atBats(bss) * 1000) / 1000 }
  batbabip(bss: BatterSeasonStats) { return !bss ? null : Math.round((this.hits(bss) - bss.homeruns) / (this.atBats(bss) - bss.strikeouts
    - bss.homeruns + bss.sacrificeFlies) * 1000) / 1000 }
  woba(bss: BatterSeasonStats) { return !bss ? null : Math.round((.7 * bss.walks + .9 * bss.singles + 1.25 * bss.doubles
    + 1.6 * bss.triples + 2 * bss.homeruns) / bss.plateAppearences * 1000) / 1000 }
}
