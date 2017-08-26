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
    if(skill <= 6){
      return .27;
    } else{
      return (13 -(skill -7)) / 13 * (.3 - .07) + .07;
    }
  }
  
  getModifierPercentage(min, max, skill, isNegative){
    if(isNegative){
      return (20 - skill) / 20 * (max - min);
    } else {
      return (skill) / 20 * (max - min);
    }
	}

	getTrajectoryPercentage(pitcher, trajectoryType){
		if(trajectoryType == "gb"){
			if(pitcher.skills.type == "gb"){
				return this.gbpct + ((pitcher.skills.stuff - 5) / 15 * .1)
			} else if(pitcher.skills.type == "fb"){
				return this.gbpct - ((pitcher.skills.stuff - 5) / 15 * .075)
			} else {
				return this.gbpct;
			}
		} else if(trajectoryType == "ld"){
			if(pitcher.skills.type == "gb"){
				return this.ldpct - ((pitcher.skills.stuff - 5) / 15 * .05)
			} else if(pitcher.skills.type == "fb"){
				return this.ldpct - ((pitcher.skills.stuff - 5) / 15 * .05);
			} else {
				return this.ldpct;
			}
		} else if (trajectoryType == "fb"){
			if(pitcher.skills.type == "gb"){
				return this.fbpct - ((pitcher.skills.stuff - 5) / 15 * .05)
			} else if(pitcher.skills.type == "fb"){
				return this.fbpct + ((pitcher.skills.stuff - 5) / 15 * .1)
			} else {
				return this.fbpct;
			}
		}
	}
  
  getHitType(homerun, speed, double){
    var hitTypeRand = Math.random();
    var triple = speed > 10 ? .025 + (speed - 10) / 10 * .15 : .025;
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
  
  atBat(batter, pitcher){
  		 var contactRand = Math.random();
  	   var strikeOutProb = Math.max(.03, this.getModifierPercentage(.04, .36, batter.skills.contact, true) + this.getModifierPercentage(.04, .36, pitcher.skills.velocity, false) - .12);
       var walkProb = Math.max(0, this.getModifierPercentage(0, .07, batter.skills.patience, false) + this.getModifierPercentage(0, .07, pitcher.skills.control, true) + .02);
       if(contactRand < strikeOutProb){
       	return new AtBat("strikeout", "none", "none");
       } else if(contactRand < strikeOutProb + walkProb) {
       	return new AtBat("walk", "none", "none");
       } else {
        //this.contacts++;
       	var contactRand = Math.random();
       	var hardHitProb = this.getModifierPercentage(.14, .5, batter.skills.power, false) + .14;
       	var softHitProb = this.getSoftPercentage(batter.skills.power);
       	var mediumHitProb = 1 - hardHitProb - softHitProb;
       	if(contactRand < hardHitProb){
       	  trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb")){
       	    if(Math.random() < .65){
       	      return new AtBat("out", "hard", "gb");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .175 + batter.skills.contact * .01), "hard", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .3){
       	      return new AtBat("out", "hard", "ld");
       	    } else {
       	      return new AtBat(this.getHitType( batter.skills.power * .03 - .05, batter.skills.speed, .2 + batter.skills.contact * .02), "hard", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .65){
       	      return new AtBat("out", "hard", "fb");
       	    } else {
       	      return new AtBat(this.getHitType(.1 + batter.skills.power * .035, batter.skills.speed, .2 + batter.skills.contact * .02), "hard", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "hard", "iffb");
       	  }
       	} else if (contactRand < hardHitProb + mediumHitProb){
       	  var trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb")){
       	    if(Math.random() < .7){
       	      return new AtBat("out", "medium", "gb");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .175 + batter.skills.contact * .015), "medium", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .35){
       	      return new AtBat("out", "medium", "ld");
       	    } else {
       	      return new AtBat(this.getHitType(batter.skills.power * .01 - .025, batter.skills.speed,  batter.skills.contact * .02), "medium", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .75){
       	      return new AtBat("out", "medium", "fb");
       	    } else {
       	      return new AtBat(this.getHitType(batter.skills.power * .02 - .025, batter.skills.speed,  batter.skills.contact * .02), "medium", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "medium", "iffb");
       	  }
       	} else {
       	  trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb")){
       	    if(Math.random() < .75){
       	      return new AtBat("out", "soft", "gb");
       	    } else {
       	      return new AtBat("single", "soft", "gb");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld")) {
       	    if(Math.random() < .5){
       	      return new AtBat("out", "soft", "ld");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0,  batter.skills.contact * .015 + .05), "soft", "ld");
       	    }
       	  } else if(trajectoryRandom < this.getTrajectoryPercentage(pitcher, "gb") + this.getTrajectoryPercentage(pitcher, "ld") + this.getTrajectoryPercentage(pitcher, "fb")){
       	    if(Math.random() < .85){
       	      return new AtBat("out", "soft", "fb");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, batter.skills.contact * .015 + .05), "soft", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "soft", "iffb");
       	  }
       	}
       }
  }
}