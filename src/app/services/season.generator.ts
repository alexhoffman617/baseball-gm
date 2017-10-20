import { Injectable } from '@angular/core';
import { Season, ScheduledDay, ScheduledGame } from '../models/season';
import { SeasonService } from '../backendServices/season/season.service';

@Injectable()
export class SeasonGenerator {

    constructor(private seasonService: SeasonService) {

     }

    async generateSeason(leagueId: string, teamIds: Array<string>, year: number) {
        const schedule = this.createNewSchedule(teamIds);
        if (!year) {
          year = (new Date()).getFullYear()
        }
        const season = new Season(year, schedule, leagueId);
        return await this.seasonService.createSeason(season);
    }

    createNewSchedule(teamIds: Array<string>){
        var schedule = new Array<ScheduledDay>();
        this.shuffleArray(teamIds);
        while(schedule.length < 162){
            for(var i = 0; i < (teamIds.length - 1) * 2; i++){
                var l1 = teamIds.slice(0, teamIds.length/2);
                var l2 = teamIds.slice(teamIds.length/2);
                l2.reverse();

                var scheduledGames = new Array<ScheduledGame>();
                if(i % 2 == 1){
                    for(var j = 0; j < l2.length; j++){
                    scheduledGames.push(new ScheduledGame(l2[j], l1[j]));
                    }
                }
                else{
                    for(var j = 0; j < l2.length; j++){
                    scheduledGames.push(new ScheduledGame(l1[j], l2[j]));
                    }
                }
                schedule.push(new ScheduledDay(scheduledGames))
                var pop = teamIds.pop();
                var shift = teamIds.shift();
                teamIds.unshift(pop);
                teamIds.unshift(shift);
            }
        }
        return schedule;
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}
