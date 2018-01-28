export class League {
  id: string;
  numberOfTeams: number;
  creatorAccountId: string;
  name: string
  simming: boolean
  _id: string;
  structure: Array<Array<Array<string>>>
  constructor(numberOfTeams: number, creatorAccountId: string, name: string) {
    this.name = name,
    this.numberOfTeams = numberOfTeams,
    this.creatorAccountId = creatorAccountId
    this.simming = false
    this.structure = null
  }
}
