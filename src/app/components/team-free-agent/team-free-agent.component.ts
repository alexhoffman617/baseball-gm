import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from 'app/services/league-data.service';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import * as _ from 'lodash';
import { Player } from 'app/models/player';

@Component({
  selector: 'app-team-free-agent',
  templateUrl: './team-free-agent.component.html',
  styleUrls: ['./team-free-agent.component.scss']
})
export class TeamFreeAgentComponent implements OnInit {

  constructor(public leagueDataService: LeagueDataService, private sharedFunctionsService: SharedFunctionsService) { }

  ngOnInit() {
  }

  getPlayersWithOfferedContracts(){
    const team = this.sharedFunctionsService.getUsersTeam()
    const players = _.filter(this.leagueDataService.players, function(player){
      return !!_.find(player.contractOffers, function(offer){ return offer.teamId === team._id })
    })
    return players
  }

  getContract(player: Player){
    const team = this.sharedFunctionsService.getUsersTeam()
    return _.find(player.contractOffers, function(offer){
      return offer.teamId === team._id
    })
  }

}
