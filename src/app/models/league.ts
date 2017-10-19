export class League {
  id: string;
  numberOfTeams: number;
  creatorId: string;
  simming: boolean
  _id: string;

  constructor(numberOfTeams: number, creatorId: string) {
    this.numberOfTeams = numberOfTeams,
    this.creatorId = creatorId
    this.simming = false
  }
}
