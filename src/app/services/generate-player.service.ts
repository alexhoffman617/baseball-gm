import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Player, HittingSkillset, PitchingSkillset, BatterSeasonStats, PitcherSeasonStats, FieldingSeasonStats } from '../models/player';
import { LeagueDataService } from './league-data.service';
import { StaticListsService } from './static-lists.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GeneratePlayerService {

    constructor(private http: Http,
                private staticListsService: StaticListsService,
                private leagueDataService: LeagueDataService) { }

    async generateFreeAgents(leagueId: string, year: number, numberNeeded: number) {
     for (let x = 0; x < numberNeeded; x++) {
      if (x % 2 === 1) {
        await this.generateBatter(leagueId, null, year)
      } else {
        await this.generatePitcher(leagueId, null, year)
      }
     }
    }
    async generateBatter(leagueId: string, teamId: string, year: number) {
      const name = this.staticListsService.firstNames[Math.round(Math.random() * this.staticListsService.firstNames.length)] + ' '
      + this.staticListsService.lastNames[Math.round(Math.random() * this.staticListsService.lastNames.length)]
        const age = Math.round(18 + Math.random() * 22);
        const potential = new HittingSkillset(
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.generatePotentialValue(age));

        const skills = new HittingSkillset(
            this.generateSkillValue('contact', age, potential),
            this.generateSkillValue('power', age, potential),
            this.generateSkillValue('patience', age, potential),
            this.generateSkillValue('speed', age, potential),
            this.generateSkillValue('fielding', age, potential));

        const player = new Player(name, age, this.staticListsService.playerTypes.batter, this.getBattingSide(), this.getThrowingSide(),
                       skills, potential, new PitchingSkillset(0, 0, 0, 'std'),
                       new PitchingSkillset(0, 0, 0, 'std'), leagueId, teamId, year, this.getPrimaryPositions());
        player.hittingSeasonStats = [new BatterSeasonStats(year)]
        player.pitchingSeasonStats = [new PitcherSeasonStats(year)]
        player.fieldingSeasonStats = [new FieldingSeasonStats(year)]
        const dbPlayer = await this.leagueDataService.createPlayer(player);
        return dbPlayer as Player;
    }

    async generatePitcher(leagueId: string, teamId: string, year: number) {
        const name = this.staticListsService.firstNames[Math.round(Math.random() * this.staticListsService.firstNames.length)] + ' '
            + this.staticListsService.lastNames[Math.round(Math.random() * this.staticListsService.lastNames.length)]
        const age = Math.round(18 + Math.random() * 22);
        const potential = new PitchingSkillset(
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.getPitcherType());

        const skills = new PitchingSkillset(
            this.generateSkillValue('velocity', age, potential),
            this.generateSkillValue('control', age, potential),
            this.generateSkillValue('movement', age, potential),
            potential.type);

        const player =  new Player(name, age, this.staticListsService.playerTypes.pitcher, this.getBattingSide(), this.getThrowingSide(),
             new HittingSkillset(0, 0, 0, 0, 0), new HittingSkillset(0, 0, 0, 0, 0), skills,
            potential, leagueId, teamId, year, ['P']);
        player.hittingSeasonStats = [new BatterSeasonStats(year)]
        player.pitchingSeasonStats = [new PitcherSeasonStats(year)]
        player.fieldingSeasonStats = [new FieldingSeasonStats(year)]
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

    generatePotentialValue(age) {
    let value = 20 + Math.round(Math.random() * 40) + Math.round(Math.random() * 40);
        if (value > 90 && Math.random() < .66) {
            value -= 10;
        } else if (value > 80 && Math.random() < .5) {
          value -= 10;
        }
        if (age > 30) {
        const garunteedValue = .8 - Math.abs(30 - age) / 10 * .3
        value = Math.round(value * (garunteedValue + Math.random() * 1 - garunteedValue))
        }
        return value;
    }

    generateSkillValue(skill, age, potential) {
    const garunteedValue = .2 + Math.min(9, age - 18) / 9 * .4
    const value = Math.round(garunteedValue * potential[skill] + Math.random() * potential[skill] * (1 - garunteedValue));
    return value;
    }

    getPitcherType() {
        const rand = Math.random();
        if (rand < .33) {
            return 'gb';
        } else if (rand < .66) {
            return 'fb';
        }
        return 'std';
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
}


