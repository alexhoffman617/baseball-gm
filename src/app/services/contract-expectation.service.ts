import { Injectable } from '@angular/core';
import { Player } from 'app/models/player';
import { StaticListsService } from 'app/services/static-lists.service';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import { LeagueDataService } from 'app/services/league-data.service';
import * as _ from 'lodash';
import { Contract } from 'app/models/contract';

@Injectable()
export class ContractExpectationService {

  constructor(private staticListsService: StaticListsService,
    private sharedFunctionsService: SharedFunctionsService,
    private leagueDataService: LeagueDataService) { }

  getContractExpectations(player: Player) {
    if (!player) {
      return
    }
    const contractAvv =  player.playerType === this.staticListsService.playerTypes.pitcher ? this.getPitcherContractExpectations(player) :
      this.getBatterContractExpectations(player)
    return new Contract(player._id, null, contractAvv, this.leagueDataService.currentSeason.year,
      this.leagueDataService.currentSeason.year + this.getContractLength(player) - 1)
  }

  getContractLength(player: Player) {
    const overall = player.playerType === this.staticListsService.playerTypes.batter ?
    this.sharedFunctionsService.overallHitting(player.hittingAbility) :
    this.sharedFunctionsService.overallPitching(player.pitchingAbility)
    const potential = player.playerType === this.staticListsService.playerTypes.batter ?
    this.sharedFunctionsService.overallHitting(player.hittingPotential) :
    this.sharedFunctionsService.overallPitching(player.pitchingPotential)
    if (potential < 25) {
      return 1
    } else if (potential < 35) {
      return 2
    }
    if (overall < 60) {
      const potentialDifference = Math.round((potential - overall) / 10)
      let years = 5 - potentialDifference;
      if (years < 2) {
        years = 2
      }
      return years
    } else if (player.age < 30) {
      return 8 - Math.round(((potential + 4) % 10) * .3)
    } else if (player.age < 35) {
      return 6 - Math.round(((potential + 7) % 10) * .2)
    } else {
      return 3 - Math.round(((potential + 7) % 10) * .2)
    }
  }

  getPitcherContractExpectations(player: Player) {
    const that = this
    const filteredPitchingStats = _.filter(player.pitchingSeasonStats, function(hss){
      return hss.appearances > 0 && hss.year !== that.leagueDataService.currentSeason.year
    })
    const orderedPitchingStats = _.orderBy(filteredPitchingStats, 'year', 'desc')
    let projectedWar: number
    const mostRecentWar = this.sharedFunctionsService.pitWar(orderedPitchingStats[0])
    const secondMostRecentWar = this.sharedFunctionsService.pitWar(orderedPitchingStats[1])
    if (secondMostRecentWar) {
      projectedWar = mostRecentWar * 2 / 3 + secondMostRecentWar * 1 / 3
    } else if (mostRecentWar) {
      projectedWar = mostRecentWar
    }
    const skillFactor = (this.sharedFunctionsService.overallPitching(player.pitchingAbility)
    + this.sharedFunctionsService.overallPitching(player.pitchingPotential)) / 20 - 1
    return this.getContractExpectationFromProjectedWarAndSkill(projectedWar, skillFactor)
  }

  getBatterContractExpectations(player: Player) {
    const that = this
    const filteredHittingStats = _.filter(player.hittingSeasonStats, function(hss){
      return hss.plateAppearences > 0 && hss.year !== that.leagueDataService.currentSeason.year
    })
    const orderedHittingStats = _.orderBy(filteredHittingStats, 'year', 'desc')
    const filteredFieldingStats = _.filter(player.fieldingSeasonStats, function(hss){
      return hss.year !== that.leagueDataService.currentSeason.year
    })
    const orderedFieldingStats = _.orderBy(filteredFieldingStats, 'year', 'desc')
    const mostRecentWar = this.sharedFunctionsService.batWar(orderedHittingStats[0], orderedFieldingStats[0])
    const secondMostRecentWar = this.sharedFunctionsService.batWar(orderedHittingStats[1], orderedFieldingStats[1])
    let projectedWar = 0
    if (secondMostRecentWar) {
      projectedWar = mostRecentWar * 2 / 3 + secondMostRecentWar * 1 / 3
    } else if (mostRecentWar) {
      projectedWar = mostRecentWar
    }
    const skillFactor = (this.sharedFunctionsService.overallHitting(player.hittingAbility)
    + this.sharedFunctionsService.overallHitting(player.hittingPotential)) / 20 - 3
    return this.getContractExpectationFromProjectedWarAndSkill(projectedWar, skillFactor)
  }

  getContractExpectationFromProjectedWarAndSkill(war, skillFactor) {
    let totalSalary = 0
    const salaryFactor = !war || war <= 0 ? skillFactor : war * .3 + skillFactor * .2
    for (let x = 1; x < salaryFactor + 1; x ++) {
      if (salaryFactor - x < 0) {
        totalSalary += 70 * (salaryFactor + 1 - x) * Math.pow(.9, x)
      } else {
        totalSalary += 70 * Math.pow(.9, x)
      }
    }
    return Math.max(Math.round(totalSalary) * 100000, 500000)
  }

}
