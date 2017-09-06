import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats, GamePlayer  } from '../models/game';
import * as _ from "lodash";

@Injectable()
export class AtBatService {
    gbpct = .45;
    ldpct = .2;
    fbpct = .25;
		iffbpct = .1;
		pullPct = .40;
  	centPct = .35;
 		oppPct = .25;
    constructor() { 
        
    }

    getSoftPercentage(skill){
    if(skill <= 30){
      return .27;
    } else{
      return (65 - (skill - 35)) / 65 * (.3 - .07) + .07;
    }
  }
  
  getModifierPercentage(min, max, skill, isNegative){
    if(isNegative){
      return (100 - skill) / 100 * (max - min);
    } else {
      return (skill) / 100 * (max - min);
    }
	}

	getTrajectoryPercentage(pitcher, trajectoryType){
		if(trajectoryType == "gb"){
			if(pitcher.pitchingAbility.type == "gb"){
				return this.gbpct + ((pitcher.pitchingAbility.movement - 25) / 75 * .1)
			} else if(pitcher.pitchingAbility.type == "fb"){
				return this.gbpct - ((pitcher.pitchingAbility.movement - 25) / 75 * .075)
			} else {
				return this.gbpct;
			}
		} else if(trajectoryType == "ld"){
			if(pitcher.pitchingAbility.type == "gb"){
				return this.ldpct - ((pitcher.pitchingAbility.movement - 25) / 75 * .05)
			} else if(pitcher.pitchingAbility.type == "fb"){
				return this.ldpct - ((pitcher.pitchingAbility.movement - 25) / 75 * .05);
			} else {
				return this.ldpct;
			}
		} else if (trajectoryType == "fb"){
			if(pitcher.pitchingAbility.type == "gb"){
				return this.fbpct - ((pitcher.pitchingAbility.movement - 25) / 75 * .05)
			} else if(pitcher.pitchingAbility.type == "fb"){
				return this.fbpct + ((pitcher.pitchingAbility.movement - 25) / 75 * .1)
			} else {
				return this.fbpct;
			}
		}
	}
  
  getHitType(homerun, speed, double){
    var hitTypeRand = Math.random();
    var triple = speed > 50 ? .025 + (speed - 50) / 50 * .15 : .025;
    if(hitTypeRand < homerun){
      return "homerun";
    } else if(hitTypeRand < triple){
      return "triple";
    } else if(hitTypeRand < double){
      return "double";
    } else {
      return "single";
    }
	}
	
	getErrorChance(trajectory, contactQuality, isHomeTeam, fielder){
    var probability;
    if(contactQuality == "soft"){
      probability = .015;
    } else if(contactQuality == "medium"){
      probability = .02;
    } else {
      probability = .035;
    }
    
    if(trajectory == "gb"){
      probability = probability * 1.5;
    } else if(trajectory == "fb"){
      probability = probability *.5;
    }
    
    if(!isHomeTeam){
      probability += .005
    }
    return probability;
  }
	
	getHitDirection(battingSide){
    var directionRand = Math.random();
    if(directionRand < this.pullPct){
      return battingSide == "L" ? "right" : "left";
    } else if(directionRand < this.pullPct + this.centPct){
      return "center";
    } else {
      return battingSide == "R" ? "left" : "right";
    }
	}
	
	getFielder(fieldingTeam: Array<GamePlayer>, hitDirection, trajectory){
		var rand = Math.random();
		if(hitDirection == "left"){
			if(trajectory == "gb"){
				if(rand < .5){			
					return _.find(fieldingTeam, function(player){
						return player.position == "3B";
					}).player;
				} else {
					return _.find(fieldingTeam, function(player){
						return player.position == "SS";
					}).player;
				}
			} else if(trajectory == "ld"){
				if(rand < .7){
					return _.find(fieldingTeam, function(player){
						return player.position == "LF";
					}).player;
				} else if(rand < .85){
					return _.find(fieldingTeam, function(player){
						return player.position == "3B";
					}).player;
				} else{
					return _.find(fieldingTeam, function(player){
						return player.position == "SS";
					}).player;
				}
			} else{
				return _.find(fieldingTeam, function(player){
					return player.position == "LF";
				}).player;
			}
		} else if(hitDirection == "center"){
			if(trajectory == "gb"){
				if(rand < .45){
					return _.find(fieldingTeam, function(player){
						return player.position == "2B";
					}).player;
				} else if(rand < .9)  {
					return _.find(fieldingTeam, function(player){
						return player.position == "SS";
					}).player;
				} else {
					return _.find(fieldingTeam, function(player){
						return player.position == "P";
					}).player;
				}
			} else if(trajectory == "ld"){
				if(rand < .7){
					return _.find(fieldingTeam, function(player){
						return player.position == "CF";
					}).player;
				} else if(rand < .8){
					return _.find(fieldingTeam, function(player){
						return player.position == "2B";
					}).player;
				} else if(rand < .9){
					return _.find(fieldingTeam, function(player){
						return player.position == "SS";
					}).player;
				} else{
					return _.find(fieldingTeam, function(player){
						return player.position == "P";
					}).player;
				}
			} else{
				return _.find(fieldingTeam, function(player){
					return player.position == "CF";
				}).player;
			}
		} else{
			if(trajectory == "gb"){
				if(rand < .5){
					return _.find(fieldingTeam, function(player){
						return player.position == "1B";
					}).player;
				} else {
					return _.find(fieldingTeam, function(player){
						return player.position == "2B";
					}).player;
				}
			} else if(trajectory == "ld"){
				if(rand < .7){
					return _.find(fieldingTeam, function(player){
						return player.position == "RF";
					}).player;
				} else if(rand < .85){
					return _.find(fieldingTeam, function(player){
						return player.position == "1B";
					}).player;
				} else{
					return _.find(fieldingTeam, function(player){
						return player.position == "2B";
					}).player;
				}
			} else{
				return _.find(fieldingTeam, function(player){
					return player.position == "RF";
				}).player;
			}
		}
	}

	getFieldedBallOutcome(trajectory, hitDirection, contactType, fieldingTeam, isHomeTeam){
		var fielder = this.getFielder(fieldingTeam, hitDirection, contactType);
		if(Math.random() < this.getErrorChance(trajectory, contactType, isHomeTeam, fielder)){
			return new AtBat("error", contactType, trajectory);
		}
		return new AtBat("out", contactType, trajectory);
	}
  
  atBat(batter, pitcher, fieldingTeam){
  		 var contactRand = Math.random();
  	   var strikeOutProb = Math.max(.03, this.getModifierPercentage(.04, .36, batter.hittingAbility.contact, true) + this.getModifierPercentage(.04, .36, pitcher.pitchingAbility.velocity, false) - .12);
       var walkProb = Math.max(0, this.getModifierPercentage(0, .07, batter.hittingAbility.patience, false) + this.getModifierPercentage(0, .07, pitcher.pitchingAbility.control, true) + .02);
       if(contactRand < strikeOutProb){
       	return new AtBat("strikeout", "none", "none");
       } else if(contactRand < strikeOutProb + walkProb) {
       	return new AtBat("walk", "none", "none");
       } else {
        //this.contacts++;
				var contactRand = Math.random();
				var battingSide = batter.bats == "B" ? (pitcher.throws == "L" ? "R" : "L") : batter.bats;
				var hitDirection = this.getHitDirection(battingSide)
       	var hardHitProb = this.getModifierPercentage(.14, .5, batter.hittingAbility.power, false) + .14;
       	var softHitProb = this.getSoftPercentage(batter.hittingAbility.power);
       	var mediumHitProb = 1 - hardHitProb - softHitProb;
       	if(contactRand < hardHitProb){
       	  trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb")){
       	    if(Math.random() < .65){
							return this.getFieldedBallOutcome("gb", hitDirection, "hard", fieldingTeam, true);
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .175 + batter.hittingAbility.contact * .002), "hard", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .3){
							return this.getFieldedBallOutcome("ld", hitDirection, "hard", fieldingTeam, true);
       	    } else {
       	      return new AtBat(this.getHitType( batter.hittingAbility.power * .006 - .05, batter.hittingAbility.speed, .2 + batter.hittingAbility.contact * .004), "hard", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .65){
							return this.getFieldedBallOutcome("fb", hitDirection, "hard", fieldingTeam, true);
       	    } else {
       	      return new AtBat(this.getHitType(.1 + batter.hittingAbility.power * .007, batter.hittingAbility.speed, .2 + batter.hittingAbility.contact * .004), "hard", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "hard", "iffb");
       	  }
       	} else if (contactRand < hardHitProb + mediumHitProb){
       	  var trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb")){
       	    if(Math.random() < .7){
							return this.getFieldedBallOutcome("gb", hitDirection, "medium", fieldingTeam, true);
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .175 + batter.hittingAbility.contact * .003), "medium", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .35){
							return this.getFieldedBallOutcome("ld", hitDirection, "medium", fieldingTeam, true);
       	    } else {
       	      return new AtBat(this.getHitType(batter.hittingAbility.power * .002 - .025, batter.hittingAbility.speed,  batter.hittingAbility.contact * .004), "medium", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .75){
							return this.getFieldedBallOutcome("fb", hitDirection, "medium", fieldingTeam, true);
       	    } else {
       	      return new AtBat(this.getHitType(batter.hittingAbility.power * .004 - .025, batter.hittingAbility.speed,  batter.hittingAbility.contact * .004), "medium", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "medium", "iffb");
       	  }
       	} else {
       	  trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb")){
       	    if(Math.random() < .75){
							return this.getFieldedBallOutcome("gb", hitDirection, "soft", fieldingTeam, true);
       	    } else {
       	      return new AtBat("single", "soft", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .5){
							return this.getFieldedBallOutcome("ld", hitDirection, "soft", fieldingTeam, true);
       	    } else {
       	      return new AtBat(this.getHitType(0, 0,  batter.hittingAbility.contact * .003 + .05), "soft", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .85){
							return this.getFieldedBallOutcome("fb", hitDirection, "soft", fieldingTeam, true);
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, batter.hittingAbility.contact * .003 + .05), "soft", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "soft", "iffb");
       	  }
       	}
       }
  }
}