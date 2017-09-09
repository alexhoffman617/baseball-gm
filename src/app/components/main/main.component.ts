import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../../backEndServices/league/league.service';
import { League  } from '../../models/league';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  leagues;
  constructor(private leagueService: LeagueService) { }

  ngOnInit() {
    this.leagueService.getAllLeagues().subscribe(leagues => {
      this.leagues = leagues;
    });; 
  }

  generateLeague(){
    this.leagueService.postLeague(new League("test", new Date(), 4));
  }
}
