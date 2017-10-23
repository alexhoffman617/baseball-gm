import { Injectable } from '@angular/core';
import { Season } from '../models/season';
import { Team } from '../models/team';
import { Game, AtBat, PitcherAppearance } from '../models/game';
import { BatterSeasonStats, PitcherSeasonStats } from '../models/season-stats';
import { Player, HittingProgression, PitchingProgression } from '../models/player';
import { PlayerProgressionService } from './player-progression.service';
import { PitcherProgressionService } from './pitcher-progression.service';
import { SeasonGenerator } from './season.generator';
import { PlayerService } from '../backendServices/player/player.service';
import { GameService } from '../backendServices/game/game.service';
import * as _ from 'lodash';
import 'rxjs/add/operator/first'

@Injectable()
export class LeagueProgressionService {

  constructor(private playerProgressionService: PlayerProgressionService,
              private pitcherProgressionService: PitcherProgressionService,
              private seasonGenerator: SeasonGenerator,
              private playerService: PlayerService,
              private gameService: GameService) { }

  async progressLeague(leagueId: string, currentSeason: Season, teams: Array<Team>) {
    const that = this
    const teamIds = new Array<string>()
    teams.forEach(team => {
      teamIds.push(team._id)
      that.playerService.getPlayersByTeamId(team._id).first().subscribe(teamPlayers => {
        team.roster.batters.forEach(batter => {
          const player = _.find(teamPlayers.data, {_id: batter.playerId}) as Player
          that.progressBatter(player, team._id, currentSeason)
        })
        team.roster.pitchers.forEach(pitcher => {
          const player = _.find(teamPlayers.data, {_id: pitcher.playerId}) as Player
          that.progressPitcher(player, team._id, currentSeason)
        })
      })
    })
    await that.seasonGenerator.generateSeason(leagueId, teamIds, currentSeason.year + 1)
  }

  progressPitcher(player: Player, teamId, currentSeason: Season) {
    let games = Array<Game>()
    this.gameService.getTeamsGamesBySeason(teamId, currentSeason._id).first().subscribe(g => {
      games = g.data as Array<Game>
      const playerEvents = new Array<PitcherAppearance>()
      _.each(games, function(game){
        _.each(game.homeTeamStats.pitcherAppearances, function(appearance){
          if (appearance.pitcherId === player._id) {
            playerEvents.push(appearance)
          }
        })
        _.each(game.awayTeamStats.pitcherAppearances, function(appearance){
          if (appearance.pitcherId === player._id) {
            playerEvents.push(appearance)
          }
        })
      })
      const seasonStats = new PitcherSeasonStats()
      seasonStats.buildSeasonStatsFromPitcherAppearances(player._id, playerEvents)
      const improvement = this.pitcherProgressionService.progressPlayer(player, seasonStats)
      if (!player.hittingProgressions) {
        player.hittingProgressions = []
      }
      player.pitchingProgressions.push(new PitchingProgression(currentSeason.year, improvement))
      player.age++
      this.playerService.updatePlayer(player)
    })
  }

  progressBatter(player: Player, teamId, currentSeason: Season) {
    let games = Array<Game>()
    this.gameService.getTeamsGamesBySeason(teamId, currentSeason._id).first().subscribe(g => {
      games = g.data as Array<Game>
      const playerEvents = new Array<AtBat>()
      _.each(games, function(game){
        _.each(game.homeTeamStats.events, function(event){
          if (event.batterId === player._id) {
            playerEvents.push(event.outcome)
          }
        })
        _.each(game.awayTeamStats.events, function(event){
          if (event.batterId === player._id) {
            playerEvents.push(event.outcome)
          }
        })
      })
      const seasonStats = new BatterSeasonStats()
      seasonStats.buildSeasonStatsFromGameEvents(player._id, playerEvents)
      const improvement = this.playerProgressionService.progressPlayer(player, seasonStats)
      if (!player.hittingProgressions) {
        player.hittingProgressions = []
      }
      player.hittingProgressions.push(new HittingProgression(currentSeason.year, improvement))
      player.age++
      this.playerService.updatePlayer(player)
    })
  }
}
