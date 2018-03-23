import { Injectable } from '@angular/core';
import { Season, PlayoffMatchup } from '../models/season';
import { RealMlbScheduleGenerator } from '../services/real-mlb-schedule.generator';
import { LeagueDataService } from './league-data.service';
import { SharedFunctionsService } from './shared-functions.service';
import * as _ from 'lodash';

@Injectable()
export class PlayoffScheduleGenerator {

  constructor(private leagueDataService: LeagueDataService, private sharedFunctionsService: SharedFunctionsService) {}

  async generatePlayoffSchedule() {
    this.leagueDataService.league.simming = true
    this.leagueDataService.updateLeague()
    const teams = []
    _.each(this.sharedFunctionsService.getRecordOrderedTeams().splice(0, this.leagueDataService.teams.length >= 16 ? 8 : 4), function(team){
      teams.push(team._id)
    })


    const schedule = []
    const seeds = this.generateScheduleForTeamSeeds(teams.length)
    const round1 = new Array<PlayoffMatchup>()
    for (let x = 0; x < teams.length; x = x + 2) {
      round1.push(new PlayoffMatchup(teams[seeds[x] - 1], teams[seeds[x + 1] - 1], 7))
    }
    schedule.push(round1)
    this.leagueDataService.currentSeason.playoffSchedule = schedule
    this.leagueDataService.updateSeason(this.leagueDataService.currentSeason)
    this.leagueDataService.league.simming = false
    this.leagueDataService.updateLeague()
  }

  async generateNextRound(playoffSchedule) {
    this.leagueDataService.league.simming = true
    this.leagueDataService.updateLeague()
    const currentRound = playoffSchedule[playoffSchedule.length - 1]
    const nextRound = []
    for (let x = 0; x < currentRound.length; x = x + 2) {
      nextRound.push(
        new PlayoffMatchup(
          this.getPlayoffMatchupWinner(currentRound[x]),
          this.getPlayoffMatchupWinner(currentRound[x + 1]), 7))
    }
    playoffSchedule.push(nextRound)
    this.leagueDataService.currentSeason.playoffSchedule = playoffSchedule
    this.leagueDataService.updateSeason(this.leagueDataService.currentSeason)
    this.leagueDataService.league.simming = true
    this.leagueDataService.updateLeague()
  }

  getPlayoffMatchupWinner(matchup: PlayoffMatchup) {
    if (matchup.higherSeedWins > matchup.bestOf / 2) {
      return matchup.higherSeedTeamId
    } else if (matchup.lowerSeedWins > matchup.bestOf / 2) {
      return matchup.lowerSeedTeamId
    } else {
      return null
    }
  }

  isCurrentRoundDone() {
    const that = this
    let roundDone = true
    _.each(that.leagueDataService.currentSeason.playoffSchedule[that.leagueDataService.currentSeason.playoffSchedule.length - 1],
      function(matchup) {
        if (!that.getPlayoffMatchupWinner(matchup)) {
          roundDone = false
        }
      }
    )
    return roundDone
  }

  generateScheduleForTeamSeeds(totalTeams) {
    const seeds = new Array();
    for (let i = 0; i < totalTeams; i++) {
      seeds[i] = i + 1;
    }

    const num_rounds = Math.log(seeds.length) / Math.log(2);
    const seed_rounds = [];

    for (let i = 0; i < num_rounds; i++) {
      seed_rounds[i] = []
    }
    seed_rounds[num_rounds] = [1, 2];

    for (let r = num_rounds; r > 0; r--) {
      const round = seed_rounds[r];
      const feed_round = seed_rounds[r - 1];

      for (let m = 0; m < round.length; m++) {

        const num_teams_in_round = round.length * 2;
        feed_round[m * 2] = round[m];

        feed_round[(m * 2) + 1] = num_teams_in_round + 1 - round[m];
      }
    }
    return seed_rounds[1]
  }
}

