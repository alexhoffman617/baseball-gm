import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Season } from '../../models/season';
import { GamePlayer } from '../../models/game';
import { Team } from '../../models/team';
import { Player } from '../../models/player';
import { LeagueDataService } from '../../services/league-data.service';
import { SharedFunctionsService } from '../../services/shared-functions.service';
import { PlayGameService } from '../../services/play-game.service';
import { LeagueProgressionService } from '../../services/league-progression.service';
import { StaticListsService } from '../../services/static-lists.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css']
})
export class LeagueHomeComponent implements OnInit {
  restOfSeason = 'ROS'
  leagueId;
  players: Array<Player>;
  constructor(private route: ActivatedRoute,
              public leagueDataService: LeagueDataService,
              public sharedFunctionsService: SharedFunctionsService,
              public staticListsService: StaticListsService,
  ) { }

  async ngOnInit() {
    this.leagueDataService.playersObservable.subscribe(players => {
      this.players = players
    })
  }

  getLeaders(attribute: string, isSharedFunction: boolean = false, isPitching: boolean = false, asc: boolean = false) {
    const that = this
    const filteredPlayers = _.filter(this.players, function(player){
      if (isPitching) {
        return that.getStat(player, 'innings', false, true) > 0
      } else {
        return that.getStat(player, 'plateAppearences', false, false) > 0
      }
    })
    return filteredPlayers.length === 0 ? ['', '', ''] : _.orderBy(filteredPlayers, function(player){
     return that.getStat(player, attribute, isSharedFunction, isPitching)
    }, asc ? 'asc' : 'desc').slice(0, 3)
  }

  getStat(player: Player, attribute: string, isSharedFunction: boolean, isPitching: boolean = false) {
    const that = this
    let stats
    if (!that.leagueDataService.currentSeason) { return null }
    if (isPitching) {
      stats = _.find(player.pitchingSeasonStats, function(s){
        return s.year === that.leagueDataService.currentSeason.year
      })
    } else {
      stats = _.find(player.hittingSeasonStats, function(s){
        return s.year === that.leagueDataService.currentSeason.year
      })
    }

    return stats ? (isSharedFunction ? that.sharedFunctionsService[attribute](stats) : stats[attribute]) : null
  }
}
