import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../backendServices/player/player.service';
import { TeamService } from '../../backendServices/team/team.service';
import { GameService } from '../../backendServices/game/game.service';
import { SeasonService } from '../../backendServices/season/season.service';
import { Team } from '../../models/team';
import { Player, HittingProgression } from '../../models/player';
import { Game, AtBat, PitcherAppearance } from '../../models/game';
import { BatterSeasonStats, PitcherSeasonStats } from '../../models/season-stats';
import { Season } from '../../models/season';
import * as _ from 'lodash';
import 'rxjs/add/operator/first'

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService,
              private gameService: GameService,
              private seasonService: SeasonService,
              private teamService: TeamService) { }
  leagueId: string;
  teamId: string;
  team;
  teamInstance: Team;
  players;
  playersInstance: Array<Player>;
  season;
  seasonInstance: Season;
  async ngOnInit() {
    await this.route.parent.params.subscribe(parentParams => {
      this.leagueId = parentParams['leagueId'];
      this.route.params.subscribe(params => {
        this.teamId = params['teamId'];
        this.players = this.playerService.getPlayersByTeamId(this.teamId).map(
          p => p.data
        );
        this.players.subscribe(t =>
          this.playersInstance = <Array<Player>>t
        )
        this.team = this.teamService.getTeam(this.teamId).map(
          t => t.data[0]
        );
        this.team.first().subscribe(t => this.teamInstance = t)
        this.season = this.seasonService.getCurrentSeason(this.leagueId).map(
          s => s.data[0]
        );
        this.season.subscribe(s => this.seasonInstance = s)
      });
    });

  }

  getPlayerById(id) {
    const x = _.find(this.playersInstance, function(player){
      return player._id === id;
    });
    const y = <Player>x;
    return y;
  }

  getBatterSeasonStats(playerId) {
    let games = Array<Game>()
    this.gameService.getTeamsGamesBySeason(this.teamInstance._id, this.seasonInstance._id).subscribe(g => games = g.data as Array<Game>)
    const playerEvents = new Array<AtBat>()
    _.each(games, function(game){
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
    })

    const seasonStats = new BatterSeasonStats()
    seasonStats.buildSeasonStatsFromGameEvents(playerId, playerEvents)
    return seasonStats
  }

  getPitcherSeasonStats(playerId) {
    let games = Array<Game>()
    this.gameService.getTeamsGamesBySeason(this.teamInstance._id, this.seasonInstance._id).subscribe(g => games = g.data as Array<Game>)
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
}
