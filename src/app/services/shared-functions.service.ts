import { Injectable } from '@angular/core';
import { Player, PitchingSkillset, BatterSeasonStats, PitcherSeasonStats, FieldingSeasonStats } from '../models/player';
import { Team } from '../models/team';
import { LeagueDataService } from './league-data.service'
import { StaticListsService } from './static-lists.service'
import * as _ from 'lodash';

@Injectable()
export class SharedFunctionsService {
  progressBarValue = 0
  loadingText = ''
  constructor(private leagueDataService: LeagueDataService, private staticListsService: StaticListsService) {}

  setLoading(percent: number, text: string) {
    this.progressBarValue = percent
    this.loadingText = text
  }

  era(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 : Math.round(9 * pss.earnedRuns / pss.innings * 1000) / 1000 }
  whip(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 : Math.round((pss.walks + pss.hits) / pss.innings * 1000) / 1000 }
  pitchbabip(pss: PitcherSeasonStats) { return !pss ? 0 : 0 }
  walksPerNine(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 : 9 * pss.walks / pss.innings }
  strikeoutsPerNine(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 : 9 * pss.strikeouts / pss.innings }
  fip(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 :
    Math.round(((13 * pss.homeruns + 3 * pss.walks - 2 * (pss.strikeouts + pss.iffb)) / pss.innings * 3.1) * 100) / 100 }
  pitcherSpecificRunsPerWin(pss: PitcherSeasonStats) {
    return !pss || !pss.innings ? 0 :
    (((((18 - pss.innings / pss.appearances) * this.getGamesPlayed(pss.year) / 162)
      + pss.innings / pss.appearances * this.fip(pss)) / 18) + 2) * 1.5
  }
  pitcherReplacementLevel(pss: PitcherSeasonStats) {
    return !pss || !pss.innings ? 0 : (0.03 * (1 - pss.starts / pss.appearances) + 0.12 * pss.starts / pss.appearances)
  }
  pitWar(pss: PitcherSeasonStats) { return !pss || !pss.innings ? 0 :
    Math.round(((4.2 * this.getGamesPlayed(pss.year) / 162 - this.fip(pss)) / this.pitcherSpecificRunsPerWin(pss) +
     this.pitcherReplacementLevel(pss) * pss.innings / 9
    + pss.innings * -.001) * 100) / 100}

  walkPercentage(bss: BatterSeasonStats) { return !bss  || bss.plateAppearences === 0 ? 0 : bss.walks / bss.plateAppearences }
  strikeoutPercentage(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0 ? 0 : bss.strikeouts / bss.plateAppearences }
  atBats(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0 ? 0  : bss.plateAppearences - bss.walks }
  hits(bss: BatterSeasonStats) { return !bss ? 0 : bss.singles + bss.doubles + bss.triples + bss.homeruns }
  average(bss: BatterSeasonStats) { return !bss || this.atBats(bss) === 0 ? 0 :
          Math.round( this.hits(bss) / this.atBats(bss) * 1000) / 1000 }
  obp(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0 ? 0
       : Math.round((this.hits(bss) + bss.walks) / bss.plateAppearences * 1000) / 1000 }
  slg(bss: BatterSeasonStats) { return !bss || this.atBats(bss) === 0  ? 0 :
    Math.round((bss.singles + bss.doubles * 2 + bss.triples * 3 + bss.homeruns * 4) / this.atBats(bss) * 1000) / 1000 }
  batbabip(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0  ? 0 :
    Math.round((this.hits(bss) - bss.homeruns) / (this.atBats(bss) - bss.strikeouts - bss.homeruns + bss.sacrificeFlies) * 1000) / 1000 }
  woba(bss: BatterSeasonStats) { return !bss || bss.plateAppearences === 0 ? 0 :
    Math.round((.7 * bss.walks + .9 * bss.singles + 1.25 * bss.doubles + 1.6 * bss.triples + 2 * bss.homeruns)
     / (bss.plateAppearences + bss.sacrificeFlies) * 1000) / 1000 }
  raa(bss: BatterSeasonStats) { return bss && bss.plateAppearences ? (this.woba(bss) - .320) / 1.25
     * (bss.plateAppearences + bss.sacrificeFlies) : 0 }
  batWar(bss: BatterSeasonStats, fss: FieldingSeasonStats) { return fss && bss ? Math.round(((this.raa(bss) + 0
    + this.positionWar(fss) + 20 / 600 * bss.plateAppearences) / 10) * 100) / 100 : 0 }
  positionWar(fss: FieldingSeasonStats) {
    let result = 0
    result += fss.appearances[this.staticListsService.positions.catcher] / 162 * 12.5
    result += fss.appearances[this.staticListsService.positions.firstBase] / 162 * -12.5
    result += fss.appearances[this.staticListsService.positions.secondBase] / 162 * 2.5
    result += fss.appearances[this.staticListsService.positions.shortStop] / 162 * 7.5
    result += fss.appearances[this.staticListsService.positions.thirdBase] / 162 * 2.5
    result += fss.appearances[this.staticListsService.positions.leftField] / 162 * -7.5
    result += fss.appearances[this.staticListsService.positions.centerField] / 162 * 2.5
    result += fss.appearances[this.staticListsService.positions.rightField] / 162 * -7.5
    result += fss.appearances[this.staticListsService.positions.catcher] / 162 * -17.5
    return result
  }

  getWins(teamId) {
  let wins = 0;
    if (!this.leagueDataService.currentSeason) {
      return wins
    }
    _.each(this.leagueDataService.currentSeason.schedule, function(scheduledDay){
      const game = _.find(scheduledDay.scheduledGames, function(g){
        return g.homeTeamId === teamId || g.awayTeamId === teamId;
      });
      if ((game && game.homeTeamId === teamId && game.homeTeamScore > game.awayTeamScore)
          || (game.awayTeamId === teamId && game.awayTeamScore > game.homeTeamScore) ) {
        wins++;
      }
    })
    return wins;
  }

  getLosses(teamId) {
    let losses = 0;
    if (!this.leagueDataService.currentSeason) {
      return losses
    }
    _.each(this.leagueDataService.currentSeason.schedule, function(scheduledDay){
      const game = _.find(scheduledDay.scheduledGames, function(g){
        return g.homeTeamId === teamId || g.awayTeamId === teamId;
      });
      if ((game.homeTeamId === teamId && game.homeTeamScore < game.awayTeamScore)
          || (game.awayTeamId === teamId && game.awayTeamScore < game.homeTeamScore) ) {
        losses++;
      }
    })
    return losses;
  }

  getGamesPlayed(year: number) {
    const season = _.find(this.leagueDataService.seasons, {year: year})
    return _.filter(season.schedule, function(scheduledDay){
        return scheduledDay.complete
      }).length;
  }


  getRecordOrderedTeams() {
    const that = this
    return _.orderBy(this.leagueDataService.teams, function(team){
      return that.getWins(team._id)
    }, 'desc')
  }

  getRecordOrderedTeamsById(teamIds: Array<string>) {
    const that = this
    const resultArray = []
    const orderedTeamId = _.orderBy(teamIds, function(teamId){
      return that.getWins(teamId)
    }, 'desc')
    _.each(orderedTeamId, function(id){
      resultArray.push(that.leagueDataService.getTeamById(id))
    })
    return resultArray
  }

  overallHitting(hittingSkillset) {
    if (!hittingSkillset) {
      return null
    }
    return Math.round((hittingSkillset.contact + hittingSkillset.power
      + hittingSkillset.patience + hittingSkillset.speed + hittingSkillset.fielding) * .2);
  }

  overallHittingOutOfPosition(player, actualPosition) {
    if (!player || !player.hittingAbility) {
      return null
    }
    return Math.round((player.hittingAbility.contact + player.hittingAbility.power
      + player.hittingAbility.patience + player.hittingAbility.speed
      + (actualPosition === this.staticListsService.positions.designatedHitter ? 50
        : this.getBestFieldingAtPostion(player, actualPosition)) * 4) / 8);
  }

  overallHittingFieldingIndependent(hittingSkillset) {
    if (!hittingSkillset) {
      return null
    }
    return Math.round((hittingSkillset.contact + hittingSkillset.power
      + hittingSkillset.patience + hittingSkillset.speed) * .25);
  }

  overallPitching(skillset) {
    if (!skillset) {
      return null
    }
    return Math.round((skillset.velocity + skillset.control
       + skillset.movement) / 3);
  }

  autoSetLineup(team: Team) {
    const players = this.leagueDataService.getPlayersByTeamId(team._id)
    this.autoSetPitchers(team, players)
    this.autoSetHitters(team, players)
    this.leagueDataService.updateTeam(team)
  }

  autoSetPitchers(team: Team, players: Array<Player>) {
    const that = this
    const orderedPitchers = _.orderBy(team.roster.pitchers, function(pitcher) {
      return that.overallPitching(_.find(players, {_id: pitcher.playerId}).pitchingAbility)
    }, 'desc')
    _.each(this.staticListsService.pitcherRoles, function(role){
      if (!_.find(team.roster.pitchers, {startingPosition: role})) {
        _.find(orderedPitchers, function(op){
          return !op.startingPosition
        }).startingPosition = role
      }
    })
    team.roster.pitchers = orderedPitchers
  }

  autoSetHitters(team: Team, players: Array<Player>) {
    const that = this
    const orderedBatters = _.orderBy(team.roster.batters, function(batter) {
      return that.overallHitting(_.find(players, {_id: batter.playerId}).hittingAbility)
    }, 'desc')

    // Fill best players at positions they play
    _.each(that.staticListsService.fieldingPositions, function(position){
      if (!_.find(team.roster.batters, {startingPosition: position})) {
        let overall = 0
        let rosterPlayer = null
        _.each(team.roster.batters, function(rosterBatter) {
          const player = _.find(players, {_id: rosterBatter.playerId})
          if (!rosterBatter.startingPosition && _.indexOf(player.primaryPositions, position) > -1) {
            if (overall < that.overallHitting(player.hittingAbility)) {
              rosterPlayer = rosterBatter
              overall = that.overallHitting(player.hittingAbility)
            }
          }
        })
        if (rosterPlayer) {
          rosterPlayer.startingPosition = position
        }
      }
    })

    // Fill best players out of position
    _.each(that.staticListsService.fieldingPositionsWithDHFieldingSpectrumOrder, function(position){
      if (!_.find(team.roster.batters, {startingPosition: position})) {
        let overall = 0
        let rosterPlayer = null
        _.each(team.roster.batters, function(rosterBatter) {
          const player = _.find(players, {_id: rosterBatter.playerId})
          if (!rosterBatter.startingPosition) {
            if (overall < that.overallHittingOutOfPosition(player, position)) {
              rosterPlayer = rosterBatter
              overall = that.overallHittingOutOfPosition(player, position)
            }
          }
        })
        rosterPlayer.startingPosition = position
      }
    })

    // remove order number from batters without a starting position
    _.each(team.roster.batters, function(rosterBatter){
      if (rosterBatter.orderNumber && !rosterBatter.startingPosition) {
        rosterBatter.orderNumber = null
      }
    })

    // set batting order
    _.each(that.staticListsService.battingOrderNumbers, function(orderNumber){
      if (!_.find(team.roster.batters, {orderNumber: orderNumber})) {
        let overall = 0
        let rosterPlayer = null
        _.each(team.roster.batters, function(rosterBatter) {
          const player = _.find(players, {_id: rosterBatter.playerId})
          if (rosterBatter.startingPosition && !rosterBatter.orderNumber) {
            if (overall < that.overallHittingFieldingIndependent(player.hittingAbility)) {
              rosterPlayer = rosterBatter
              overall = that.overallHittingFieldingIndependent(player.hittingAbility)
            }
          }
        })
        rosterPlayer.orderNumber = orderNumber
      }
    })
  }

  getBestFieldingAtPostion(player: Player, actualPosition: string) {
    const that = this
    let bestFielding = 0
    _.each(player.primaryPositions, function(position){
      const fielding = that.getFieldingForPosition(position, actualPosition, player.hittingAbility.fielding)
      if (fielding > bestFielding) {
        bestFielding = fielding
      }
    })
    return bestFielding
  }

  getFieldingForPosition(primaryPosition: string, actualPosition: string, fielding: number) {
    if (primaryPosition === actualPosition) {
      return fielding
    } else if (actualPosition === this.staticListsService.positions.catcher) {
      return fielding * .1
    } else if (primaryPosition === this.staticListsService.positions.catcher) {
      if (actualPosition === this.staticListsService.positions.firstBase) {
        return fielding * .95
      } else if (actualPosition === this.staticListsService.positions.thirdBase) {
        return fielding * .8
      } else {
        return fielding * .5
      }
    } else if (primaryPosition === this.staticListsService.positions.firstBase) {
      if (actualPosition === this.staticListsService.positions.thirdBase) {
        return fielding * .75
      } else {
        return fielding * .4
      }
    } else if (primaryPosition === this.staticListsService.positions.secondBase) {
      if (actualPosition === this.staticListsService.positions.shortStop) {
        return fielding * .8
      } else if (actualPosition === this.staticListsService.positions.centerField) {
        return fielding * .85
      } else if (actualPosition === this.staticListsService.positions.thirdBase) {
        return fielding * .9
      } else if (actualPosition === this.staticListsService.positions.leftField
                || actualPosition === this.staticListsService.positions.rightField) {
        return fielding * .9
      } else {
        return fielding * .95
      }
    } else if (primaryPosition === this.staticListsService.positions.thirdBase) {
      if (actualPosition === this.staticListsService.positions.shortStop) {
        return fielding * .6
      } else if (actualPosition === this.staticListsService.positions.secondBase) {
        return fielding * .7
      } else if (actualPosition === this.staticListsService.positions.centerField) {
        return fielding * .8
      } else if (actualPosition === this.staticListsService.positions.leftField
                || actualPosition === this.staticListsService.positions.rightField) {
        return fielding * .9
      } else {
        return fielding * .95
      }
    } else if (primaryPosition === this.staticListsService.positions.shortStop) {
      if (actualPosition === this.staticListsService.positions.secondBase) {
        return fielding
      } else if (actualPosition === this.staticListsService.positions.centerField) {
        return fielding * .95
      } else if (actualPosition === this.staticListsService.positions.thirdBase) {
        return fielding
      } else if (actualPosition === this.staticListsService.positions.leftField
                || actualPosition === this.staticListsService.positions.rightField) {
        return fielding * .95
      } else {
        return fielding * .95
      }
    } else if (primaryPosition === this.staticListsService.positions.centerField) {
      if (actualPosition === this.staticListsService.positions.shortStop) {
        return fielding * .6
      } else if (actualPosition === this.staticListsService.positions.secondBase) {
        return fielding * .7
      } else if (actualPosition === this.staticListsService.positions.thirdBase) {
        return fielding * .8
      } else if (actualPosition === this.staticListsService.positions.leftField
                || actualPosition === this.staticListsService.positions.rightField) {
        return fielding * .95
      } else {
        return fielding * .95
      }
    } else if (primaryPosition === this.staticListsService.positions.leftField
            || primaryPosition === this.staticListsService.positions.leftField) {
      if (actualPosition === this.staticListsService.positions.shortStop) {
        return fielding * .5
      } else if (actualPosition === this.staticListsService.positions.secondBase) {
        return fielding * .55
      } else if (actualPosition === this.staticListsService.positions.centerField) {
        return fielding * .75
      } else if (actualPosition === this.staticListsService.positions.thirdBase) {
        return fielding * .65
      } else {
        return fielding * .95
      }
    }
  }
}
