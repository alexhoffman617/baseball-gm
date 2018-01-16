import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats, GamePlayer, GameEvent, PitcherAppearance  } from '../models/game';
import { Player, PitcherSeasonStats, BatterSeasonStats  } from '../models/player';
import { LeagueDataService } from '../services/league-data.service';
import * as _ from 'lodash';

@Injectable()
export class ProcessGameService {
    constructor(private leagueDataService: LeagueDataService) {

    }

    processGame(game: Game) {
      this.processTeam(game.homeTeamStats, game.homeTeamId)
      this.processTeam(game.awayTeamStats, game.awayTeamId)
    }

    processTeam(teamStats: TeamStats, teamId: string) {
      const that = this
      const players = this.leagueDataService.getPlayersByTeamId(teamId)
      _.each(players, function(player){
        that.updateBatterSeasonStatsFromGameEvents(teamStats.events, player)
        player.currentStamina = Math.min(player.currentStamina + 10, 100)
      })
      _.each(teamStats.pitcherAppearances, function(appearance){
        const pitcher = _.find(players, { _id: appearance.pitcherId})
        that.updatePitcherSeasonStatsFromAppearances(appearance, pitcher)
        pitcher.currentStamina -= 50
      })

    }

    updateBatterSeasonStatsFromGameEvents(events: Array<GameEvent>, batter: Player) {
      const batterSeasonStats = _.find(batter.hittingSeasonStats,
           {year: this.leagueDataService.currentSeason.year})
      let gamePlayed = false
      _.each(events, function(event){
        if (event.batterId === batter._id) {
          gamePlayed = true
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
          if (event.outcome.result === 'sacrifice fly') {
            batterSeasonStats.sacrificeFlies++
          }
          if (event.outcome.batterScored) {
            batterSeasonStats.runs++
          }
          batterSeasonStats.rbis += event.outcome.scoredIds.length
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
      this.roundInnings(pitcherSeasonStats.innings)
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
      if (appearance.earnedRuns <= 3 && appearance.innings >= 6) {
        pitcherSeasonStats.qs++
      }
    }

    roundInnings(innings) {
      if (parseFloat((innings % 1).toFixed(1)) >= .3) {
        innings += .7
      }
      innings = parseFloat((innings).toFixed(1))
    }

}
