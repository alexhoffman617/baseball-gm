import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { Feathers } from './backendServices/feathers.service';

import { AppComponent } from './app.component';

import { MainComponent } from './components/main/main.component';
import { CreateLeagueDialogComponent } from './components/main/main.component';
import { LeagueComponent } from './components/league/league.component';
import { LeagueHomeComponent } from './components/league-home/league-home.component';
import { TeamComponent } from './components/team/team.component';

import { TestComponent } from './components/test/test.component';
import { PlayGameTestComponent } from './components/play-game-test/play-game-test.component';
import { GeneratePlayerTestComponent } from './components/generate-player-test/generate-player-test.component';
import { CreateTeamTestComponent } from './components/create-team-test/create-team-test.component';
import { PlayerProgressionTestComponent } from './components/player-progression-test/player-progression-test.component';
import { AdminDbCleanupComponent } from './components/admin-db-cleanup/admin-db-cleanup.component';

import { PlayGameService } from './services/play-game.service';
import { GeneratePlayerService } from './services/generate-player.service';
import { GenerateTeamService } from './services/generate-team.service';
import { GenerateLeagueService } from './services/generate-league.service';
import { SeasonGenerator } from './services/season.generator';
import { RealMlbScheduleGenerator } from './services/real-mlb-schedule.generator';
import { AtBatService } from './services/at-bat.service';
import { PlayerProgressionService } from './services/player-progression.service';
import { PitcherProgressionService } from './services/pitcher-progression.service';
import { LeagueProgressionService } from './services/league-progression.service';
import { LeagueDataService } from './services/league-data.service';
import { TeamBatterRowComponent } from './components/team-batter-row/team-batter-row.component';

import { PlayerService } from './backendServices/player/player.service';
import { LeagueService } from './backendServices/league/league.service';
import { TeamService } from './backendServices/team/team.service';
import { SeasonService } from './backendServices/season/season.service';
import { GameService } from './backendServices/game/game.service';
import { TeamPitcherRowComponent } from './components/team-pitcher-row/team-pitcher-row.component';
import { PlayerComponent } from './components/player/player.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'test', component: TestComponent},
  {path: ':leagueId',
  component: LeagueComponent,
  children: [
    {path: '', redirectTo: 'league-home', pathMatch: 'full'},
    {path: 'league-home', component: LeagueHomeComponent},
    {path: 'team/:teamId', component: TeamComponent},
    {path: 'player/:playerId', component: PlayerComponent}
  ]}
];

@NgModule({
  declarations: [
    AppComponent,
    PlayGameTestComponent,
    GeneratePlayerTestComponent,
    TestComponent,
    CreateTeamTestComponent,
    PlayerProgressionTestComponent,
    MainComponent,
    CreateLeagueDialogComponent,
    AdminDbCleanupComponent,
    LeagueHomeComponent,
    LeagueComponent,
    TeamComponent,
    TeamBatterRowComponent,
    TeamPitcherRowComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    FlexLayoutModule,
    HttpModule
  ],
  providers: [
    Feathers,
    PlayGameService,
    GeneratePlayerService,
    AtBatService,
    GenerateTeamService,
    GenerateLeagueService,
    SeasonGenerator,
    RealMlbScheduleGenerator,
    PlayerProgressionService,
    PitcherProgressionService,
    LeagueProgressionService,
    PlayerService,
    LeagueService,
    TeamService,
    SeasonService,
    GameService,
    LeagueDataService
  ],
  entryComponents: [CreateLeagueDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
