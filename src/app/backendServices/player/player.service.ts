import { Injectable } from '@angular/core';
import { Feathers } from '../feathers.service';
import { Player } from '../../models/player'
/**
 *  Abstraction layer for data management
 *  Technically this isn't needed for feathers-chat,
 *  but you will need it for more complex tasks.
 */
@Injectable()
export class PlayerService {
  constructor(private feathers: Feathers) {
  }

  players$() {
    // just returning the observable will query the backend on every subscription
    // using some caching mechanism would be wise in more complex applications
    return this.feathers
      .service('players')
      .watch()
      .find({
        query: {
          $sort: {createdAt: -1},
          $limit: 25
        }
      });
  }

  users$() {
    // just returning the observable will query the backend on every subscription
    // using some caching mechanism would be wise in more complex applications
    return this.feathers
      .service('users')
      .watch()
      .find();
  }

  createPlayer(player: Player) {
    // feathers-reactive Observables are hot by default,
    // so we don't need to subscribe to make create() happen.
    this.feathers
      .service('players')
      .create(player);
  }
}