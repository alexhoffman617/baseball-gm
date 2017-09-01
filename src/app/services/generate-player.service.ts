import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Player, Skills  } from '../models/player';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GeneratePlayerService {

    constructor(private http: Http) { }

    async generatePlayer(){
        var result = await this.http.get('https://uinames.com/api/?gender=male&region=United+States').toPromise()
        var name = result.json().name + " " + result.json().surname;
        var id = result.json().name+result.json().surname;
        var age = Math.round(18 + Math.random() * 22);
        var potential = {
            "contact": this.generatePotentialValue(age),
            "power": this.generatePotentialValue(age),
            "speed": this.generatePotentialValue(age),
            "patience": this.generatePotentialValue(age)
        };
        var skills = {
            "contact": this.generateSkillValue("contact", age, potential),
            "power": this.generateSkillValue("power", age, potential),
            "speed": this.generateSkillValue("speed", age, potential),
            "patience": this.generateSkillValue("patience", age, potential)
        };
    
        return new Player(name, id, age, skills, potential);
    }

    generatePotentialValue(age){
    var value = 20 + Math.round(Math.random() * 40) + Math.round(Math.random() * 40);
        if(value > 90 && Math.random() < .66){
            value -= 10;
        } else if(value > 80 && Math.random() < .5){
        value -= 10;
        } else if(value < 20){
        value += 10;
        }
        if(age > 30){
        var garunteedValue = .8 - Math.abs(30 - age) / 10 * .5;  
        value = Math.round(value * (garunteedValue + Math.random() * 1-garunteedValue))
        }
        return value;
    }

      generateSkillValue(skill, age, potential){
        var garunteedValue = .2 + Math.min(9, age - 18) / 9 * .4;  
        var value = Math.round(garunteedValue * potential[skill] + Math.random() * potential[skill] * (1 - garunteedValue));
        return value;
      }
}