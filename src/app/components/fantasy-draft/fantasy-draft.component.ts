import { Component, OnChanges } from '@angular/core';
import { Player } from 'app/models/player';
import { LeagueDataService } from 'app/services/league-data.service';
import * as _ from 'lodash';
import { StaticListsService } from 'app/services/static-lists.service';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import { Contract } from '../../models/contract';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-fantasy-draft',
  templateUrl: './fantasy-draft.component.html',
  styleUrls: ['./fantasy-draft.component.scss']
})
export class FantasyDraftComponent {
  accountId
  sort = {
    sortType: 'ovr',
    sortDirection: 'desc',
    positionFilter: ''
  }
  simming = false
  displayType = 'std'
  constructor(public leagueDataService: LeagueDataService,
      public sharedFunctionsService: SharedFunctionsService,
      public snackBar: MatSnackBar,
     public staticListsService: StaticListsService) {
      this.accountId = localStorage.getItem('baseballgm-id')
      }

  getPlayers() {
    const that = this
    const players = _.filter(that.leagueDataService.players, function(player){
      return !player.teamId
      && !_.find(that.leagueDataService.currentSeason.draft.draftPlayerIds, function(dpi){
        return dpi === player._id
      })
    })
    return _.orderBy(players, function(player){
      return that.sharedFunctionsService.overallAbility(player)
    }, 'desc')
  }

  getCurrentPick() {
    return _.find(this.leagueDataService.league.fantasyDraft.draftPicks, function(pick){ return !pick.playerId })
  }

  getCurrentRound() {
    return Math.floor((this.getCurrentPick().pickNumber - 1) / this.leagueDataService.teams.length) + 1
  }

  getCurrentSalary() {
    const currentRound = this.getCurrentRound()
    if (currentRound <= 10) {
      return (24 - currentRound * 2) * 1000000
    } else if (currentRound <= 16) {
      return 2000000
    } else if (currentRound <= 26) {
      return 1000000
    } else {
      return 500000
    }
  }

  getRandomYears() {
    return Math.round(Math.random() * 4) + 1
  }

  isUsersPick() {
    return this.leagueDataService.league.fantasyDraft && this.getCurrentPick()
          && this.leagueDataService.getTeamById(this.getCurrentPick().teamId).ownerAccountId === localStorage.getItem('baseballgm-id')
  }

  async draft(player: Player) {
    const team = this.leagueDataService.getTeamById(this.getCurrentPick().teamId)
    const salary = this.getCurrentSalary()
    this.sharedFunctionsService.acceptDraftContract(player, new Contract(player._id, team._id,
      salary, this.leagueDataService.currentSeason.year, this.getRandomYears(), null, 0))
    this.getCurrentPick().playerId = player._id
    await this.leagueDataService.updateLeague()
    if (!this.getCurrentPick()) {
      this.endDraft()
    } else {
      if (this.simming) {
        this.autoDraftBestAvailable()
      } else {
        this.simToNextUserPick()
      }
    }
  }

  canStartDraft() {
    return this.leagueDataService.league &&
      this.leagueDataService.league.fantasyDraft.status === this.staticListsService.draftStates.preDraft
  }

  async simToNextUserPick() {
    if (!this.leagueDataService.getTeamById(this.getCurrentPick().teamId).ownerAccountId) {
      await this.autoDraftBestAvailable()
    }
  }

  async startSimming() {
    this.simming = true
    await this.autoDraftBestAvailable()
  }

  async stopSimming() {
    this.simming = false
  }

  async autoDraftBestAvailable() {
    if (this.leagueDataService.seasons
      && this.leagueDataService.currentSeason.phase === this.staticListsService.leaguePhases.fantasyDraft.name
      && !this.getCurrentPick()) {
        this.endDraft()
    } else {
      const team = this.leagueDataService.getTeamById(this.getCurrentPick().teamId)
      const salary = this.getCurrentPick().pickNumber <= this.leagueDataService.teams.length ? 2000000 :
      this.getCurrentPick().pickNumber <= this.leagueDataService.teams.length * 2 ? 1000000 : 500000
      await this.draft(this.getPlayers()[0])
    }
  }

  async startDraft() {
    this.leagueDataService.league.fantasyDraft.status = this.staticListsService.draftStates.inProgress
    await this.leagueDataService.updateLeague()
    this.simToNextUserPick()
  }

  endDraft() {
    this.leagueDataService.league.fantasyDraft.status = this.staticListsService.draftStates.completed
    this.sharedFunctionsService.updateSeasonToNextPhase()
    this.leagueDataService.updateSeason(this.leagueDataService.currentSeason)
  }

  getClosePicks() {
    if (!this.leagueDataService.league || !this.getCurrentPick()) { return [] }
    if (this.getCurrentPick().pickNumber < 4) {
      return this.leagueDataService.league.fantasyDraft.draftPicks.slice(0, 5)
    } else {
      return this.leagueDataService.league.fantasyDraft.draftPicks.slice(this.getCurrentPick().pickNumber - 4,
      this.getCurrentPick().pickNumber + 2)
    }
  }

  getSortedPlayers() {
    return this.sharedFunctionsService.getSortedPlayers(this.getPlayers(), this.sort.sortType,
    this.sort.sortDirection, this.sort.positionFilter)
  }

  getRosterCount(position) {
    const that = this;
    if (!this.sharedFunctionsService.getUsersTeam()) { return 0 }
    const batterReservesCount = _.filter(this.sharedFunctionsService.getUsersTeam().roster.batterReserves, function(batter) {
      if (!that.leagueDataService.getPlayer(batter.playerId)) { return false }
      return _.indexOf(that.leagueDataService.getPlayer(batter.playerId).primaryPositions, position) > -1
    }).length
    const batterCount = _.filter(this.sharedFunctionsService.getUsersTeam().roster.batters, function(batter) {
      if (!that.leagueDataService.getPlayer(batter.playerId)) { return false }
      return _.indexOf(that.leagueDataService.getPlayer(batter.playerId).primaryPositions, position) > -1
    }).length
    const pitcherReservesCount = _.filter(this.sharedFunctionsService.getUsersTeam().roster.pitcherReserves, function(batter) {
      if (!that.leagueDataService.getPlayer(batter.playerId)) { return false }
      return _.indexOf(that.leagueDataService.getPlayer(batter.playerId).primaryPositions, position) > -1
    }).length
    const pitcherCount = _.filter(this.sharedFunctionsService.getUsersTeam().roster.pitchers, function(batter) {
      if (!that.leagueDataService.getPlayer(batter.playerId)) { return false }
      return _.indexOf(that.leagueDataService.getPlayer(batter.playerId).primaryPositions, position) > -1
    }).length
    return batterReservesCount + batterCount + pitcherCount + pitcherReservesCount
  }
}
