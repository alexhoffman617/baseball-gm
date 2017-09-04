import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats  } from '../models/game';

@Injectable()
export class AtBatService {
    gbpct = .45;
    ldpct = .2;
    fbpct = .25;
    iffbpct = .1;
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
	
	getErrorChance(trajectory, contactQuality, isHomeTeam){
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
  
  
  atBat(batter, pitcher){
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
       	var hardHitProb = this.getModifierPercentage(.14, .5, batter.hittingAbility.power, false) + .14;
       	var softHitProb = this.getSoftPercentage(batter.hittingAbility.power);
       	var mediumHitProb = 1 - hardHitProb - softHitProb;
       	if(contactRand < hardHitProb){
       	  trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb")){
       	    if(Math.random() < .65){
							if(Math.random() < this.getErrorChance("gb", "hard", true)){
       	        return new AtBat("error", "hard", "gb");
       	      }
       	      return new AtBat("out", "hard", "gb");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .175 + batter.hittingAbility.contact * .002), "hard", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .3){
							if(Math.random() < this.getErrorChance("ld", "hard", true)){
       	        return new AtBat("error", "hard", "ld");
       	      }
       	      return new AtBat("out", "hard", "ld");
       	    } else {
       	      return new AtBat(this.getHitType( batter.hittingAbility.power * .006 - .05, batter.hittingAbility.speed, .2 + batter.hittingAbility.contact * .004), "hard", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .65){
							if(Math.random() < this.getErrorChance("fb", "hard", true)){
       	        return new AtBat("error", "hard", "fb");
       	      }
       	      return new AtBat("out", "hard", "fb");
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
							if(Math.random() < this.getErrorChance("gb", "medium", true)){
       	        return new AtBat("error", "medium", "gb");
       	      }
       	      return new AtBat("out", "medium", "gb");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .175 + batter.hittingAbility.contact * .003), "medium", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .35){
							if(Math.random() < this.getErrorChance("ld", "medium", true)){
       	        return new AtBat("error", "medium", "ld");
       	      }
       	      return new AtBat("out", "medium", "ld");
       	    } else {
       	      return new AtBat(this.getHitType(batter.hittingAbility.power * .002 - .025, batter.hittingAbility.speed,  batter.hittingAbility.contact * .004), "medium", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .75){
							if(Math.random() < this.getErrorChance("fb", "medium", true)){
       	        return new AtBat("error", "medium", "fb");
       	      }
       	      return new AtBat("out", "medium", "fb");
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
							if(Math.random() < this.getErrorChance("gb", "soft", true)){
       	        return new AtBat("error", "soft", "gb");
       	      }
       	      return new AtBat("out", "soft", "gb");
       	    } else {
       	      return new AtBat("single", "soft", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .5){
							if(Math.random() < this.getErrorChance("ld", "soft", true)){
       	        return new AtBat("error", "soft", "ld");
       	      }
       	      return new AtBat("out", "soft", "ld");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0,  batter.hittingAbility.contact * .003 + .05), "soft", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .85){
							if(Math.random() < this.getErrorChance("fb", "soft", true)){
       	        return new AtBat("error", "soft", "fb");
       	      }
       	      return new AtBat("out", "soft", "fb");
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