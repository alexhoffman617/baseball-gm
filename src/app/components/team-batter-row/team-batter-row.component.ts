import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models/player';
import { BatterSeasonStats } from '../../models/season-stats';
import { RosterSpot, Team } from '../../models/team';
import { HittingProgression } from '../../models/player';
import { TeamService } from '../../backendServices/team/team.service';
import * as _ from 'lodash';

@Component({
  selector: '[app-team-batter-row]',
  templateUrl: './team-batter-row.component.html',
  styleUrls: ['./team-batter-row.component.css']
})
export class TeamBatterRowComponent implements OnInit {
  @Input() batter: Player;
  @Input() seasonStats: BatterSeasonStats;
  @Input() seasonYear: number;
  @Input() teamInstance: Team
  @Input() rosterBatter: RosterSpot;
  hittingProgression: HittingProgression

  positions= [
    'C',
    '1B',
    '2B',
    '3B',
    'SS',
    'LF',
    'CF',
    'RF',
    'DH'
  ]

  orderNumbers= [
    null,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ]

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.hittingProgression = this.getHittingProgression()
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
    this.teamService.updateTeam(this.teamInstance)
  }

  onOrderChange(setBatter, event) {
    _.each(this.teamInstance.roster.batters, function(batter){
      if (batter.playerId === setBatter._id) {
        batter.orderNumber = event.value
      } else if (batter.orderNumber === event.value) {
        batter.orderNumber = null;
      }
    })
    this.teamService.updateTeam(this.teamInstance)
  }
}
