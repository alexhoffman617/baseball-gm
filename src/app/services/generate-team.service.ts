import { Injectable } from '@angular/core';
import { Player  } from '../models/player';
import { Team, Roster, RosterSpot } from '../models/team';
import { GeneratePlayerService } from './generate-player.service';
import { LeagueDataService } from './league-data.service';
import { StaticListsService } from './static-lists.service';
import 'rxjs/add/operator/toPromise';
import { SharedFunctionsService } from 'app/services/shared-functions.service';

@Injectable()
export class GenerateTeamService {
    players = [];
    constructor(private generatePlayerSerivce: GeneratePlayerService,
                private staticListsService: StaticListsService,
                private sharedFunctionsService: SharedFunctionsService,
                private leagueDataService: LeagueDataService) { }

    async generateRandomTeam(leagueId: string,  ownerAccountId: string = null) {
      const team = await this.leagueDataService.createTeam(new Team(this.getTeamName(), this.getTeamLocation(),
        new Roster(new Array<RosterSpot>(), new Array<RosterSpot>(), new Array<RosterSpot>(), new Array<RosterSpot>()), leagueId)) as Team;
      team.ownerAccountId = ownerAccountId
      return await this.generateTeam(leagueId, team)
    }

    async generateMlbTeam(leagueId: string, mlbTeamIndex: number, ownerAccountId: string = null) {
      const team = await this.leagueDataService.createTeam(new Team(this.staticListsService.mlbTeamNames[mlbTeamIndex],
         this.staticListsService.mlbLocations[mlbTeamIndex],
         new Roster(new Array<RosterSpot>(), new Array<RosterSpot>(), new Array<RosterSpot>(), new Array<RosterSpot>()), leagueId)) as Team;
      team.ownerAccountId = ownerAccountId
      return await this.generateTeam(leagueId, team)
    }

    async generateTeam(leagueId: string, team: Team) {
        for (let x = 0; x < 22; x++) {
          const batter = await this.generatePlayerSerivce.generateBatter(leagueId, team._id, (new Date()).getFullYear());
          if (x < 13) {
            team.roster.batters.push(new RosterSpot(batter._id, null, null));
          } else {
            team.roster.batterReserves.push(new RosterSpot(batter._id, null, null));
          }
        }

        for (let y = 0; y < 18; y++) {
          const pitcher = await this.generatePlayerSerivce.generatePitcher(leagueId, team._id, (new Date()).getFullYear());
          if (y < 12) {
            team.roster.pitchers.push(new RosterSpot(pitcher._id, null, null));
          } else {
            team.roster.pitcherReserves.push(new RosterSpot(pitcher._id, null, null));
          }
        }
        this.leagueDataService.updateTeam(team);
        return team as Team
    }

    getTeamName() {
        return this.staticListsService.teamNames[Math.round(Math.random() * (this.staticListsService.teamNames.length - 1))];
    }

    getTeamLocation() {
        return this.staticListsService.teamLocations[Math.round(Math.random() * (this.staticListsService.teamLocations.length - 1))];
    }
  }
