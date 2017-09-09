import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { Feathers } from './backendServices/feathers.service';

import { AppComponent } from './app.component';

import { MainComponent } from './components/main/main.component';

import { TestComponent } from './components/test/test.component';
import { PlayGameTestComponent } from './components/play-game-test/play-game-test.component';
import { GeneratePlayerTestComponent } from './components/generate-player-test/generate-player-test.component';
import { CreateTeamTestComponent } from './components/create-team-test/create-team-test.component';
import { PlayerProgressionTestComponent } from './components/player-progression-test/player-progression-test.component';

import { PlayGameService } from './services/play-game.service';
import { GeneratePlayerService } from './services/generate-player.service';
import { GenerateTeamService } from './services/generate-team.service';
import { AtBatService } from './services/at-bat.service';
import { PlayerProgressionService } from './services/player-progression.service';

import { PlayerService } from './backendServices/player/player.service';
import { LeagueService } from './backendServices/league/league.service';
import { TeamService } from './backendServices/team/team.service';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'test', component: TestComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    PlayGameTestComponent,
    GeneratePlayerTestComponent,
    TestComponent,
    CreateTeamTestComponent,
    PlayerProgressionTestComponent,
    MainComponent
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
    PlayerProgressionService,
    PlayerService,
    LeagueService,
    TeamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
