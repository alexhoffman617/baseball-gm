import { Injectable } from '@angular/core';
import { League } from '../models/league';
import { Team, Roster, RosterSpot } from '../models/team';
import { GenerateTeamService } from './generate-team.service';
import { GeneratePlayerService } from './generate-player.service';
import { SeasonGenerator } from './season.generator';
import { SharedFunctionsService } from './shared-functions.service';
import { LeagueDataService } from './league-data.service'
import 'rxjs/add/operator/toPromise';
import * as io from 'socket.io-client';
import { StaticListsService } from 'app/services/static-lists.service';
import * as _ from 'lodash';

@Injectable()
export class GenerateLeagueService {

    constructor(private leagueDataService: LeagueDataService,
                private generateTeamService: GenerateTeamService,
                private generatePlayerService: GeneratePlayerService,
                private sharedFunctionsService: SharedFunctionsService,
                private staticListsService: StaticListsService,
                private seasonGenerator: SeasonGenerator) {

     }

    async generateLeague(leagueName: string, numberOfTeams: number, useMlbTeams = false) {
      this.sharedFunctionsService.setLoading(2, 'Generating League')
      const league = new League(numberOfTeams, localStorage.getItem('baseballgm-id'), leagueName)
      const createdLeague = await this.createLeague(league) as League
      this.sharedFunctionsService.setLoading(10, 'Generating Teams')
      const teamIds = []
      for (let x = 0; x < league.numberOfTeams; x++) {
        const ownerAccountId = x === 0 ? localStorage.getItem('baseballgm-id') : null
        const team = useMlbTeams ?
                      await this.generateTeamService.generateMlbTeam(createdLeague._id, x, ownerAccountId) :
                      await this.generateTeamService.generateRandomTeam(createdLeague._id, ownerAccountId)
        teamIds.push(team._id)
        this.sharedFunctionsService.setLoading(10 + (70 * (x + 1) / numberOfTeams),
          'Generated Team ' + (x + 1) + ': ' + team.location + ' ' + team.name)
      }
      if (numberOfTeams === 30) {
        const leagueArray = [
          [teamIds.slice(0, 5), teamIds.slice(5, 10), teamIds.slice(10, 15)],
          [teamIds.slice(15, 20), teamIds.slice(20, 25), teamIds.slice(25, 30)]
        ]
        createdLeague.structure = leagueArray
        this.leagueDataService.updateLeague(createdLeague)
      }
      this.sharedFunctionsService.setLoading(85, 'Generating Free Agents')
      await this.generatePlayerService.generateFreeAgents(createdLeague._id, (new Date()).getFullYear(), teamIds.length * 10)
      this.sharedFunctionsService.setLoading(92, 'Generating Season')
      this.seasonGenerator.generateSeason(createdLeague._id, teamIds, null,
        this.staticListsService.leaguePhases.regularSeason.name, createdLeague.structure)
      return createdLeague._id
    }

    createLeague(league) {
      const socket = io.connect(window.location.protocol + '//' + window.location.host);
      return new Promise(function(resolve){
        socket.emit('create-league', league, function(savedLeague){
          resolve(savedLeague)
      });
    })
  }

}
