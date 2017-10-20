import { GameEvent, AtBat, PitcherAppearance } from '../models/game';
import * as _ from 'lodash';

export class BatterSeasonStats {
    playerId: string;
    plateAppearences: number;
    atBats: number;
    singles: number;
    doubles: number;
    triples: number;
    homeruns: number;
    hits: number;
    walks: number;
    strikeouts: number;
    walkPercentage: number;
    strikeoutPercentage: number;
    sacrificeFlies: number
    average: number;
    obp: number;
    slg: number;
    babip: number;
    woba: number;
    steals: number;

    buildSeasonStats(playerId: string, plateAppearences: number,
        singles: number, doubles: number, triples: number, homeruns: number,
        walks: number, strikeouts: number, sacrificeFlies: number) {
        this.playerId = playerId,
        this.plateAppearences = plateAppearences,
        this.singles = singles,
        this.doubles = doubles,
        this.triples = triples,
        this.homeruns = homeruns,
        this.steals = 0,
        this.walks = walks,
        this.strikeouts = strikeouts,
        this.walkPercentage = walks / plateAppearences,
        this.strikeoutPercentage = strikeouts / plateAppearences,
        this.sacrificeFlies = sacrificeFlies,
        this.atBats = plateAppearences - walks,
        this.hits = singles + doubles + triples + homeruns
        this.average = Math.round(this.hits / this.atBats * 1000) / 1000,
        this.obp = Math.round((this.hits + walks) / this.plateAppearences * 1000) / 1000,
        this.slg = Math.round((singles + doubles * 2 + triples * 3 + homeruns * 4) / this.atBats * 1000) / 1000,
        this.babip = Math.round((this.hits - homeruns) / (this.atBats - strikeouts - homeruns + sacrificeFlies) * 1000) / 1000,
        this.woba = Math.round((.7 * walks + .9 * singles + 1.25 * doubles + 1.6 * triples + 2 * homeruns) / plateAppearences * 1000) / 1000
    }

    buildSeasonStatsFromGameEvents(playerId: string, seasonEvents: Array<AtBat>) {
        this.playerId = playerId,
        this.plateAppearences = seasonEvents.length,
        this.singles = _.filter(seasonEvents, function(event){
            return event.result === 'single';
        }).length,
        this.doubles = _.filter(seasonEvents, function(event){
            return event.result === 'double';
        }).length,
        this.triples = _.filter(seasonEvents, function(event){
            return event.result === 'triple';
        }).length,
        this.homeruns =  _.filter(seasonEvents, function(event){
            return event.result === 'homerun';
        }).length,
        this.steals = 0,
        this.walks = _.filter(seasonEvents, function(event){
            return event.result === 'walk';
        }).length,
        this.strikeouts = _.filter(seasonEvents, function(event){
            return event.result === 'strikeout';
        }).length,
        this.walkPercentage = this.walks / this.plateAppearences,
        this.strikeoutPercentage = this.strikeouts / this.plateAppearences,
        this.sacrificeFlies =  _.filter(seasonEvents, function(event){
            return event.result === 'sacrifice fly';
        }).length,
        this.atBats = this.plateAppearences - this.walks,
        this.hits = this.singles + this.doubles + this.triples + this.homeruns
        this.average = Math.round(this.hits / this.atBats * 1000) / 1000,
        this.obp = Math.round((this.hits + this.walks) / this.plateAppearences * 1000) / 1000,
        this.slg = Math.round((this.singles + this.doubles * 2 + this.triples * 3 + this.homeruns * 4) / this.atBats * 1000) / 1000,
        this.babip = Math.round((this.hits - this.homeruns) / (this.atBats - this.strikeouts
          - this.homeruns + this.sacrificeFlies) * 1000) / 1000,
        this.woba = Math.round((.7 * this.walks + .9 * this.singles + 1.25 * this.doubles
          + 1.6 * this.triples + 2 * this.homeruns) / this.plateAppearences * 1000) / 1000
    }
  }

export class PitcherSeasonStats {
    playerId: string;
    appearances: number;
    starts: number;
    innings: number;
    strikeouts: number;
    walks: number;
    hits: number;
    earnedRuns: number;
    runs: number;
    wins: number;
    losses: number;
    saves: number;
    holds: number;
    qs: number;
    era: number;
    whip: number;
    babip: number;

    constructor() {
      this.playerId = ''
      this.appearances = 0
      this.starts = 0
      this.innings = 0
      this.strikeouts = 0
      this.walks = 0
      this.hits = 0;
      this.earnedRuns = 0
      this.runs = 0
      this.wins = 0
      this.losses = 0
      this.saves = 0
      this.holds = 0
      this.qs = 0
      this.era = 0
      this.whip = 0
      this.babip = 0
    }

    buildSeasonStats() {

    }

    buildSeasonStatsFromPitcherAppearances(playerId: string, pitcherAppearances: Array<PitcherAppearance>) {
      const that = this
      this.playerId = playerId
      this.appearances = pitcherAppearances.length
      _.each(pitcherAppearances, function(appearance){
        if (appearance.start) {
          that.starts++
        }
        that.innings += appearance.innings
        that.roundInnings()
        that.strikeouts += appearance.strikeouts
        that.walks += appearance.walks
        that.hits += appearance.hits
        that.earnedRuns += appearance.earnedRuns
        that.runs += appearance.runs
        if (appearance.win) {
          that.wins++
        }
        if (appearance.loss) {
          that.losses++
        }
        if (appearance.save) {
          that.saves++
        }
        if (appearance.hold) {
          that.holds++
        }
        if (appearance.earnedRuns <= 3 && appearance.innings >= 6) {
          that.qs++
        }
      })
      this.era = Math.round(9 * this.earnedRuns / this.innings * 1000) / 1000
      this.whip = Math.round((this.walks + this.hits) / this.innings * 1000) / 1000
      this.babip = 0
    }

    roundInnings() {
      if (parseFloat((this.innings % 1).toFixed(1)) === .3) {
        this.innings += .7
      }
      this.innings = parseFloat((this.innings).toFixed(1))
    }

}

