import { Component, OnChanges, Input } from '@angular/core';
import { Player } from '../../models/player';
import { RosterSpot, Team } from '../../models/team';
import { PitchingProgression, PitcherSeasonStats } from '../../models/player';
import { LeagueDataService } from '../../services/league-data.service';
import { SharedFunctionsService } from '../../services/shared-functions.service';
import { StaticListsService } from '../../services/static-lists.service';
import { MatDialog } from '@angular/material';
import { ActivatePlayerPopupComponent } from '../activate-player-popup/activate-player-popup.component'
import * as _ from 'lodash';

@Component({
  selector: '[app-team-pitcher-row]',
  templateUrl: './team-pitcher-row.component.html',
  styleUrls: ['./team-pitcher-row.component.css']
})
export class TeamPitcherRowComponent implements OnChanges {
  @Input() pitcher: Player
  @Input() seasonYear: number
  @Input() teamInstance: Team
  @Input() rosterPitcher: RosterSpot
  @Input() displaySet: string
  @Input() button: string
  @Input() owner: boolean
  @Input() reserve: boolean
  pitchingProgression: PitchingProgression
  seasonStats: PitcherSeasonStats
  showName = false
  showSeasonYear = false
  showAge = false
  showRosterPosition = false
  showPosition = false
  showOverall = false
  showSkills = false
  showStats = false
  showStamina = false

  constructor(private leagueDataService: LeagueDataService,
     public staticListsService: StaticListsService,
     public sharedFunctionsService: SharedFunctionsService,
     public dialog: MatDialog) { }

  ngOnChanges() {
    this.pitchingProgression = this.getPitchingProgression()
    this.seasonStats = this.getPitchingStats()
    this.setDisplay()
  }

  setDisplay() {
    if (this.displaySet === 'stats') {
      this.showName = false
      this.showPosition = false
      this.showSeasonYear = true
      this.showAge = false
      this.showRosterPosition = false
      this.showOverall = false
      this.showSkills = false
      this.showStats = true
      this.showStamina = false
    } else if (this.displaySet === 'fa') {
      this.showName = true
      this.showPosition = true
      this.showSeasonYear = false
      this.showAge = true
      this.showRosterPosition = false
      this.showOverall = true
      this.showSkills = false
      this.showStats = false
      this.showStamina = false
    } else {
      this.showName = true
      this.showPosition = false
      this.showSeasonYear = false
      this.showAge = true
      this.showRosterPosition = true
      this.showOverall = true
      this.showSkills = false
      this.showStats = true
      this.showStamina = true
    }
  }

  isPitchingProgression() {
    this.pitchingProgression = this.getPitchingProgression()
    return !!this.pitchingProgression
  }

  overallPitching(skillset) {
    if (!this.pitcher) {
      return
    }
    return Math.round((skillset.velocity + skillset.control
       + skillset.movement) / 3);
  }

  getPitchingProgression() {
    if (!this.pitcher) {
      return
    }
    const that = this
    return _.find(this.pitcher.pitchingProgressions, function(pp: PitchingProgression){
      return pp.year === that.seasonYear - 1
    })
  }

  getPitchingStats() {
    if (!this.pitcher) {
      return
    }
    const that = this
    return _.find(this.pitcher.pitchingSeasonStats, function(hss: PitcherSeasonStats){
      return hss.year === that.seasonYear
    })
  }

  onPitcherRoleChange(setPitcher, event) {
    _.each(this.teamInstance.roster.pitchers, function(pitcher){
      if (pitcher.startingPosition === event.value && pitcher.playerId !== setPitcher.playerId) {
        pitcher.startingPosition = '';
        pitcher.orderNumber = null
      }
    })
    this.leagueDataService.updateTeam(this.teamInstance)
  }

  release() {
    const that = this
    _.remove(this.teamInstance.roster.pitchers, function(pitcher){
      return pitcher.playerId === that.pitcher._id
    })
    _.remove(this.teamInstance.roster.pitcherReserves, function(pitcher){
      return pitcher.playerId === that.pitcher._id
    })
    this.leagueDataService.updateTeam(this.teamInstance)
    this.pitcher.teamId = null
    this.leagueDataService.updatePlayer(this.pitcher)
  }

  activate() {
    const dialogRef = this.dialog.open(ActivatePlayerPopupComponent, {
      height: '300px',
      width: '300px'
    });
    dialogRef.componentInstance.teamInstance = this.teamInstance
    dialogRef.componentInstance.player = this.pitcher
  }
}
