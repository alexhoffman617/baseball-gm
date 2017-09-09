import { Component, OnInit } from '@angular/core';
import { League } from '../../models/league';
import { LeagueService } from '../../backendServices/league/league.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  leagues;
  constructor(private leagueService: LeagueService) { }

  ngOnInit() {
    this.leagues = this.leagueService.leagues$().map(l => l.data)
  }

  generateNewLeague(){
    this.leagueService.createLeague(new League(4, "test"))
  }

}
