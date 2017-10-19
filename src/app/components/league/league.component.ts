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
selector: 'app-league',
templateUrl: './league.component.html',
styleUrls: ['./league.component.css']
})
export class LeagueComponent implements OnInit {

restOfSeason = 'ROS'
leagueId;
teams
season
teamsInstance: Array<Team>
seasonInstance: Season
simming = false

  constructor(private route: ActivatedRoute,
              private teamService: TeamService,
              private seasonService: SeasonService,
              private playerService: PlayerService,
              private gameService: GameService,
              private leagueProgressionService: LeagueProgressionService,
              private playGameService: PlayGameService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.leagueId = params['leagueId'];
    });
    this.seasonService.getCurrentSeason(this.leagueId).subscribe(s => {
      this.seasonInstance = s.data[0]
    })
    this.teams = this.teamService.getLeagueTeams(this.leagueId).map(
      l => l.data
    );
    this.teams.subscribe(t => this.teamsInstance = t)
  }

stopSimming() {
  this.simming = false
}

areDaysLeftInSeason() {
  if (!this.seasonInstance) {
    return true
  }
  return !!_.find(this.seasonInstance.schedule, function(d){
    return !d.complete
  });
}

  playOffseason() {
    this.leagueProgressionService.progressLeague(this.leagueId, this.seasonInstance, this.teamsInstance)
  }

simDays(days) {
  this.simming = true
  this.playDays(days)
}

async playDays(daysLeft) {
    const that = this
    let day
    if (this.simming === false) {
      this.seasonService.updateSeason(this.seasonInstance)
      return
    }
    this.seasonInstance.schedule.some(function(d){
      if (!d.complete) {
        day = d
        return true
      }
    });
    for (const rosterGame of day.scheduledGames) {
      const homeGamePlayers = await that.constructRoster(rosterGame.homeTeamId) as GamePlayer[]
      const awayGamePlayers = await that.constructRoster(rosterGame.awayTeamId) as GamePlayer[]
      const game = that.playGameService.playGame(homeGamePlayers, awayGamePlayers,
          rosterGame.homeTeamId, rosterGame.awayTeamId, that.seasonInstance._id);
      const savedGame = that.gameService.createGame(game)
      rosterGame.homeTeamScore = game.homeTeamStats.runs
      rosterGame.awayTeamScore = game.awayTeamStats.runs
      rosterGame.gameId = savedGame._id
      rosterGame.innings = game.inning
    }
        day.complete = true
        if (daysLeft === this.restOfSeason) {
          if (this.areDaysLeftInSeason()) {
            this.playDays(daysLeft)
          } else {
            this.seasonService.updateSeason(this.seasonInstance)
            this.simming = false
          }
        } else if (daysLeft > 1) {
          daysLeft--
          this.playDays(daysLeft)
        } else {
          this.seasonService.updateSeason(this.seasonInstance)
          this.simming = false
        }
  }

    constructRoster(teamId) {
      const that = this
      return new Promise(function(resolve){
        const gamePlayers = new Array<GamePlayer>();
        that.playerService.getPlayersByTeamId(teamId).first().subscribe(t => {
          const teamPlayers = t.data as Array<Player>
          const gameTeam = _.find(that.teamsInstance, function(team){
            return team._id === teamId;
          })

          const rosterPitcher = _.find(gameTeam.roster.pitchers, function(pitcher){
            return pitcher.startingPosition === 'SP1';
          });
          const pitcher = _.find(teamPlayers, function(tp){
            return tp._id === rosterPitcher.playerId
          })
          gamePlayers.push(new GamePlayer('P', null, true, pitcher));

          for (let x = 1; x <= 9; x++) {
            const rosterBatter = _.find(gameTeam.roster.batters, function(batter){
              return batter.orderNumber === x;
            });
            const batter = _.find(teamPlayers, function(tp){
              return tp._id === rosterBatter.playerId
            })
            gamePlayers.push(new GamePlayer(rosterBatter.startingPosition, rosterBatter.orderNumber, true, batter))
          }
          resolve(gamePlayers)
        })
      })
    }
}

