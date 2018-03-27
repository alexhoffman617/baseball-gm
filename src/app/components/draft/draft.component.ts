import { Component, OnChanges } from '@angular/core';
import { Player } from 'app/models/player';
import { LeagueDataService } from 'app/services/league-data.service';
import * as _ from 'lodash';
import { StaticListsService } from 'app/services/static-lists.service';
import { SharedFunctionsService } from 'app/services/shared-functions.service';
import { Contract } from '../../models/contract';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent {
  passString = 'Pass'
  sort = {
    sortType: 'ovr',
    sortDirection: 'desc',
    positionFilter: ''
  }
  displayType = 'std'
  constructor(public leagueDataService: LeagueDataService,
      public sharedFunctionsService: SharedFunctionsService,
      public snackBar: MatSnackBar,
     public staticListsService: StaticListsService) { }

  getPlayers() {
    const that = this
    const players = new Array<Player>()
    if (!that.leagueDataService.currentSeason) { return players }
    if (that.leagueDataService.currentSeason.phase === that.staticListsService.leaguePhases.draft.name) {
      _.each(that.leagueDataService.getSeasonByYear(that.leagueDataService.currentSeason.year - 1).draft.draftPlayerIds, function(dpi){
        const player = that.leagueDataService.getPlayer(dpi)
        if (player) { players.push(player )}
      })
    } else {
      _.each(that.leagueDataService.currentSeason.draft.draftPlayerIds, function(dpi){
        const player = that.leagueDataService.getPlayer(dpi)
        if (player) { players.push(player )}
      })
    }
    return _.orderBy(players, function(player){
      return that.sharedFunctionsService.overallPotential(player)
    }, 'desc')
  }

  getSortedPlayers() {
    return this.sharedFunctionsService.getSortedPlayers(this.getPlayers(), this.sort.sortType,
    this.sort.sortDirection, this.sort.positionFilter)
  }

  currentDraft() {
    if (!this.leagueDataService.currentSeason) { return null }
    if (this.isDraftPhase()) {
      return this.leagueDataService.getSeasonByYear(this.leagueDataService.currentSeason.year - 1).draft
    } else {
      return this.leagueDataService.currentSeason.draft
    }
  }

  getCurrentPick() {
    return _.find(this.currentDraft().draftPicks, function(pick){ return !pick.playerId })
  }

  isUsersPick() {
    return this.currentDraft() && this.getCurrentPick() && this.currentDraft().status === this.staticListsService.draftStates.inProgress
          && this.leagueDataService.getTeamById(this.getCurrentPick().teamId).ownerAccountId === localStorage.getItem('baseballgm-id')
  }

  isDraftPhase() {
    return this.leagueDataService.currentSeason ?
    this.leagueDataService.currentSeason.phase === this.staticListsService.leaguePhases.draft.name : false
  }

  canStartDraft() {
    return this.isDraftPhase() && this.currentDraft().status === this.staticListsService.draftStates.preDraft
  }

  async draft(player: Player) {
    const team = this.leagueDataService.getTeamById(this.getCurrentPick().teamId)
    const salary = this.getCurrentPick().pickNumber <= this.leagueDataService.teams.length ? 2000000 :
    this.getCurrentPick().pickNumber <= this.leagueDataService.teams.length * 2 ? 1000000 : 500000
    if (!this.sharedFunctionsService.canOfferContract(team, salary).canOffer) {
      this.snackBar.open(this.sharedFunctionsService.canOfferContract(team, salary).reason, 'Ok', {duration: 2000})
    } else {
      this.sharedFunctionsService.acceptDraftContract(player, new Contract(player._id, team._id,
        salary, this.leagueDataService.currentSeason.year, 5, null, 0))
      this.getCurrentPick().playerId = player._id
      _.remove(this.currentDraft().draftPlayerIds, function(dpi) {
        return dpi === player._id
      })
      await this.leagueDataService.updateSeason(this.leagueDataService.getSeasonByYear(this.leagueDataService.currentSeason.year - 1))
      if (!this.getCurrentPick()) {
        this.endDraft()
      } else {
        this.simToNextUserPick()
      }
    }
  }

  async pass() {
    this.getCurrentPick().playerId = this.passString
    await this.leagueDataService.updateSeason(this.leagueDataService.getSeasonByYear(this.leagueDataService.currentSeason.year - 1))
    if (!this.getCurrentPick()) {
      this.endDraft()
    } else {
      this.simToNextUserPick()
    }
  }

  async simToNextUserPick() {
    if (!this.leagueDataService.getTeamById(this.getCurrentPick().teamId).ownerAccountId) {
      await this.autoDraftBestAvailable()
    }
  }

  async autoDraftBestAvailable() {
    const team = this.leagueDataService.getTeamById(this.getCurrentPick().teamId)
    const salary = this.getCurrentPick().pickNumber <= this.leagueDataService.teams.length ? 2000000 :
    this.getCurrentPick().pickNumber <= this.leagueDataService.teams.length * 2 ? 1000000 : 500000
    if (!this.sharedFunctionsService.canOfferContract(team, salary).canOffer) {
      this.pass()
    } else {
      this.draft(this.getPlayers()[0])
    }
  }

  async startDraft() {
    this.currentDraft().status = this.staticListsService.draftStates.inProgress
    await this.leagueDataService.updateSeason(this.leagueDataService.getSeasonByYear(this.leagueDataService.currentSeason.year - 1))
    this.simToNextUserPick()
  }

  endDraft() {
    this.currentDraft().status = this.staticListsService.draftStates.completed
    this.sharedFunctionsService.updateSeasonToNextPhase()
    this.leagueDataService.updateSeason(this.leagueDataService.currentSeason)
  }
}
