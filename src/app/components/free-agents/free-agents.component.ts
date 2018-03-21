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
  sortType = 'ovr'
  sortDirection = 'desc'
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

  changeSort(sortType) {
    if (this.sortType === sortType) {
      if (this.sortDirection === 'desc') {
        this.sortDirection = 'asc'
      } else {
        this.sortDirection = 'desc'
      }
    } else {
      this.sortDirection = 'desc'
      this.sortType = sortType
    }
  }

  getSortedFreeAgents() {
    const that = this
    if (!this.freeAgents) { return [] }
    if (this.sortType === 'name') {
      return _.orderBy(this.freeAgents, function(freeAgent) {
        return freeAgent.name
      }, that.sortDirection)
    } else if (this.sortType === 'pos') {
      return _.orderBy(this.freeAgents, function(freeAgent) {
        return _.indexOf(that.staticListsService.fieldingPositionsWithDH, freeAgent.primaryPositions[0])
      }, that.sortDirection)
    } else if (this.sortType === 'age') {
      return _.orderBy(this.freeAgents, function(freeAgent) {
        return freeAgent.age
      }, that.sortDirection)
    } else if (this.sortType === 'pot') {
      return _.orderBy(this.freeAgents, function(freeAgent) {
        return that.sharedFunctionsService.overallPotential(freeAgent)
      }, that.sortDirection)
    } else {
      return _.orderBy(this.freeAgents, function(freeAgent) {
        return that.sharedFunctionsService.overallAbility(freeAgent)
      }, that.sortDirection)
    }
  }

}
