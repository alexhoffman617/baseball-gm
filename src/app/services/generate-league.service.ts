import { Injectable } from '@angular/core';
import { League } from '../models/league';
import { Team, Roster, RosterSpot } from '../models/team';
import { GenerateTeamService } from './generate-team.service';
import { SeasonGenerator } from './season.generator';
import { LeagueService } from '../backendServices/league/league.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenerateLeagueService {

    constructor(private leagueService: LeagueService,
                private generateTeamService: GenerateTeamService,
                private seasonGenerator: SeasonGenerator) {

     }

    async generateLeague(leagueName: string, numberOfTeams: number) {
        const league = new League(numberOfTeams, 'test', leagueName);
        const createdLeague = await this.leagueService.createLeague(league);
        const teamIds = []
        for (let x = 0; x < league.numberOfTeams; x++) {
            const team = await this.generateTeamService.generateTeam(createdLeague._id)
            teamIds.push(team._id)
        }
        if (numberOfTeams === 30) {
          const leagueArray = [
            [teamIds.slice(0, 5), teamIds.slice(5, 10), teamIds.slice(10, 15)],
            [teamIds.slice(15, 20), teamIds.slice(20, 25), teamIds.slice(25, 30)]
          ]
          league.structure = leagueArray
          this.leagueService.updateLeague(league)
        }
        this.seasonGenerator.generateSeason(createdLeague._id, teamIds, null, league.structure)
    }

}
