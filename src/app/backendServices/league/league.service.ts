import { Injectable } from '@angular/core';
import { Feathers } from '../feathers.service';
import { League } from '../../models/league'
/**
 *  Abstraction layer for data management
 *  Technically this isn't needed for feathers-chat,
 *  but you will need it for more complex tasks.
 */
@Injectable()
export class LeagueService {
  constructor(private feathers: Feathers) {
  }

  leagues$() {
    // just returning the observable will query the backend on every subscription
    // using some caching mechanism would be wise in more complex applications
    return this.feathers
      .service('leagues')
      .watch()
      .find({
        query: {
          $sort: {createdAt: -1},
          $limit: 25
        }
      });
  }

  getLeague(id: string) {
    return this.feathers
      .service('leagues')
      .watch()
      .find({
        query: {
          id: id
        }
      })
  }

  createLeague(league: League) {
    return this.feathers
      .service('leagues')
      .create(league);
  }

  deleteAllLeagues() {
    return this.feathers
      .service('leagues')
      .remove();
  }
}
