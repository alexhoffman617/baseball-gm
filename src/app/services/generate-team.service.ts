import { Injectable } from '@angular/core';
import { Player  } from '../models/player';
import { Team, Roster, RosterSpot } from '../models/team';
import { GeneratePlayerService } from './generate-player.service';
import { LeagueDataService } from './league-data.service';
import { StaticListsService } from './static-lists.service';
import 'rxjs/add/operator/toPromise';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import * as _ from 'lodash';

@Injectable()
export class GenerateTeamService {
    players = [];
    constructor(private generatePlayerSerivce: GeneratePlayerService,
                private staticListsService: StaticListsService,
                private sharedFunctionsService: SharedFunctionsService,
                private leagueDataService: LeagueDataService) { }

    async generateRandomTeam(leagueId: string, fantasyDraft: boolean, ownerAccountId: string = null) {
      const team = await this.leagueDataService.createTeam(new Team(this.getTeamName(), this.getTeamLocation(),
      this.getRandomColor(), this.getRandomColor(), new Roster(new Array<RosterSpot>(),
      new Array<RosterSpot>(), new Array<RosterSpot>(), new Array<RosterSpot>()), leagueId)) as Team;
      team.ownerAccountId = ownerAccountId
      if (fantasyDraft) {
        return team
      } else {
        return await this.generateTeam(leagueId, team)
      }
    }

    async generateMlbTeam(leagueId: string, mlbTeamIndex: number, fantasyDraft: boolean, ownerAccountId: string = null) {
      const team = await this.leagueDataService.createTeam(new Team(this.staticListsService.mlbTeams[mlbTeamIndex].name,
         this.staticListsService.mlbTeams[mlbTeamIndex].location, this.staticListsService.mlbTeams[mlbTeamIndex].primaryColor,
        this.staticListsService.mlbTeams[mlbTeamIndex].secondaryColor, new Roster(new Array<RosterSpot>(),
        new Array<RosterSpot>(), new Array<RosterSpot>(), new Array<RosterSpot>()), leagueId)) as Team;
      team.ownerAccountId = ownerAccountId
      if (fantasyDraft) {
        return team
      } else {
        return await this.generateTeam(leagueId, team)
      }
    }

    async generateTeam(leagueId: string, team: Team) {
        for (let x = 0; x < 22; x++) {
          const batter = await this.generatePlayerSerivce.generateBatter(leagueId, team._id, (new Date()).getFullYear());
          team.roster.batterReserves.push(new RosterSpot(batter._id, null, null));
        }

        for (let y = 0; y < 18; y++) {
          const pitcher = await this.generatePlayerSerivce.generatePitcher(leagueId, team._id, (new Date()).getFullYear());
          team.roster.pitcherReserves.push(new RosterSpot(pitcher._id, null, null));
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

    getRandomColor() {
      const colors = [
        '#6d8572',
        '#343a83',
        '#fae705',
        '#b32735',
        '#ffb400',
        '#0c5b09',
        '#131d24',
        '#a20b20',
        '#000080',
        '#008000',
        '#7c519f',
        '#36127f',
        '#a95e00',
        '#adadad',
        '#FC4C02',
        '#C8102E',
        '#0C2340',
        '#092C5C',
        '#8FBCE6',
        '#134A8E',
        '#8A8D8F',
        '#D50032',
        '#7AB2DD',
        '#C09A5B',
        '#BA0C2F',
        '#034638',
        '#FFB81C',
        '#00685E',
        '#ED6F2E',
        '#0077C8',
        '#8A8D8F',
        '#002D72',
        '#BA0C2F',
        '#BA122B',
        '#002F6C',
        '#D50032',
        '#13294B',
        '#85714D',
        '#FFC72C',
        '#A71930',
        '#E3D4AD',
        '#041E42',

      ]

      return colors[_.random(colors.length - 1)]
    }
  }
