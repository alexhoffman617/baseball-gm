import { Player } from '../models/player';

export class Game {
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  homeTeamId: string;
  awayTeamId: string;
  inning: number;
  seasonId: string;
  leagueId: string;
  _id: string;
  constructor(homeTeamStats: TeamStats, awayTeamStats: TeamStats, homeTeamId: string,
    awayTeamId: string, seasonId: string, leagueId: string) {
    this.homeTeamStats = homeTeamStats,
    this.awayTeamStats = awayTeamStats,
    this.homeTeamId = homeTeamId,
    this.awayTeamId = awayTeamId,
    this.seasonId = seasonId,
    this.leagueId = leagueId
  }
}

export class GamePlayer {
    position: string;
    orderNumber: number;
    played: string;
    player: Player;

    constructor(position: string, orderNumber: number, played: string, player: Player) {
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
    stolenBaseAttempt: StolenBaseAttempt

    constructor(batterId: string, pitcherId: string, outcome: AtBat, stolenBaseAttempt: StolenBaseAttempt = null) {
        this.batterId = batterId;
        this.pitcherId = pitcherId;
        this.outcome = outcome;
        this.stolenBaseAttempt = stolenBaseAttempt
    }
}

export class StolenBaseAttempt {
    successful: boolean
    runnerId: string
    catcherId: string

    constructor(successful: boolean, runnerId: string, catcherId: string) {
      this.successful = successful
      this.runnerId = runnerId
      this.catcherId = catcherId
    }
}

export class AtBat {
    result: string;
    contact: string;
    trajectory: string;
    direction: string;
    fielderId: string;
    scoredIds: Array<string>;
    batterScored: boolean;
    pitches: number;
    constructor(result: string, contact: string, trajectory: string, direction: string, fielderId: string, pitches: number) {
        this.result = result;
        this.contact = contact;
        this.trajectory = trajectory;
        this.direction = direction;
        this.fielderId = fielderId;
        this.scoredIds = [],
        this.batterScored = false
        this.pitches = pitches
    }
}

export class PitcherAppearance {
  pitcherId: string;
  innings: number;
  pitches: number
  hits: number;
  walks: number;
  strikeouts: number;
  homeruns: number;
  iffb: number;
  runs: number;
  earnedRuns: number;
  start: boolean;
  qs: boolean;
  win: boolean;
  loss: boolean;
  save: boolean;
  hold: boolean;
  blownSave: boolean;

  constructor(pitcherId: string, isStart: boolean) {
    this.pitcherId = pitcherId;
    this.innings = 0;
    this.pitches = 0;
    this.hits = 0;
    this.walks = 0;
    this.strikeouts = 0;
    this.homeruns = 0;
    this.iffb = 0;
    this.runs = 0;
    this.earnedRuns = 0;
    this.start = isStart;
    this.win = false;
    this.loss = false;
    this.save = false;
    this.hold = false;
  }
}
