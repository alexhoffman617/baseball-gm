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

    async generateLeague() {
        const league = new League(4, 'test');
        const createdLeague = await this.leagueService.createLeague(league);
        const teamIds = []
        for (let x = 0; x < league.numberOfTeams; x++) {
            const team = await this.generateTeamService.generateTeam(createdLeague._id)
            teamIds.push(team._id)
        }
        this.seasonGenerator.generateSeason(createdLeague._id, teamIds, null)
    }

}
