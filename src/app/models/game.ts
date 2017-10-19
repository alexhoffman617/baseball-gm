import { Player } from '../models/player';

export class Game {
  gameLogString: string;
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  homeTeamId: string;
  awayTeamId: string;
  inning: number;
  seasonId: string;
  constructor(gameLogString: string, homeTeamStats: TeamStats, awayTeamStats: TeamStats, homeTeamId: string, awayTeamId: string, seasonId: string) {
    this.gameLogString = gameLogString,
    this.homeTeamStats = homeTeamStats,
    this.awayTeamStats = awayTeamStats,
    this.homeTeamId = homeTeamId,
    this.awayTeamId = awayTeamId,
    this.seasonId = seasonId
  }
}

export class GamePlayer {
    position: string;
    orderNumber: number;
    played: boolean;
    player: Player;

    constructor(position: string, orderNumber: number, played: boolean, player: Player) {
        this.position = position;
        this.orderNumber = orderNumber;
        this.played = played;
        this.player = player;
    }
}

export class TeamStats {
    events: Array<GameEvent>
    runs: number;

    constructor(events: Array<GameEvent>, runs: number) {
        this.events = events;
        this.runs = runs;
    }
}

export class GameEvent {
    batterId: string;
    pitcherId: string;
    outcome: AtBat;

    constructor(batterId: string, pitcherId: string, outcome: AtBat) {
        this.batterId = batterId;
        this.pitcherId = pitcherId;
        this.outcome = outcome;
    }
}

export class AtBat {
    result: string;
    contact: string;
    trajectory: string;
    direction: string;
    fielderId: string;

    constructor(result: string, contact: string, trajectory: string, direction: string, fielderId: string) {
        this.result = result;
        this.contact = contact;
        this.trajectory = trajectory;
        this.direction = direction;
        fielderId = fielderId;
    }
}
