import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { League } from '../../models/league'
import 'rxjs/add/operator/catch'
import { Observable } from "rxjs/Observable";

@Injectable()
export class LeagueService {

  constructor(private http: Http) { }

  // Get all posts from the API
  getAllLeagues() {
    return this.http.get('/api/leagues/all')
      .map(res => res.json());
  }

  getLeague(id: string) {
    return this.http.get('/api/leagues/'+id)
      .map(res => res.json());
  }
    
  postLeague(league: League){
    return this.http.post('/api/leagues', league)
          .map(res => res.json())
          .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
          .subscribe();;
  }
}