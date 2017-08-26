import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats, GameEvent  } from '../models/game';
import { AtBatService } from '../services/at-bat.service';

@Injectable()
export class PlayGameService {
    gameObject;
    currentInning;
    outs;
    firstBase;
    secondBase;
    thirdBase;
    outcome;
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
    leagueMaxHitFreq = .285
    leagueMinHitFreq = .17

    constructor(public atBatService: AtBatService) { 
        
    }

    newGameObject(){
        this.gameObject =  {
        "gameLogString": "",
        "homeTeamStats": {
            "events": [],
            "runs": 0
        },
        "awayTeamStats": {
            "events": [],
            "runs": 0
        }
    }
    }

    playGame(homeTeam, awayTeam){
        this.newGameObject();
        this.currentInning = 1;

        while (this.currentInning <= 9 || this.gameObject.homeTeamStats.runs == this.gameObject.awayTeamStats.runs){
          this.playInning(homeTeam, awayTeam);
          this.gameObject.gameLogString += ("<div>" + "After " + this.currentInning + " the score is: Home " + this.gameObject.homeTeamStats.runs + "," + " Away " + this.gameObject.awayTeamStats.runs + "</div>");
          this.currentInning++;
        }

        return this.gameObject;
    }

    playInning(homeTeam, awayTeam){
        this.halfInning(awayTeam, this.gameObject.awayTeamStats, homeTeam, this.gameObject.homeTeamStats, "Top");
        if(this.currentInning < 9 || this.gameObject.homeTeamStats.runs <= this.gameObject.awayTeamStats.runs){
          this.halfInning(homeTeam, this.gameObject.homeTeamStats, awayTeam, this.gameObject.awayTeamStats, "Bottom");
        }
    }

    halfInning(battingTeam, battingTeamStats, pitchingTeam, pitchingTeamStats, side){
        this.outs = 0;
        this.firstBase = 0;
        this.secondBase = 0;
        this.thirdBase = 0;
        this.gameObject.gameLogString += ("<div class='" + side + "'>" + side + " " + this.currentInning + "</div>");

        while (this.outs < 3 && (side != "Bottom" || this.currentInning < 9 || battingTeamStats.runs <= pitchingTeamStats.runs)){
          // Get Batter
          var batter = battingTeam.batters[(battingTeamStats.events.length) % 9];
          var pitcher = pitchingTeam.pitcher;
          this.gameObject.gameLogString += ("<div>" + batter.name + " is up to bat" + "</div>");


          // determine outcome of PA
          this.outcome = this.atBatService.atBat(batter, pitcher).result;
          this.advanceRunners(batter, pitcher, battingTeamStats);

          this.gameObject.gameLogString += ("<div>" + this.outcome + "</div>");
          battingTeamStats.events.push({"batterId": batter.id, "pitcherId": pitcher.id, "outcome": this.outcome});
        }

        //pitcher.gameStats.InningsPitched++;
    }

    getModifierPercentage(min, max, skill, isNegative = false){
      if(isNegative){
        return (20 - skill) / 20 * (max - min);
      } else {
        return (skill) / 20 * (max - min);
      }
    }


    advanceRunners(batter, pitcher, battingTeam){
      if(this.outcome == "strikeout") {
        this.outs ++;
      } else if(this.outcome == "out"){
        this.processOut(batter, pitcher, battingTeam);
      } else {
        if(this.thirdBase){
          this.advanceThirdBaseRunner(batter, pitcher, this.outcome, battingTeam);
        }
        if(this.secondBase){
          this.advanceSecondBaseRunner(batter, pitcher, this.outcome, battingTeam);                
        }
        if(this.firstBase){
          this.advanceFirstBaseRunner(batter, pitcher, this.outcome, battingTeam);                
        }
        this.advanceBatter(batter, pitcher, this.outcome, battingTeam);
      }
    }

    processOut(batter, pitcher, battingTeamStats){
      var prob = Math.random();
      if(this.outs == 2){
        this.outs++
      } else if(this.thirdBase && this.secondBase && this.firstBase){
        this.outs++;
        if(this.outs == 1 && prob < .02){
          this.outs ++;
          this.outs ++;
          this.outcome = "triple play";
        } else if(prob <= .2){
          if(prob < .05){
            this.thirdBase = null
            this.secondBase = null;
            this.firstBase = batter;
            battingTeamStats.runs++;
          } else if(prob < .1) {
            this.thirdBase = this.secondBase;
            this.secondBase = null;
            this.firstBase = null;
            battingTeamStats.runs++;
          } else if(prob < .15){
            this.thirdBase = null;
            this.secondBase = this.firstBase;
            this.firstBase = null;
            battingTeamStats.runs++;
          } else{
            this.thirdBase = this.secondBase;
            this.secondBase = this.firstBase;
            this.firstBase = null;
          }
          this.outs ++;
          this.outcome = "double play";
        } else if(prob  < .35){
          if(prob < .25){
            this.thirdBase = this.secondBase;
            this.secondBase = this.firstBase;
            this.firstBase = batter;           
          } else if(prob < .3){
            this.thirdBase = null;
            this.secondBase = this.firstBase;
            this.firstBase = batter;
          } else{
            this.thirdBase = this.secondBase;
            this.secondBase = null;
            this.firstBase = batter;
          }
          this.outcome = "fielders choice";
        } else if(prob < .45){
          this.thirdBase = this.secondBase;
          this.secondBase = this.firstBase;
          this.firstBase = null;
          battingTeamStats.runs++;
        }
      } else if (this.thirdBase && this.firstBase){
        this.outs++;
        if(prob <= .2){
          this.firstBase = null;
          this.outs ++;
          this.outcome = "double play";
        } else if (prob < .3){
          this.firstBase = batter;
          this.outcome = "fielders choice";
        } else if( prob < .4){
          this.secondBase = this.firstBase;
          this.firstBase = null;
        }
        if(this.outs < 3){
          battingTeamStats.runs ++;
          this.thirdBase = null;
        }
      } else if(this.secondBase && this.firstBase){
         this.outs++;
        if(prob <= .2){
          if(prob < .1){
            this.firstBase = batter;
            this.secondBase = null;
          } else {
            this.thirdBase = this.secondBase;
            this.firstBase = null;
            this.secondBase = null;
          }
          this.outs ++;
          this.outcome = "double play";
        } else if(prob  < .3){
          if(prob < .25){
            this.secondBase = this.firstBase;
            this.firstBase = batter;
          } else{
            this.thirdBase = this.secondBase;
            this.secondBase = null;
            this.firstBase = batter;
          }
          this.outcome = "fielders choice";
        } else if(prob < .4){
          this.thirdBase = this.secondBase;
          this.secondBase = this.firstBase;
          this.firstBase = null;
        }
      } else if(this.firstBase){
        this.outs++;
        if(prob <= .2){
          this.firstBase = null;
          this.outs ++;
          this.outcome = "double play";
        } else if (prob < .3){
          this.firstBase = batter;
          this.outcome = "fielders choice";
        } else if( prob < .4){
          this.secondBase = this.firstBase;
          this.firstBase = null;
        }
      } else {
        this.outs++;
      }
    }

    advanceThirdBaseRunner(batter, pitcher, outcome, battingTeamStats){
      if(outcome == "walk"){
        if(this.firstBase && this.secondBase){
          battingTeamStats.runs ++;
          this.thirdBase = null;
        }
      }
      else if (outcome == "single"){
        battingTeamStats.runs ++;
        this.thirdBase = null;
      }
      else if(outcome == "double"){
        battingTeamStats.runs ++;
        this.thirdBase = null;
      }
      else if(outcome == "triple"){
        battingTeamStats.runs ++;
        this.thirdBase = null;
      }
      else if(outcome == "homerun"){
        battingTeamStats.runs ++;
        this.thirdBase = null;
      }
    }
    advanceSecondBaseRunner(batter, pitcher, outcome, battingTeamStats){
      if(outcome == "walk"){
        if(this.firstBase){
          this.thirdBase = this.secondBase;
          this.secondBase = null;
        }
      }
      else if (outcome == "single"){
        var bsr = Math.random();
        if (bsr <= 0.42){
          this.thirdBase = this.secondBase;
          this.secondBase = null;
        }
        else{
          battingTeamStats.runs ++;
          this.secondBase = null;
        }
      }
      else if(outcome == "double"){
        battingTeamStats.runs ++;
        this.secondBase = null;
      }
      else if(outcome == "triple"){
        battingTeamStats.runs ++;
        this.secondBase = null;
      }
      else if(outcome == "homerun"){
        battingTeamStats.runs ++;
        this.secondBase = null;
      }
    }

    advanceFirstBaseRunner(batter, pitcher, outcome, battingTeamStats){
      if(outcome == "walk"){
        this.secondBase = this.firstBase;
        this.firstBase = null;
      }
      else if (outcome == "single"){
        var bsr = Math.random();
        if (bsr <= 0.72 && this.thirdBase){
          this.thirdBase = this.firstBase;
          this.firstBase = null;
        } else {
          this.secondBase = this.firstBase;
          this.firstBase = null;          
        }
      }
      else if(outcome == "double"){
        var bsr = Math.random();
        if (bsr <= 0.38){
          this.thirdBase = this.firstBase;
          this.firstBase = null;
        } else {
          battingTeamStats.runs ++;
          this.firstBase = null;
        }
      }
      else if(outcome == "triple"){
        battingTeamStats.runs ++;
        this.firstBase = null;
      }
      else if(outcome == "homerun"){
        battingTeamStats.runs ++;
        this.firstBase = null;
      }
    }

    advanceBatter(batter, pitcher, outcome, battingTeamStats){
        if (outcome == "single" || outcome == "walk"){
          this.firstBase = batter;
        }
      else if(outcome == "double"){
          this.secondBase = batter;
        }
      else if(outcome == "triple"){
          this.thirdBase = batter;
        }
      else if(outcome == "homerun"){
          battingTeamStats.runs ++;
        }
    }
}