export class League {
  id: string;
  numberOfTeams: number;
  creatorId: string;
  _id: string;
  
  constructor(numberOfTeams: number, creatorId: string) {
    this.numberOfTeams = numberOfTeams,
    this.creatorId = creatorId
  }
}