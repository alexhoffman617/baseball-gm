import { Component, OnInit, Inject } from '@angular/core';
import { League } from '../../models/league';
import { GenerateLeagueService } from '../../services/generate-league.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client';
import { SharedFunctionsService } from 'app/services/shared-functions.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  leagues;
  socket;
  constructor(public dialog: MatDialog,
              private http: Http) { }

  ngOnInit() {
    this.socket = io.connect('http://localhost:3000/');
    new Observable(observer => {
      this.http.get('/api/leagues', {params: {}}).subscribe(data => {
        observer.next(data.json());
      });
    this.socket.on('leagues', (data) => {
      observer.next(data);
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
      height: '300px',
      width: '300px'
    });
  }

}

@Component({
  selector: 'app-create-league-dialog',
  templateUrl: 'create-league-dialog.html',
})
export class CreateLeagueDialogComponent {
  leagueName: string
  numberOfTeams: number
  useMlbTeams = false
  isGenerating = false
  constructor(
    public dialogRef: MatDialogRef<CreateLeagueDialogComponent>,
    private generateLeagueService: GenerateLeagueService,
    public sharedFunctionsService: SharedFunctionsService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async generateLeague() {
    this.isGenerating = true
    await this.generateLeagueService.generateLeague(this.leagueName, this.numberOfTeams, this.useMlbTeams)
    this.isGenerating = false
    this.dialogRef.close();
  }

}
