import { Component, OnInit, Inject } from '@angular/core';
import { League } from '../../models/league';
import { LeagueService } from '../../backendServices/league/league.service'
import { GenerateLeagueService } from '../../services/generate-league.service'
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  leagues;
  constructor(private leagueService: LeagueService,
              public dialog: MdDialog) { }

  ngOnInit() {
    this.leagues = this.leagueService.leagues$().map(l => l.data)
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
  isGenerating = false
  constructor(
    public dialogRef: MdDialogRef<CreateLeagueDialogComponent>,
    private generateLeagueService: GenerateLeagueService,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async generateLeague() {
    this.isGenerating = true
    await this.generateLeagueService.generateLeague(this.leagueName, this.numberOfTeams)
    this.isGenerating = false
    this.dialogRef.close();
  }

}
