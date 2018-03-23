import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeagueDataService } from '../../services/league-data.service';
import { Team } from '../../models/team';
import { Player, HittingProgression } from '../../models/player';
import { Game, AtBat, PitcherAppearance } from '../../models/game';
import { BatterSeasonStats, PitcherSeasonStats } from '../../models/season-stats';
import { Season, ScheduledGame } from '../../models/season';
import { StaticListsService } from '../../services/static-lists.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import 'rxjs/add/operator/first'
import { SharedFunctionsService } from 'app/services/shared-functions.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  leagueId: string;
  teamId: string;
  team: Team;
  players: Array<Player>;
  constructor(private route: ActivatedRoute,
              public staticListsService: StaticListsService,
              public sharedFunctionsService: SharedFunctionsService,
              public sanitizer: DomSanitizer,
              public leagueDataService: LeagueDataService) { }

  async ngOnInit() {
    await this.route.parent.params.subscribe(parentParams => {
      const that = this
      this.leagueId = parentParams['leagueId'];
      this.route.params.subscribe(params => {
        (async () => {
        this.teamId = params['teamId'];
        this.leagueDataService.playersObservable.subscribe(players => {
          that.players = _.filter(players, function(player){
            return player.teamId === that.teamId
          })
        })
        this.leagueDataService.teamsObservable.subscribe(teams => {
          that.team = _.find(teams, function(team){
            return team._id === that.teamId
          })
        })
       })();
      });
    });

  }

  getPlayerById(id) {
    const x = _.find(this.players, function(player){
      return player._id === id;
    });
    const y = <Player>x;
    return y;
  }

  getBatterSeasonStats(playerId) {
    if (!this.team || !this.leagueDataService.currentSeason) {
      return null
    }
    return this.leagueDataService.getBatterSeasonStats(playerId, this.leagueDataService.currentSeason.year)
  }

  getPitcherSeasonStats(playerId) {
    if (!this.team || !this.leagueDataService.currentSeason) {
      return null
    }
    const games = this.leagueDataService.getTeamsGamesBySeason(this.team._id, this.leagueDataService.currentSeason._id)
    const playerEvents = new Array<PitcherAppearance>()
    _.each(games, function(game){
      _.each(game.homeTeamStats.pitcherAppearances, function(appearance){
        if (appearance.pitcherId === playerId) {
          playerEvents.push(appearance)
        }
      })
      _.each(game.awayTeamStats.pitcherAppearances, function(appearance){
        if (appearance.pitcherId === playerId) {
          playerEvents.push(appearance)
        }
      })
    })

    const seasonStats = new PitcherSeasonStats()
    seasonStats.buildSeasonStatsFromPitcherAppearances(playerId, playerEvents)
    return seasonStats
  }

  getOrderedBatters() {
    return this.team && this.team.roster ?
     _.orderBy(this.team.roster.batters, ['orderNumber', 'startingPosition'], ['asc', 'asc']) :
    []
  }

  getOrderedPitchers() {
    const that = this
    return this.team && this.team.roster ?
     _.orderBy(this.team.roster.pitchers, function(batter){
      let index = that.staticListsService.pitcherRoles.indexOf(batter.startingPosition)
      if (index === -1) {
        index = 100
      }
      return index
     }) :
    []
  }

  isOwner() {
    return this.team ? this.team.ownerAccountId === localStorage.getItem('baseballgm-id') : false
  }

  getMatchupDisplay(matchup: ScheduledGame) {
    if (!this.leagueDataService.teams) { return ' '}
    let otherTeam = ''
    let matchupString = ''
    let result = ''
    let score = ''
    if (this.teamId === matchup.homeTeamId) {
      otherTeam = this.leagueDataService.getTeamById(matchup.awayTeamId).location + ' '
      + this.leagueDataService.getTeamById(matchup.awayTeamId).name
      matchupString = 'vs'
      if (matchup.gameId) {
        if (matchup.homeTeamScore > matchup.awayTeamScore) {
          result = '<span style="color:green">W</span>'
        } else {
          result = '<span style="color:red">L</span>'
        }
        score = matchup.homeTeamScore + ' - ' + matchup.awayTeamScore
      } else {
        result = '-'
        score = '0 - 0'
      }
    } else {
      otherTeam = this.leagueDataService.getTeamById(matchup.homeTeamId).location + ' '
      + this.leagueDataService.getTeamById(matchup.homeTeamId).name
      matchupString = '@'
      if (matchup.gameId) {
        if (matchup.awayTeamScore > matchup.homeTeamScore) {
          result = '<span style="color:green">W</span>'
        } else {
          result = '<span style="color:red">L</span>'
        }
        score = matchup.awayTeamScore + ' - ' + matchup.homeTeamScore
      } else {
        result = '-'
        score = '0 - 0'
      }
    }
    const value = '<td>' + result + '</td><td>' + score + '</td><td>' + matchupString + '</td><td>' + otherTeam + '</td>'
    return this.sanitizer.bypassSecurityTrustHtml(value)
  }

  getRecentMatchups() {
    const that = this
    const matchups = []
    if (!this.leagueDataService.currentSeason) { return [] }
    let index =  _.findIndex(this.leagueDataService.currentSeason.schedule, function(scheduleGames){
      return scheduleGames.complete === false;
    })
    if (index === -1) { index = 161 }
    for (let i = 1; i > 0; i--) {
      if (this.leagueDataService.currentSeason.schedule.length > index + i) {
        const matchup = _.find(this.leagueDataService.currentSeason.schedule[index + i].scheduledGames, function(game){
          return game.homeTeamId === that.teamId || game.awayTeamId === that.teamId
        })
        matchups.push(matchup)
      }
    }
    for (let i = 0; i < 9; i++) {
      if (0 < index - i) {
        const matchup = _.find(this.leagueDataService.currentSeason.schedule[index - i].scheduledGames, function(game){
          return game.homeTeamId === that.teamId || game.awayTeamId === that.teamId
        })
        matchups.push(matchup)
      }
    }
    return matchups
  }
}
