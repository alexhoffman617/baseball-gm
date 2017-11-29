import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../backendServices/team/team.service';
import { SeasonService } from '../../backendServices/season/season.service';
import { PlayerService } from '../../backendServices/player/player.service';
import { GameService } from '../../backendServices/game/game.service';
import { Season } from '../../models/season';
import { GamePlayer } from '../../models/game';
import { Team } from '../../models/team';
import { Player } from '../../models/player';
import { LeagueDataService } from '../../services/league-data.service';
import { PlayGameService } from '../../services/play-game.service';
import { LeagueProgressionService } from '../../services/league-progression.service';
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
  teams: Array<Team>
  season: Season
  constructor(private route: ActivatedRoute,
              private leagueDataService: LeagueDataService,
  ) { }

  async ngOnInit() {
    this.route.parent.params.subscribe(params => {
     this.leagueId = params['leagueId'];
     (async () => {
        await this.leagueDataService.getData(this.leagueId)
        this.teams =  this.leagueDataService.teams
        this.season = this.leagueDataService.currentSeason
      })();
    });
  }

  getWins(teamId) {
    let wins = 0;
    if (!this.season) {
      return wins
    }
    _.each(this.season.schedule, function(scheduledDay){
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
    if (!this.season) {
      return losses
    }
    _.each(this.season.schedule, function(scheduledDay){
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
}
