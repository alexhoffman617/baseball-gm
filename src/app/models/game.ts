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
    events: Array<GameEvent>
    runs: number;

    constructor(events: Array<GameEvent>, runs: number){
        this.events = events;
        this.runs = runs;
    }
}

export class GameEvent {
    batterId: string;
    pitcherId: string;
    outcome: string;

    constructor(batterId: string, pitcherId: string, outcome: string){
        this.batterId = batterId;
        this.pitcherId = pitcherId;
        this.outcome = outcome;
    }
}

export class AtBat{
    result: string;
    contact: string;
    trajectory: string;

    constructor(result: string, contact: string, trajectory: string){
        this.result = result;
        this.contact = contact;
        this.trajectory = trajectory;
    }
}