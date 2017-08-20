import { Component, OnInit } from '@angular/core';
import { PlayGameService } from '../../services/play-game.service';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { AtBat, Game, TeamStats  } from '../../models/game';
import * as _ from "lodash";


@Component({
  selector: 'app-home',
  templateUrl: './play-game-test.component.html',
  styleUrls: ['./play-game-test.component.css']
})
export class PlayGameTestComponent implements OnInit {
  teamA;
  teamB;
  games = 0;
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  homeWins = 0;
  awayWins = 0;
  game: Game;
  constructor(public playGameService: PlayGameService, public generatePlayerService: GeneratePlayerService) { }

  async ngOnInit() {
    this.teamA = {
      "batters": [],
      "pitcher": {
        "id": "player9A", "name": "player9A", "position": "P", "skills": {"velocity": 10, "stuff": 10, "control": 10}
      }
    };
    this.teamB = {
      "batters": [],
      "pitcher": {
        "id": "player9B", "name": "player9B", "position": "P", "skills": {"velocity": 10, "stuff": 10, "control": 10}
      }
    };
    for(var i = 0; i < 9; i++){
      this.teamA.batters.push(await this.generatePlayerService.generatePlayer());
      this.teamB.batters.push(await this.generatePlayerService.generatePlayer());
    }
  }
  
  playGame(times: number){
    this.homeTeamStats = new TeamStats([], 0);
    this.awayTeamStats = new TeamStats([], 0);
    this.homeWins = 0;
    this.awayWins = 0;
    this.games = 0;
    for(var i = 0; i < times; i++){
      this.game = this.playGameService.playGame(this.teamA, this.teamB);
      this.homeTeamStats.runs += this.game.homeTeamStats.runs;
      this.homeTeamStats.atBats = this.homeTeamStats.atBats.concat(this.game.homeTeamStats.atBats);
      this.awayTeamStats.runs += this.game.awayTeamStats.runs;
      this.awayTeamStats.atBats = this.awayTeamStats.atBats.concat(this.game.awayTeamStats.atBats);
      if(this.game.homeTeamStats.runs > this.game.awayTeamStats.runs){
        this.homeWins ++;
      } else {
        this.awayWins ++;
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
      return _.filter(teamStats.atBats, function(atBat){
        return atBat.batterId == playerId;
      }).length
    }
    if(outcome == 'hits'){
      return _.filter(teamStats.atBats, function(atBat){
        return atBat.batterId == playerId && 
        (atBat.outcome == 'single' ||
        atBat.outcome == 'double' ||
        atBat.outcome == 'triple' ||
        atBat.outcome == 'homerun');
      }).length
    }
    return _.filter(teamStats.atBats, function(atBat){
      return atBat.batterId == playerId && atBat.outcome == outcome;
    }).length;
  }
}
