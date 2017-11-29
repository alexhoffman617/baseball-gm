import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../backendServices/team/team.service';
import { SeasonService } from '../../backendServices/season/season.service';
import { PlayerService } from '../../backendServices/player/player.service';
import { GameService } from '../../backendServices/game/game.service';
import { LeagueService } from '../../backendServices/league/league.service';
import { Season } from '../../models/season';
import { League } from '../../models/league';
import { GamePlayer } from '../../models/game';
import { Team, RosterSpot } from '../../models/team';
import { Player } from '../../models/player';
import { PlayGameService } from '../../services/play-game.service';
import { LeagueProgressionService } from '../../services/league-progression.service';
import { LeagueDataService } from '../../services/league-data.service';
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
leagueInstance: League

  constructor(private route: ActivatedRoute,
              private seasonService: SeasonService,
              private gameService: GameService,
              private leagueService: LeagueService,
              private leagueProgressionService: LeagueProgressionService,
              private playGameService: PlayGameService,
              private leagueDataService: LeagueDataService,
  ) { }

  async ngOnInit() {
    const that = this
    this.route.params.subscribe(params => {
      this.leagueId = params['leagueId'];
      (async () => {
        await this.leagueDataService.getData(this.leagueId)
        this.leagueInstance = this.leagueDataService.league
        this.teamsInstance = this.leagueDataService.teams
        this.seasonInstance = this.leagueDataService.currentSeason
      })();
    });
  }

async stopSimming() {
  this.seasonService.updateSeason(this.seasonInstance)
  await this.leagueDataService.updateAllPlayers()
  this.leagueInstance.simming = false
  this.leagueService.updateLeague(this.leagueInstance)
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
    this.leagueProgressionService.progressLeague(this.leagueId, this.seasonInstance, this.teamsInstance, this.leagueInstance.structure)
  }

simDays(days) {
  this.leagueInstance.simming = true
  this.leagueService.updateLeague(this.leagueInstance)
  this.playDays(days)
}

async playDays(daysLeft) {
    const that = this
    let day
    if (this.leagueInstance.simming === false) {
      this.seasonService.updateSeason(this.seasonInstance)
      return
    }
    this.seasonInstance.schedule.some(function(d){
      if (!d.complete) {
        day = d
        return true
      }
    });
    let completedGames = 0
    for (const rosterGame of day.scheduledGames) {
      that.constructRoster(rosterGame.homeTeamId).then(function(hgp){
        const homeGamePlayers =  hgp as GamePlayer[]
        that.constructRoster(rosterGame.awayTeamId).then(function(agp){
          const awayGamePlayers = agp as GamePlayer[]
          const game = that.playGameService.playGame(homeGamePlayers, awayGamePlayers,
            rosterGame.homeTeamId, rosterGame.awayTeamId, that.seasonInstance._id);
          const savedGame = that.gameService.createGame(game)
          rosterGame.homeTeamScore = game.homeTeamStats.runs
          rosterGame.awayTeamScore = game.awayTeamStats.runs
          rosterGame.gameId = savedGame._id
          rosterGame.innings = game.inning
          that.setPitcherStamina(homeGamePlayers, rosterGame.homeTeamId).then(function(){
          that.setPitcherStamina(awayGamePlayers, rosterGame.awayTeamId).then(function(){
            completedGames++
            if (completedGames === day.scheduledGames.length) {
              that.completeDaySim(day, daysLeft)
            }
          })
        })
        })
      })
    }
  }

  completeDaySim(day, daysLeft) {
    day.complete = true
    if (daysLeft === this.restOfSeason) {
      if (this.areDaysLeftInSeason()) {
        this.playDays(daysLeft)
      } else {
        this.stopSimming()
      }
    } else if (daysLeft > 1) {
      daysLeft--
      this.playDays(daysLeft)
    } else {
      this.stopSimming()
    }
  }

    constructRoster(teamId) {
      const that = this
      return new Promise(function(resolve){
        const gamePlayers = new Array<GamePlayer>();
        const teamPlayers = that.leagueDataService.getPlayersByTeamId(teamId) as Array<Player>
        const gameTeam = _.find(that.teamsInstance, function(team){
          return team._id === teamId;
        })

      const orderedPitchers = _.sortBy(gameTeam.roster.pitchers, function(p){
        return p.startingPosition === '' ? null : p.startingPosition
      })
      let pitcher
      _.some(orderedPitchers, function(p: RosterSpot){
        const playerPitcher = _.find(teamPlayers, function(tp: Player){
          return tp._id === p.playerId
        })
        if (playerPitcher.currentStamina > 90) {
          pitcher = playerPitcher
          return true
        } else {
          return false
        }
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
    }

    setPitcherStamina (gamePlayers: Array<GamePlayer>, teamId) {
      const that = this
      return new Promise(function(resolve){
        const gamePitcher =  _.find(gamePlayers, function(player: GamePlayer){
          return player.position === 'P'
        })
        const teamPlayers = that.leagueDataService.getPlayersByTeamId(teamId) as Array<Player>
        _.each(teamPlayers, function(player){
          if (gamePitcher.player._id === player._id) {
            player.currentStamina = player.currentStamina - 40
          } else {
            player.currentStamina = Math.min(player.currentStamina + 10, 100)
          }
        })
        resolve(true)
      })
    }
}

