import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from '../../services/league-data.service';
import { SharedFunctionsService } from '../../services/shared-functions.service';

@Component({
  selector: 'app-league-stats',
  templateUrl: './league-stats.component.html',
  styleUrls: ['./league-stats.component.scss']
})
export class LeagueStatsComponent implements OnInit {

  constructor(public leagueDataService: LeagueDataService, public sharedFunctionsService: SharedFunctionsService) { }

  ngOnInit() {
  }

}
