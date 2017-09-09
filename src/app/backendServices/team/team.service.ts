import { Injectable } from '@angular/core';
import { Feathers } from '../feathers.service';
import { Team } from '../../models/team'
/**
 *  Abstraction layer for data management
 *  Technically this isn't needed for feathers-chat,
 *  but you will need it for more complex tasks.
 */
@Injectable()
export class TeamService {
  constructor(private feathers: Feathers) {
  }

  teams$() {
    // just returning the observable will query the backend on every subscription
    // using some caching mechanism would be wise in more complex applications
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

  createTeam(team: Team) {
    // feathers-reactive Observables are hot by default,
    // so we don't need to subscribe to make create() happen.
    this.feathers
      .service('teams')
      .create(team);
  }
}