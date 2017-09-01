import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { TestComponent } from './components/test/test.component';
import { PlayGameTestComponent } from './components/play-game-test/play-game-test.component';
import { GeneratePlayerTestComponent } from './components/generate-player-test/generate-player-test.component';
import { CreateTeamTestComponent } from './components/create-team-test/create-team-test.component';

import { PlayGameService } from './services/play-game.service';
import { GeneratePlayerService } from './services/generate-player.service';
import { GenerateTeamService } from './services/generate-team.service';
import { AtBatService } from './services/at-bat.service';

const routes: Routes = [
  {path: '', component: TestComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    PlayGameTestComponent,
    GeneratePlayerTestComponent,
    TestComponent,
    CreateTeamTestComponent
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
    PlayGameService,
    GeneratePlayerService,
    AtBatService,
    GenerateTeamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
