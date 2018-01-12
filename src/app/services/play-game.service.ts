import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats, GameEvent, GamePlayer, PitcherAppearance } from '../models/game';
import { AtBatService } from '../services/at-bat.service';
import * as _ from 'lodash';

@Injectable()
export class PlayGameService {
    gameObject;
    currentInning;
    outs;
    firstBase;
    secondBase;
    thirdBase;
    outcome;
    currentPitcherAppearance: PitcherAppearance;
    halfInningEvents: Array<GameEvent>;
    battingTeamStats: TeamStats
    pitchingTeamStats: TeamStats
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

    newGameObject() {
        this.gameObject =  {
        'homeTeamStats': {
            'pitcherAppearances': [],
            'events': [],
            'runs': 0
        },
        'awayTeamStats': {
          'pitcherAppearances': [],
          'events': [],
          'runs': 0
        }
    }
    }

    playGame(homeTeam: Array<GamePlayer>, awayTeam: Array<GamePlayer>, homeTeamId, awayTeamId, seasonId, leagueId) {
        if (!homeTeam || !awayTeam || homeTeam.length === 0 || awayTeam.length === 0) {
          return
        }
        this.newGameObject();
        this.currentInning = 1;
        this.gameObject.homeTeamId = homeTeamId
        this.gameObject.awayTeamId = awayTeamId
        this.gameObject.seasonId = seasonId
        this.gameObject.leagueId = leagueId

        const homeStartingPitcher = _.find(homeTeam, function(player){
          return player.position  === 'P';
        }).player;
        this.gameObject.homeTeamStats.pitcherAppearances.push(new PitcherAppearance(homeStartingPitcher._id, true))

        const awayStartingPitcher = _.find(awayTeam, function(player){
          return player.position  === 'P';
        }).player;
        this.gameObject.awayTeamStats.pitcherAppearances.push(new PitcherAppearance(awayStartingPitcher._id, true))

        while (this.currentInning <= 9 || this.gameObject.homeTeamStats.runs === this.gameObject.awayTeamStats.runs) {
          this.playInning(homeTeam, awayTeam);
          this.currentInning++;
        }

        this.gameObject.inning = this.currentInning - 1
        return this.gameObject;
    }

    playInning(homeTeam: Array<GamePlayer>, awayTeam: Array<GamePlayer>) {
        this.halfInning(awayTeam, this.gameObject.awayTeamStats, homeTeam, this.gameObject.homeTeamStats, 'Top')
        if (this.currentInning < 9 || this.gameObject.homeTeamStats.runs <= this.gameObject.awayTeamStats.runs) {
          this.halfInning(homeTeam, this.gameObject.homeTeamStats, awayTeam, this.gameObject.awayTeamStats, 'Bottom')
        }
    }

    halfInning(battingTeam: Array<GamePlayer>, battingTeamStats, pitchingTeam: Array<GamePlayer>, pitchingTeamStats, side) {
      const that = this
      this.outs = 0;
      this.firstBase = 0;
      this.secondBase = 0;
      this.thirdBase = 0;
      this.halfInningEvents = new Array<GameEvent>()
      this.battingTeamStats = battingTeamStats
      this.pitchingTeamStats = pitchingTeamStats
      while (this.outs < 3 && (side !== 'Bottom' || this.currentInning < 9 || this.battingTeamStats.runs <= this.pitchingTeamStats.runs)) {
        const batter = _.find(battingTeam, function(player){
          return player.orderNumber === (that.battingTeamStats.events.length % 9 + 1);
        }).player;
        const pitcher = _.find(pitchingTeam, function(player){
          return player.position  === 'P';
        }).player;
        this.currentPitcherAppearance = this.pitchingTeamStats.pitcherAppearances[this.pitchingTeamStats.pitcherAppearances.length - 1]
        // determine outcome of PA
        this.outcome = this.atBatService.atBat(batter, pitcher, pitchingTeam, side === 'Bottom');
        this.advanceRunners(batter, pitcher);
        this.halfInningEvents.push({'batterId': batter._id, 'pitcherId': pitcher._id, 'outcome': this.outcome});
        this.battingTeamStats.events.push({'batterId': batter._id, 'pitcherId': pitcher._id, 'outcome': this.outcome})
      }
    }

    advanceRunners(batter, pitcher) {
      if (this.outcome.result === 'strikeout') {
        this.addOut()
        this.currentPitcherAppearance.strikeouts++
      } else if (this.outcome.result === 'out') {
        this.processOut(batter, pitcher)
      } else {
        if (this.outcome.result === 'walk') {
          this.currentPitcherAppearance.walks++
        } else if (this.outcome.result !== 'error') {
          this.currentPitcherAppearance.hits++
        }
        if (this.thirdBase) {
          this.advanceThirdBaseRunner(batter, pitcher, this.outcome.result);
        }
        if (this.secondBase) {
          this.advanceSecondBaseRunner(batter, pitcher, this.outcome.result);
        }
        if (this.firstBase) {
          this.advanceFirstBaseRunner(batter, pitcher, this.outcome.result);
        }
        this.advanceBatter(batter, pitcher, this.outcome.result);
      }
    }

    processOut(batter, pitcher) {
      const prob = Math.random();
      if (this.outs === 2) {
        this.addOut()
      } else if (this.thirdBase && this.secondBase && this.firstBase) {
        this.addOut()
        if (this.outs === 1 && prob < .02) {
          this.addOut()
          this.addOut()
          this.outcome.result = 'triple play';
        } else if (prob <= .2) {
          if (prob < .05) {
            this.runScores(this.thirdBase)
            this.thirdBase = null
            this.secondBase = null;
            this.firstBase = batter;
          } else if (prob < .1) {
            this.runScores(this.thirdBase)
            this.thirdBase = this.secondBase;
            this.secondBase = null;
            this.firstBase = null;
          } else if (prob < .15) {
            this.runScores(this.thirdBase)
            this.outcome.scoredIds.push(this.thirdBase)
            this.thirdBase = null;
            this.secondBase = this.firstBase;
            this.firstBase = null;
          } else {
            this.thirdBase = this.secondBase;
            this.secondBase = this.firstBase;
            this.firstBase = null;
          }
          this.addOut()
          this.outcome.result = 'double play';
        } else if (prob  < .35) {
          if (prob < .25) {
            this.thirdBase = this.secondBase;
            this.secondBase = this.firstBase;
            this.firstBase = batter;
          } else if (prob < .3) {
            this.thirdBase = null;
            this.secondBase = this.firstBase;
            this.firstBase = batter;
          } else {
            this.thirdBase = this.secondBase;
            this.secondBase = null;
            this.firstBase = batter;
          }
          this.outcome.result = 'fielders choice';
        } else if (prob < .45) {
          this.runScores(this.thirdBase)
          this.thirdBase = this.secondBase;
          this.secondBase = this.firstBase;
          this.firstBase = null;
        }
      } else if (this.thirdBase && this.firstBase) {
        this.addOut()
        if (prob <= .2) {
          this.firstBase = null;
          this.addOut()
          this.outcome.result = 'double play';
        } else if (prob < .3) {
          this.firstBase = batter;
          this.outcome.result = 'fielders choice';
        } else if ( prob < .4) {
          this.secondBase = this.firstBase;
          this.firstBase = null;
        }
        if (this.outs < 3) {
          this.runScores(this.thirdBase)
        }
      } else if (this.secondBase && this.firstBase) {
        this.addOut()
        if (prob <= .2) {
          if (prob < .1) {
            this.firstBase = batter;
            this.secondBase = null;
          } else {
            this.thirdBase = this.secondBase;
            this.firstBase = null;
            this.secondBase = null;
          }
          this.addOut()
          this.outcome.result = 'double play';
        } else if (prob  < .3) {
          if (prob < .25) {
            this.secondBase = this.firstBase;
            this.firstBase = batter;
          } else {
            this.thirdBase = this.secondBase;
            this.secondBase = null;
            this.firstBase = batter;
          }
          this.outcome.result = 'fielders choice';
        } else if (prob < .4) {
          this.thirdBase = this.secondBase;
          this.secondBase = this.firstBase;
          this.firstBase = null;
        }
      } else if (this.firstBase) {
        this.addOut()
        if (prob <= .2) {
          this.firstBase = null;
          this.addOut()
          this.outcome.result = 'double play';
        } else if (prob < .3) {
          this.firstBase = batter;
          this.outcome.result = 'fielders choice';
        } else if ( prob < .4) {
          this.secondBase = this.firstBase;
          this.firstBase = null;
        }
      } else {
        this.addOut()
      }
    }

    advanceThirdBaseRunner(batter, pitcher, outcome) {
      if (outcome === 'walk') {
        if (this.firstBase && this.secondBase && this.thirdBase) {
          this.runScores(this.thirdBase)
          this.thirdBase = null;
        }
      } else if (outcome === 'single' || outcome === 'error') {
        this.runScores(this.thirdBase)
        this.thirdBase = null;
      } else if (outcome === 'double') {
        this.runScores(this.thirdBase)
        this.thirdBase = null;
      } else if (outcome === 'triple') {
        this.runScores(this.thirdBase)
        this.thirdBase = null;
      } else if (outcome === 'homerun') {
        this.runScores(this.thirdBase)
        this.thirdBase = null;
      }
    }
    advanceSecondBaseRunner(batter, pitcher, outcome) {
      if (outcome === 'walk') {
        if (this.firstBase && this.secondBase) {
          this.thirdBase = this.secondBase;
          this.secondBase = null;
        }
      } else if (outcome === 'single' || outcome === 'error') {
        const bsr = Math.random();
        if (bsr <= 0.42) {
          this.thirdBase = this.secondBase;
          this.secondBase = null;
        } else {
          this.runScores(this.secondBase)
          this.secondBase = null;
        }
      } else if (outcome === 'double') {
        this.runScores(this.secondBase)
        this.secondBase = null;
      } else if (outcome === 'triple') {
        this.runScores(this.secondBase)
        this.secondBase = null;
      } else if (outcome === 'homerun') {
        this.runScores(this.secondBase)
        this.secondBase = null;
      }
    }

    advanceFirstBaseRunner(batter, pitcher, outcome) {
      if (outcome === 'walk') {
        this.secondBase = this.firstBase;
        this.firstBase = null;
      } else if (outcome === 'single' || outcome === 'error') {
        const bsr = Math.random();
        if (bsr <= 0.72 && this.thirdBase) {
          this.thirdBase = this.firstBase;
          this.firstBase = null;
        } else {
          this.secondBase = this.firstBase;
          this.firstBase = null;
        }
      } else if (outcome === 'double') {
        const bsr = Math.random();
        if (bsr <= 0.38) {
          this.thirdBase = this.firstBase;
          this.firstBase = null;
        } else {
          this.runScores(this.firstBase)
          this.firstBase = null;
        }
      } else if (outcome === 'triple') {
        this.runScores(this.firstBase)
        this.firstBase = null;
      } else if (outcome === 'homerun') {
        this.runScores(this.firstBase)
        this.firstBase = null;
      }
    }

    advanceBatter(batter, pitcher, outcome) {
        if (outcome === 'single' || outcome === 'walk' || outcome === 'error') {
          this.firstBase = batter;
        } else if (outcome === 'double') {
          this.secondBase = batter;
        } else if (outcome === 'triple') {
          this.thirdBase = batter;
        } else if (outcome === 'homerun') {
        this.runScores(batter, true)
      }
    }

    addOut() {
      this.outs ++
      this.addOneThirdInning()
    }

    addOneThirdInning() {
      this.currentPitcherAppearance.innings += .1
      if (parseFloat((this.currentPitcherAppearance.innings % 1).toFixed(1)) === .3) {
        this.currentPitcherAppearance.innings += .7
      }
      this.currentPitcherAppearance.innings = parseFloat((this.currentPitcherAppearance.innings).toFixed(1))
    }

    runScores(scoredPlayer, isHomerun = false) {
      this.battingTeamStats.runs++
      if (isHomerun) {
        this.outcome.batterScored = true
      } else {
        const runScoringEvent = _.findLast(this.halfInningEvents, {batterId: scoredPlayer._id})
        runScoringEvent.outcome.batterScored = true
      }
      this.outcome.scoredIds.push(scoredPlayer._id)
      this.currentPitcherAppearance.runs++
      this.scoreRunsAsEarned(scoredPlayer, isHomerun)
    }

    scoreRunsAsEarned(scoredPlayer, isHomerun) {
      const inningExtendedDueToErrors = _.filter(this.halfInningEvents, function(event){
        return event.outcome.result === 'out' || event.outcome.result === 'error'
      }).length >= 3
      const isEarned = !inningExtendedDueToErrors && this.outcome.result !== 'error'
      const atBatOfScorer = _.findLast(this.halfInningEvents, {batterId: scoredPlayer._id})
      const pitcherAppearance = isHomerun ? this.currentPitcherAppearance :
             _.find(this.pitchingTeamStats.pitcherAppearances, {pitcherId: atBatOfScorer.pitcherId})
      pitcherAppearance.runs++
      if (isEarned) {
        pitcherAppearance.earnedRuns++
      }
      if (pitcherAppearance.start && pitcherAppearance.earnedRuns > 3) {
        pitcherAppearance.qs = false
      }
      if (this.battingTeamStats.runs === this.pitchingTeamStats.runs) {
        _.each(this.pitchingTeamStats.pitcherAppearances, function(appearance){
          appearance.win = false
        })
        _.each(this.battingTeamStats.pitcherAppearances, function(appearance){
          appearance.loss = false
        })
        if (this.currentPitcherAppearance.save) {
          this.currentPitcherAppearance.save = false
          this.currentPitcherAppearance.blownSave = true
        }
      } else if (this.battingTeamStats.runs === this.pitchingTeamStats.runs + 1) {
        pitcherAppearance.loss = true
        this.battingTeamStats.pitcherAppearances[this.battingTeamStats.pitcherAppearances.length - 1].win = true
      }

    }
}
