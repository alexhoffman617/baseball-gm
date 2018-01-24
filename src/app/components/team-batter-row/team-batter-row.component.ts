import { Component, OnChanges, Input } from '@angular/core';
import { Player, BatterSeasonStats, FieldingSeasonStats } from '../../models/player';
import { RosterSpot, Team } from '../../models/team';
import { HittingProgression } from '../../models/player';
import { LeagueDataService } from '../../services/league-data.service';
import { SharedFunctionsService } from '../../services/shared-functions.service';
import { StaticListsService } from '../../services/static-lists.service';
import * as _ from 'lodash';

@Component({
  selector: '[app-team-batter-row]',
  templateUrl: './team-batter-row.component.html',
  styleUrls: ['./team-batter-row.component.css']
})
export class TeamBatterRowComponent implements OnChanges {
  @Input() batter: Player;
  @Input() seasonYear: number;
  @Input() teamInstance: Team
  @Input() rosterBatter: RosterSpot;
  @Input() displaySet: string;
  @Input() button: string;
  hittingProgression: HittingProgression
  seasonStats: BatterSeasonStats
  fieldingSeasonStats: FieldingSeasonStats
  showName = false
  showSeasonYear = false
  showBatterAge = false
  showPosition = false
  showRosterPosition = false
  showOrderNumber = false
  showOverall = false
  showSkills = false
  showStats = false
  showErrors = false

  constructor(public leagueDataService: LeagueDataService,
    public sharedFunctionsService: SharedFunctionsService,
    public staticListsService: StaticListsService,
  ) { }

  ngOnChanges() {
    this.hittingProgression = this.getHittingProgression()
    this.seasonStats = this.getHittingStats()
    this.fieldingSeasonStats = this.getFieldingStats()
    this.setDisplay()
  }

  setDisplay() {
    if (this.displaySet === 'stats') {
      this.showName = false
      this.showSeasonYear = true
      this.showBatterAge = false
      this.showPosition = false
      this.showRosterPosition = false
      this.showOrderNumber = false
      this.showOverall = false
      this.showSkills = false
      this.showStats = true
      this.showErrors = true
    } else if (this.displaySet === 'fa') {
      this.showName = true
      this.showSeasonYear = false
      this.showBatterAge = true
      this.showPosition = true
      this.showRosterPosition = false
      this.showOrderNumber = false
      this.showOverall = true
      this.showSkills = false
      this.showStats = false
      this.showErrors = false
    } else {
      this.showName = true
      this.showSeasonYear = false
      this.showBatterAge = true
      this.showPosition = true
      this.showRosterPosition = true
      this.showOrderNumber = true
      this.showOverall = true
      this.showSkills = false
      this.showStats = true
      this.showErrors = true
    }
  }

  isHittingProgression() {
    this.hittingProgression = this.getHittingProgression()
    return !!this.hittingProgression
  }

  overallHittingAbility() {
    if (!this.batter) {
      return
    }
    return Math.round((this.batter.hittingAbility.contact + this.batter.hittingAbility.power
      + this.batter.hittingAbility.patience + this.batter.hittingAbility.speed + this.batter.hittingAbility.fielding) * .2);
  }

  overallHittingPotential() {
    if (!this.batter) {
      return
    }
    return Math.round((this.batter.hittingPotential.contact + this.batter.hittingPotential.power
      + this.batter.hittingPotential.patience + this.batter.hittingPotential.speed + this.batter.hittingPotential.fielding) * .2);
  }

  getHittingStats() {
    if (!this.batter) {
      return
    }
    const that = this
    return _.find(this.batter.hittingSeasonStats, function(hss: BatterSeasonStats){
      return hss.year === that.seasonYear
    })
  }

  getFieldingStats() {
    if (!this.batter) {
      return
    }
    const that = this
    return _.find(this.batter.fieldingSeasonStats, function(fss: FieldingSeasonStats){
      return fss.year === that.seasonYear
    })
  }

  getHittingProgression() {
    if (!this.batter) {
      return
    }
    const that = this
    return _.find(this.batter.hittingProgressions, function(hp: HittingProgression){
      return hp.year === that.seasonYear - 1
    })
  }

  onPositionChange(setBatter, event) {
    _.each(this.teamInstance.roster.batters, function(batter){
      if (batter.playerId === setBatter._id) {
        batter.startingPosition = event.value
      } else if (batter.startingPosition === event.value) {
        batter.startingPosition = null;
        batter.orderNumber = null;
      }
    })
    this.leagueDataService.updateTeam(this.teamInstance)
  }

  onOrderChange(setBatter, event) {
    _.each(this.teamInstance.roster.batters, function(batter){
      if (batter.playerId === setBatter._id) {
        batter.orderNumber = event.value
      } else if (batter.orderNumber === event.value) {
        batter.orderNumber = null;
      }
    })
    this.leagueDataService.updateTeam(this.teamInstance)
  }

  overallHitting(hittingSkillset) {
    if (!hittingSkillset) {
      return null
    }
    return Math.round((hittingSkillset.contact + hittingSkillset.power
      + hittingSkillset.patience + hittingSkillset.speed + hittingSkillset.fielding) * .2);
  }

  release() {
    const that = this
    _.remove(this.teamInstance.roster.batters, function(batter){
      return batter.playerId === that.batter._id
    })
    this.leagueDataService.updateTeam(this.teamInstance)
    this.batter.teamId = null
    this.leagueDataService.updatePlayer(this.batter)
  }
}
