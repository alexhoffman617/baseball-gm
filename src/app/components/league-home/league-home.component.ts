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
import 'rxjs/add/operator/first'

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

  getWins(teamId) {
    let wins = 0;
    if (!this.leagueDataService.currentSeason) {
      return wins
    }
    _.each(this.leagueDataService.currentSeason.schedule, function(scheduledDay){
      const game = _.find(scheduledDay.scheduledGames, function(g){
        return g.homeTeamId === teamId || g.awayTeamId === teamId;
      });
      if ((game.homeTeamId === teamId && game.homeTeamScore > game.awayTeamScore)
          || (game.awayTeamId === teamId && game.awayTeamScore > game.homeTeamScore) ) {
        wins++;
      }
    })
    return wins;
  }

  getLosses(teamId) {
    let losses = 0;
    if (!this.leagueDataService.currentSeason) {
      return losses
    }
    _.each(this.leagueDataService.currentSeason.schedule, function(scheduledDay){
      const game = _.find(scheduledDay.scheduledGames, function(g){
        return g.homeTeamId === teamId || g.awayTeamId === teamId;
      });
      if ((game.homeTeamId === teamId && game.homeTeamScore < game.awayTeamScore)
          || (game.awayTeamId === teamId && game.awayTeamScore < game.homeTeamScore) ) {
        losses++;
      }
    })
    return losses;
  }

  getRecordOrderedTeams() {
    const that = this
    return _.orderBy(this.leagueDataService.teams, function(team){
      return that.getWins(team._id)
    }, 'desc')
  }

  getRecordOrderedTeamsById(teamIds: Array<string>) {
    const that = this
    const resultArray = []
    const orderedTeamId = _.orderBy(teamIds, function(teamId){
      return that.getWins(teamId)
    }, 'desc')
    _.each(orderedTeamId, function(id){
      resultArray.push(that.leagueDataService.getTeamById(id))
    })
    return resultArray
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
    return _.orderBy(filteredPlayers, function(player){
     return that.getStat(player, attribute, isSharedFunction, isPitching)
    }, asc ? 'asc' : 'desc').slice(0, 3)
  }

  getStat(player: Player, attribute: string, isSharedFunction: boolean, isPitching: boolean = false) {
    const that = this
    let stats
    if (isPitching) {
      stats = _.find(player.pitchingSeasonStats, function(s){
        return s.year === that.leagueDataService.currentSeason.year
      })
    } else {
      stats = _.find(player.hittingSeasonStats, function(s){
        return s.year === that.leagueDataService.currentSeason.year
      })
    }

    return isSharedFunction ? that.sharedFunctionsService[attribute](stats) : stats[attribute]
  }
}
