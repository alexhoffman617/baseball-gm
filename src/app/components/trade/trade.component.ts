import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from '../../services/league-data.service';
import { Trade } from '../../models/trade';
import { StaticListsService } from '../../services/static-lists.service';
import * as _ from 'lodash';
import { SharedFunctionsService } from '../../services/shared-functions.service';
import { Contract } from '../../models/contract';
import { RosterSpot, Team } from '../../models/team';
import { Player } from '../../models/player';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {
  otherTeamId: string
  otherTeamPlayersArray
  usersTeamPlayersArray
  constructor(public leagueDataService: LeagueDataService,
    public sharedFunctionsService: SharedFunctionsService,
    private staticListService: StaticListsService) { }

  ngOnInit() {
  }

  offer() {
    const userPlayers = []
    _.each(this.usersTeamPlayersArray, function(player){
      if (player.selected) {
        userPlayers.push(player.player._id)
      }
    })
    const otherTeamPlayers = []
    _.each(this.otherTeamPlayersArray, function(player){
      if (player.selected) {
        otherTeamPlayers.push(player.player._id)
      }
    })
    this.leagueDataService.createTrade(new Trade(this.leagueDataService.leagueId, this.sharedFunctionsService.getUserTeam()._id,
      this.otherTeamId, userPlayers, otherTeamPlayers, this.staticListService.tradeStatus.offered))
    this.otherTeamId = null
    this.otherTeamPlayersArray = null
    this.usersTeamPlayersArray = null
  }

  accept(trade: Trade) {
    const teamA = this.leagueDataService.getTeamById(trade.teamAId)
    const teamB = this.leagueDataService.getTeamById(trade.teamBId)
    this.processHalfTrade(teamA, trade.teamAPlayerIds, teamB)
    this.processHalfTrade(teamB, trade.teamBPlayerIds, teamA)
    this.leagueDataService.updateTeam(teamA)
    this.leagueDataService.updateTeam(teamB)
    trade.state = this.staticListService.tradeStatus.completed
    this.leagueDataService.updateTrade(trade)
  }

  getCantAcceptTradeReason(trade: Trade) {
    const that = this
    const teamA = this.leagueDataService.getTeamById(trade.teamAId)
    const teamB = this.leagueDataService.getTeamById(trade.teamBId)
    if (trade.teamAPlayerIds.length > trade.teamBPlayerIds.length
      && this.sharedFunctionsService.getRosterCount(teamB) + trade.teamAPlayerIds.length - trade.teamBPlayerIds.length > 40) {
        return 'Trade would put ' + teamB.location + ' ' + teamB.name + ' over the 40 man roster limit'
    }
    if (trade.teamBPlayerIds.length > trade.teamAPlayerIds.length
      && this.sharedFunctionsService.getRosterCount(teamA) + trade.teamBPlayerIds.length - trade.teamAPlayerIds.length > 40) {
        return 'Trade would put ' + teamA.location + ' ' + teamA.name + ' over the 40 man roster limit'
    }
    let newTeamASalary = this.sharedFunctionsService.getTeamSalary(teamA)
    let newTeamBSalary = this.sharedFunctionsService.getTeamSalary(teamB)
    _.each(trade.teamAPlayerIds, function(id){
      const player = that.leagueDataService.getPlayer(id)
      if (player) {
        const contract = that.getCurrentContract(player)
        newTeamASalary -= contract.salary
        newTeamBSalary += contract.salary
      }
    })
    _.each(trade.teamBPlayerIds, function(id){
      const player = that.leagueDataService.getPlayer(id)
      if (player) {
        const contract = that.getCurrentContract(player)
        newTeamBSalary -= contract.salary
        newTeamASalary += contract.salary
      }
    })
    if (newTeamASalary > that.staticListService.leagueSalary) {
      return 'Trade would put ' + teamA.location + ' ' + teamA.name + ' over the '
      + that.sharedFunctionsService.salaryWithCommas(that.staticListService.leagueSalary) + ' salary cap'
    }
    if (newTeamBSalary > that.staticListService.leagueSalary) {
      return 'Trade would put ' + teamB.location + ' ' + teamB.name + ' over the '
      + that.sharedFunctionsService.salaryWithCommas(that.staticListService.leagueSalary) + ' salary cap'
    }
    return
  }

  processHalfTrade(givingTeam: Team, givingPlayerIds: Array<string>, recievingTeam: Team) {
    const that = this
    _.each(givingPlayerIds, function(playerId){
      that.sharedFunctionsService.removePlayerFromRoster(playerId, givingTeam)
      const player = that.leagueDataService.getPlayer(playerId)
      const contract = this.getCurrentContract(player)
      contract.teamId = recievingTeam._id
      player.teamId = recievingTeam._id
      player.playerType === that.staticListService.playerTypes.batter ?
      recievingTeam.roster.batterReserves.push(new RosterSpot(player._id, null, null)) :
      recievingTeam.roster.pitcherReserves.push(new RosterSpot(player._id, null, null))
      that.leagueDataService.updatePlayer(player)
    })
  }

  revoke(trade: Trade) {
    trade.state = this.staticListService.tradeStatus.revoked
    this.leagueDataService.updateTrade(trade)
  }

  getCurrentContract(player: Player) {
    if (!player) { return }
    const that = this
    return _.find(player.contracts, function(c){
      return c.firstYear + c.years - 1 >= that.leagueDataService.currentSeason.year
    })
  }

  changeTeam() {
    const that = this
    this.otherTeamPlayersArray = []
    _.each(that.leagueDataService.getPlayersByTeamId(that.otherTeamId), function(player){
      that.otherTeamPlayersArray.push({player: player, selected: false})
    })
    this.usersTeamPlayersArray = []
    _.each(that.leagueDataService.getPlayersByTeamId(this.sharedFunctionsService.getUserTeam()._id), function(player){
      that.usersTeamPlayersArray.push({player: player, selected: false})
    })
  }

}
