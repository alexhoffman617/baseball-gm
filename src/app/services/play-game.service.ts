import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats, GameEvent, GamePlayer  } from '../models/game';
import { AtBatService } from '../services/at-bat.service';
import * as _ from "lodash";

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

    playGame(homeTeam: Array<GamePlayer>, awayTeam: Array<GamePlayer>, homeTeamId, awayTeamId, seasonId) {
        if (!homeTeam || !awayTeam || homeTeam.length === 0 || awayTeam.length === 0) {
          return
        }
        this.newGameObject();
        this.currentInning = 1;
        this.gameObject.homeTeamId = homeTeamId
        this.gameObject.awayTeamId = awayTeamId
        this.gameObject.seasonId = seasonId

        while (this.currentInning <= 9 || this.gameObject.homeTeamStats.runs === this.gameObject.awayTeamStats.runs) {
          this.playInning(homeTeam, awayTeam);
          this.gameObject.gameLogString += ("<div>" + "After " + this.currentInning + " the score is: Home " + this.gameObject.homeTeamStats.runs + "," + " Away " + this.gameObject.awayTeamStats.runs + "</div>");
          this.currentInning++;
        }

        this.gameObject.inning = this.currentInning - 1
        return this.gameObject;
    }

    playInning(homeTeam: Array<GamePlayer>, awayTeam: Array<GamePlayer>){
        this.halfInning(awayTeam, this.gameObject.awayTeamStats, homeTeam, this.gameObject.homeTeamStats, 'Top')
        if (this.currentInning < 9 || this.gameObject.homeTeamStats.runs <= this.gameObject.awayTeamStats.runs) {
          this.halfInning(homeTeam, this.gameObject.homeTeamStats, awayTeam, this.gameObject.awayTeamStats, 'Bottom')
        }
    }

    halfInning(battingTeam: Array<GamePlayer>, battingTeamStats, pitchingTeam: Array<GamePlayer>, pitchingTeamStats, side){
      this.outs = 0;
      this.firstBase = 0;
      this.secondBase = 0;
      this.thirdBase = 0;
      this.gameObject.gameLogString += ('<div class="' + side + '">' + side + ' ' + this.currentInning + '</div>')

      while (this.outs < 3 && (side !== "Bottom" || this.currentInning < 9 || battingTeamStats.runs <= pitchingTeamStats.runs)){
        // Get Batter
        var batter = _.find(battingTeam, function(player){
          return player.orderNumber === (battingTeamStats.events.length % 9 + 1);
        }).player;
        var pitcher = _.find(pitchingTeam, function(player){
          return player.position  === "P";
        }).player;

        this.gameObject.gameLogString += ("<div>" + batter.name + " is up to bat" + "</div>");


        // determine outcome of PA
        this.outcome = this.atBatService.atBat(batter, pitcher, pitchingTeam, side == "Bottom");
        this.advanceRunners(batter, pitcher, battingTeamStats);

        this.gameObject.gameLogString += ("<div>" + this.outcome.result + "</div>");
        battingTeamStats.events.push({"batterId": batter._id, "pitcherId": pitcher._id, "outcome": this.outcome});
      }
    }

    advanceRunners(batter, pitcher, battingTeam){
      if(this.outcome.result == "strikeout") {
        this.outs ++;
      } else if(this.outcome.result == "out"){
        this.processOut(batter, pitcher, battingTeam);
      } else {
        if(this.thirdBase){
          this.advanceThirdBaseRunner(batter, pitcher, this.outcome.result, battingTeam);
        }
        if(this.secondBase){
          this.advanceSecondBaseRunner(batter, pitcher, this.outcome.result, battingTeam);
        }
        if(this.firstBase){
          this.advanceFirstBaseRunner(batter, pitcher, this.outcome.result, battingTeam);
        }
        this.advanceBatter(batter, pitcher, this.outcome.result, battingTeam);
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
          this.outcome.result = "triple play";
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
          this.outcome.result = "double play";
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
          this.outcome.result = "fielders choice";
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
          this.outcome.result = "double play";
        } else if (prob < .3){
          this.firstBase = batter;
          this.outcome.result = "fielders choice";
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
          this.outcome.result = "double play";
        } else if(prob  < .3){
          if(prob < .25){
            this.secondBase = this.firstBase;
            this.firstBase = batter;
          } else{
            this.thirdBase = this.secondBase;
            this.secondBase = null;
            this.firstBase = batter;
          }
          this.outcome.result = "fielders choice";
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
          this.outcome.result = "double play";
        } else if (prob < .3){
          this.firstBase = batter;
          this.outcome.result = "fielders choice";
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
        if(this.firstBase && this.secondBase && this.thirdBase){
          battingTeamStats.runs ++;
          this.thirdBase = null;
        }
      }
      else if (outcome == "single" || outcome == "error"){
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
        if(this.firstBase && this.secondBase){
          this.thirdBase = this.secondBase;
          this.secondBase = null;
        }
      }
      else if (outcome == "single" || outcome == "error"){
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
      else if (outcome == "single" || outcome == "error"){
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
        if (outcome == "single" || outcome == "walk" || outcome == "error"){
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
