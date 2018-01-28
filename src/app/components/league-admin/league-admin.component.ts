import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from 'app/services/league-data.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/Operators';

@Component({
  selector: 'app-league-admin',
  templateUrl: './league-admin.component.html',
  styleUrls: ['./league-admin.component.scss']
})
export class LeagueAdminComponent implements OnInit {
  myControl: FormControl = new FormControl();
  constructor(public leagueDataService: LeagueDataService) {}
  ngOnInit() {
  }

}
