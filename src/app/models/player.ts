export class Player {
  name: string;
  id: string;
  skills: Skills;


  constructor(name: string, id: string, skills: Skills) {
    this.name = name;
    this.id = id;
    this.skills = skills;
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