import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from '../../services/league-data.service';
import { Player } from '../../models/player';
import * as _ from 'lodash';

@Component({
  selector: 'app-free-agents',
  templateUrl: './free-agents.component.html',
  styleUrls: ['./free-agents.component.css']
})
export class FreeAgentsComponent implements OnInit {
  freeAgents: Array<Player>
  constructor(public leagueDataService: LeagueDataService) { }

  ngOnInit() {
    const that = this
    this.leagueDataService.playersObservable.subscribe(players => {
      that.freeAgents = _.filter(players, function(player){
        return !player.teamId
      })
    })
  }

}
