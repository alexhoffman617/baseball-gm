import { Injectable } from '@angular/core';
import { Feathers } from '../feathers.service';
import { Season } from '../../models/season'

@Injectable()
export class SeasonService {
  constructor(private feathers: Feathers) {
  }

  seasons$() {
    return this.feathers
      .service('seasons')
      .watch()
      .find({
        query: {
          $sort: {createdAt: -1},
          $limit: 25
        }
      });
  }

  getLeagueSeasons(id) {
    return this.feathers
      .service('seasons')
      .watch()
      .find({
        query: {
          leagueId: id
        }
      })
  }

  getCurrentSeason(id) {
    return this.feathers
      .service('seasons')
      .watch()
      .find({
        query: {
          leagueId: id,
          $sort: { year: -1 },
          $limit: 1

        }
      })
  }

  getSeasonByLeagueAndYear(leagueId, year) {
    return this.feathers
      .service('seasons')
      .watch()
      .find({
        query: {
          leagueId: leagueId,
          year: year
        }
      })
  }

  createSeason(season: Season) {
    return this.feathers
      .service('seasons')
      .create(season);
  }

  updateSeason(season: Season) {
    return this.feathers
      .service('seasons')
      .update(season._id, season);
  }

  deleteAllSeasons(){
    return this.feathers
      .service('seasons')
      .remove();
  }
}
