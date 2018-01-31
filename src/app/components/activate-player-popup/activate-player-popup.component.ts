import { Component, OnInit } from '@angular/core';
import { Team, RosterSpot } from 'app/models/team';
import { Player } from 'app/models/player';
import { StaticListsService } from 'app/services/static-lists.service';
import * as _ from 'lodash';
import { LeagueDataService } from 'app/services/league-data.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-activate-player-popup',
  templateUrl: './activate-player-popup.component.html',
  styleUrls: ['./activate-player-popup.component.scss']
})
export class ActivatePlayerPopupComponent implements OnInit {
  teamInstance: Team
  player: Player
  playerToDeactivate: Player
  constructor(private staticListsService: StaticListsService,
    public dialogRef: MatDialogRef<ActivatePlayerPopupComponent>,
    public leagueDataService: LeagueDataService) { }

  ngOnInit() {
    while (!this.player || !this.teamInstance) { }
    if (this.teamInstance.roster.batters.length + this.teamInstance.roster.pitchers.length < 25) {
      this.getPlayerFromReservesAndAddToRoster()
      this.leagueDataService.updateTeam(this.teamInstance)
      this.dialogRef.close()
    }
  }

  getPlayerFromReservesAndAddToRoster() {
    const that = this
    let player: RosterSpot
    if (that.player.playerType === that.staticListsService.playerTypes.batter) {
      const index = _.findIndex(that.teamInstance.roster.batterReserves, function(batter){
        return that.player._id === batter.playerId
      })
      player = this.teamInstance.roster.batterReserves.splice(index, 1)[0]
      player.startingPosition = null
      player.orderNumber = null
      that.teamInstance.roster.batters.push(player)
    } else {
      const index = _.findIndex(that.teamInstance.roster.pitcherReserves, function(batter){
        return that.player._id === batter.playerId
      })
      player = that.teamInstance.roster.pitcherReserves.splice(index, 1)[0]
      player.startingPosition = null
      player.orderNumber = null
      that.teamInstance.roster.pitchers.push(player)
    }
  }

  switchPlayers() {
    const that = this
    let player: RosterSpot
    if (that.playerToDeactivate.playerType === that.staticListsService.playerTypes.batter) {
      const index = _.findIndex(that.teamInstance.roster.batterReserves, function(batter){
        return that.playerToDeactivate._id === batter.playerId
      })
      player = this.teamInstance.roster.batters.splice(index, 1)[0]
      player.startingPosition = null
      player.orderNumber = null
      that.teamInstance.roster.batterReserves.push(player)
    } else {
      const index = _.findIndex(that.teamInstance.roster.pitcherReserves, function(batter){
        return that.playerToDeactivate._id === batter.playerId
      })
      player = that.teamInstance.roster.pitchers.splice(index, 1)[0]
      player.startingPosition = null
      player.orderNumber = null
      that.teamInstance.roster.pitcherReserves.push(player)
    }
    that.getPlayerFromReservesAndAddToRoster()
    that.leagueDataService.updateTeam(that.teamInstance)
    that.dialogRef.close()
  }
}
