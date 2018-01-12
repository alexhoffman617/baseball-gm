import { Injectable } from '@angular/core';
import { Player, PitchingSkillset, PitcherSeasonStats } from '../models/player';
import { SharedFunctionsService } from '../services/shared-functions.service';

@Injectable()
export class PitcherProgressionService {
  kPerNineAvg = 8.35;
  kPerNineMin = 3;
  kPerNineMax = 14;
  bbPerNineAvg = 3.3;
  bbPerNineMin = 1;
  bbPerNineMax = 4.5;
  eraAvg = 4.00;
  eraMin = 1.75;
  eraMax = 6;
  whipAvg = 1.34;
  whipMin = .8;
  whipMax = 1.6;

  constructor(private sharedFunctionsService: SharedFunctionsService) {}

  progressPlayer(player: Player, seasonStats: PitcherSeasonStats) {
    const controlAgeChange = this.getAgeImprovement(player.pitchingAbility.control, player.pitchingPotential.control, player.age, 28);
    const movementAgeChange = this.getAgeImprovement(player.pitchingAbility.movement, player.pitchingPotential.movement, player.age, 28);
    const velocityAgeChange = this.getAgeImprovement(player.pitchingAbility.velocity, player.pitchingPotential.velocity, player.age, 26);
    const fieldingAgeChange = this.getAgeImprovement(player.hittingAbility.speed, player.hittingPotential.speed, player.age, 24);

    const controlPerformanceChange = this.getControlPerformanceImprovement(this.sharedFunctionsService.walksPerNine(seasonStats),
      player.pitchingAbility.control, player.pitchingPotential.control);
    const movementPerformanceChange = this.getMovementPerformanceImprovement(this.sharedFunctionsService.era(seasonStats),
     this.sharedFunctionsService.whip(seasonStats), player.pitchingAbility.movement, player.pitchingPotential.movement);
    const velocityPerformanceChange = this.getVelocityPerformanceImprovement(this.sharedFunctionsService.strikeoutsPerNine(seasonStats),
      player.pitchingAbility.velocity, player.pitchingPotential.velocity);
    const fieldingPerformanceChange = 0

    const controlChange = controlAgeChange + controlPerformanceChange;
    const movementChange = movementAgeChange + movementPerformanceChange;
    const velocityChange = velocityAgeChange + velocityPerformanceChange;
    const fieldingChange = fieldingAgeChange + fieldingPerformanceChange;
    return new PitchingSkillset(velocityChange, controlChange, movementChange, player.pitchingAbility.type);
  }

  getAgeImprovement(ability: number, potential: number, age: number, peakAge: number) {
    let x = peakAge - age;
    if (x < 0) {
      x = Math.round(x * 2);
    }
    return Math.round((potential - ability) / 2 * Math.random() * (8 - Math.min(8, Math.abs(x))) / 8);
  }

  getControlPerformanceImprovement(walkRate: number, ability: number, potential: number) {
    let walkRatePerformance
    if (walkRate > this.bbPerNineAvg) {
      walkRatePerformance = 50 - (walkRate - this.bbPerNineAvg) / (this.bbPerNineMax - this.bbPerNineAvg) * 50;
    } else {
      walkRatePerformance = 100 - (walkRate - this.bbPerNineMin) / (this.bbPerNineAvg - this.bbPerNineMin) * 50;
    }
    let walkRatePatienceImprovement = (walkRatePerformance - ability) * Math.random();
    if (walkRatePatienceImprovement > (potential - ability)) {
    walkRatePatienceImprovement = potential - ability;
    }
    return walkRatePatienceImprovement ? Math.round((walkRatePatienceImprovement ) / 2) : 0;
  }

  getVelocityPerformanceImprovement(strikeoutRate: number, ability: number, potential: number) {
    let strikeoutRatePerformance
    if (strikeoutRate > this.kPerNineAvg) {
      strikeoutRatePerformance = (strikeoutRate - this.kPerNineAvg) / (this.kPerNineMax - this.kPerNineAvg)
       * 50 + 50;
    } else {
      strikeoutRatePerformance = (strikeoutRate - this.kPerNineMin) / (this.kPerNineAvg - this.kPerNineMin)
       * 50;
    }
    let strikeoutRateImprovement = (strikeoutRatePerformance - ability) * Math.random();
    if (strikeoutRateImprovement > (potential - ability)) {
      strikeoutRateImprovement = potential - ability;
    }
    return strikeoutRateImprovement ? Math.round(strikeoutRateImprovement / 2) : 0;
  }

  getMovementPerformanceImprovement(era: number, whip: number, ability: number, potential: number) {
    let eraPerformance
    if (era > this.eraAvg) {
      eraPerformance = 50 - (era - this.eraAvg) / (this.eraMax - this.eraAvg) * 50;
    } else {
      eraPerformance = 100 - (era - this.eraMin) / (this.eraAvg - this.eraMin) * 50;
    }
    let eraImprovement = (eraPerformance - ability) * Math.random();
    if (eraImprovement > (potential - ability)) {
      eraImprovement = potential - ability;
    }

    let whipPerformance
    if (whip > this.whipAvg) {
      whipPerformance = (whip - this.whipAvg) / (this.whipMax - this.whipAvg) * 50 + 50;
    } else {
      whipPerformance = (whip - this.whipMin) / (this.whipAvg - this.whipMin) * 50;
    }
    let whipImprovement = (whipPerformance - ability) * Math.random();
    if (whipImprovement > (potential - ability)) {
      whipImprovement = potential - ability;
    }
    return whipImprovement ? Math.round(whipImprovement / 2) : 0;
  }

  getSpeedPerformanceImprovement(steal: number, ability: number, potential: number) {
    return 0;
  }

  getFieldingPerformanceImprovement(steal: number, ability: number, potential: number) {
    return 0;
  }
}
