import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeagueDataService } from '../../services/league-data.service';
import { Player, HittingProgression } from '../../models/player';
import { Game, AtBat } from '../../models/game';
import { BatterSeasonStats } from '../../models/season-stats';
import * as _ from 'lodash';
import { StaticListsService } from 'app/services/static-lists.service';
import { SharedFunctionsService } from 'app/services/shared-functions.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  leagueId: string;
  playerId: string;
  player: Player;
  years = [];

  constructor(private route: ActivatedRoute,
    public leagueDataService: LeagueDataService,
    public staticListsService: StaticListsService,
    public sharedFunctionsService: SharedFunctionsService
  ) { }

  ngOnInit() {
    const that = this
    that.route.parent.params.subscribe(parentParams => {
      that.leagueId = parentParams['leagueId'];
      that.route.params.subscribe(params => {
        that.playerId = params['playerId'];
        that.leagueDataService.playersObservable.subscribe(players => {
          that.player = _.find(players, function(player){
            return player._id === that.playerId
          });
          that.leagueDataService.seasonsObservable.subscribe(seasons => {
            that.years = []
            const lastYear = !!that.player.lastYear ? that.player.lastYear :  that.leagueDataService.currentSeason.year
            for (let year = that.player.firstYear; year <= lastYear; year++) {
              that.years.push(year)
            }
          })

        })
      })
    })
  }

  getCurrentContract() {
    const that = this
    if (!this.player) {
      return
    }
    return  _.find(this.player.contracts, function(contract){
      return contract.firstYear - 1 + contract.years >= that.leagueDataService.currentSeason.year
    })
  }
}
