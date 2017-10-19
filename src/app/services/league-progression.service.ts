import { Injectable } from '@angular/core';
import { Season } from '../models/season';
import { Team } from '../models/team';
import { Game, AtBat } from '../models/game';
import { SeasonStats } from '../models/season-stats';
import { Player, HittingProgression } from '../models/player';
import { PlayerProgressionService } from './player-progression.service';
import { SeasonGenerator } from './season.generator';
import { PlayerService } from '../backendServices/player/player.service';
import { GameService } from '../backendServices/game/game.service';
import * as _ from 'lodash';
import 'rxjs/add/operator/first'

@Injectable()
export class LeagueProgressionService {

  constructor(private playerProgressionService: PlayerProgressionService,
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
          that.progressPlayer(player, team._id, currentSeason)
        })
      })
    })
    await that.seasonGenerator.generateSeason(leagueId, teamIds, currentSeason.year + 1)
  }

  progressPlayer(player: Player, teamId, currentSeason: Season) {
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
      const seasonStats = new SeasonStats()
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
