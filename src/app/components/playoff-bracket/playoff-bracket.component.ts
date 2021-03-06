import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from '../../services/league-data.service'
import { SharedFunctionsService } from '../../services/shared-functions.service'
@Component({
  selector: 'app-playoff-bracket',
  templateUrl: './playoff-bracket.component.html',
  styleUrls: ['./playoff-bracket.component.scss']
})
export class PlayoffBracketComponent implements OnInit {

  constructor(public leagueDataService: LeagueDataService, public sharedFunctionsService: SharedFunctionsService) { }

  ngOnInit() {

  }

  getLastPlayoffMatchup() {
    return this.leagueDataService.currentSeason.playoffSchedule[this.leagueDataService.currentSeason.playoffSchedule.length - 1]
  }

  getLastPlayoffWinner() {
    if (this.getLastPlayoffMatchup()[0].higherSeedWins > this.getLastPlayoffMatchup()[0].bestOf / 2) {
      return this.getLastPlayoffMatchup()[0].higherSeedTeamId
    } else if (this.getLastPlayoffMatchup()[0].lowerSeedWins > this.getLastPlayoffMatchup()[0].bestOf / 2) {
      return this.getLastPlayoffMatchup()[0].lowerSeedTeamId
    } else {
      return null
    }
  }
}
