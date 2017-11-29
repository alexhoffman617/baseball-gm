import { Injectable } from '@angular/core';
import { Feathers } from '../feathers.service';
import { Player } from '../../models/player'

@Injectable()
export class PlayerService {
  constructor(private feathers: Feathers) {
  }

  players$() {
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

  getPlayer(playerId) {
    return this.feathers
      .service('players')
      .watch()
      .find({
        query: {
          _id: playerId
        }
      })
  }

  getPlayersByTeamId(teamId: string) {
    return this.feathers
      .service('players')
      .watch()
      .find({
        query: {
          teamId: teamId,
          $limit: 50
        }
      })
  }

  getPlayersByLeagueId(leagueId: string) {
    return this.feathers
      .service('players')
      .watch()
      .find({
        query: {
          leagueId: leagueId,
        }
      })
  }

  createPlayer(player: Player) {
    return this.feathers
      .service('players')
      .create(player);
  }

  updatePlayer(player: Player) {
    return this.feathers
      .service('players')
      .update(player._id, player);
  }

  deleteAllPlayers() {
    return this.feathers
      .service('players')
      .remove();
  }
}
