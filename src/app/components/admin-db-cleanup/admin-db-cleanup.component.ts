import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from '../../services/league-data.service'

@Component({
  selector: 'admin-db-cleanup',
  templateUrl: './admin-db-cleanup.component.html',
  styleUrls: ['./admin-db-cleanup.component.css']
})
export class AdminDbCleanupComponent implements OnInit {

  constructor(private leagueDataService: LeagueDataService) { }

  ngOnInit() {
  }

  deleateLeague(leagueId) {
    this.leagueDataService.deleteLeague();
  }

  deleteAll() {
    this.leagueDataService.deleteAll();
  }
}
