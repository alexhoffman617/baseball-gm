import { Draft } from './draft'

export class Season {
  year: number;
  preseasonDay: number
  playoffSchedule: Array<Array<PlayoffMatchup>>
  schedule: Array<ScheduledDay>;
  leagueId: string;
  _id: string;
  phase: string
  draft: Draft
  constructor(year: number, schedule: Array<ScheduledDay>, leagueId: string, phase: string) {
    this.year = year;
    this.schedule = schedule
    this.leagueId = leagueId
    this.leagueId = leagueId
    this.phase = phase
    this.preseasonDay = 1
    this.draft = new Draft()
  }
}

export class ScheduledDay {
    scheduledGames: Array<ScheduledGame>;
    complete: boolean;
  constructor(scheduledGames: Array<ScheduledGame>) {
    this.scheduledGames = scheduledGames;
    this.complete = false;
  }
}

export class ScheduledGame {
    homeTeamId: string;
    awayTeamId: string;
    gameId: string;
    homeTeamScore: number;
    awayTeamScore: number;
    innings: number;

  constructor(homeTeamId: string, awayTeamId: string) {
    this.homeTeamId = homeTeamId;
    this.awayTeamId = awayTeamId;
  }
}

export class PlayoffMatchup {
  higherSeedTeamId: string
  lowerSeedTeamId: string
  gameIds: Array<string>
  bestOf: number
  higherSeedWins: number
  lowerSeedWins: number

  constructor(higherSeedTeamId: string, lowerSeedTeamId: string, bestOf: number) {
    this.higherSeedTeamId = higherSeedTeamId;
    this.lowerSeedTeamId = lowerSeedTeamId;
    this.bestOf = bestOf
    this.gameIds = []
    this.higherSeedWins = 0
    this.lowerSeedWins = 0
  }
}


