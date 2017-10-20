import { Player } from '../models/player';

export class Game {
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  homeTeamId: string;
  awayTeamId: string;
  inning: number;
  seasonId: string;
  constructor(homeTeamStats: TeamStats, awayTeamStats: TeamStats, homeTeamId: string, awayTeamId: string, seasonId: string) {
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
    pitcherAppearances: Array<PitcherAppearance>
    runs: number;

    constructor(events: Array<GameEvent>, pitcherAppearances: Array<PitcherAppearance>, runs: number) {
        this.events = events;
        this.pitcherAppearances = pitcherAppearances;
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
    scoredIds: Array<string>;
    constructor(result: string, contact: string, trajectory: string, direction: string, fielderId: string) {
        this.result = result;
        this.contact = contact;
        this.trajectory = trajectory;
        this.direction = direction;
        this.fielderId = fielderId;
        this.scoredIds = []
    }
}

export class PitcherAppearance {
  pitcherId: string;
  innings: number;
  hits: number;
  walks: number;
  strikeouts: number;
  runs: number;
  earnedRuns: number;
  start: boolean;
  win: boolean;
  loss: boolean;
  save: boolean;
  hold: boolean;

  constructor(pitcherId: string, isStart: boolean) {
    this.pitcherId = pitcherId;
    this.innings = 0;
    this.hits = 0;
    this.walks = 0;
    this.strikeouts = 0;
    this.runs = 0;
    this.earnedRuns = 0;
    this.start = isStart;
    this.win = false;
    this.loss = false;
    this.save = false;
    this.hold = false;
  }
}
