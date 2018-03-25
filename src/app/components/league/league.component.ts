import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Season, PlayoffMatchup } from '../../models/season';
import { League } from '../../models/league';
import { GamePlayer, Game } from '../../models/game';
import { Team, RosterSpot } from '../../models/team';
import { Player } from '../../models/player';
import { PlayGameService } from '../../services/play-game.service';
import { LeagueProgressionService } from '../../services/league-progression.service';
import { LeagueDataService } from '../../services/league-data.service';
import { ProcessGameService } from '../../services/process-game.service';
import { PlayoffScheduleGenerator } from '../../services/playoff-schedule.generator';
import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import { AuthService } from 'app/services/auth.service';
import { ContractExpectationService } from 'app/services/contract-expectation.service';
import { StaticListsService } from 'app/services/static-lists.service';

@Component({
selector: 'app-league',
templateUrl: './league.component.html',
styleUrls: ['./league.component.css']
})
export class LeagueComponent implements OnInit {

restOfPlayoffRound = 'ROPR'
leagueId;
teams
seasonSnapshot: Season;
accountId: string

  constructor(private route: ActivatedRoute,
              private leagueProgressionService: LeagueProgressionService,
              private playGameService: PlayGameService,
              public leagueDataService: LeagueDataService,
              public sharedFunctionsService: SharedFunctionsService,
              public staticListsService: StaticListsService,
              public playoffScheduleGenerator: PlayoffScheduleGenerator,
              public processGameService: ProcessGameService,
              public contractExpectationService: ContractExpectationService,
              public authService: AuthService,
  ) { }

  async ngOnInit() {
    const socket = io.connect(window.location.protocol + '//' + window.location.host);
    const that = this
    this.route.params.subscribe(params => {
      this.leagueId = params['leagueId'];
      (async () => {
        await this.leagueDataService.getData(this.leagueId)
      })();
    });
    this.accountId = localStorage.getItem('baseballgm-id')
  }

async stopSimming() {
  this.leagueDataService.updateSeason(this.seasonSnapshot ? this.seasonSnapshot : this.leagueDataService.currentSeason)
  await this.leagueDataService.updateAllPlayers()
  this.leagueDataService.league.simming = false
  this.leagueDataService.updateLeague()
}

areDaysLeftInSeason() {
  if (!this.leagueDataService.currentSeason) {
    return true
  }
  return !!_.find(this.leagueDataService.currentSeason.schedule, function(d){
    return !d.complete
  });
}

async generatePlayoffs() {
  this.sharedFunctionsService.updateSeasonToNextPhase()
  await this.playoffScheduleGenerator.generatePlayoffSchedule()
}

playoffsCompleted() {
  return this.leagueDataService.currentSeason &&
  this.leagueDataService.currentSeason.playoffSchedule &&
  this.leagueDataService.currentSeason.playoffSchedule[this.leagueDataService.currentSeason.playoffSchedule.length - 1].length === 1 &&
  this.playoffScheduleGenerator.isCurrentRoundDone()
}

playOffseason() {
  this.sharedFunctionsService.updateSeasonToNextPhase()
  this.leagueProgressionService.progressLeague(this.leagueId, this.leagueDataService.currentSeason,
    this.leagueDataService.teams, this.leagueDataService.league.structure)
}

simPreseasonDays(days) {
  this.contractExpectationService.processAllContractOffers()
  this.leagueDataService.currentSeason.preseasonDay++
  this.leagueDataService.updateSeason(this.leagueDataService.currentSeason)
  if (this.leagueDataService.currentSeason.preseasonDay <= this.staticListsService.preseasonDays) {
    this.simPreseasonDays(days - 1)
  }
}

simDays(days) {
  this.seasonSnapshot = this.leagueDataService.currentSeason
  this.leagueDataService.league.simming = true
  this.makeSureAllLineupsSet()
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
        rosterGame.homeTeamId, rosterGame.awayTeamId, that.seasonSnapshot._id, that.leagueId)
      const savedGame = await that.leagueDataService.createGame(game) as Game
      rosterGame.homeTeamScore = game.homeTeamStats.runs
      rosterGame.awayTeamScore = game.awayTeamStats.runs
      rosterGame.gameId = savedGame._id
      rosterGame.innings = game.inning
      that.processGameService.processGame(savedGame, homeGamePlayers, awayGamePlayers)
      completedGames++
      if (completedGames === day.scheduledGames.length) {
        that.completeDaySim(day, daysLeft)
      }
    }
  }

  async completeDaySim(day, daysLeft) {
    const that = this
    day.complete = true
    this.leagueDataService.updateLocalSeason(this.seasonSnapshot)
    if (!this.areDaysLeftInSeason()) {
      this.stopSimming()
    } else if (daysLeft > 1) {
      if (daysLeft % 6 === 0) {
        await that.leagueDataService.updateAllPlayers()
        that.leagueDataService.updateSeason(this.seasonSnapshot)
      }
      daysLeft--
      this.playDays(daysLeft)
    } else {
      this.stopSimming()
    }
  }

  simPlayoffDays(days) {
    this.seasonSnapshot = this.leagueDataService.currentSeason
    this.leagueDataService.league.simming = true
    this.makeSureAllLineupsSet()
    this.leagueDataService.updateLeague()
    this.playPlayoffDay(days)
  }

  async playPlayoffDay(daysLeft) {
    const that = this
    if (this.leagueDataService.league.simming === false) {
      this.leagueDataService.updateSeason(this.seasonSnapshot)
      return
    }
    const round = this.seasonSnapshot.playoffSchedule[this.seasonSnapshot.playoffSchedule.length - 1]
    for (const matchup of round) {
      if (this.playoffScheduleGenerator.getPlayoffMatchupWinner(matchup)) {
        continue
      }
      let homeTeamId
      let awayTeamId
      if (matchup.gameIds.length % 2 === 0) {
        homeTeamId = matchup.higherSeedTeamId
        awayTeamId = matchup.lowerSeedTeamId
      } else {
        homeTeamId = matchup.lowerSeedTeamId
        awayTeamId = matchup.higherSeedTeamId
      }
      const homeGamePlayers = that.constructRoster(homeTeamId)
      const awayGamePlayers = that.constructRoster(matchup.higherSeedTeamId)
      const game = that.playGameService.playGame(homeGamePlayers, awayGamePlayers,
        homeTeamId, awayTeamId, that.seasonSnapshot._id, that.leagueId);
      const savedGame = await that.leagueDataService.createGame(game) as Game
      matchup.gameIds.push(savedGame._id)
      if (savedGame.homeTeamStats.runs > savedGame.awayTeamStats.runs) {
        if (homeTeamId === matchup.higherSeedTeamId) {
          matchup.higherSeedWins ++
        } else {
          matchup.lowerSeedWins ++
        }
      } else {
        if (awayTeamId === matchup.higherSeedTeamId) {
          matchup.higherSeedWins ++
        } else {
          matchup.lowerSeedWins ++
        }
      }
    }
    // that.processGameService.processPlayoffGame(savedGame)
    await that.completePlayoffDaySim(daysLeft)
  }

  async completePlayoffDaySim(daysLeft) {
    this.leagueDataService.updateLocalSeason(this.seasonSnapshot)
    if (this.playoffScheduleGenerator.isCurrentRoundDone()) {
      if (!this.playoffsCompleted()) {
        await this.playoffScheduleGenerator.generateNextRound(this.seasonSnapshot.playoffSchedule)
      }
      this.stopSimming()
    } else if (daysLeft === this.restOfPlayoffRound) {
      this.simPlayoffDays(daysLeft)
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
      return p.startingPosition && p.startingPosition.indexOf('S') === -1 ? null : p.startingPosition
    })
    let startingPitcherSet = false
    _.each(orderedPitchers, function(p: RosterSpot){
      const playerPitcher = _.find(teamPlayers, function(tp: Player){
        return tp._id === p.playerId
      })
      if (playerPitcher.currentStamina > 90 && !startingPitcherSet) {
        gamePlayers.push(new GamePlayer('P', null, 'P', playerPitcher));
        startingPitcherSet = true
      } else {
        gamePlayers.push(new GamePlayer(p.startingPosition, null, null, playerPitcher))
      }
    })
    _.each(gameTeam.roster.batters, function(rosterBatter){
      const playerBatter = _.find(teamPlayers, function(tp: Player){
        return tp._id === rosterBatter.playerId
      })
      gamePlayers.push(new GamePlayer(rosterBatter.startingPosition, rosterBatter.orderNumber, rosterBatter.startingPosition, playerBatter))
    })
    this.replaceTiredBatters(gamePlayers)
    return gamePlayers
  }

  replaceTiredBatters(gamePlayers: Array<GamePlayer>) {
    const that = this
    const playerToReplace = _.find(gamePlayers, function(gamePlayer) {
      return !!gamePlayer.orderNumber && gamePlayer.player.currentStamina < 30
    })
    if (playerToReplace) {
      const orderedPlayers = _.orderBy(gamePlayers, function(g) {
        return that.sharedFunctionsService.overallHittingOutOfPosition(g.player, playerToReplace.position)
      }, 'desc')
      const replacementPlayer = _.find(orderedPlayers, function(gp) {
        return gp.player.currentStamina >= 30 && !gp.position
      })
      if (!replacementPlayer) {
        return
      }
      replacementPlayer.position = playerToReplace.position
      replacementPlayer.played = playerToReplace.played
      replacementPlayer.orderNumber = playerToReplace.orderNumber
      playerToReplace.position = null
      playerToReplace.played = null
      playerToReplace.orderNumber = null
      this.replaceTiredBatters(gamePlayers)
    }
  }

  makeSureAllLineupsSet() {
    const that = this
    _.each(that.leagueDataService.teams, function(team){
      that.sharedFunctionsService.autoSetLineup(team)
    })
  }
}

