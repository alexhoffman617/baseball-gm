import { Component, OnInit } from '@angular/core';
import { PlayGameService } from '../../services/play-game.service';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { AtBat, Game, TeamStats  } from '../../models/game';
import * as _ from "lodash";


@Component({
  selector: 'play-game-test',
  templateUrl: './play-game-test.component.html',
  styleUrls: ['./play-game-test.component.css']
})
export class PlayGameTestComponent implements OnInit {
  teamA;
  teamB;
  games = 0;
  teamAStats: TeamStats;
  teamBStats: TeamStats;
  homeWins = 0;
  awayWins = 0;
  game: Game;
  constructor(public playGameService: PlayGameService, public generatePlayerService: GeneratePlayerService) { }

  async ngOnInit() {
    this.teamA = {
      "batters": [],
      "pitcher": {
        "id": "player9A", "name": "player9A", "position": "P", "skills": {"velocity": 10, "stuff": 10, "control": 10, "type": "gb"}
      }
    };
    this.teamB = {
      "batters": [],
      "pitcher": {
        "id": "player9B", "name": "player9B", "position": "P", "skills": {"velocity": 10, "stuff": 10, "control": 10, "type": "gb"}
      }
    };
    this.avgBatters()
  }

  async randomBatters(){
    this.teamA.batters = [];
    this.teamB.batters = [];
    for(var i = 0; i < 9; i++){
      this.teamA.batters.push(await this.generatePlayerService.generatePlayer());
      this.teamB.batters.push(await this.generatePlayerService.generatePlayer());
    }
  }

  async avgBatters(){
    this.teamA.batters = [];
    this.teamB.batters = [];
    for(var i = 0; i < 9; i++){
      this.teamA.batters.push(await this.generatePlayerService.generatePlayer());
      this.teamA.batters.forEach(batter => {
        batter.skills.contact = 10;
        batter.skills.power = 10;
        batter.skills.patience = 10;
        batter.skills.speed = 10;
      });
      this.teamB.batters.push(await this.generatePlayerService.generatePlayer());
      this.teamB.batters.forEach(batter => {
        batter.skills.contact = 10;
        batter.skills.power = 10;
        batter.skills.patience = 10;
        batter.skills.speed = 10;
      });
    }
  }
  
  playGame(times: number){
    this.teamAStats = new TeamStats([], 0);
    this.teamBStats = new TeamStats([], 0);
    this.homeWins = 0;
    this.awayWins = 0;
    this.games = 0;
    for(var i = 0; i < times; i++){
      if(!(i % 2)){
        this.game = this.playGameService.playGame(this.teamA, this.teamB);
        this.teamAStats.runs += this.game.homeTeamStats.runs;
        this.teamAStats.events = this.teamAStats.events.concat(this.game.homeTeamStats.events);
        this.teamBStats.runs += this.game.awayTeamStats.runs;
        this.teamBStats.events = this.teamBStats.events.concat(this.game.awayTeamStats.events);
        if(this.game.homeTeamStats.runs > this.game.awayTeamStats.runs){
          this.homeWins ++;
        } else {
          this.awayWins ++;
        }
      } else {
        this.game = this.playGameService.playGame(this.teamB, this.teamA);
        this.teamBStats.runs += this.game.homeTeamStats.runs;
        this.teamBStats.events = this.teamBStats.events.concat(this.game.homeTeamStats.events);
        this.teamAStats.runs += this.game.awayTeamStats.runs;
        this.teamAStats.events = this.teamAStats.events.concat(this.game.awayTeamStats.events);
        if(this.game.homeTeamStats.runs > this.game.awayTeamStats.runs){
          this.homeWins ++;
        } else {
          this.awayWins ++;
        }
      }

      this.games++;
    }
    var x = 1;
  }

  getOutcomeTotal(playerId: string, outcome: string, teamStats: TeamStats){
    if(!this.game){
      return "--"
    }
    if(outcome == 'plateAppearance'){
      return _.filter(teamStats.events, function(event){
        return event.batterId == playerId || playerId == "all";
      }).length
    }
    if(outcome == 'hits'){
      return _.filter(teamStats.events, function(event){
        return (event.batterId == playerId || playerId == "all") && 
        (event.outcome.result == 'single' ||
        event.outcome.result == 'double' ||
        event.outcome.result == 'triple' ||
        event.outcome.result == 'homerun');
      }).length
    }
    if(outcome == 'outs'){
      var outs = 0;
      _.forEach(teamStats.events, function(event){
        if(event.outcome.result == "out"){
          outs++;
        } else if(event.outcome.result == "strikeout"){
          outs++;
        } else if(event.outcome.result == "fielders choice"){
          outs++;
        } else if(event.outcome.result == "double play"){
          outs += 2;
        } else if(event.outcome.result == "triple play"){
          outs += 3;
        }
      }) 
      return outs;
    }
    return _.filter(teamStats.events, function(event){
      return (event.batterId == playerId || playerId == "all") && event.outcome.result == outcome;
    }).length;
  }
}
