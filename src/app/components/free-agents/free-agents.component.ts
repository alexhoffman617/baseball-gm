import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from '../../services/league-data.service';
import { Player } from '../../models/player';
import * as _ from 'lodash';
import { StaticListsService } from 'app/services/static-lists.service';
import { SharedFunctionsService } from '../../services/shared-functions.service';

@Component({
  selector: 'app-free-agents',
  templateUrl: './free-agents.component.html',
  styleUrls: ['./free-agents.component.css']
})
export class FreeAgentsComponent implements OnInit {
  freeAgents: Array<Player>
  sort = {
    sortType: 'ovr',
    sortDirection: 'desc',
    positionFilter: ''
  }
  constructor(public leagueDataService: LeagueDataService,
    public sharedFunctionsService: SharedFunctionsService,
    public staticListsService: StaticListsService) { }

  ngOnInit() {
    const that = this
    this.leagueDataService.playersObservable.subscribe(players => {
      that.freeAgents = _.filter(players, function(player){
        return !player.teamId
        && !_.find(that.leagueDataService.currentSeason.draft.draftPlayerIds, function(dpi){
          return dpi === player._id
        })
      })
    })
  }

  getSortedFreeAgents() {
    return this.sharedFunctionsService.getSortedPlayers(this.freeAgents, this.sort.sortType,
      this.sort.sortDirection, this.sort.positionFilter)
  }

}
