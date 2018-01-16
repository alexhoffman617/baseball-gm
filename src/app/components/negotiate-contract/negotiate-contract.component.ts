import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team, RosterSpot } from '../../models/team';
import { Player } from '../../models/player';
import { LeagueDataService } from '../../services/league-data.service';
import { StaticListsService } from '../../services/static-lists.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-negotiate-contract',
  templateUrl: './negotiate-contract.component.html',
  styleUrls: ['./negotiate-contract.component.css']
})
export class NegotiateContractComponent implements OnInit {
  selectedTeam: Team
  playerId: string
  player: Player
  constructor(public leagueDataService: LeagueDataService,
    private staticListsService: StaticListsService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    const that = this
    that.route.params.subscribe(params => {
      that.playerId = params['playerId']
      that.player = that.leagueDataService.getPlayer(that.playerId)
    })
  }

  add() {
    if (this.selectedTeam.roster.batters.length + this.selectedTeam.roster.pitchers.length >= 25) {
      this.snackBar.open('Team already has 25 players', 'Ok', {duration: 2000})
    } else {
      if (this.player.playerType === this.staticListsService.playerTypes.batter) {
        this.selectedTeam.roster.batters.push(new RosterSpot(this.playerId, null, null))
      } else {
        this.selectedTeam.roster.pitchers.push(new RosterSpot(this.playerId, null, null))
      }
      this.leagueDataService.updateTeam(this.selectedTeam)
      this.player.teamId = this.selectedTeam._id
      this.leagueDataService.updatePlayer(this.player)
    }
  }

}
