export class League {
  id: string;
  numberOfTeams: number;
  creatorId: string;
  name: string
  simming: boolean
  _id: string;
  structure: Array<Array<Array<string>>>
  constructor(numberOfTeams: number, creatorId: string, name: string) {
    this.name = name,
    this.numberOfTeams = numberOfTeams,
    this.creatorId = creatorId
    this.simming = false
    this.structure = null
  }
}
