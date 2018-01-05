import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../backendServices/player/player.service';
import { TeamService } from '../../backendServices/team/team.service';
import { GameService } from '../../backendServices/game/game.service';
import { SeasonService } from '../../backendServices/season/season.service';
import { LeagueDataService } from '../../services/league-data.service';
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
  leagueId: string;
  teamId: string;
  team: Team;
  players: Array<Player>;
  season: Season;
  constructor(private route: ActivatedRoute,
              private playerService: PlayerService,
              private gameService: GameService,
              private seasonService: SeasonService,
              private leagueDataService: LeagueDataService,
              private teamService: TeamService) { }

  async ngOnInit() {
    await this.route.parent.params.subscribe(parentParams => {
      this.leagueId = parentParams['leagueId'];
      this.route.params.subscribe(params => {
        (async () => {
        await this.leagueDataService.getData(this.leagueId)
        this.teamId = params['teamId'];
        this.players = this.leagueDataService.getPlayersByTeamId(this.teamId)
        this.team = this.leagueDataService.getTeamById(this.teamId)
        this.season = this.leagueDataService.currentSeason
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
    let games = Array<Game>()
    this.gameService.getTeamsGamesBySeason(this.team._id, this.season._id).subscribe(g => games = g.data as Array<Game>)
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
    this.gameService.getTeamsGamesBySeason(this.team._id, this.season._id).subscribe(g => games = g.data as Array<Game>)
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
