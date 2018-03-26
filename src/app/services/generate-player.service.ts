import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Player, HittingSkillset, PitchingSkillset, BatterSeasonStats, PitcherSeasonStats, FieldingSeasonStats } from '../models/player';
import { LeagueDataService } from './league-data.service';
import { StaticListsService } from './static-lists.service';
import 'rxjs/add/operator/toPromise';
import { Contract } from 'app/models/contract';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import { ContractExpectationService } from 'app/services/contract-expectation.service';
import { RandomFaceService } from './random-face.service';
import * as _ from 'lodash';

@Injectable()
export class GeneratePlayerService {

    constructor(private http: Http,
                private staticListsService: StaticListsService,
                private sharedFunctionsService: SharedFunctionsService,
                private contractExpectationService: ContractExpectationService,
                private randomFaceService: RandomFaceService,
                private leagueDataService: LeagueDataService) { }

    async generateFreeAgents(leagueId: string, year: number, numberNeeded: number) {
     for (let x = 0; x < numberNeeded; x++) {
      if (Math.random() < .6) {
        await this.generateBatter(leagueId, null, year)
      } else {
        await this.generatePitcher(leagueId, null, year)
      }
     }
    }

    async generateProspect(leagueId: string, year: number) {
      const age = Math.round(18 + Math.random() * 5)
      if (Math.random() > .5) {
        return await this.generateBatter(leagueId, null, year, age, true)
      } else {
        return await this.generatePitcher(leagueId, null, year, age, true)
      }
    }

    async generateBatter(leagueId: string, teamId: string, year: number, age: number = null, isProspect: boolean = false) {
      const name = this.staticListsService.firstNames[Math.round(Math.random() * (this.staticListsService.firstNames.length - 1))] + ' '
      + this.staticListsService.lastNames[Math.round(Math.random() * (this.staticListsService.lastNames.length - 1))]
        if (!age) { age = Math.round(18 + Math.random() * 22) };
        const potential = new HittingSkillset(
          this.generatePotentialValue(age, isProspect),
          this.generatePotentialValue(age, isProspect),
          this.generatePotentialValue(age, isProspect),
          this.generatePotentialValue(age, isProspect),
          this.generatePotentialValue(age, isProspect),
          this.generateBatterStamina());

        const skills = new HittingSkillset(
          this.generateSkillValue('contact', age, potential),
          this.generateSkillValue('power', age, potential),
          this.generateSkillValue('patience', age, potential),
          this.generateSkillValue('speed', age, potential),
          this.generateSkillValue('fielding', age, potential),
          potential.stamina);

        const player = new Player(name, age, this.staticListsService.playerTypes.batter, this.getBattingSide(), this.getThrowingSide(),
                       skills, potential, new PitchingSkillset(0, 0, 0, 0, 'std'),
                       new PitchingSkillset(0, 0, 0, 0, 'std'), leagueId, teamId, year,
                       this.getPrimaryPositions(), this.randomFaceService.generateRandomFace());
        player.hittingSeasonStats = [new BatterSeasonStats(year)]
        player.pitchingSeasonStats = [new PitcherSeasonStats(year)]
        player.fieldingSeasonStats = [new FieldingSeasonStats(year)]
        if (player.teamId) {
          player.contracts.push(new Contract(player._id, teamId, Math.max(500000,
            Math.round(this.contractExpectationService.getContractExpectations(player).salary * .6 / 100000) * 100000),
          year, 1 + Math.round(Math.random() * 3), this.staticListsService.contractStates.accepted, 0))
        }
        const dbPlayer = await this.leagueDataService.createPlayer(player);
        return dbPlayer as Player;
    }

    async generatePitcher(leagueId: string, teamId: string, year: number, age: number = null, isProspect: boolean = false) {
        const name = this.staticListsService.firstNames[Math.round(Math.random() * this.staticListsService.firstNames.length)] + ' '
            + this.staticListsService.lastNames[Math.round(Math.random() * this.staticListsService.lastNames.length)]
        if (!age) { age = Math.round(18 + Math.random() * 22) }
        const potential = new PitchingSkillset(
            this.generatePotentialValue(age, isProspect),
            this.generatePotentialValue(age, isProspect),
            this.generatePotentialValue(age, isProspect),
            this.generatePitcherStamina(),
            this.getPitcherType());

        const skills = new PitchingSkillset(
            this.generateSkillValue('velocity', age, potential, isProspect),
            this.generateSkillValue('control', age, potential, isProspect),
            this.generateSkillValue('movement', age, potential, isProspect),
            potential.stamina,
            potential.type);

        const player =  new Player(name, age, this.staticListsService.playerTypes.pitcher, this.getBattingSide(), this.getThrowingSide(),
             new HittingSkillset(0, 0, 0, 0, 0, 0), new HittingSkillset(0, 0, 0, 0, 0, 0), skills,
            potential, leagueId, teamId, year, ['P'], this.randomFaceService.generateRandomFace());
        player.hittingSeasonStats = [new BatterSeasonStats(year)]
        player.pitchingSeasonStats = [new PitcherSeasonStats(year)]
        player.fieldingSeasonStats = [new FieldingSeasonStats(year)]
        if (player.teamId) {
          player.contracts.push(new Contract(player._id, teamId,
            Math.max(500000, Math.round(this.contractExpectationService.getContractExpectations(player).salary * .6 / 100000) * 100000),
             year, 1 + Math.round(Math.random() * 4), this.staticListsService.contractStates.accepted, 0))
        }
        const dbPlayer = await this.leagueDataService.createPlayer(player);
        return dbPlayer as Player;
    }

    getBattingSide() {
      const rand = Math.random();
      if (rand < .125) {
          return 'B';
      } else if (rand < .4) {
          return 'L';
      } else {
          return 'R';
      }
    }

    getThrowingSide() {
        const rand = Math.random();
        if (rand < .3) {
            return 'L';
        } else {
            return 'R';
        }
    }

    generatePotentialValue(age, prospect: boolean = false) {
      let value
      if (prospect) {
        value = 25 + Math.round(Math.random() * 75)
      } else {
        value = 20 + Math.round(Math.random() * 40) + Math.round(Math.random() * 40);
      }
        // if (value > 90 && Math.random() < .66) {
        //     value -= 10;
        // } else if (value > 80 && Math.random() < .5) {
        //   value -= 10;
        // }
      if (age > 30) {
        const garunteedValue = .8 - Math.abs(30 - age) / 10 * .3
       value = Math.round(value * (garunteedValue + Math.random() * 1 - garunteedValue))
      }
      return value;
    }

    generateSkillValue(skill, age, potential, isProspect = false) {
    const garunteedValue = .2 + Math.min(9, age - 18) / 9 * .4
    let value
    if (isProspect) {
      const percentileRand = Math.random()
      if (percentileRand < .45) {
        value = _.random(0, Math.round((potential[skill] / 3)))
      } else if (percentileRand < .8) {
        value = _.random(Math.round(potential[skill] / 3), Math.round(potential[skill] * 2 / 3))
      } else {
        value = _.random(Math.round(potential[skill] * 2 / 3), Math.round(potential[skill]))
      }
    } else {
      value = Math.round(garunteedValue * potential[skill] + Math.random() * potential[skill] * (1 - garunteedValue));
    }
    return value;
    }

    getPitcherType() {
      const rand = Math.random();
      if (rand < .33) {
          return this.staticListsService.pitcherTypes.groundBall;
      } else if (rand < .66) {
          return this.staticListsService.pitcherTypes.flyBall;
      }
      return this.staticListsService.pitcherTypes.standard;
    }

    getPrimaryPositions() {
      const positions = []
      const index1 = Math.round(Math.random() * (this.staticListsService.fieldingPositions.length - 1))
      positions.push(this.staticListsService.fieldingPositions[index1])
      if (Math.random() < .15) {
         const index2 = Math.round(Math.random() * (this.staticListsService.fieldingPositions.length - 1))
         if (index1 !== index2) {
          positions.push(this.staticListsService.fieldingPositions[index2])
         }
      }
      return positions
    }

    generatePitcherStamina() {
      return 20 + Math.round(Math.random() * 80)
    }

    generateBatterStamina() {
      return 20 + Math.round(Math.random() * 80)
    }
}


