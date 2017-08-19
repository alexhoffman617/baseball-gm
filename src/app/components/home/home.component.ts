import { Component, OnInit } from '@angular/core';
import { PlayGameService } from '../../services/play-game.service';
import { AtBat, Game, TeamStats  } from '../../models/game';
import * as _ from "lodash";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  teamA;
  teamB;
  games = 0;
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  homeWins = 0;
  awayWins = 0;
  game: Game;
  constructor(public playGameService: PlayGameService) { }

  ngOnInit() {
    this.teamA = {
      "players": [
        {"id": "player1A", "name": "player1A", "position": "LF", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player2A", "name": "player2A", "position": "CF", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player3A", "name": "player3A", "position": "RF", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player4A", "name": "player4A", "position": "1B", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player5A", "name": "player5A", "position": "2B", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player6A", "name": "player6A", "position": "SS", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player7A", "name": "player7A", "position": "3B", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player8A", "name": "player8A", "position": "C", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player9A", "name": "player9A", "position": "P", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}}
      ]
    };
    this.teamB = {
      "players": [
        {"id": "player1B", "name": "player1B", "position": "LF", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player2B", "name": "player2B", "position": "CF", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player3B", "name": "player3B", "position": "RF", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player4B", "name": "player4B", "position": "1B", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player5B", "name": "player5B", "position": "2B", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player6B", "name": "player6B", "position": "SS", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player7B", "name": "player7B", "position": "3B", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player8B", "name": "player8B", "position": "C", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}},
        {"id": "player9B", "name": "player9B", "position": "P", "skills": {"contact": 10,"power": 10,"speed": 10,"eye": 10}}
      ]
    };
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
