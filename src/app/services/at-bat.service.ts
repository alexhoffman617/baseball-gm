import { Injectable } from '@angular/core';
import { AtBat, Game, TeamStats, GamePlayer  } from '../models/game';
import { SharedFunctionsService } from '../services/shared-functions.service'
import { StaticListsService } from '../services/static-lists.service'
import * as _ from 'lodash';

@Injectable()
export class AtBatService {
  gbpct = .45;
  ldpct = .2;
  fbpct = .25;
  iffbpct = .1;
  pullPct = .40;
  centPct = .35;
  oppPct = .25;
  constructor(private sharedFunctionsService: SharedFunctionsService, private staticListsService: StaticListsService) {

  }

    getSoftPercentage(skill) {
    if (skill <= 30) {
      return .27;
    } else {
      return (65 - (skill - 35)) / 65 * (.3 - .07) + .07;
    }
  }

  getModifierPercentage(min, max, skill, isNegative) {
    if (isNegative) {
      return (100 - skill) / 100 * (max - min);
    } else {
      return (skill) / 100 * (max - min);
    }
  }

  getTrajectoryPercentage(pitcher, trajectoryType) {
    if (trajectoryType === 'gb') {
      if (pitcher.pitchingAbility.type === this.staticListsService.pitcherTypes.groundBall) {
        return this.gbpct + ((pitcher.pitchingAbility.movement - 25) / 75 * .1)
      } else if (pitcher.pitchingAbility.type === this.staticListsService.pitcherTypes.flyBall) {
        return this.gbpct - ((pitcher.pitchingAbility.movement - 25) / 75 * .075)
      } else {
        return this.gbpct
      }
    } else if (trajectoryType === 'ld') {
      if (pitcher.pitchingAbility.type === this.staticListsService.pitcherTypes.groundBall) {
        return this.ldpct - ((pitcher.pitchingAbility.movement - 25) / 75 * .05)
      } else if (pitcher.pitchingAbility.type === this.staticListsService.pitcherTypes.flyBall) {
        return this.ldpct - ((pitcher.pitchingAbility.movement - 25) / 75 * .05)
      } else {
        return this.ldpct
      }
    } else if (trajectoryType === 'fb') {
      if (pitcher.pitchingAbility.type === this.staticListsService.pitcherTypes.groundBall) {
        return this.fbpct - ((pitcher.pitchingAbility.movement - 25) / 75 * .05)
      } else if (pitcher.pitchingAbility.type === this.staticListsService.pitcherTypes.flyBall) {
        return this.fbpct + ((pitcher.pitchingAbility.movement - 25) / 75 * .1)
      } else {
        return this.fbpct
      }
    }
  }

  getHitType(homerun, speed, double) {
    const hitTypeRand = Math.random();
    const triple = speed > 50 ? .025 + (speed - 50) / 50 * .15 : .025;
    if (hitTypeRand < homerun) {
      return 'homerun'
    } else if (hitTypeRand < triple) {
      return 'triple'
    } else if (hitTypeRand < double) {
      return 'double'
    } else {
      return 'single'
    }
  }

  getErrorChance(trajectory, contactQuality, isHomeTeam, fielder, fieldingPosition) {
    if (trajectory === 'iffb') {
      return 0
    }

    let probability;
    if (contactQuality === 'soft') {
      probability = .0175;
    } else if (contactQuality === 'medium') {
      probability = .0225;
    } else {
      probability = .0375;
    }

    if (trajectory === 'gb') {
      probability = probability * 1.5;
      probability = Math.max(0, probability
        + (50 - this.sharedFunctionsService.getBestFieldingAtPostion(fielder, fieldingPosition)) / 50 * .0325)
    } else if (trajectory === 'fb' ) {
      probability = probability * .5;
      probability = Math.max(0, probability
        + (50 - this.sharedFunctionsService.getBestFieldingAtPostion(fielder, fieldingPosition)) / 50 * .0275)
    } else {
      probability = Math.max(0, probability
        + (50 - this.sharedFunctionsService.getBestFieldingAtPostion(fielder, fieldingPosition)) / 50 * .0225)
  }

    if (!isHomeTeam) {
      probability += .005
    }
    return probability;
  }

  getHitDirection(battingSide) {
    const directionRand = Math.random();
    if (directionRand < this.pullPct) {
      return battingSide === 'L' ? 'right' : 'left';
    } else if (directionRand < this.pullPct + this.centPct) {
      return 'center';
    } else {
      return battingSide === 'R' ? 'left' : 'right';
    }
  }

  getFielder(fieldingTeam: Array<GamePlayer>, fieldingPosition: string) {
    return _.find(fieldingTeam, function(player) {
      return player.position === fieldingPosition;
    }).player;
  }

  getFieldingPosition(fieldingTeam: Array<GamePlayer>, hitDirection, trajectory) {
    const rand = Math.random();
    if (hitDirection === 'left') {
      if (trajectory === 'gb') {
        if (rand < .5) {
          return this.staticListsService.positions.thirdBase;
        } else {
          return this.staticListsService.positions.shortStop;
        }
      } else if (trajectory === 'ld') {
        if (rand < .7) {
          return this.staticListsService.positions.leftField;
        } else if (rand < .85) {
          return this.staticListsService.positions.thirdBase;
        } else {
          return this.staticListsService.positions.shortStop;
        }
      } else {
        return this.staticListsService.positions.leftField
      }
    } else if (hitDirection === 'center') {
      if (trajectory === 'gb') {
        if (rand < .45) {
          return this.staticListsService.positions.secondBase
        } else if (rand < .9)  {
          return this.staticListsService.positions.shortStop
        } else {
          return this.staticListsService.positions.pitcher
        }
      } else if (trajectory === 'ld') {
        if (rand < .7) {
          return this.staticListsService.positions.centerField
        } else if (rand < .8) {
          return this.staticListsService.positions.secondBase
        } else if (rand < .9) {
          return this.staticListsService.positions.shortStop
        } else {
          return this.staticListsService.positions.pitcher
        }
      } else {
        return this.staticListsService.positions.centerField
      }
    } else {
      if (trajectory === 'gb') {
        if (rand < .5) {
          return this.staticListsService.positions.firstBase
        } else {
          return this.staticListsService.positions.secondBase
        }
      } else if (trajectory === 'ld') {
        if (rand < .7) {
          return this.staticListsService.positions.rightField
        } else if (rand < .85) {
          return this.staticListsService.positions.firstBase
        } else {
          return this.staticListsService.positions.secondBase
        }
      } else {
        return this.staticListsService.positions.rightField
      }
    }
  }

  getFileidingModifiedPercentageByPlayer(position: string, originalChance: number,
                                        fieldingTeam: Array<GamePlayer>, chanceOfFielding: number) {
    const that = this
    const fieldingAtPosition = this.sharedFunctionsService.getBestFieldingAtPostion(
      _.find(fieldingTeam, {position: position}).player, position)
    return (fieldingAtPosition - 45) / 45 * originalChance * .1 * chanceOfFielding
  }

  getFieldingModifiedFieldedChance(originalChance: number, trajectory: string, hitDirection: string, fieldingTeam: Array<GamePlayer>) {
      const that = this
      if (hitDirection === 'left') {
        if (trajectory === 'gb') {
          return originalChance
            + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.shortStop, originalChance, fieldingTeam, .5)
            + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.thirdBase, originalChance, fieldingTeam, .5)
        } else if (trajectory === 'ld') {
          return originalChance
            + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.shortStop, originalChance, fieldingTeam, .15)
            + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.thirdBase, originalChance, fieldingTeam, .15)
            + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.leftField, originalChance, fieldingTeam, .7)
        } else {
          return originalChance
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.leftField, originalChance, fieldingTeam, 1)
        }
      } else if (hitDirection === 'center') {
        if (trajectory === 'gb') {
          return originalChance
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.secondBase, originalChance, fieldingTeam, .45)
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.shortStop, originalChance, fieldingTeam, .45)
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.pitcher, originalChance, fieldingTeam, .1)
        } else if (trajectory === 'ld') {
          return originalChance
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.centerField, originalChance, fieldingTeam, .7)
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.secondBase, originalChance, fieldingTeam, .1)
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.shortStop, originalChance, fieldingTeam, .1)
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.pitcher, originalChance, fieldingTeam, .1)
        } else {
          return originalChance
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.centerField, originalChance, fieldingTeam, 1)
        }
      } else {
        if (trajectory === 'gb') {
          return originalChance
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.firstBase, originalChance, fieldingTeam, .5)
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.secondBase, originalChance, fieldingTeam, .5)
        } else if (trajectory === 'ld') {
          return originalChance
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.rightField, originalChance, fieldingTeam, .7)
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.firstBase, originalChance, fieldingTeam, .15)
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.secondBase, originalChance, fieldingTeam, .15)
        } else {
          return originalChance
          + that.getFileidingModifiedPercentageByPlayer(that.staticListsService.positions.rightField, originalChance, fieldingTeam, 1)
        }
      }
  }

  getFieldedBallOutcome(trajectory, hitDirection, contactType, fieldingTeam, isHomeTeam) {
    const fieldingPosition = this.getFieldingPosition(fieldingTeam, hitDirection, trajectory)
    const fielder = this.getFielder(fieldingTeam, fieldingPosition);
    if (Math.random() < this.getErrorChance(trajectory, contactType, isHomeTeam, fielder, fieldingPosition)) {
      return new AtBat('error', contactType, trajectory, hitDirection, fielder._id, _.random(1, 7))
    }
      return new AtBat('out', contactType, trajectory, hitDirection, fielder._id, _.random(1, 7))
    }

  atBat(batter, pitcher, catcher, fieldingTeam, fieldingTeamIsHome = false) {
    const contactRand = Math.random();
    const strikeOutProb = Math.max(.03, this.getModifierPercentage(.04, .36, batter.hittingAbility.contact, true)
     + this.getModifierPercentage(.04, .36, pitcher.pitchingAbility.velocity, false)
     + this.getModifierPercentage(0, .04, this.sharedFunctionsService.getBestFieldingAtPostion(catcher, 'C'), false)
     - .14);
     const walkProb = Math.max(0, this.getModifierPercentage(0, .07, batter.hittingAbility.patience, false)
     + this.getModifierPercentage(0, .07, pitcher.pitchingAbility.control, true) +
     - this.getModifierPercentage(0, .04, this.sharedFunctionsService.getBestFieldingAtPostion(catcher, 'C'), false)
     + .02);
     if (contactRand < strikeOutProb) {
      return new AtBat('strikeout', 'none', 'none', 'none', '', _.random(3, 7));
     } else if (contactRand < strikeOutProb + walkProb) {
      return new AtBat('walk', 'none', 'none', 'none', '', _.random(4, 7));
     } else {
      const contactTypeRand = Math.random();
      const battingSide = batter.bats === 'B' ? (pitcher.throws === 'L' ? 'R' : 'L') : batter.bats;
      const hitDirection = this.getHitDirection(battingSide)
      const hardHitProb = this.getModifierPercentage(.14, .5, batter.hittingAbility.power, false) + .14;
      const softHitProb = this.getSoftPercentage(batter.hittingAbility.power);
      const mediumHitProb = 1 - hardHitProb - softHitProb;
      if (contactTypeRand < hardHitProb) {
        const trajectoryRandom = Math.random();
        if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.64, 'gb', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('gb', hitDirection, 'hard', fieldingTeam, fieldingTeamIsHome);
          } else {
            return new AtBat(this.getHitType(0, 0, .185 + batter.hittingAbility.contact * .002), 'hard',
            'gb', hitDirection, '', _.random(1, 7));
          }
        } else if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb') + this.getTrajectoryPercentage(pitcher, 'ld')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.29, 'ld', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('ld', hitDirection, 'hard', fieldingTeam, fieldingTeamIsHome);
          } else {
             return new AtBat(this.getHitType( batter.hittingAbility.power * .006 - .04,
              batter.hittingAbility.speed, .23 + batter.hittingAbility.contact * .004), 'hard', 'ld', hitDirection, '', _.random(1, 7));
          }
         } else if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb') +
         this.getTrajectoryPercentage(pitcher, 'ld') + this.getTrajectoryPercentage(pitcher, 'fb')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.64, 'fb', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('fb', hitDirection, 'hard', fieldingTeam, fieldingTeamIsHome);
          } else {
             return new AtBat(this.getHitType(.11 + batter.hittingAbility.power * .007,
              batter.hittingAbility.speed, .23 + batter.hittingAbility.contact * .004), 'hard', 'fb', hitDirection, '', _.random(1, 7));
          }
        } else {
          return this.getFieldedBallOutcome('iffb', hitDirection, 'hard', fieldingTeam, fieldingTeamIsHome);
        }
      } else if (contactTypeRand < hardHitProb + mediumHitProb) {
        const trajectoryRandom = Math.random();
        if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.69, 'gb', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('gb', hitDirection, 'medium', fieldingTeam, fieldingTeamIsHome);
          } else {
            return new AtBat(this.getHitType(0, 0, .18 + batter.hittingAbility.contact * .003), 'medium',
            'gb', hitDirection, '', _.random(1, 7));
          }
        } else if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb') + this.getTrajectoryPercentage(pitcher, 'ld')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.34, 'ld', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('ld', hitDirection, 'medium', fieldingTeam, fieldingTeamIsHome);
          } else {
             return new AtBat(this.getHitType(batter.hittingAbility.power * .002 - .015,
              batter.hittingAbility.speed, .05 + batter.hittingAbility.contact * .004), 'medium',
              'ld', hitDirection, '', _.random(1, 7));
          }
         } else if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb') +
         this.getTrajectoryPercentage(pitcher, 'ld') + this.getTrajectoryPercentage(pitcher, 'fb')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.74, 'fb', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('fb', hitDirection, 'medium', fieldingTeam, fieldingTeamIsHome);
          } else {
             return new AtBat(this.getHitType(batter.hittingAbility.power * .004 - .015, batter.hittingAbility.speed,
              .05 + batter.hittingAbility.contact * .004), 'medium', 'fb', hitDirection, '', _.random(1, 7));
          }
        } else {
          return this.getFieldedBallOutcome('iffb', hitDirection, 'medium', fieldingTeam, fieldingTeamIsHome);
        }
      } else {
        const trajectoryRandom = Math.random();
        if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.74, 'gb', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('gb', hitDirection, 'soft', fieldingTeam, fieldingTeamIsHome);
          } else {
            return new AtBat('single', 'soft', 'gb', hitDirection, '', _.random(1, 7));
          }
        } else if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb') + this.getTrajectoryPercentage(pitcher, 'ld')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.49, 'ld', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('ld', hitDirection, 'soft', fieldingTeam, fieldingTeamIsHome);
          } else {
            return new AtBat(this.getHitType(0, 0,  batter.hittingAbility.contact * .003 + .05), 'soft',
            'ld', hitDirection, '', _.random(1, 7));
          }
         } else if (trajectoryRandom < this.getTrajectoryPercentage(pitcher, 'gb') +
         this.getTrajectoryPercentage(pitcher, 'ld') + this.getTrajectoryPercentage(pitcher, 'fb')) {
          if (Math.random() < this.getFieldingModifiedFieldedChance(.85, 'fb', hitDirection, fieldingTeam)) {
            return this.getFieldedBallOutcome('fb', hitDirection, 'soft', fieldingTeam, fieldingTeamIsHome);
          } else {
            return new AtBat(this.getHitType(0, 0, batter.hittingAbility.contact * .003 + .05), 'soft',
            'fb', hitDirection, '', _.random(1, 7));
          }
        } else {
          return this.getFieldedBallOutcome('iffb', hitDirection, 'soft', fieldingTeam, fieldingTeamIsHome);
        }
      }
     }
  }
}
