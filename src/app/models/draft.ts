export class Draft {
    draftPlayerIds: Array<string>
    draftPicks: Array<DraftPick>
    year: number
    leagueId: string
    status: string
  constructor() {
    this.draftPlayerIds = new Array<string>()
    this.draftPicks = new Array<DraftPick>()
    this.status = 'Pre Draft'
  }
}

export class DraftPick {
    playerId: string
    pickNumber: number
    teamId: string
  constructor(pickNumber: number, teamId: string) {
    this.pickNumber = pickNumber
    this.teamId = teamId
  }
}
