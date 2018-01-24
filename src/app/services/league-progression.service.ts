import { Injectable } from '@angular/core';
import { Season } from '../models/season';
import { Team } from '../models/team';
import { Game, AtBat, PitcherAppearance } from '../models/game';
import { Player, HittingProgression, PitchingProgression, BatterSeasonStats,
   PitcherSeasonStats, HittingSkillset, PitchingSkillset, FieldingSeasonStats } from '../models/player';
import { PlayerProgressionService } from './player-progression.service';
import { PitcherProgressionService } from './pitcher-progression.service';
import { SeasonGenerator } from './season.generator';
import { LeagueDataService } from './league-data.service';
import * as _ from 'lodash';
import { StaticListsService } from 'app/services/static-lists.service';

@Injectable()
export class LeagueProgressionService {

  constructor(private playerProgressionService: PlayerProgressionService,
              private pitcherProgressionService: PitcherProgressionService,
              private seasonGenerator: SeasonGenerator,
              private staticListsService: StaticListsService,
              private leagueDataService: LeagueDataService ) { }

  async progressLeague(leagueId: string, currentSeason: Season, teams: Array<Team>, structure) {
    const that = this
    that.leagueDataService.league.simming = true
    that.leagueDataService.updateLeague()
    const teamIds = _.map(teams, '_id')
    _.each(that.leagueDataService.players, function(player){
      (async () => {
        if (player.playerType === that.staticListsService.playerTypes.batter) {
          that.progressBatter(player, currentSeason)
        } else {
          that.progressPitcher(player, currentSeason)
        }
        await that.retirePlayerIfNeeded(player, currentSeason, teams)
      })();
    })
    that.leagueDataService.deleteAllGamesInSeason(currentSeason._id)
    await that.seasonGenerator.generateSeason(leagueId, teamIds, currentSeason.year + 1, structure)
    that.leagueDataService.league.simming = false
    that.leagueDataService.updateLeague()
  }

  progressPitcher(player: Player, currentSeason: Season) {
    const playerEvents = new Array<PitcherAppearance>()
    const seasonStats = _.find(player.pitchingSeasonStats, {year: currentSeason.year})
    const improvement = this.pitcherProgressionService.progressPlayer(player, seasonStats)
    if (!player.hittingProgressions) {
      player.hittingProgressions = []
    }
    player.pitchingProgressions.push(new PitchingProgression(currentSeason.year, improvement))
    this.progressPitcherAbility(player, improvement)
  }

  progressBatter(player: Player, currentSeason: Season) {
    const seasonStats = _.find(player.hittingSeasonStats, {year: currentSeason.year})
    const improvement = this.playerProgressionService.progressPlayer(player, seasonStats)
    if (!player.hittingProgressions) {
      player.hittingProgressions = []
    }
    player.hittingProgressions.push(new HittingProgression(currentSeason.year, improvement))
    this.progressBatterAbility(player, improvement)
  }

  resetBatterForNewYear(player: Player, currentSeason: Season) {
    player.age++
    player.currentStamina = 100
    player.hittingSeasonStats.push(new BatterSeasonStats(currentSeason.year + 1))
    player.pitchingSeasonStats.push(new PitcherSeasonStats(currentSeason.year + 1))
    player.fieldingSeasonStats.push(new FieldingSeasonStats(currentSeason.year + 1))
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

  async retirePlayerIfNeeded(player: Player, currentSeason: Season, teams: Array<Team>) {
    const that = this
    if (player.age > 35) {
      if (!this.playerPlayedInYear(player, currentSeason.year) && !player.teamId
          || Math.random() < .2 * (player.age - 35)) {
        await this.retirePlayer(player, currentSeason, teams)
      } else {
        that.resetBatterForNewYear(player, currentSeason)
      }
    } else if (player.age > 26) {
      if (player.hittingSeasonStats.length > 1
      && !this.playerPlayedInYear(player, currentSeason.year)
      && !this.playerPlayedInYear(player, currentSeason.year - 1)
      && !player.teamId) {
        await this.retirePlayer(player, currentSeason, teams)
      } else {
        that.resetBatterForNewYear(player, currentSeason)
      }
    } else {
      that.resetBatterForNewYear(player, currentSeason)
    }
  }

  playerPlayedInYear(player: Player, year: number) {
    if (_.find(player.hittingSeasonStats, {year: year}).gamesPlayed === 0
          && _.find(player.pitchingSeasonStats, {year: year}).appearances === 0) {
      return false
    } else {
      return true
    }
  }

  async retirePlayer(player: Player, currentSeason: Season, teams: Array<Team>) {
    player.retired = true
    player.lastYear = currentSeason.year
    if (player.teamId) {
      const playerType = player.playerType === this.staticListsService.playerTypes.batter ? 'batters' : 'pitchers'
      const team = _.find(teams, {_id: player.teamId})
      _.remove(team.roster[playerType], function(batter){
        return batter.playerId === player._id
      })
      await this.leagueDataService.updateTeam(team)
    }
    await this.leagueDataService.updatePlayer(player)
  }
}
