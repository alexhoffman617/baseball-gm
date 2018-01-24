import { Injectable } from '@angular/core';
import { Player, HittingSkillset, BatterSeasonStats } from '../models/player';
import { SharedFunctionsService } from '../services/shared-functions.service';

@Injectable()
export class PlayerProgressionService {
  leagueStrikeOutFreq = 0.203563;
  leagueMinStrikeOutFreq = .07;
  leagueMaxStrikeOutFreq = .33;
  leagueOutFreq = 0.479726;
  leagueWalkFreq = 0.090562;
  leagueMinWalkFreq = 0
  leagueMaxWalkFreq = .2
  leagueHRFreq = 0.022758;
  leagueMinHRFreq = 0.005;
  leagueMaxHRFreq = 0.075
  leagueTripleFreq = 0.004615;
  leagueMinTripleFreq = 0;
  leagueMaxTripleFreq = .0225;
  leagueDoubleFreq = 0.044240;
  leagueMinDoubleFreq = .025
  leagueMaxDoubleFreq = .075;
  leagueHitFreq = 0.23;
  leagueMaxHitFreq = .285;
  leagueMinHitFreq = .17;
  leagueMinAvg = .2;
  leagueAvgAvg = .255;
  leagueMaxAvg = .35;
  leagueMaxSlg = .500;
  leagueMinSlg = .300;
  leagueAvgSlg = .400;
  constructor(private sharedFunctionsService: SharedFunctionsService) {}

  progressPlayer(player: Player, seasonStats: BatterSeasonStats) {
    const contactAgeChange = this.getAgeImprovement(player.hittingAbility.contact, player.hittingPotential.contact, player.age, 26);
    const powerAgeChange = this.getAgeImprovement(player.hittingAbility.power, player.hittingPotential.power, player.age, 26);
    const patienceAgeChange = this.getAgeImprovement(player.hittingAbility.patience, player.hittingPotential.patience, player.age, 28);
    const speedAgeChange = this.getAgeImprovement(player.hittingAbility.speed, player.hittingPotential.speed, player.age, 24);
    const fieldingAgeChange = this.getAgeImprovement(player.hittingAbility.speed, player.hittingPotential.speed, player.age, 24);

    const contactPerformanceChange = this.getContactPerformanceImprovement(this.sharedFunctionsService.strikeoutPercentage(seasonStats),
       this.sharedFunctionsService.average(seasonStats), player.hittingAbility.contact,
       player.hittingPotential.contact, seasonStats.plateAppearences);
    const powerPerformanceChange = this.getPowerPerformanceImprovement(this.sharedFunctionsService.slg(seasonStats), seasonStats.homeruns,
      player.hittingAbility.power, player.hittingPotential.power, seasonStats.plateAppearences);
    const patiencePerformanceChange = this.getPatiencePerformanceImprovement(this.sharedFunctionsService.walkPercentage(seasonStats),
     player.hittingAbility.patience, player.hittingPotential.patience, seasonStats.plateAppearences);
    const speedPerformanceChange = this.getSpeedPerformanceImprovement(seasonStats.steals, player.hittingAbility.speed,
      player.hittingPotential.speed, seasonStats.plateAppearences);
    const fieldingPerformanceChange = this.getSpeedPerformanceImprovement(seasonStats.steals, player.hittingAbility.speed,
      player.hittingPotential.speed, seasonStats.plateAppearences);

    const contactChange = Math.max(contactAgeChange + contactPerformanceChange, 1 - player.hittingAbility.contact);
    const powerChange = Math.max(powerAgeChange + powerPerformanceChange, 1 - player.hittingAbility.power);
    const speedChange = Math.max(speedAgeChange + speedPerformanceChange, 1 - player.hittingAbility.speed);
    const patienceChange = Math.max(patienceAgeChange + patiencePerformanceChange, 1 - player.hittingAbility.patience);
    const fieldingChange = Math.max(fieldingAgeChange + fieldingPerformanceChange, 1 - player.hittingAbility.fielding);
    return new HittingSkillset(contactChange, powerChange, patienceChange, speedChange, fieldingPerformanceChange);
  }

  getAgeImprovement(ability: number, potential: number, age: number, peakAge: number) {
    let x = peakAge - age;
    if (x < 0) {
      x = Math.round(x * 2);
    }
    return Math.round((potential - ability) / 2 * Math.random() * (8 - Math.min(8, Math.abs(x))) / 8);
  }

  getContactPerformanceImprovement(kRate: number, avg: number, ability: number, potential: number, plateAppearances: number) {
    let kRatePerformance
    if (kRate > this.leagueStrikeOutFreq) {
      kRatePerformance = 50 - (kRate - this.leagueStrikeOutFreq) / (this.leagueMaxStrikeOutFreq - this.leagueStrikeOutFreq) * 50;
    } else {
      kRatePerformance = 100 - (kRate - this.leagueMinStrikeOutFreq) / (this.leagueStrikeOutFreq - this.leagueMinStrikeOutFreq) * 50;
    }
    let kRateContactImprovement = (kRatePerformance - ability) * Math.random();
    if (kRateContactImprovement > (potential - ability)) {
      kRateContactImprovement = potential - ability;
    }
    let avgPerformance
    if (avg > this.leagueAvgAvg) {
      avgPerformance = (avg - this.leagueAvgAvg) / (this.leagueMaxAvg - this.leagueAvgAvg) * 50 + 50;
    } else {
      avgPerformance = (avg - this.leagueMinAvg) / (this.leagueAvgAvg - this.leagueMinAvg) * 50
    }
    let avgContactImprovement = (avgPerformance - ability) * Math.random();
    if (avgContactImprovement > (potential - ability)) {
      avgContactImprovement = potential - ability;
    }
    return kRateContactImprovement + avgContactImprovement
      ? Math.round((kRateContactImprovement + avgContactImprovement) / 4 * Math.min(plateAppearances / 300, 1))
      : 0
  }

  getPowerPerformanceImprovement(slg: number, hr: number, ability: number, potential: number, plateAppearances: number) {
    let slgPerformance
    if (slg > this.leagueAvgSlg) {
      slgPerformance = (slg - this.leagueAvgSlg) / (this.leagueMaxSlg - this.leagueAvgSlg) * 50 + 50;
    } else {
      slgPerformance = (slg - this.leagueMinSlg) / (this.leagueAvgSlg - this.leagueMinSlg) * 50;
    }
    let slgPowerImprovement = (slgPerformance - ability) * Math.random();
    if (slgPowerImprovement > (potential - ability)) {
      slgPowerImprovement = potential - ability;
    }
    let hrPerformance
    if (hr > 18) {
      hrPerformance = (hr - 18) / (45 - 18) * 50 + 50;
    } else {
      hrPerformance = (hr - 0) / (18 - 0) * 50;
    }
    let hrPowerImprovement = (hrPerformance - ability) * Math.random();
    if (hrPowerImprovement > (potential - ability)) {
      hrPowerImprovement = potential - ability;
    }
    return slgPowerImprovement + hrPowerImprovement
    ? Math.round((slgPowerImprovement + hrPowerImprovement) / 4 * Math.min(plateAppearances / 300, 1))
    : 0;
  }

  getPatiencePerformanceImprovement(walkRate: number, ability: number, potential: number, plateAppearances: number) {
    let walkRatePerformance
    if (walkRate > this.leagueWalkFreq) {
      walkRatePerformance = (walkRate - this.leagueWalkFreq) / (this.leagueMaxWalkFreq - this.leagueWalkFreq) * 50 + 50;
    } else {
      walkRatePerformance = (walkRate - this.leagueMinWalkFreq) / (this.leagueWalkFreq - this.leagueMinWalkFreq) * 50;
    }
    let walkRatePatienceImprovement = (walkRatePerformance - ability) * Math.random();
    if (walkRatePatienceImprovement > (potential - ability)) {
    walkRatePatienceImprovement = potential - ability;
    }
    return walkRatePatienceImprovement ? Math.round((walkRatePatienceImprovement ) / 2  * Math.min(plateAppearances / 300, 1)) : 0;
  }

  getSpeedPerformanceImprovement(steal: number, ability: number, potential: number, plateAppearances: number) {
    return 0;
  }

  getFieldingPerformanceImprovement(steal: number, ability: number, potential: number, plateAppearances: number) {
    return 0;
  }
}
