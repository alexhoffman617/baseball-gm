import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team, RosterSpot } from '../../models/team';
import { Player } from '../../models/player';
import { LeagueDataService } from '../../services/league-data.service';
import { StaticListsService } from '../../services/static-lists.service';
import { MatSnackBar } from '@angular/material';
import { ContractExpectationService } from 'app/services/contract-expectation.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Contract } from 'app/models/contract';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import * as _ from 'lodash';
import { timeout } from 'q';

@Component({
  selector: 'app-negotiate-contract',
  templateUrl: './negotiate-contract.component.html',
  styleUrls: ['./negotiate-contract.component.css']
})
export class NegotiateContractComponent implements OnInit {
  usersTeam: Team
  playerId: string
  player: Player
  expectedContract: Contract
  currentOffer: Contract
  salary: number
  years: number
  constructor(public leagueDataService: LeagueDataService,
    private staticListsService: StaticListsService,
    public sharedFunctionsService: SharedFunctionsService,
    private route: ActivatedRoute,
    public contractExpectationService: ContractExpectationService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    const that = this
    that.route.params.subscribe(params => {
      that.playerId = params['playerId'];
      (async () => {
        that.player = await that.leagueDataService.getPlayer(that.playerId)
        that.usersTeam = that.sharedFunctionsService.getUsersTeam()
        that.currentOffer = _.find(that.player.contractOffers, function(co){
          return that.usersTeam._id === co.teamId
        })
        that.expectedContract = that.contractExpectationService.getContractExpectations(that.player)
      })()
    })
  }

  add() {
    if (this.usersTeam.roster.batters.length + this.usersTeam.roster.pitchers.length +
      this.usersTeam.roster.batterReserves.length + this.usersTeam.roster.pitcherReserves.length >= 40) {
      this.snackBar.open('Team already has a full 40 man roster players', 'Ok', {duration: 2000})
    } else {
      if (this.player.playerType === this.staticListsService.playerTypes.batter) {
        this.usersTeam.roster.batters.push(new RosterSpot(this.playerId, null, null))
      } else {
        this.usersTeam.roster.pitchers.push(new RosterSpot(this.playerId, null, null))
      }
      this.leagueDataService.updateTeam(this.usersTeam)
      this.player.teamId = this.usersTeam._id
      this.player.contracts.push(new Contract(this.playerId, this.usersTeam._id, this.expectedContract.salary,
        this.leagueDataService.currentSeason.year, this.expectedContract.years, this.staticListsService.contractStates.accepted, 0))
      this.leagueDataService.updatePlayer(this.player)
    }
  }

  offerContract() {
    const that = this
    const rosterCount = this.usersTeam.roster.batters.length + this.usersTeam.roster.pitchers.length +
    this.usersTeam.roster.batterReserves.length + this.usersTeam.roster.pitcherReserves.length
    if (!this.years || !this.salary) {
      this.snackBar.open('Years and Value are required', 'Ok', {duration: 2000})
    } else if (!this.sharedFunctionsService.canOfferContract(this.usersTeam, this.salary)) {
      this.snackBar.open(this.sharedFunctionsService.canOfferContract(this.usersTeam, this.salary).reason,  'Ok', {duration: 2000})
    } else {
      const index = _.findIndex(this.player.contractOffers, {teamId: that.usersTeam._id})
      if (index > -1) {
        this.player.contractOffers.splice(index, 1)
      }
      that.currentOffer = new Contract(this.playerId, this.usersTeam._id, this.salary, this.leagueDataService.currentSeason.year,
        this.years, this.staticListsService.contractStates.offered, this.leagueDataService.currentSeason.preseasonDay)
      this.player.contractOffers.push(that.currentOffer)
        this.leagueDataService.updatePlayer(this.player)
    }
  }

  processContractOffers() {
    this.contractExpectationService.processContractOffers(this.player)
  }

  valueRound() {
    if (this.salary < 500000) {
      this.salary = 500000
    }
    if (this.salary > 100000000) {
      this.salary = 100000000
    }
    this.salary = Math.round(this.salary / 100000) * 100000
  }

  playerIsFreeAgent() {
    if (this.player && !this.player.teamId) {
      return true
    } else {
      return false
    }
  }

}
