import { Injectable } from '@angular/core';
import { Season, ScheduledDay, ScheduledGame } from '../models/season';
import { SeasonService } from '../backendServices/season/season.service';
import * as _ from 'lodash';

@Injectable()
export class RealMlbScheduleGenerator {

    constructor() {

     }

    generateRealMlbSchedule(leagues) {
      let schedule = []
      schedule = schedule.concat(this.getDivisionSpecificMatchupWeeks(leagues))
      schedule = schedule.concat(this.getConfSpecificMatchupWeeks(leagues))
      schedule = this.shuffleArray(schedule)
      const fullSchedule = Array<ScheduledDay>()
      for (let x = 0; x < schedule.length; x++) {
        fullSchedule.push(this.convertToScheduledDay(schedule[x]))
        fullSchedule.push(this.convertToScheduledDay(schedule[x]))
        fullSchedule.push(this.convertToScheduledDay(schedule[x]))
      }
      return fullSchedule
    }

    convertToScheduledDay(day: Array<Array<string>>) {
      const scheduledGames = new Array<ScheduledGame>()
      _.each(day, function(game){
        scheduledGames.push(new ScheduledGame(game[0], game[1]))
      })
      return new ScheduledDay(scheduledGames)
    }

    getConfSpecificMatchupWeeks(leagues) {
      let schedule = []
      const conf1Matchups = this.getConfMatchupWeeks(leagues[0], false)
      const conf2Matchups = this.getConfMatchupWeeks(leagues[1], true)
      for (let x = 0; x < conf1Matchups.length; x++) {
        const ttIndexes = []
        const tIndexes = []
        for (let y = 0; y < conf1Matchups[x].length; y++) {
          if (conf1Matchups[x][y][0] === 'TEMP' && conf1Matchups[x][y][1] === 'TEMP') {
            ttIndexes.unshift(y)
          } else if (conf1Matchups[x][y][0] === 'TEMP' || conf1Matchups[x][y][1] === 'TEMP') {
            tIndexes.unshift(y)
          }
        }
        if (ttIndexes.length === 0) {
          for (let z = 0; z < tIndexes.length; z++) {
            if (conf2Matchups[x][tIndexes[z]][0] === 'TEMP') {
              if (conf1Matchups[x][tIndexes[(z + 1) % tIndexes.length]][0] === 'TEMP') {
                conf1Matchups[x][tIndexes[(z + 1) % tIndexes.length]][0] = conf2Matchups[x][tIndexes[z]][1]
              } else {
                conf1Matchups[x][tIndexes[(z + 1) % tIndexes.length]][1] = conf2Matchups[x][tIndexes[z]][1]
              }
              conf2Matchups[x].splice(tIndexes[z], 1)
            } else {
              if (conf1Matchups[x][tIndexes[(z + 1) % tIndexes.length]][0] === 'TEMP') {
                conf1Matchups[x][tIndexes[(z + 1) % tIndexes.length]][0] = conf2Matchups[x][tIndexes[z]][0]
              } else {
                conf1Matchups[x][tIndexes[(z + 1) % tIndexes.length]][1] = conf2Matchups[x][tIndexes[z]][0]
              }
              conf2Matchups[x].splice(tIndexes[z], 1)
            }
          }
        } else {
          if (ttIndexes[0] > tIndexes[0]) {
            conf1Matchups[x].splice(ttIndexes[0], 1)
            conf2Matchups[x].splice(ttIndexes[0], 1)
            if (conf1Matchups[x][tIndexes[0]][0] === 'TEMP') {
              conf1Matchups[x][tIndexes[0]][0] = conf2Matchups[x][tIndexes[0]][1]
              conf2Matchups[x].splice(tIndexes[0], 1)
            } else {
              conf1Matchups[x][tIndexes[0]][1] = conf2Matchups[x][tIndexes[0]][0]
              conf2Matchups[x].splice(tIndexes[0], 1)
            }
          } else {
            if (conf1Matchups[x][tIndexes[0]][0] === 'TEMP') {
              conf1Matchups[x][tIndexes[0]][0] = conf2Matchups[x][tIndexes[0]][1]
              conf2Matchups[x].splice(tIndexes[0], 1)
            } else {
              conf1Matchups[x][tIndexes[0]][1] = conf2Matchups[x][tIndexes[0]][0]
              conf2Matchups[x].splice(tIndexes[0], 1)
            }
            conf1Matchups[x].splice(ttIndexes[0], 1)
            conf2Matchups[x].splice(ttIndexes[0], 1)
          }
        }
        schedule.push(conf1Matchups[x].concat(conf2Matchups[x]))
      }
      schedule = schedule.concat(this.reverseMatchups(schedule))
      return schedule
    }

    getConfMatchupWeeks(conf, rotate) {
      const confGroups = []
      for (let x = 0; x < conf.length; x++) {
        if (rotate) {
          confGroups.push(conf[x].slice(1, 4))
          confGroups.push([conf[x][4], conf[x][0], 'TEMP'])
        } else {
          confGroups.push(conf[x].slice(0, 3))
          confGroups.push(conf[x].slice(3).concat('TEMP'))
        }

      }
      return this.groupsPlay(confGroups)
    }

    groupsPlay(groups) {
      let schedule = []
      schedule = schedule.concat(this.concatGroupMatchups(groups[0], groups[2], groups[1], groups[5], groups[3], groups[4]))
      schedule = schedule.concat(this.concatGroupMatchups(groups[0], groups[3], groups[1], groups[4], groups[2], groups[5]))
      schedule = schedule.concat(this.concatGroupMatchups(groups[0], groups[4], groups[1], groups[2], groups[3], groups[5]))
      schedule = schedule.concat(this.concatGroupMatchups(groups[0], groups[5], groups[1], groups[3], groups[2], groups[4]))
      return schedule
    }

    concatGroupMatchups(a, b, c, d, e, f) {
      const ab = this.playAllTeamsFromOtherGroup(a, b)
      const cd = this.playAllTeamsFromOtherGroup(c, d)
      const ef = this.playAllTeamsFromOtherGroup(e, f)
      return [ab[0].concat(cd[0]).concat(ef[0]), ab[1].concat(cd[1]).concat(ef[1]), ab[2].concat(cd[2]).concat(ef[2])]
    }

    playAllTeamsFromOtherGroup(groupA, groupB) {
      const weeks = []
      for (let x = 0; x < groupA.length; x++) {
        const weekMatchups = []
        for (let y = 0; y < groupB.length; y++) {
          weekMatchups.push([groupA[(y + x) % groupA.length], groupB[y]])
        }
        weeks.push(weekMatchups)
      }
      return weeks
    }

    getDivisionSpecificMatchupWeeks(leagues) {
      const matchups = []
      for (let x = 0; x < 3; x++) {
        const divisionalMatchups = []
        for (let y = 0; y < 3; y++) {
          const weeks = []
          weeks.push([
                [leagues[0][x][0], leagues[0][x][1]],
                [leagues[0][x][2], leagues[0][x][3]],
                [leagues[0][x][4], leagues[1][y][4]],
                [leagues[1][y][0], leagues[1][y][1]],
                [leagues[1][y][2], leagues[1][y][3]]
          ])
          weeks.push([
                [leagues[0][x][0], leagues[0][x][2]],
                [leagues[0][x][1], leagues[0][x][4]],
                [leagues[0][x][3], leagues[1][y][3]],
                [leagues[1][y][0], leagues[1][y][2]],
                [leagues[1][y][1], leagues[1][y][4]]
          ])
          weeks.push([
                [leagues[0][x][0], leagues[0][x][3]],
                [leagues[0][x][2], leagues[0][x][4]],
                [leagues[0][x][1], leagues[1][y][1]],
                [leagues[1][y][0], leagues[1][y][3]],
                [leagues[1][y][2], leagues[1][y][4]]
          ])
          weeks.push([
                [leagues[0][x][0], leagues[0][x][4]],
                [leagues[0][x][1], leagues[0][x][3]],
                [leagues[0][x][2], leagues[1][y][2]],
                [leagues[1][y][0], leagues[1][y][4]],
                [leagues[1][y][1], leagues[1][y][3]],

          ])
          weeks.push([
                [leagues[0][x][1], leagues[0][x][2]],
                [leagues[0][x][3], leagues[0][x][4]],
                [leagues[0][x][0], leagues[1][y][0]],
                [leagues[1][y][1], leagues[1][y][2]],
                [leagues[1][y][3], leagues[1][y][4]],
          ])
            divisionalMatchups.push(weeks);
            divisionalMatchups.push(this.reverseMatchups(weeks))
          }
          matchups.push(divisionalMatchups)
      }
      matchups[1].push(matchups[1].shift())
      matchups[1].push(matchups[1].shift())
      matchups[2].push(matchups[2].shift())
      matchups[2].push(matchups[2].shift())
      matchups[2].push(matchups[2].shift())
      matchups[2].push(matchups[2].shift())

      const schedule = []
      for (let a = 0; a < 30; a++) {
         schedule.push([])
      }
      for (let m = 0; m < matchups.length; m++) {
       for (let d = 0; d < matchups[m].length; d++) {
         for (let w = 0; w < matchups[m][d].length; w++) {
           const index = d * 5 + w;
           schedule[index] = schedule[index].concat(matchups[m][d][w]);
         }
       };
      }
      return schedule
    }

    reverseMatchups(weeks) {
      const reverseWeeks = []
      for (let x = 0; x < weeks.length; x++) {
        const reverseWeek = []
        for (let y = 0; y < weeks[x].length; y++) {
          reverseWeek.push([weeks[x][y][1], weeks[x][y][0]])
        }
        reverseWeeks.push(reverseWeek)
      }
      return reverseWeeks
    }

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
    }
}
