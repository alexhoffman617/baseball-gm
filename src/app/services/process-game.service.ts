import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats, GamePlayer, GameEvent, PitcherAppearance  } from '../models/game';
import { Player, PitcherSeasonStats, BatterSeasonStats  } from '../models/player';
import { LeagueDataService } from '../services/league-data.service';
import * as _ from 'lodash';

@Injectable()
export class ProcessGameService {
    constructor(private leagueDataService: LeagueDataService) {

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
        that.updatePitcherSeasonStatsFromAppearances(appearance, pitcher)
        pitcher.currentStamina -= 50
      })
      _.each(players, function(player){
        that.updateBatterSeasonStatsFromGameEvents(teamStats.events, player)
        that.updateFieldingStatsFromGameEvents(otherTeamStats.events, player, gamePlayers)
        player.currentStamina = Math.min(player.currentStamina + 10, 100)
      })
    }

    updateBatterSeasonStatsFromGameEvents(events: Array<GameEvent>, batter: Player) {
      const batterSeasonStats = _.find(batter.hittingSeasonStats,
           {year: this.leagueDataService.currentSeason.year})
      let gamePlayed = false
      _.each(events, function(event){
        if (event.batterId === batter._id) {
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
        if (event.stolenBaseAttempt && event.stolenBaseAttempt.runnerId === batter._id) {
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
    }

    updatePitcherSeasonStatsFromAppearances(appearance: PitcherAppearance, pitcher: Player) {
      const pitcherSeasonStats = _.find(pitcher.pitchingSeasonStats,
          {year: this.leagueDataService.currentSeason.year})
      pitcherSeasonStats.appearances++
      if (appearance.start) {
        pitcherSeasonStats.starts++
      }
      pitcherSeasonStats.innings += appearance.innings
      pitcherSeasonStats.innings = this.roundInnings(pitcherSeasonStats.innings)
      pitcherSeasonStats.strikeouts += appearance.strikeouts
      pitcherSeasonStats.walks += appearance.walks
      pitcherSeasonStats.hits += appearance.hits
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

    updateFieldingStatsFromGameEvents(otherTeamEvents: Array<GameEvent>, player: Player, gamePlayers: Array<GamePlayer>) {
      const fieldingSeasonStats = _.find(player.fieldingSeasonStats,
        {year: this.leagueDataService.currentSeason.year})
      _.each(otherTeamEvents, function(event){
        if (event.outcome && event.outcome.fielderId === player._id) {
          if (event.outcome.result === 'out') {
            fieldingSeasonStats.putOuts++
          } else if (event.outcome.result === 'error') {
            fieldingSeasonStats.errors++
          }
        }
      })
      const gamePlayer = _.find(gamePlayers, function(gp){
        return gp.player._id === player._id
      })
      if (gamePlayer.played) {
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
