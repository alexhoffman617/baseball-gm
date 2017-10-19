export class Season {
  year: number;
  schedule: Array<ScheduledDay>;
  leagueId: string;
  _id: string;
  constructor(year: number, schedule: Array<ScheduledDay>, leagueId: string) {
    this.year = year;
    this.schedule = schedule;
    this.leagueId = leagueId;
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


