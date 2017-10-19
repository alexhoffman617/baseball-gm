import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../../backendServices/league/league.service'
import { TeamService } from '../../backendServices/team/team.service'
import { PlayerService } from '../../backendServices/player/player.service'
import { SeasonService } from '../../backendServices/season/season.service'
import { GameService } from '../../backendServices/game/game.service'

@Component({
  selector: 'admin-db-cleanup',
  templateUrl: './admin-db-cleanup.component.html',
  styleUrls: ['./admin-db-cleanup.component.css']
})
export class AdminDbCleanupComponent implements OnInit {

  constructor(private leagueService: LeagueService,
              private teamService: TeamService,
              private seasonService: SeasonService,
              private gameService: GameService,
              private playerService: PlayerService) { }

  ngOnInit() {
  }

  clearLeagues() {
    this.leagueService.deleteAllLeagues();
  }

  clearTeams() {
    this.teamService.deleteAllTeams();
  }

  clearPlayers() {
    this.playerService.deleteAllPlayers();
  }

  clearSeasons() {
    this.seasonService.deleteAllSeasons();
  }

  clearGames() {
    this.gameService.deleteAllGames();
  }

  clearAll() {
    this.clearLeagues();
    this.clearTeams();
    this.clearPlayers();
    this.clearSeasons();
    this.clearGames();
  }

}
