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
  	   var strikeOutProb = this.getModifierPercentage(.04, .36, batter.skills.contact, true) + .04;
       var walkProb = this.getModifierPercentage(0, .25, batter.skills.patience, false);
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
       	  if(trajectoryRandom < this.gbpct){
       	    if(Math.random() < .65){
       	      return new AtBat("out", "hard", "gb");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .15 + batter.skills.contact * .015), "hard", "gb");
       	    }
       	  } else if(trajectoryRandom < this.gbpct + this.ldpct) {
       	    if(Math.random() < .3){
       	      return new AtBat("out", "hard", "ld");
       	    } else {
       	      return new AtBat(this.getHitType( batter.skills.power * .04 - .05, batter.skills.speed, .15 + batter.skills.contact * .025), "hard", "ld");
       	    }
       	  } else if(trajectoryRandom < this.gbpct + this.ldpct + this.fbpct){
       	    if(Math.random() < .65){
       	      return new AtBat("out", "hard", "fb");
       	    } else {
       	      return new AtBat(this.getHitType(.1 + batter.skills.power * .045, batter.skills.speed, .15 + batter.skills.contact * .025), "hard", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "hard", "iffb");
       	  }
       	} else if (contactRand < hardHitProb + mediumHitProb){
       	  var trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.gbpct){
       	    if(Math.random() < .7){
       	      return new AtBat("out", "medium", "gb");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .15 + batter.skills.contact * .015), "medium", "gb");
       	    }
       	  } else if(trajectoryRandom < this.gbpct + this.ldpct) {
       	    if(Math.random() < .35){
       	      return new AtBat("out", "medium", "ld");
       	    } else {
       	      return new AtBat(this.getHitType(batter.skills.power * .015 - .05, batter.skills.speed,  batter.skills.contact * .03 - .05), "medium", "ld");
       	    }
       	  } else if(trajectoryRandom < this.gbpct + this.ldpct + this.fbpct){
       	    if(Math.random() < .75){
       	      return new AtBat("out", "medium", "fb");
       	    } else {
       	      return new AtBat(this.getHitType(batter.skills.power * .025 - .05, batter.skills.speed,  batter.skills.contact * .03 - .05), "medium", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "medium", "iffb");
       	  }
       	} else {
       	  trajectoryRandom = Math.random();
       	  if(trajectoryRandom < this.gbpct){
       	    if(Math.random() < .75){
       	      return new AtBat("out", "soft", "gb");
       	    } else {
       	      return new AtBat("single", "soft", "gb");
       	    }
       	  } else if(trajectoryRandom < this.gbpct + this.ldpct) {
       	    if(Math.random() < .5){
       	      return new AtBat("out", "soft", "ld");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .15 + batter.skills.contact * .025), "soft", "ld");
       	    }
       	  } else if(trajectoryRandom < this.gbpct + this.ldpct + this.fbpct){
       	    if(Math.random() < .85){
       	      return new AtBat("out", "soft", "fb");
       	    } else {
       	      return new AtBat(this.getHitType(0, 0, .5 + batter.skills.contact * .015), "soft", "fb");
       	    }
       	  } else {
       	    return new AtBat("out", "soft", "iffb");
       	  }
       	}
       }
  }
}