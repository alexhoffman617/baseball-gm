export class Contract {
  _id: string
  playerId: string
  teamId: string
  firstYear: number
  lastYear: number
  salary: number
  constructor(playerId: string, teamId: string, salary: number, firstYear: number, lastYear: number) {
    this.playerId = playerId
    this.teamId = teamId
    this.salary = salary
    this.firstYear = firstYear
    this.lastYear = lastYear
  }
}
