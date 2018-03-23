import { Component, OnInit, Inject } from '@angular/core';
import { League } from '../../models/league';
import { GenerateLeagueService } from '../../services/generate-league.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import { Router } from '@angular/router';
import { Season } from '../../models/season';
import * as _ from 'lodash';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  leagues;
  seasons: Array<Season>;
  socket;
  constructor(public dialog: MatDialog,
              private http: Http) { }

  ngOnInit() {
    this.socket = io.connect(window.location.protocol + '//' + window.location.host);
    this.http.get('/api/seasons', {params: {}}).subscribe(data => {
      this.seasons = data.json()
    })
    new Observable(observer => {
      this.http.get('/api/leagues/' + localStorage.getItem('baseballgm-id'), {params: {}}).subscribe(data => {
        observer.next(data.json());
      });
    this.socket.on('leagues', (data) => {
      // observer.next(data);
    });
    return () => {
      this.socket.disconnect();
    };
  }).subscribe(leagues => {
    this.leagues = leagues
  })
}

  generateNewLeague() {
    const dialogRef = this.dialog.open(CreateLeagueDialogComponent, {
      height: '400px',
      width: '400px'
    });
  }

  getYear(leagueId) {
    if (!this.seasons) { return }
    const seasons = _.filter(this.seasons, function(season){
      return season.leagueId === leagueId
    })
    const orderedSeasons = _.orderBy(seasons, 'year', 'desc')
    return orderedSeasons.length === 0 ? null : orderedSeasons[0].year
  }
}


@Component({
  selector: 'app-create-league-dialog',
  templateUrl: 'create-league-dialog.html',
})
export class CreateLeagueDialogComponent {
  leagueName: string
  fantasyDraft = false
  numberOfTeams = 4
  useMlbTeams = false
  isGenerating = false
  constructor(
    public dialogRef: MatDialogRef<CreateLeagueDialogComponent>,
    private generateLeagueService: GenerateLeagueService,
    public sharedFunctionsService: SharedFunctionsService,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async generateLeague() {
    this.isGenerating = true
    const newLeagueId = await this.generateLeagueService.generateLeague(this.leagueName, this.numberOfTeams,
       this.fantasyDraft, this.useMlbTeams)
    this.isGenerating = false
    this.dialogRef.close();
    this.router.navigate([newLeagueId])
  }

}
