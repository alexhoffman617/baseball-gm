import { Injectable } from '@angular/core';
import { Feathers } from '../feathers.service';
import { Game } from '../../models/game'

@Injectable()
export class GameService {
  constructor(private feathers: Feathers) {
  }

  games$() {
    return this.feathers
      .service('games')
      .watch()
      .find({
        query: {
          $sort: {createdAt: -1},
        }
      });
  }

  getGame(id) {
    return this.feathers
      .service('games')
      .watch()
      .find({
        query: {
          _id: id
        }
      })
  }

  getTeamsGamesBySeason(teamId, seasonId) {
    return this.feathers
      .service('games')
      .watch()
      .find({
        query: {
          $or: [
            { homeTeamId: teamId, seasonId: seasonId },
            { awayTeamId: teamId, seasonId: seasonId }
          ]
        }
      })
  }

  createGame(game: Game) {
    return this.feathers
      .service('games')
      .create(game);
  }

  deleteAllGames() {
    return this.feathers
      .service('games')
      .remove();
  }
}
