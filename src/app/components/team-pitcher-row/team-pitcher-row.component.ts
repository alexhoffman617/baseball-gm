import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models/player';
import { PitcherSeasonStats } from '../../models/season-stats';
import { RosterSpot, Team } from '../../models/team';
import { PitchingProgression } from '../../models/player';
import { TeamService } from '../../backendServices/team/team.service';
import * as _ from 'lodash';

@Component({
  selector: '[app-team-pitcher-row]',
  templateUrl: './team-pitcher-row.component.html',
  styleUrls: ['./team-pitcher-row.component.css']
})
export class TeamPitcherRowComponent implements OnInit {
  @Input() pitcher: Player;
  @Input() seasonStats: PitcherSeasonStats;
  @Input() seasonYear: number;
  @Input() teamInstance: Team
  @Input() rosterPitcher: RosterSpot
  pitchingProgression: PitchingProgression

  pitcherRoles = [
    '',
    'SP1',
    'SP2',
    'SP3',
    'SP4',
    'SP5'
  ]

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.pitchingProgression = this.getPitchingProgression()
  }

  isPitchingProgression() {
    this.pitchingProgression = this.getPitchingProgression()
    return !!this.pitchingProgression
  }

  overallPitchingAbility() {
    if (!this.pitcher) {
      return
    }
    return Math.round((this.pitcher.pitchingAbility.velocity + this.pitcher.pitchingAbility.control
       + this.pitcher.pitchingAbility.movement) / 3);
  }

  overallPitchingPotential() {
    if (!this.pitcher) {
      return
    }
    return Math.round((this.pitcher.pitchingPotential.velocity + this.pitcher.pitchingPotential.control
       + this.pitcher.pitchingPotential.movement) / 3);
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

  onPitcherRoleChange(setPitcher, event) {
    _.each(this.teamInstance.roster.pitchers, function(pitcher){
      if (pitcher.startingPosition === event.value && pitcher.playerId !== setPitcher.playerId) {
        pitcher.startingPosition = '';
        pitcher.orderNumber = null
      }
    })
    this.teamService.updateTeam(this.teamInstance)
  }

}
