export class Player {
  name: string;
  _id: string;
  age: number;
  bats: string;
  throws: string;
  hittingAbility: HittingSkillset;
  hittingPotential: HittingSkillset;
  hittingProgressions: Array<HittingProgression>
  pitchingAbility: PitchingSkillset;
  pitchingPotential: PitchingSkillset;
  pitchingProgressions: Array<PitchingProgression>

  leagueId: string;
  teamId: string;

  overallHittingAbility() {
    return Math.round((this.hittingAbility.contact + this.hittingAbility.power + this.hittingAbility.patience + this.hittingAbility.speed + this.hittingAbility.fielding) * .2);
  }

  overallHittingPotential() {
    return Math.round((this.hittingPotential.contact + this.hittingPotential.power + this.hittingPotential.patience + this.hittingPotential.speed + this.hittingPotential.fielding) * .2);
  }

  overallPitchingAbility() {
    return Math.round((this.pitchingAbility.velocity + this.pitchingAbility.control + this.pitchingAbility.movement) / 3);
  }

  overallPitchingPotential() {
    return Math.round((this.pitchingPotential.velocity + this.pitchingPotential.control + this.pitchingPotential.movement) / 3);
  }

  constructor(name: string, age: number, bats: string, throws: string,
    hittingAbility: HittingSkillset, hittingPotential: HittingSkillset,
    pitchingAbility: PitchingSkillset, pitchingPotential: PitchingSkillset, leagueId: string, teamId: string) {
    this.name = name;
    this.age = age;
    this.bats = bats,
    this.throws = throws,
    this.hittingAbility = hittingAbility;
    this.hittingPotential = hittingPotential;
    this.pitchingAbility = pitchingAbility;
    this.pitchingPotential = pitchingPotential;
    this.leagueId = leagueId;
    this.teamId = teamId;
    this.hittingProgressions = new Array<HittingProgression>()
    this.pitchingProgressions = new Array<PitchingProgression>()
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
