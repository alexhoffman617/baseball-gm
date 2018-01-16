import { Injectable } from '@angular/core';
import { Player  } from '../models/player';
import { Team, Roster, RosterSpot } from '../models/team';
import { GeneratePlayerService } from './generate-player.service';
import { LeagueDataService } from './league-data.service';
import { StaticListsService } from './static-lists.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenerateTeamService {
    players = [];
    constructor(private generatePlayerSerivce: GeneratePlayerService,
                private staticListsService: StaticListsService,
                private leagueDataService: LeagueDataService) { }

    async generateRandomTeam(leagueId: string) {
      const team = await this.leagueDataService.createTeam(new Team(this.getTeamName(), this.getTeamLocation(),
        new Roster(new Array<RosterSpot>(), new Array<RosterSpot>()), leagueId)) as Team;
      return await this.generateTeam(leagueId, team)
    }

    async generateMlbTeam(leagueId: string, mlbTeamIndex: number) {
      const team = await this.leagueDataService.createTeam(new Team(this.staticListsService.mlbTeamNames[mlbTeamIndex],
         this.staticListsService.mlbLocations[mlbTeamIndex],
         new Roster(new Array<RosterSpot>(), new Array<RosterSpot>()), leagueId)) as Team;
      return await this.generateTeam(leagueId, team)
    }

    async generateTeam(leagueId: string, team: Team) {
        for (let x = 0; x < 15; x++) {
            const batter = await this.generatePlayerSerivce.generateBatter(leagueId, team._id, (new Date()).getFullYear());
            this.players.push(batter);
            if (x < 9) {
              team.roster.batters.push(new RosterSpot(batter._id, this.staticListsService.fieldingPositions[x], x + 1));
            } else {
              team.roster.batters.push(new RosterSpot(batter._id, null, null));
            }
        }

        for (let y = 0; y < 10; y++) {
            const pitcher = await this.generatePlayerSerivce.generatePitcher(leagueId, team._id, (new Date()).getFullYear());
            this.players.push(pitcher);
            if (y < 5) {
              team.roster.pitchers.push(new RosterSpot(pitcher._id, this.staticListsService.pitcherRoles[y], null));
            } else {
              team.roster.pitchers.push(new RosterSpot(pitcher._id, null, null));
            }
        }
        const updatedTeam = await this.leagueDataService.updateTeam(team);
        return updatedTeam as Team
    }

    getTeamName() {
        return this.staticListsService.teamNames[Math.round(Math.random() * (this.staticListsService.teamNames.length - 1))];
    }

    getTeamLocation() {
        return this.staticListsService.teamLocations[Math.round(Math.random() * (this.staticListsService.teamLocations.length - 1))];
    }
  }
