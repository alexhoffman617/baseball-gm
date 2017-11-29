import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../backendServices/player/player.service';
import { SeasonService } from '../../backendServices/season/season.service';
import { GameService } from '../../backendServices/game/game.service';
import { Player, HittingProgression } from '../../models/player';
import { Game, AtBat } from '../../models/game';
import { BatterSeasonStats } from '../../models/season-stats';
import * as _ from 'lodash';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  leagueId: string;
  playerId: string;
  player: Player;
  years = [];

  constructor(private route: ActivatedRoute,
    private playerService: PlayerService,
    private seasonService: SeasonService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    const that = this
    that.route.parent.params.subscribe(parentParams => {
      that.leagueId = parentParams['leagueId'];
      that.route.params.subscribe(params => {
        that.playerId = params['playerId'];
        that.playerService.getPlayer(that.playerId).subscribe(player => {
          that.player = player.data[0]
          that.seasonService.getCurrentSeason(that.leagueId).subscribe(season => {
            const lastYear = !!that.player.lastYear ? that.player.lastYear : season.data[0].year
            for (let year = that.player.firstYear; year <= lastYear; year++) {
              that.years.push(year)
            }
          })
        })

      })
    })
  }


  overallHitting(hittingSkillset) {
    if (!hittingSkillset) {
      return null
    }
    return Math.round((hittingSkillset.contact + hittingSkillset.power
      + hittingSkillset.patience + hittingSkillset.speed + hittingSkillset.fielding) * .2);
  }

  getBatterSeasonStats(playerId, year) {
    let games = Array<Game>()
    this.seasonService.getSeasonByLeagueAndYear(this.leagueId, year).subscribe(season => {
      this.gameService.getGamesBySeason(season.data[0]._id).subscribe(g => games = g.data as Array<Game>)
    })
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
}
