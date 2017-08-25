import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Player, Skills  } from '../models/player';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GeneratePlayerService {

    constructor(private http: Http) { }

    async generatePlayer(){
        var result = await this.http.get('https://uinames.com/api/?gender=male&region=United+States').toPromise()
        return new Player(result.json().name + " " + result.json().surname, result.json().name+result.json().surname, 
        new Skills(Math.round(Math.random() * 10) + Math.round(Math.random() * 10), 
                   Math.round(Math.random() * 10) + Math.round(Math.random() * 10), 
                   Math.round(Math.random() * 10) + Math.round(Math.random() * 10), 
                   Math.round(Math.random() * 10) + Math.round(Math.random() * 10)));
    }
}