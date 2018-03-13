import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats, GamePlayer, GameEvent, PitcherAppearance  } from '../models/game';
import { Player, PitcherSeasonStats, BatterSeasonStats, FieldingSeasonStats  } from '../models/player';
import { LeagueDataService } from '../services/league-data.service';
import * as _ from 'lodash';
import { StaticListsService } from './static-lists.service';

@Injectable()
export class ProcessGameService {
    constructor(private leagueDataService: LeagueDataService, private staticListsService: StaticListsService) {

    }

    processGame(game: Game, homeGamePlayers: Array<GamePlayer>, awayGamePlayers: Array<GamePlayer>) {
      this.processTeam(game.homeTeamStats, game.homeTeamId, game.awayTeamStats, homeGamePlayers)
      this.processTeam(game.awayTeamStats, game.awayTeamId, game.homeTeamStats, awayGamePlayers)
    }

    processTeam(teamStats: TeamStats, teamId: string, otherTeamStats: TeamStats, gamePlayers: Array<GamePlayer>) {
      const that = this
      const players = this.leagueDataService.getPlayersByTeamId(teamId)
      _.each(teamStats.pitcherAppearances, function(appearance){
        const pitcher = _.find(players, { _id: appearance.pitcherId})
        const pitcherSeasonStats = _.find(pitcher.pitchingSeasonStats,
          {year: that.leagueDataService.currentSeason.year})
        that.updatePitcherSeasonStatsFromAppearances(appearance, pitcherSeasonStats)
        that.updatePitcherSeasonStatsFromAppearances(appearance, that.leagueDataService.currentSeason.seasonStats.seasonPitchingStats)
        if (appearance.start) {
          pitcher.currentStamina = 0
        } else {
          pitcher.currentStamina = Math.max(pitcher.currentStamina - (20 + appearance.pitches), 0)
        }
      })
      _.each(players, function(player){
        const batterSeasonStats = _.find(player.hittingSeasonStats,
          {year: that.leagueDataService.currentSeason.year})
        const playerPlayed = that.updateBatterSeasonStatsFromGameEvents(teamStats.events, batterSeasonStats, player._id)
        that.updateBatterSeasonStatsFromGameEvents(teamStats.events,
          that.leagueDataService.currentSeason.seasonStats.seasonBattingStats, player._id)
        const fieldingSeasonStats = _.find(player.fieldingSeasonStats,
          {year: that.leagueDataService.currentSeason.year})
        that.updateFieldingStatsFromGameEvents(otherTeamStats.events, gamePlayers, fieldingSeasonStats, player._id)
        that.updateFieldingStatsFromGameEvents(otherTeamStats.events, gamePlayers,
          that.leagueDataService.currentSeason.seasonStats.seasonFieldingStats, player._id)
        if (player.playerType === that.staticListsService.playerTypes.pitcher) {
          player.currentStamina = Math.min(player.currentStamina + 20, 100)
        } else {
          if (playerPlayed) {
            player.currentStamina = Math.max(player.currentStamina - Math.round((13 - player.hittingAbility.stamina / 10) * Math.random()),
            0)
          } else {
            player.currentStamina = Math.min(player.currentStamina + 50, 100)
          }
        }
      })
    }

    updateBatterSeasonStatsFromGameEvents(events: Array<GameEvent>, batterSeasonStats: BatterSeasonStats, batterId: string) {

      let gamePlayed = false
      _.each(events, function(event){
        if (event.batterId === batterId) {
          gamePlayed = true
          if (event.outcome.result === 'sacrifice fly') {
            batterSeasonStats.sacrificeFlies++
          } else {
            batterSeasonStats.plateAppearences++
            if (event.outcome.result === 'single') {
              batterSeasonStats.singles++
            }
            if (event.outcome.result === 'double') {
              batterSeasonStats.doubles++
            }
            if (event.outcome.result === 'triple') {
              batterSeasonStats.triples++
            }
            if (event.outcome.result === 'homerun') {
              batterSeasonStats.homeruns++
            }
            if (event.outcome.result === 'strikeout') {
              batterSeasonStats.strikeouts++
            }
            if (event.outcome.result === 'walk') {
              batterSeasonStats.walks++
            }
            if (event.outcome.batterScored) {
              batterSeasonStats.runs++
            }
          }
          batterSeasonStats.rbis += event.outcome.scoredIds.length
        }
        if (event.stolenBaseAttempt && event.stolenBaseAttempt.runnerId === batterId) {
          if (event.stolenBaseAttempt.successful) {
            batterSeasonStats.steals++
          } else {
            batterSeasonStats.caughtStealing++
          }
        }
      })
      if (gamePlayed) {
        batterSeasonStats.gamesPlayed ++
      }
      return gamePlayed
    }

    updatePitcherSeasonStatsFromAppearances(appearance: PitcherAppearance, pitcherSeasonStats: PitcherSeasonStats) {
      pitcherSeasonStats.appearances++
      if (appearance.start) {
        pitcherSeasonStats.starts++
      }
      pitcherSeasonStats.innings += appearance.innings
      pitcherSeasonStats.innings = this.roundInnings(pitcherSeasonStats.innings)
      pitcherSeasonStats.strikeouts += appearance.strikeouts
      pitcherSeasonStats.walks += appearance.walks
      pitcherSeasonStats.hits += appearance.hits
      pitcherSeasonStats.homeruns += appearance.homeruns
      pitcherSeasonStats.iffb += appearance.iffb
      pitcherSeasonStats.earnedRuns += appearance.earnedRuns
      pitcherSeasonStats.runs += appearance.runs
      if (appearance.win) {
        pitcherSeasonStats.wins++
      }
      if (appearance.loss) {
        pitcherSeasonStats.losses++
      }
      if (appearance.save) {
        pitcherSeasonStats.saves++
      }
      if (appearance.hold) {
        pitcherSeasonStats.holds++
      }
      if (appearance.start && appearance.earnedRuns <= 3 && appearance.innings >= 6) {
        pitcherSeasonStats.qs++
      }
    }

    updateFieldingStatsFromGameEvents(otherTeamEvents: Array<GameEvent>,
      gamePlayers: Array<GamePlayer>, fieldingSeasonStats: FieldingSeasonStats, playerId: string) {
      _.each(otherTeamEvents, function(event){
        if (event.outcome && event.outcome.fielderId === playerId) {
          if (event.outcome.result === 'out') {
            fieldingSeasonStats.putOuts++
          } else if (event.outcome.result === 'error') {
            fieldingSeasonStats.errors++
          }
        }
      })
      const gamePlayer = _.find(gamePlayers, function(gp){
        return gp.player._id === playerId
      })
      if (gamePlayer && gamePlayer.played) {
        fieldingSeasonStats.appearances[gamePlayer.played]++
      }
    }

    roundInnings(innings) {
      if (parseFloat((innings % 1).toFixed(1)) >= .3) {
        innings += .7
      }
      return parseFloat((innings).toFixed(1))
    }

}
