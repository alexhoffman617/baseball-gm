export class Game {
  gameLogString: string;
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;

  constructor(gameLogString: string, homeTeamStats: TeamStats, awayTeamStats: TeamStats) {
    this.gameLogString = gameLogString,
    this.homeTeamStats = homeTeamStats,
    this.awayTeamStats = awayTeamStats
  }
}

export class TeamStats {
    atBats: Array<AtBat>
    runs: number;

    constructor(atBats: Array<AtBat>, runs: number){
        this.atBats = atBats;
        this.runs = runs;
    }
}

export class AtBat{
    batterId: string;
    pitcherId: string;
    outcome: string;

    constructor(batterId: string, pitcherId: string, outcome: string){
        this.batterId = batterId;
        this.pitcherId = pitcherId;
        this.outcome = outcome;
    }
}