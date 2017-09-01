export class Player {
  name: string;
  id: string;
  hittingAbility: HittingSkillset;
  hittingPotential: HittingSkillset;
  pitchingAbility: PitchingSkillset;
  pitchingPotential: PitchingSkillset;
  age: number;

  overallHittingAbility(){
    return Math.round((this.hittingAbility.contact + this.hittingAbility.power + this.hittingAbility.patience + this.hittingAbility.speed) * .25);
  }

  overallHittingPotential(){
    return Math.round((this.hittingPotential.contact + this.hittingPotential.power + this.hittingPotential.patience + this.hittingPotential.speed) * .25);
  }

  overallPitchingAbility(){
    return Math.round((this.pitchingAbility.velocity + this.pitchingAbility.control + this.pitchingAbility.movement) / 3);
  }

  overallPitchingPotential(){
    return Math.round((this.pitchingPotential.velocity + this.pitchingPotential.control + this.pitchingPotential.movement) / 3);
  }

  constructor(name: string, id: string, age: number, 
    hittingAbility: HittingSkillset, hittingPotential: HittingSkillset,
    pitchingAbility: PitchingSkillset, pitchingPotential: PitchingSkillset) {
    this.name = name;
    this.id = id;
    this.age = age;
    this.hittingAbility = hittingAbility;
    this.hittingPotential = hittingPotential;
    this.pitchingAbility = pitchingAbility;
    this.pitchingPotential = pitchingPotential;
  }
}

export class HittingSkillset {
  contact: number;
  power: number;
  speed: number;
  patience: number;

  constructor(contact: number, power: number, speed: number, patience: number) {
    this.contact = contact;
    this.power = power;
    this.speed = speed;
    this.patience = patience;
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