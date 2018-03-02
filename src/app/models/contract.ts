export class Contract {
  _id: string
  playerId: string
  teamId: string
  firstYear: number
  years: number
  salary: number
  state: string
  offeredDay: number

  constructor(playerId: string, teamId: string, salary: number, firstYear: number, years: number, state: string, offeredDay: number) {
    this.playerId = playerId
    this.teamId = teamId
    this.salary = salary
    this.firstYear = firstYear
    this.years = years
    this.state = state
    this.offeredDay = offeredDay
  }
}
