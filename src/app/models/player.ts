export class Player {
  name: string;
  id: string;
  skills: Skills;
  potential: Potential;
  age: number;

  constructor(name: string, id: string, age: number, skills: Skills, potential: Potential) {
    this.name = name;
    this.id = id;
    this.skills = skills;
    this.potential = potential;
    this.age = age;
  }
}

export class Skills {
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

export class Potential {
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