import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Season } from '../../models/season';
import { GamePlayer } from '../../models/game';
import { Team } from '../../models/team';
import { Player } from '../../models/player';
import { LeagueDataService } from '../../services/league-data.service';
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
  constructor(private route: ActivatedRoute,
              public leagueDataService: LeagueDataService,
              public staticListsService: StaticListsService,
  ) { }

  async ngOnInit() {

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
}
