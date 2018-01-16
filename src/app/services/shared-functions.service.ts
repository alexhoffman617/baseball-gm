import { Injectable } from '@angular/core';
import { Player, PitchingSkillset, BatterSeasonStats, PitcherSeasonStats } from '../models/player';
import { LeagueDataService } from './league-data.service'
import * as _ from 'lodash';

@Injectable()
export class SharedFunctionsService {
  progressBarValue = 0
  loadingText = ''
  constructor(private leagueDataService: LeagueDataService) {}

  setLoading(percent: number, text: string) {
    this.progressBarValue = percent
    this.loadingText = text
  }

  era(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 : Math.round(9 * pss.earnedRuns / pss.innings * 1000) / 1000 }
  whip(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 : Math.round((pss.walks + pss.hits) / pss.innings * 1000) / 1000 }
  pitchbabip(pss: PitcherSeasonStats) { return !pss ? 0 : 0 }
  walksPerNine(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 : 9 * pss.walks / pss.innings }
  strikeoutsPerNine(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 : 9 * pss.strikeouts / pss.innings }


  walkPercentage(bss: BatterSeasonStats) { return !bss  || bss.plateAppearences === 0 ? 0 : bss.walks / bss.plateAppearences }
  strikeoutPercentage(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0 ? 0 : bss.strikeouts / bss.plateAppearences }
  atBats(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0 ? 0  : bss.plateAppearences - bss.walks }
  hits(bss: BatterSeasonStats) { return !bss ? 0 : bss.singles + bss.doubles + bss.triples + bss.homeruns }
  average(bss: BatterSeasonStats) { return !bss || this.atBats(bss) === 0 ? 0 :
          Math.round( this.hits(bss) / this.atBats(bss) * 1000) / 1000 }
  obp(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0 ? 0
       : Math.round((this.hits(bss) + bss.walks) / bss.plateAppearences * 1000) / 1000 }
  slg(bss: BatterSeasonStats) { return !bss || this.atBats(bss) === 0  ? 0 :
    Math.round((bss.singles + bss.doubles * 2 + bss.triples * 3 + bss.homeruns * 4) / this.atBats(bss) * 1000) / 1000 }
  batbabip(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0  ? 0 :
    Math.round((this.hits(bss) - bss.homeruns) / (this.atBats(bss) - bss.strikeouts - bss.homeruns + bss.sacrificeFlies) * 1000) / 1000 }
  woba(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0 ? 0 :
    Math.round((.7 * bss.walks + .9 * bss.singles + 1.25 * bss.doubles + 1.6 * bss.triples + 2 * bss.homeruns)
     / bss.plateAppearences * 1000) / 1000 }

    getWins(teamId) {
    let wins = 0;
    if (!this.leagueDataService.currentSeason) {
      return wins
    }
    _.each(this.leagueDataService.currentSeason.schedule, function(scheduledDay){
      const game = _.find(scheduledDay.scheduledGames, function(g){
        return g.homeTeamId === teamId || g.awayTeamId === teamId;
      });
      if ((game.homeTeamId === teamId && game.homeTeamScore > game.awayTeamScore)
          || (game.awayTeamId === teamId && game.awayTeamScore > game.homeTeamScore) ) {
        wins++;
      }
    })
    return wins;
  }

  getLosses(teamId) {
    let losses = 0;
    if (!this.leagueDataService.currentSeason) {
      return losses
    }
    _.each(this.leagueDataService.currentSeason.schedule, function(scheduledDay){
      const game = _.find(scheduledDay.scheduledGames, function(g){
        return g.homeTeamId === teamId || g.awayTeamId === teamId;
      });
      if ((game.homeTeamId === teamId && game.homeTeamScore < game.awayTeamScore)
          || (game.awayTeamId === teamId && game.awayTeamScore < game.homeTeamScore) ) {
        losses++;
      }
    })
    return losses;
  }


  getRecordOrderedTeams() {
    const that = this
    return _.orderBy(this.leagueDataService.teams, function(team){
      return that.getWins(team._id)
    }, 'desc')
  }

  getRecordOrderedTeamsById(teamIds: Array<string>) {
    const that = this
    const resultArray = []
    const orderedTeamId = _.orderBy(teamIds, function(teamId){
      return that.getWins(teamId)
    }, 'desc')
    _.each(orderedTeamId, function(id){
      resultArray.push(that.leagueDataService.getTeamById(id))
    })
    return resultArray
  }
}
