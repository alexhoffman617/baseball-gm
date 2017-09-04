import { Injectable } from '@angular/core';
import { Player, HittingSkillset } from '../models/player';
import { SeasonStats } from '../models/season-stats';

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
	constructor() {}

	progressPlayer(player: Player, seasonStats: SeasonStats){
		var contactAgeChange = this.getPerformanceImprovementByAge(player.hittingAbility.contact, player.hittingPotential.contact, player.age, 26);
		var powerAgeChange = this.getPerformanceImprovementByAge(player.hittingAbility.power, player.hittingPotential.power, player.age, 26);
		var patienceAgeChange = this.getPerformanceImprovementByAge(player.hittingAbility.patience, player.hittingPotential.patience, player.age, 28);
		var speedAgeChange = this.getPerformanceImprovementByAge(player.hittingAbility.speed, player.hittingPotential.speed, player.age, 24);
		
		var contactPerformanceChange = this.getContactPerformanceImprovement(seasonStats.strikeoutPercentage, seasonStats.average,
			 player.hittingAbility.contact, player.hittingPotential.contact);
		var powerPerformanceChange = this.getPowerPerformanceImprovement(seasonStats.slg, seasonStats.homeruns,
			player.hittingAbility.power, player.hittingPotential.power);
		var patiencePerformanceChange = this.getPatiencePerformanceImprovement(seasonStats.walkPercentage, player.hittingAbility.patience, 
			player.hittingPotential.patience);
		var speedPerformanceChange = this.getSpeedPerformanceImprovement(seasonStats.steals, player.hittingAbility.speed, 
			player.hittingPotential.speed);

		var contactChange = contactAgeChange + contactPerformanceChange;
		var powerChange = powerAgeChange + powerPerformanceChange;
		var speedChange = speedAgeChange + speedPerformanceChange;
		var patienceChange = patienceAgeChange + patiencePerformanceChange;
		return new HittingSkillset(contactChange, powerChange, patienceChange, speedChange);
	}

	getPerformanceImprovementByAge(ability: number, potential: number, age: number, peakAge: number){
		var x = peakAge - age;
		if(x < 0){
			x = Math.round(x * 2);
		}
		return Math.round((potential - ability) / 2 * Math.random() * (8 - Math.min(8, Math.abs(x))) / 8);
	}

	getContactPerformanceImprovement(kRate: number, avg: number, ability: number, potential: number){
		if(kRate > this.leagueStrikeOutFreq){
			var kRatePerformance = 50 - (kRate - this.leagueStrikeOutFreq) / (this.leagueMaxStrikeOutFreq - this.leagueStrikeOutFreq) * 50;
		} else {
			var kRatePerformance = 100 - (kRate - this.leagueMinStrikeOutFreq) / (this.leagueStrikeOutFreq - this.leagueMinStrikeOutFreq) * 50;
		}
		var kRateContactImprovement = (kRatePerformance - ability) * Math.random();
		if(kRateContactImprovement > (potential - ability)){
			kRateContactImprovement = potential - ability;
		}
		if(avg > this.leagueAvgAvg){
			var avgPerformance = (avg - this.leagueAvgAvg) / (this.leagueMaxAvg - this.leagueAvgAvg) * 50 + 50;
		} else{
			var avgPerformance = (avg - this.leagueMinAvg) / (this.leagueAvgAvg - this.leagueMinAvg) * 50
		}
		var avgContactImprovement =(avgPerformance - ability) * Math.random();
		if(avgContactImprovement > (potential - ability)){
			avgContactImprovement = potential - ability;
		}
		return Math.round((kRateContactImprovement + avgContactImprovement) / 4);
	}

	getPowerPerformanceImprovement(slg: number, hr: number, ability: number, potential: number){
		if(slg > this.leagueAvgSlg){
			var slgPerformance = (slg - this.leagueAvgSlg) / (this.leagueMaxSlg - this.leagueAvgSlg) * 50 + 50;
		} else {
			var slgPerformance = (slg - this.leagueMinSlg) / (this.leagueAvgSlg - this.leagueMinSlg) * 50;
		}
		var slgPowerImprovement = (slgPerformance - ability) * Math.random();
		if(slgPowerImprovement > (potential - ability)){
			slgPowerImprovement = potential - ability;
		}
		if(hr > 18){
			var hrPerformance = (hr - 18) / (45 - 18) * 50 + 50;
		} else {
			var hrPerformance = (hr - 0) / (18 - 0) * 50;
		}
		var hrPowerImprovement =(hrPerformance - ability) * Math.random();
		if(hrPowerImprovement > (potential - ability)){
			hrPowerImprovement = potential - ability;
		}
		return Math.round((slgPowerImprovement + hrPowerImprovement) / 4);
	}

	getPatiencePerformanceImprovement(walkRate: number, ability: number, potential: number){
		if(walkRate > this.leagueWalkFreq){
			var walkRatePerformance = (walkRate - this.leagueWalkFreq) / (this.leagueMaxWalkFreq - this.leagueWalkFreq) * 50 + 50;
		} else {
			var walkRatePerformance = (walkRate - this.leagueMinWalkFreq) / (this.leagueWalkFreq - this.leagueMinWalkFreq) * 50;
		}
		var walkRatePatienceImprovement = (walkRatePerformance - ability) * Math.random();
		if(walkRatePatienceImprovement > (potential - ability)){
			walkRatePatienceImprovement = potential - ability;
		}
		return Math.round((walkRatePatienceImprovement ) / 2);
	}

	getSpeedPerformanceImprovement(steal: number, ability: number, potential: number){
		return 0;
	}
}