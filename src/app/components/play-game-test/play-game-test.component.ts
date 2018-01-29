import { Component, OnInit } from '@angular/core';
import { PlayGameService } from '../../services/play-game.service';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { AtBat, Game, TeamStats, GamePlayer  } from '../../models/game';
import * as _ from 'lodash';


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
      'batters': [],
      'pitcher': {
        'id': 'player9A', 'name': 'player9A', 'pitchingAbility': {'velocity': 50, 'movement': 50, 'control': 50, 'type': 'gb'}
      }
    };
    this.teamB = {
      'batters': [],
      'pitcher': {
        'id': 'player9A', 'name': 'player9A', 'pitchingAbility': {'velocity': 50, 'movement': 50, 'control': 50, 'type': 'gb'}
      }
    };
    this.avgBatters();
  }

  async randomBatters() {
    this.teamA.batters = [];
    this.teamB.batters = [];
    for (let i = 0; i < 9; i++) {
      this.teamA.batters.push(await this.generatePlayerService.generateBatter(null, null, null));
      this.teamB.batters.push(await this.generatePlayerService.generateBatter(null, null, null));
    }
  }

  async randomPitchers() {
      this.teamA.pitcher = await this.generatePlayerService.generatePitcher(null, null, null);
      this.teamB.pitcher = await this.generatePlayerService.generatePitcher(null, null, null);
  }

  async avgBatters() {
    this.teamA.batters = [];
    this.teamB.batters = [];
    for (let i = 0; i < 9; i++) {
      this.teamA.batters.push(await this.generatePlayerService.generateBatter(null, null, null));
      this.teamA.batters.forEach(batter => {
        batter.hittingAbility.contact = 50;
        batter.hittingAbility.power = 50;
        batter.hittingAbility.patience = 50;
        batter.hittingAbility.speed = 50;
        batter.hittingAbility.fielding = 50;
      });
      this.teamB.batters.push(await this.generatePlayerService.generateBatter(null, null, null));
      this.teamB.batters.forEach(batter => {
        batter.hittingAbility.contact = 50;
        batter.hittingAbility.power = 50;
        batter.hittingAbility.patience = 50;
        batter.hittingAbility.speed = 50;
        batter.hittingAbility.fielding = 50;
      });
    }
  }

  playGame(times: number) {
    this.teamAStats = new TeamStats([], [], 0);
    this.teamBStats = new TeamStats([], [], 0);
    this.homeWins = 0;
    this.awayWins = 0;
    this.games = 0;
    const a = [
      new GamePlayer('C', 1, null, this.teamA.batters[0]),
      new GamePlayer('1B', 2, null, this.teamA.batters[1]),
      new GamePlayer('2B', 3, null, this.teamA.batters[2]),
      new GamePlayer('3B', 4, null, this.teamA.batters[3]),
      new GamePlayer('SS', 5, null, this.teamA.batters[4]),
      new GamePlayer('LF', 6, null, this.teamA.batters[5]),
      new GamePlayer('CF', 7, null, this.teamA.batters[6]),
      new GamePlayer('RF', 8, null, this.teamA.batters[7]),
      new GamePlayer('DH', 9, null, this.teamA.batters[8]),
      new GamePlayer('P', null, null, this.teamA.pitcher)
    ];
    const b = [
      new GamePlayer('C', 1, null, this.teamB.batters[0]),
      new GamePlayer('1B', 2, null, this.teamB.batters[1]),
      new GamePlayer('2B', 3, null, this.teamB.batters[2]),
      new GamePlayer('3B', 4, null, this.teamB.batters[3]),
      new GamePlayer('SS', 5, null, this.teamB.batters[4]),
      new GamePlayer('LF', 6, null, this.teamB.batters[5]),
      new GamePlayer('CF', 7, null, this.teamB.batters[6]),
      new GamePlayer('RF', 8, null, this.teamB.batters[7]),
      new GamePlayer('DH', 9, null, this.teamB.batters[8]),
      new GamePlayer('P', null, null, this.teamB.pitcher)
    ];
    for (let i = 0; i < times; i++) {
      if (!(i % 2)) {
        this.game = this.playGameService.playGame(a, b, null, null, null, null);
        this.teamAStats.runs += this.game.homeTeamStats.runs;
        this.teamAStats.events = this.teamAStats.events.concat(this.game.homeTeamStats.events);
        this.teamBStats.runs += this.game.awayTeamStats.runs;
        this.teamBStats.events = this.teamBStats.events.concat(this.game.awayTeamStats.events);
        if (this.game.homeTeamStats.runs > this.game.awayTeamStats.runs) {
          this.homeWins ++;
        } else {
          this.awayWins ++;
        }
      } else {
        this.game = this.playGameService.playGame(b, a, null, null, null, null);
        this.teamBStats.runs += this.game.homeTeamStats.runs;
        this.teamBStats.events = this.teamBStats.events.concat(this.game.homeTeamStats.events);
        this.teamAStats.runs += this.game.awayTeamStats.runs;
        this.teamAStats.events = this.teamAStats.events.concat(this.game.awayTeamStats.events);
        if (this.game.homeTeamStats.runs > this.game.awayTeamStats.runs) {
          this.homeWins ++;
        } else {
          this.awayWins ++;
        }
      }

      this.games++;
    }
  }

  getOutcomeTotal(playerId: string, outcome: string, teamStats: TeamStats) {
    if (!this.game) {
      return 0
    }
    if (outcome === 'plateAppearance') {
      return _.filter(teamStats.events, function(event) {
        return event.batterId === playerId || playerId === 'all';
      }).length
    }
    if (outcome === 'hits') {
      return _.filter(teamStats.events, function(event) {
        return (event.batterId === playerId || playerId === 'all') &&
        (event.outcome.result === 'single' ||
        event.outcome.result === 'double' ||
        event.outcome.result === 'triple' ||
        event.outcome.result === 'homerun');
      }).length
    }
    if (outcome === 'outs') {
      let outs = 0;
      _.forEach(teamStats.events, function(event) {
        if (event.outcome.result === 'out') {
          outs++;
        } else if (event.outcome.result === 'strikeout') {
          outs++;
        } else if (event.outcome.result === 'fielders choice') {
          outs++;
        } else if (event.outcome.result === 'double play') {
          outs += 2;
        } else if (event.outcome.result === 'triple play') {
          outs += 3;
        }
      })
      return outs;
    }
    return _.filter(teamStats.events, function(event) {
      return (event.batterId === playerId || playerId === 'all') && event.outcome.result === outcome;
    }).length;
  }
}
