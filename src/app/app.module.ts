import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout'

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
import { PlayoffScheduleGenerator } from './services/playoff-schedule.generator';
import { RealMlbScheduleGenerator } from './services/real-mlb-schedule.generator';
import { AtBatService } from './services/at-bat.service';
import { PlayerProgressionService } from './services/player-progression.service';
import { PitcherProgressionService } from './services/pitcher-progression.service';
import { LeagueProgressionService } from './services/league-progression.service';
import { LeagueDataService } from './services/league-data.service';
import { StaticListsService } from './services/static-lists.service';
import { ProcessGameService } from './services/process-game.service';
import { SharedFunctionsService } from './services/shared-functions.service';
import { AuthService } from './services/auth.service';
import { RandomFaceService } from './services/random-face.service';

import { TeamBatterRowComponent } from './components/team-batter-row/team-batter-row.component';
import { TeamPitcherRowComponent } from './components/team-pitcher-row/team-pitcher-row.component';
import { PlayerComponent } from './components/player/player.component';
import { MessegesTestComponent } from './components/messeges-test/messeges-test.component';
import { FreeAgentsComponent } from './components/free-agents/free-agents.component';
import { NegotiateContractComponent } from './components/negotiate-contract/negotiate-contract.component';
import { GenerateScheduleTestComponent } from './components/generate-schedule-test/generate-schedule-test.component';
import { PlayoffBracketComponent } from './components/playoff-bracket/playoff-bracket.component';
import { LoginComponent } from './components/login/login.component';
import { LeagueAdminComponent } from './components/league-admin/league-admin.component';
import { ContractExpectationService } from './services/contract-expectation.service';
import { ActivatePlayerPopupComponent } from './components/activate-player-popup/activate-player-popup.component';
import { TeamFreeAgentComponent } from './components/team-free-agent/team-free-agent.component';
import { DraftComponent } from 'app/components/draft/draft.component';
import { FaceComponent } from './components/face/face.component';
import { TradeComponent } from './components/trade/trade.component';
import { LeagueStatsComponent } from './components/league-stats/league-stats.component';
import { FantasyDraftComponent } from './components/fantasy-draft/fantasy-draft.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: LoginComponent},
  {path: 'test', component: TestComponent},
  {path: 'face', component: FaceComponent},
  {path: ':leagueId',
  component: LeagueComponent,
  children: [
    {path: '', redirectTo: 'league-home', pathMatch: 'full'},
    {path: 'admin', component: LeagueAdminComponent},
    {path: 'league-home', component: LeagueHomeComponent},
    {path: 'team/:teamId', component: TeamComponent},
    {path: 'player/:playerId', component: PlayerComponent},
    {path: 'negotiate-contract/:playerId', component: NegotiateContractComponent},
    {path: 'free-agents', component: FreeAgentsComponent},
    {path: 'draft', component: DraftComponent},
    {path: 'fantasy-draft', component: FantasyDraftComponent},
    {path: 'league-stats', component: LeagueStatsComponent},
    {path: 'trade', component: TradeComponent}
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
    PlayerComponent,
    MessegesTestComponent,
    FreeAgentsComponent,
    NegotiateContractComponent,
    GenerateScheduleTestComponent,
    PlayoffBracketComponent,
    LoginComponent,
    LeagueAdminComponent,
    ActivatePlayerPopupComponent,
    TeamFreeAgentComponent,
    DraftComponent,
    FaceComponent,
    TradeComponent,
    LeagueStatsComponent,
    FantasyDraftComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    FlexLayoutModule
  ],
  providers: [
    PlayGameService,
    GeneratePlayerService,
    AtBatService,
    GenerateTeamService,
    GenerateLeagueService,
    SeasonGenerator,
    RealMlbScheduleGenerator,
    PlayoffScheduleGenerator,
    PlayerProgressionService,
    PitcherProgressionService,
    LeagueProgressionService,
    LeagueDataService,
    StaticListsService,
    ProcessGameService,
    SharedFunctionsService,
    AuthService,
    ContractExpectationService,
    RandomFaceService
  ],
  entryComponents: [CreateLeagueDialogComponent, ActivatePlayerPopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
