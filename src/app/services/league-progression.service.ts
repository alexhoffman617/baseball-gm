import { Injectable } from '@angular/core';
import { Season } from '../models/season';
import { Team } from '../models/team';
import { Game, AtBat, PitcherAppearance } from '../models/game';
import { Player, HittingProgression, PitchingProgression, BatterSeasonStats, PitcherSeasonStats, HittingSkillset, PitchingSkillset } from '../models/player';
import { PlayerProgressionService } from './player-progression.service';
import { PitcherProgressionService } from './pitcher-progression.service';
import { SeasonGenerator } from './season.generator';
import { LeagueDataService } from './league-data.service';
import * as _ from 'lodash';

@Injectable()
export class LeagueProgressionService {

  constructor(private playerProgressionService: PlayerProgressionService,
              private pitcherProgressionService: PitcherProgressionService,
              private seasonGenerator: SeasonGenerator,
              private leagueDataService: LeagueDataService ) { }

  async progressLeague(leagueId: string, currentSeason: Season, teams: Array<Team>, structure) {
    const that = this
    that.leagueDataService.league.simming = true
    that.leagueDataService.updateLeague()
    const teamIds = new Array<string>()
    teams.forEach(team => {
      teamIds.push(team._id)
      const teamPlayers = that.leagueDataService.getPlayersByTeamId(team._id) as Array<Player>
        team.roster.batters.forEach(batter => {
          const player = _.find(teamPlayers, {_id: batter.playerId})
          that.progressBatter(player, team._id, currentSeason)
        })
        team.roster.pitchers.forEach(pitcher => {
          const player = _.find(teamPlayers, {_id: pitcher.playerId})
          that.progressPitcher(player, team._id, currentSeason)
        })
    })
    await that.seasonGenerator.generateSeason(leagueId, teamIds, currentSeason.year + 1, structure)
    that.leagueDataService.league.simming = false
    that.leagueDataService.updateLeague()
  }

  progressPitcher(player: Player, teamId, currentSeason: Season) {
    const games = this.leagueDataService.getTeamsGamesBySeason(teamId, currentSeason._id)
    const playerEvents = new Array<PitcherAppearance>()
    const seasonStats = _.find(player.pitchingSeasonStats, {year: currentSeason.year})
    const improvement = this.pitcherProgressionService.progressPlayer(player, seasonStats)
    if (!player.hittingProgressions) {
      player.hittingProgressions = []
    }
    player.pitchingProgressions.push(new PitchingProgression(currentSeason.year, improvement))
    this.progressPitcherAbility(player, improvement)
    player.age++
    player.currentStamina = 100
    player.hittingSeasonStats.push(new BatterSeasonStats(currentSeason.year + 1))
    player.pitchingSeasonStats.push(new PitcherSeasonStats(currentSeason.year + 1))
    this.leagueDataService.updatePlayer(player)
  }

  progressBatter(player: Player, teamId, currentSeason: Season) {
    const games = this.leagueDataService.getTeamsGamesBySeason(teamId, currentSeason._id)
    const seasonStats = _.find(player.hittingSeasonStats, {year: currentSeason.year})
    const improvement = this.playerProgressionService.progressPlayer(player, seasonStats)
    if (!player.hittingProgressions) {
      player.hittingProgressions = []
    }
    player.hittingProgressions.push(new HittingProgression(currentSeason.year, improvement))
    this.progressBatterAbility(player, improvement)
    player.age++
    player.currentStamina = 100
    player.hittingSeasonStats.push(new BatterSeasonStats(currentSeason.year + 1))
    player.pitchingSeasonStats.push(new PitcherSeasonStats(currentSeason.year + 1))
    this.leagueDataService.updatePlayer(player)
  }

  progressBatterAbility(player: Player, improvement: HittingSkillset) {
    player.hittingAbility.contact += improvement.contact
    player.hittingAbility.fielding += improvement.fielding
    player.hittingAbility.patience += improvement.patience
    player.hittingAbility.power += improvement.power
    player.hittingAbility.speed += improvement.speed
  }

  progressPitcherAbility(player: Player, improvement: PitchingSkillset) {
    player.pitchingAbility.control += improvement.control
    player.pitchingAbility.movement += improvement.movement
    player.pitchingAbility.velocity += improvement.velocity
  }
}
