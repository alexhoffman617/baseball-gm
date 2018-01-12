import { Injectable } from '@angular/core';
import { Season, ScheduledDay, ScheduledGame } from '../models/season';
import { RealMlbScheduleGenerator } from '../services/real-mlb-schedule.generator';
import { LeagueDataService } from './league-data.service';

@Injectable()
export class SeasonGenerator {

    constructor(private leagueDataService: LeagueDataService, private realMlbScheduleGenerator: RealMlbScheduleGenerator) {

     }

    async generateSeason(leagueId: string, teamIds: any, year: number, structure = null) {
        let schedule
        if (!!structure) {
          schedule = this.realMlbScheduleGenerator.generateRealMlbSchedule(structure)
        } else {
          schedule = this.createNewSchedule(teamIds)
        }
        if (!year) {
          year = (new Date()).getFullYear()
        }
        const season = new Season(year, schedule, leagueId);
        return await this.leagueDataService.createSeason(season);
    }

    createNewSchedule(teamIds: Array<string>) {
        const schedule = new Array<ScheduledDay>();
        this.shuffleArray(teamIds);
        while (schedule.length < 162) {
            for (let i = 0; i < (teamIds.length - 1) * 2; i++) {
                const l1 = teamIds.slice(0, teamIds.length / 2);
                const l2 = teamIds.slice(teamIds.length / 2);
                l2.reverse();

                const scheduledGames = new Array<ScheduledGame>();
                if (i % 2 === 1) {
                    for (let j = 0; j < l2.length; j++) {
                    scheduledGames.push(new ScheduledGame(l2[j], l1[j]));
                    }
                } else {
                    for (let j = 0; j < l2.length; j++) {
                    scheduledGames.push(new ScheduledGame(l1[j], l2[j]));
                    }
                }
                schedule.push(new ScheduledDay(scheduledGames))
                const pop = teamIds.pop();
                const shift = teamIds.shift();
                teamIds.unshift(pop);
                teamIds.unshift(shift);
            }
        }
        return schedule;
    }

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
    }
}
