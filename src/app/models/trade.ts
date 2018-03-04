export class Trade {
  _id: string
  leagueId: string
  teamAId: string
  teamBId: string
  teamAPlayerIds: Array<string>
  teamBPlayerIds: Array<string>
  state: string
  constructor(leagueId: string, teamAId: string, teamBId: string, teamAPlayerIds: Array<string>,
    teamBPlayerIds: Array<string>, state: string) {
      this.leagueId = leagueId
      this.teamAId = teamAId
      this.teamBId = teamBId
      this.teamAPlayerIds = teamAPlayerIds
      this.teamBPlayerIds = teamBPlayerIds
      this.state = state
  }
}
