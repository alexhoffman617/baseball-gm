import { Injectable } from '@angular/core';
import { TeamService } from '../backendServices/team/team.service';
import { SeasonService } from '../backendServices/season/season.service';
import { PlayerService } from '../backendServices/player/player.service';
import { GameService } from '../backendServices/game/game.service';
import { LeagueService } from '../backendServices/league/league.service';

import { Player } from '../models/player';
import { Team } from '../models/team';
import { League } from '../models/league';
import { Season } from '../models/season';

import * as _ from 'lodash';

@Injectable()
export class LeagueDataService {
  league: League;
  currentSeason: Season;
  teams: Array<Team>;
  players: Array<Player>;
  constructor(private teamService: TeamService,
    private seasonService: SeasonService,
    private playerService: PlayerService,
    private gameService: GameService,
    private leagueService: LeagueService,
              ) {
  }

  async getData(leagueId: string) {
    const that = this
    const leaguePromise = new Promise(function(resolve){
      that.leagueService.getLeague(leagueId).subscribe(l => {
        that.league = l.data[0]
        resolve(true)
      })
    })
    const seasonsPromise = new Promise(function(resolve){
      that.seasonService.getCurrentSeason(leagueId).subscribe(s => {
        that.currentSeason = s.data[0]
        resolve(true)
      })
    })
    const teamsPromise = new Promise(function(resolve){
      that.teams = that.teamService.getLeagueTeams(leagueId).subscribe(t => {
        that.teams = t.data
        resolve(true)
      });
    })

    const playersPromise = new Promise(function(resolve){
      that.players = that.playerService.getPlayersByLeagueId(leagueId).subscribe(p => {
        that.players = p.data
        resolve(true)
      });
    })

    return Promise.all([leaguePromise, seasonsPromise, teamsPromise, playersPromise])
  }

  getPlayersByTeamId(teamId: string) {
    const that = this
    return _.filter(that.players, function(player){
      return player.teamId === teamId
    })
  }

  getTeamById(teamId: string) {
    const that = this
    return _.filter(that.teams, function(team){
      return team._id === teamId
    })
  }

  updateAllPlayers() {
    const that = this
    const promises = []
    _.each(this.players, function(player){
      promises.push(that.playerService.updatePlayer(player))
    })
    return Promise.all(promises)
  }

}
