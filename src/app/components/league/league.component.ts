import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Season } from '../../models/season';
import { League } from '../../models/league';
import { GamePlayer, Game } from '../../models/game';
import { Team, RosterSpot } from '../../models/team';
import { Player } from '../../models/player';
import { PlayGameService } from '../../services/play-game.service';
import { LeagueProgressionService } from '../../services/league-progression.service';
import { LeagueDataService } from '../../services/league-data.service';
import { ProcessGameService } from '../../services/process-game.service';
import * as _ from 'lodash';
import 'rxjs/add/operator/first'
import * as io from 'socket.io-client';

@Component({
selector: 'app-league',
templateUrl: './league.component.html',
styleUrls: ['./league.component.css']
})
export class LeagueComponent implements OnInit {

restOfSeason = 'ROS'
leagueId;
teams
seasonSnapshot: Season;

  constructor(private route: ActivatedRoute,
              private leagueProgressionService: LeagueProgressionService,
              private playGameService: PlayGameService,
              public leagueDataService: LeagueDataService,
              public processGameService: ProcessGameService,
  ) { }

  async ngOnInit() {
    const socket = io.connect('http://localhost:3000/');
    const that = this
    this.route.params.subscribe(params => {
      this.leagueId = params['leagueId'];
      (async () => {
        await this.leagueDataService.getData(this.leagueId)
      })();
    });
  }

async stopSimming() {
  this.leagueDataService.updateSeason(this.seasonSnapshot ? this.seasonSnapshot : this.leagueDataService.currentSeason)
  await this.leagueDataService.updateAllPlayers()
  this.leagueDataService.league.simming = false
  this.leagueDataService.updateLeague()
}

areDaysLeftInSeason() {
  if (!this.seasonSnapshot) {
    return true
  }
  return !!_.find(this.seasonSnapshot.schedule, function(d){
    return !d.complete
  });
}

  playOffseason() {
    this.leagueProgressionService.progressLeague(this.leagueId, this.leagueDataService.currentSeason,
      this.leagueDataService.teams, this.leagueDataService.league.structure)
  }

simDays(days) {
  this.seasonSnapshot = this.leagueDataService.currentSeason
  this.leagueDataService.league.simming = true
  this.leagueDataService.updateLeague()
  this.playDays(days)
}

async playDays(daysLeft) {
    const that = this
    if (this.leagueDataService.league.simming === false) {
      this.leagueDataService.updateSeason(this.seasonSnapshot)
      return
    }
    const day = _.find(this.seasonSnapshot.schedule, function(d){
      return !d.complete
    });
    let completedGames = 0
    for (const rosterGame of day.scheduledGames) {
      const homeGamePlayers = that.constructRoster(rosterGame.homeTeamId)
      const awayGamePlayers = that.constructRoster(rosterGame.awayTeamId)
      const game = that.playGameService.playGame(homeGamePlayers, awayGamePlayers,
        rosterGame.homeTeamId, rosterGame.awayTeamId, that.seasonSnapshot._id, that.leagueId);
      const savedGame = await that.leagueDataService.createGame(game) as Game
      rosterGame.homeTeamScore = game.homeTeamStats.runs
      rosterGame.awayTeamScore = game.awayTeamStats.runs
      rosterGame.gameId = savedGame._id
      rosterGame.innings = game.inning
      that.processGameService.processGame(savedGame)
      completedGames++
      if (completedGames === day.scheduledGames.length) {
        that.completeDaySim(day, daysLeft)
      }
    }
  }

  completeDaySim(day, daysLeft) {
    day.complete = true
    this.leagueDataService.updateLocalSeason(this.seasonSnapshot)
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
      const gamePlayers = new Array<GamePlayer>();
      const teamPlayers = that.leagueDataService.getPlayersByTeamId(teamId) as Array<Player>
      const gameTeam = _.find(that.leagueDataService.teams, function(team){
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
      return gamePlayers
    }
}

