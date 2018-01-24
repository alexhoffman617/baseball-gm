import { GameEvent, AtBat, PitcherAppearance } from '../models/game';
import * as _ from 'lodash';

export class Player {
  name: string;
  _id: string;
  age: number;
  bats: string;
  throws: string;
  firstYear: number;
  lastYear: number;
  retired: boolean;
  currentStamina: number;
  playerType: string;
  primaryPositions: Array<string>;
  hittingAbility: HittingSkillset;
  hittingPotential: HittingSkillset;
  hittingProgressions: Array<HittingProgression>
  pitchingAbility: PitchingSkillset;
  pitchingPotential: PitchingSkillset;
  pitchingProgressions: Array<PitchingProgression>
  hittingSeasonStats: Array<BatterSeasonStats>
  pitchingSeasonStats: Array<PitcherSeasonStats>
  fieldingSeasonStats: Array<FieldingSeasonStats>
  leagueId: string;
  teamId: string;

  overallHittingAbility() {
    return Math.round((this.hittingAbility.contact + this.hittingAbility.power + this.hittingAbility.patience
      + this.hittingAbility.speed + this.hittingAbility.fielding) * .2);
  }

  overallHittingPotential() {
    return Math.round((this.hittingPotential.contact + this.hittingPotential.power + this.hittingPotential.patience
      + this.hittingPotential.speed + this.hittingPotential.fielding) * .2);
  }

  overallPitchingAbility() {
    return Math.round((this.pitchingAbility.velocity + this.pitchingAbility.control + this.pitchingAbility.movement) / 3);
  }

  overallPitchingPotential() {
    return Math.round((this.pitchingPotential.velocity + this.pitchingPotential.control + this.pitchingPotential.movement) / 3);
  }

  constructor(name: string, age: number, playerType: string, bats: string, throws: string,
    hittingAbility: HittingSkillset, hittingPotential: HittingSkillset,
    pitchingAbility: PitchingSkillset, pitchingPotential: PitchingSkillset,
    leagueId: string, teamId: string, firstYear: number, primaryPositions: Array<string>) {
    this.name = name;
    this.age = age;
    this.playerType = playerType
    this.primaryPositions = primaryPositions
    this.bats = bats;
    this.throws = throws;
    this.firstYear = firstYear;
    this.retired = false
    this.currentStamina = 100;
    this.hittingAbility = hittingAbility;
    this.hittingPotential = hittingPotential;
    this.pitchingAbility = pitchingAbility;
    this.pitchingPotential = pitchingPotential;
    this.leagueId = leagueId;
    this.teamId = teamId;
    this.hittingProgressions = new Array<HittingProgression>()
    this.pitchingProgressions = new Array<PitchingProgression>()
    this.fieldingSeasonStats = new Array<FieldingSeasonStats>()
  }
}

export class HittingProgression {
  year: number
  hittingSkillset: HittingSkillset

  constructor(year: number, hittingSkillset: HittingSkillset) {
    this.year = year
    this.hittingSkillset = hittingSkillset
  }
}

export class PitchingProgression {
  year: number
  pitchingSkillset: PitchingSkillset

  constructor(year: number, pitchingSkillset: PitchingSkillset) {
    this.year = year
    this.pitchingSkillset = pitchingSkillset
  }
}

export class HittingSkillset {
  contact: number;
  power: number;
  speed: number;
  patience: number;
  fielding: number;

  constructor(contact: number, power: number, patience: number, speed: number, fielding: number) {
    this.contact = contact;
    this.power = power;
    this.speed = speed;
    this.patience = patience;
    this.fielding = fielding;
  }
}

export class PitchingSkillset {
  velocity: number;
  control: number;
  movement: number;
  type: string;

  constructor(velocity: number, control: number, movement: number, type: string) {
    this.velocity = velocity;
    this.control = control;
    this.movement = movement;
    this.type = type;
  }
}

export class BatterSeasonStats {
    year: number;
    gamesPlayed: number
    plateAppearences: number;
    singles: number;
    doubles: number;
    triples: number;
    homeruns: number;
    walks: number;
    strikeouts: number;
    sacrificeFlies: number
    steals: number;
    caughtStealing: number;
    rbis: number;
    runs: number;

    constructor(year) {
      this.year = year
      this.gamesPlayed = 0
      this.plateAppearences = 0
      this.singles = 0
      this.doubles = 0
      this.triples = 0
      this.homeruns = 0
      this.walks = 0
      this.strikeouts = 0
      this.sacrificeFlies = 0
      this.steals = 0
      this.caughtStealing = 0
      this.rbis = 0
      this.runs = 0
    }
  }

export class PitcherSeasonStats {
    year: number;
    appearances: number;
    starts: number;
    innings: number;
    strikeouts: number;
    walks: number;
    hits: number;
    earnedRuns: number;
    runs: number;
    wins: number;
    losses: number;
    saves: number;
    holds: number;
    qs: number;

    constructor(year: number) {
      this.year = year
      this.appearances = 0
      this.starts = 0
      this.innings = 0
      this.strikeouts = 0
      this.walks = 0
      this.hits = 0;
      this.earnedRuns = 0
      this.runs = 0
      this.wins = 0
      this.losses = 0
      this.saves = 0
      this.holds = 0
      this.qs = 0
    }

    roundInnings() {
      if (parseFloat((this.innings % 1).toFixed(1)) === .3) {
        this.innings += .7
      }
      this.innings = parseFloat((this.innings).toFixed(1))
    }
}

export class FieldingSeasonStats {
  year: number
  putOuts: number
  errors: number

  constructor(year: number) {
    this.year = year
    this.putOuts = 0
    this.errors = 0
  }
}

