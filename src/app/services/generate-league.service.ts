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

@Injectable()
export class GenerateLeagueService {

    constructor(private leagueDataService: LeagueDataService,
                private generateTeamService: GenerateTeamService,
                private generatePlayerService: GeneratePlayerService,
                private sharedFunctionsService: SharedFunctionsService,
                private seasonGenerator: SeasonGenerator) {

     }

    async generateLeague(leagueName: string, numberOfTeams: number, useMlbTeams = false) {
      this.sharedFunctionsService.setLoading(2, 'Generating League')
      const league = new League(numberOfTeams, 'test', leagueName);
      const createdLeague = await this.createLeague(league) as League;
      this.sharedFunctionsService.setLoading(10, 'Generating Teams')
      const teamIds = []
      for (let x = 0; x < league.numberOfTeams; x++) {
        const team = useMlbTeams ?
                      await this.generateTeamService.generateMlbTeam(createdLeague._id, x) :
                      await this.generateTeamService.generateRandomTeam(createdLeague._id)
        teamIds.push(team._id)
        this.sharedFunctionsService.setLoading(10 + (70 * x / numberOfTeams),
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
      await this.generatePlayerService.generateFreeAgents(createdLeague._id, (new Date()).getFullYear(), 20)
      this.sharedFunctionsService.setLoading(92, 'Generating Season')
      this.seasonGenerator.generateSeason(createdLeague._id, teamIds, null, createdLeague.structure)
    }

    createLeague(league) {
      const socket = io.connect('http://localhost:3000/');
      return new Promise(function(resolve){
        socket.emit('create-league', league, function(savedLeague){
          resolve(savedLeague)
      });
    })
  }

}
