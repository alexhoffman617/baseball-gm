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

  constructor(private route: ActivatedRoute,
              private teamService: TeamService,
              private seasonService: SeasonService,
              private playerService: PlayerService,
              private gameService: GameService,
              private leagueProgressionService: LeagueProgressionService,
              private playGameService: PlayGameService
  ) { }
  restOfSeason = 'ROS'
  leagueId;
  teams
  season
  teamsInstance: Array<Team>
  seasonInstance: Season
  async ngOnInit() {
    await this.route.parent.params.subscribe(params => {
     this.leagueId = params['leagueId'];
    });
    this.season = await this.seasonService.getCurrentSeason(this.leagueId).map(
      s => s.data[0]
    );
    await this.season.subscribe(s => this.seasonInstance = s)
    this.teams = await this.teamService.getLeagueTeams(this.leagueId).map(
      l => l.data
    );
    await this.teams.subscribe(t => this.teamsInstance = t)
  }

  getWins(teamId) {
    let wins = 0;
    if (!this.seasonInstance) {
      return wins
    }
    _.each(this.seasonInstance.schedule, function(scheduledDay){
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
    if (!this.seasonInstance) {
      return losses
    }
    _.each(this.seasonInstance.schedule, function(scheduledDay){
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
