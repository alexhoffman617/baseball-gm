export class League {
  creatorId: string;
  createDate: Date;
  numberOfTeams: number;

  constructor(creatorId: string, creatDate: Date, numberOfTeams: number) {
    this.creatorId = creatorId;
    this.createDate = creatDate;
    this.numberOfTeams = numberOfTeams;
  }
}