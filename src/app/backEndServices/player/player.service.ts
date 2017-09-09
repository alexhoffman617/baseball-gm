import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Player } from '../../models/player'
import 'rxjs/add/operator/catch'
import { Observable } from "rxjs/Observable";

@Injectable()
export class PlayerService {

  constructor(private http: Http) { }

  // Get all posts from the API
  getAllPlayers() {
    return this.http.get('/api/players')
      .map(res => res.json());
  }
  
  postPlayer(player: Player){
    return this.http.post('/api/player', player)
          .map(res => res.json()) // ...and calling .json() on the response to return data
          .catch((error:any) => Observable.throw(error.json().error || 'Server error')) //...errors if
          .subscribe();;
  }
}