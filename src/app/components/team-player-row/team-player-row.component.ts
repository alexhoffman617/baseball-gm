import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models/player';
import { SeasonStats } from '../../models/season-stats';
import { RosterSpot, Team } from '../../models/team';
import { HittingProgression } from '../../models/player';
import { TeamService } from '../../backendServices/team/team.service';
import * as _ from 'lodash';

@Component({
  selector: '[app-team-player-row]',
  templateUrl: './team-player-row.component.html',
  styleUrls: ['./team-player-row.component.css']
})
export class TeamPlayerRowComponent implements OnInit {
  @Input() batter: Player;
  @Input() seasonStats: SeasonStats;
  @Input() seasonYear: number;
  @Input() teamInstance: Team
  @Input() rosterBatter: RosterSpot
  hittingProgression: HittingProgression

  positions= [
    "C",
    "1B",
    "2B",
    "3B",
    "SS",
    "LF",
    "CF",
    "RF",
    "DH"
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
    this.hittingProgression = this.getHittingProgression(this.batter)
  }

  isHittingProgression(){
    this.hittingProgression = this.getHittingProgression(this.batter)
    return !!this.hittingProgression
  }

  overallHittingAbility(player) {
    return Math.round((player.hittingAbility.contact + player.hittingAbility.power
      + player.hittingAbility.patience + player.hittingAbility.speed + player.hittingAbility.fielding) * .2);
  }

  overallHittingPotential(player) {
    return Math.round((player.hittingPotential.contact + player.hittingPotential.power
      + player.hittingPotential.patience + player.hittingPotential.speed + player.hittingPotential.fielding) * .2);
  }

  getHittingProgression(player) {
    const that = this
    return _.find(player.hittingProgressions, function(hp: HittingProgression){
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
