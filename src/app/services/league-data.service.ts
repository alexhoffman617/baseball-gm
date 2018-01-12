import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Player } from '../models/player';
import { Team } from '../models/team';
import { League } from '../models/league';
import { Season } from '../models/season';
import { Game, AtBat, PitcherAppearance } from '../models/game';
import { BatterSeasonStats, PitcherSeasonStats } from '../models/season-stats';

import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class LeagueDataService  {
  leagueId: string;
  league: League;
  leagueObservable: Observable<League>;
  currentSeason: Season;
  teams: Array<Team>;
  teamsObservable: Observable<Array<Team>>;
  players: Array<Player>;
  playersObservable: Observable<Array<Player>>;
  seasons: Array<Season>;
  seasonsObservable: Observable<Array<Season>>;
  games: Array<Game>;
  gamesObservable: Observable<Array<Game>>;
  socket = io.connect('http://localhost:3000/');
  messages: any;
  constructor(private http: Http, private route: ActivatedRoute) {
  }

  getMessages() {
    const observable = new Observable(observer => {
        this.http.get('/api/messages', {params: {}}).subscribe(data => {
          observer.next(data.json());
        });
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  sendMessage(message) {
    this.socket.emit('add-message', message);
  }

  async getLeague(leagueId) {
    const that = this
    return new Promise(function(resolve){
      const leagueObservable = new Observable(observer => {
        that.http.get('/api/league/' + leagueId).subscribe(data => {
          observer.next(data.json());
          resolve(true)
        });
        that.socket.on('league:' + leagueId, (data) => {
          observer.next(data);
        });
        return () => {
          that.socket.disconnect();
        };
      })
      leagueObservable.subscribe(league => {
        that.league = league as League
      })
    })
  }

  async getSeasons(leagueId) {
    const that = this
    return new Promise(function(resolve){
      that.seasonsObservable = new Observable(observer => {
        that.http.get('/api/seasons/' + leagueId).subscribe(data => {
          observer.next(data.json());
          resolve(true)
        });
        that.socket.on('seasons:' + leagueId, (data) => {
          observer.next(data);
        });
        return () => {
          that.socket.disconnect();
        };
      })
      that.seasonsObservable.subscribe(seasons => {
        that.seasons = seasons as Array<Season>
        that.currentSeason = _.orderBy(that.seasons, ['year'], ['desc'])[0]
      })
    })
  }

  async getTeams(leagueId) {
    const that = this
    return new Promise(function(resolve){
      that.teamsObservable = new Observable(observer => {
        that.http.get('/api/teams/' + leagueId).subscribe(data => {
          observer.next(data.json());
          resolve(true)
        });
        that.socket.on('teams:' + leagueId, (data) => {
          observer.next(data);
        });
        return () => {
          that.socket.disconnect();
        };
      })
      that.teamsObservable.subscribe(teams => {
        that.teams = teams as Array<Team>
      })
    })
  }

  async getPlayers(leagueId) {
    const that = this
    return new Promise(function(resolve){
      that.playersObservable = new Observable(observer => {
        that.http.get('/api/players/' + leagueId).subscribe(data => {
          observer.next(data.json());
          resolve(true)
        });
        that.socket.on('players:' + leagueId, (data) => {
          observer.next(data);
        });
        return () => {
          that.socket.disconnect();
        };
      })
      that.playersObservable.subscribe(players => {
        that.players = players as Array<Player>
      })
    })
  }

  async getGames(leagueId) {
    const that = this
    return new Promise(function(resolve){
      that.gamesObservable = new Observable(observer => {
        that.http.get('/api/games/' + leagueId).subscribe(data => {
          observer.next(data.json());
          resolve(true)
        });
        that.socket.on('games:' + leagueId, (data) => {
          observer.next(data);
        });
        return () => {
          that.socket.disconnect();
        };
      })
      that.gamesObservable.subscribe(games => {
        that.games = games as Array<Game>
      })
    })
  }

  updateLocalSeason(season: Season) {
    this.currentSeason = season
  }

  async getData(leagueId: string) {
    const that = this
    const leaguePromise = this.getLeague(leagueId)
    const seasonsPromise = this.getSeasons(leagueId)
    const teamsPromise = this.getTeams(leagueId)
    const playersPromise = this.getPlayers(leagueId)
    const gamesPromise = this.getGames(leagueId)

    return Promise.all([leaguePromise, seasonsPromise, teamsPromise, playersPromise, gamesPromise])
  }

  getPlayersByTeamId(teamId: string) {
    const that = this
    return _.filter(that.players, function(player){
      return player.teamId === teamId
    })
  }

  getTeamById(teamId: string) {
    const that = this
    return _.find(that.teams, function(team){
      return team._id === teamId
    })
  }

  updateAllPlayers() {
    const that = this
    return new Promise(function(resolve){
      that.socket.emit('update-players', that.players, that.league._id,  function(completed){
        resolve(completed)
      });
    })
  }

  updatePlayer(player) {
    const that = this
    return new Promise(function(resolve){
      that.socket.emit('update-player', player,  function(completed){
        resolve(completed)
      });
    })
  }

  updateSeason(season) {
    const that = this
    const socket = io.connect('http://localhost:3000/');
    return new Promise(function(resolve){
      that.socket.emit('update-season', season, function(completed){
        resolve(completed)
      });
    })
  }

  updateLeague(league = null) {
    const that = this
    return new Promise(function(resolve){
      that.socket.emit('update-league', league ? league : that.league, function(completed){
        resolve(completed)
      });
    })
  }

  createPlayer(player) {
    const that = this
    return new Promise(function(resolve){
      that.socket.emit('create-player', player, function(completed){
        resolve(completed)
      });
    })
  }

  createTeam(team) {
    const that = this
    return new Promise(function(resolve){
      that.socket.emit('create-team', team, function(completed){
        resolve(completed)
      });
    })
  }

  createSeason(season) {
    const that = this
    return new Promise(function(resolve){
      that.socket.emit('create-season', season, function(completed){
        resolve(completed)
      });
    })
  }

  getTeamsGamesBySeason(teamId, seasonId) {
   return _.filter(this.games, function(game){
      return game.seasonId === seasonId && ( game.homeTeamId === teamId || game.awayTeamId === teamId)
    })
  }

  getBatterSeasonStats(playerId, year) {
    const playerEvents = new Array<AtBat>()
    const seasonId = _.find(this.seasons, function(season){
      return season.year === year
    })._id
    _.each(this.games, function(game){
      if (game.seasonId === seasonId) {
        _.each(game.homeTeamStats.events, function(event){
          if (event.batterId === playerId) {
            playerEvents.push(event.outcome)
          }
        })
        _.each(game.awayTeamStats.events, function(event){
          if (event.batterId === playerId) {
            playerEvents.push(event.outcome)
          }
        })
      }
    })

    const seasonStats = new BatterSeasonStats()
    seasonStats.buildSeasonStatsFromGameEvents(playerId, playerEvents)
    return seasonStats
  }

  async createGame(game) {
    const that = this
    return new Promise(function(resolve){
      that.socket.emit('create-game', game, function(completed){
        resolve(completed)
      })
    })
  }

  deleteLeague() {

  }

  deleteAll() {

  }

  updateTeam(team) {
    const that = this
    return new Promise(function(resolve){
      that.socket.emit('update-team', team, function(completed){
        resolve(completed)
      })
    })
  }

  getPlayer(playerId) {
    return _.find(this.players, function(player){
      return player._id === playerId
    })
  }

  getGamesBySeason(seasonId) {
    return _.filter(this.games, function(game){
      return game.seasonId === seasonId
    })
  }

  getSeasonByYear(year) {
    return _.find(this.seasons, function(season){
      return season.year === year
    })
  }
}
