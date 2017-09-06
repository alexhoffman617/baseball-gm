import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Player, HittingSkillset, PitchingSkillset  } from '../models/player';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GeneratePlayerService {

    constructor(private http: Http) { }

    async generateBatter(){
        var result = await this.http.get('https://uinames.com/api/?gender=male&region=United+States').toPromise();
        var name = result.json().name + " " + result.json().surname;
        var id = result.json().name+result.json().surname;
        var age = Math.round(18 + Math.random() * 22);
        var potential = new HittingSkillset(
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.generatePotentialValue(age));

        var skills = new HittingSkillset(
            this.generateSkillValue("contact", age, potential),
            this.generateSkillValue("power", age, potential),
            this.generateSkillValue("patience", age, potential),
            this.generateSkillValue("speed", age, potential),
            this.generateSkillValue("fielding", age, potential));
    
        return new Player(name, id, age, this.getBattingSide(), this.getThrowingSide(), skills, potential, new PitchingSkillset(0,0,0, "std"), new PitchingSkillset(0, 0, 0, "std"));
    }

    async generatePitcher(){
        var result = await this.http.get('https://uinames.com/api/?gender=male&region=United+States').toPromise();
        var name = result.json().name + " " + result.json().surname;
        var id = result.json().name+result.json().surname;
        var age = Math.round(18 + Math.random() * 22);
        var potential = new PitchingSkillset(
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.generatePotentialValue(age),
            this.getPitcherType());
            
        var skills = new PitchingSkillset(
            this.generateSkillValue("velocity", age, potential),
            this.generateSkillValue("control", age, potential),
            this.generateSkillValue("movement", age, potential),
            potential.type);
    
        return new Player(name, id, age, this.getBattingSide(), this.getThrowingSide(), new HittingSkillset(0,0,0,0,0), new HittingSkillset(0, 0, 0, 0, 0), skills, potential);
    }   

    getBattingSide(){
        var rand = Math.random();
        if(rand < .125){
            return "B";
        } else if(rand < .4){
            return "L";
        } else {
            return "R";
        }
    }

    getThrowingSide(){
        var rand = Math.random();
        if(rand < .3){
            return "L";
        } else {
            return "R";
        }
    }

    generatePotentialValue(age){
    var value = 20 + Math.round(Math.random() * 40) + Math.round(Math.random() * 40);
        if(value > 90 && Math.random() < .66){
            value -= 10;
        } else if(value > 80 && Math.random() < .5){
        value -= 10;
        } 
        if(age > 30){
        var garunteedValue = .8 - Math.abs(30 - age) / 10 * .3;  
        value = Math.round(value * (garunteedValue + Math.random() * 1-garunteedValue))
        }
        return value;
    }

    generateSkillValue(skill, age, potential){
    var garunteedValue = .2 + Math.min(9, age - 18) / 9 * .4;  
    var value = Math.round(garunteedValue * potential[skill] + Math.random() * potential[skill] * (1 - garunteedValue));
    return value;
    }

    getPitcherType(){
        var rand = Math.random();
        if(rand < .33){
            return "gb";
        } else if(rand < .66){
            return "fb";
        }
        return "std";
    }
}