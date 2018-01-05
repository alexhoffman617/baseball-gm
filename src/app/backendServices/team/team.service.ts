import { Injectable } from '@angular/core';
import { Feathers } from '../feathers.service';
import { Team } from '../../models/team'

@Injectable()
export class TeamService {
  constructor(private feathers: Feathers) {
  }

  teams$() {
    return this.feathers
      .service('teams')
      .watch()
      .find({
        query: {
          $sort: {createdAt: -1},
          $limit: 25
        }
      });
  }

  getLeagueTeams(id){
    return this.feathers
      .service('teams')
      .watch()
      .find({
        query: {
          leagueId: id
        }
      })
  }

  getTeam(id){
    return this.feathers
      .service('teams')
      .watch()
      .find({
        query: {
          _id: id
        }
      })
  }

  createTeam(team: Team) {
    return this.feathers
      .service('teams')
      .create(team);
  }

  updateTeam(team: Team) {
    return this.feathers
      .service('teams')
      .update(team._id, team)
  }

  deleteAllTeams() {
    return this.feathers
      .service('teams')
      .remove();
  }
}