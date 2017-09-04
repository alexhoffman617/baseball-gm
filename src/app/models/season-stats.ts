import { GameEvent, AtBat } from '../models/game';
import * as _ from "lodash";

export class SeasonStats {
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
        this.obp = Math.round((this.hits + walks) / this.atBats * 1000) / 1000,
        this.slg = Math.round((singles + doubles * 2 + triples * 3 + homeruns * 4) / this.atBats * 1000) / 1000,
        this.babip = Math.round((this.hits - homeruns) / (this.atBats - strikeouts - homeruns + sacrificeFlies) * 1000) / 1000,
        this.woba = Math.round((.7 * walks + .9 * singles + 1.25 * doubles + 1.6 * triples + 2 * homeruns) / plateAppearences * 1000) / 1000 
    }

    buildSeasonStatsFromGameEvents(playerId: string, seasonEvents: Array<AtBat>) {
        this.playerId = playerId,
        this.plateAppearences = seasonEvents.length,
        this.singles = _.filter(seasonEvents, function(event){
            return event.result == "single";
        }).length,
        this.doubles = _.filter(seasonEvents, function(event){
            return event.result == "double";
        }).length,
        this.triples = _.filter(seasonEvents, function(event){
            return event.result == "triple";
        }).length,
        this.homeruns =  _.filter(seasonEvents, function(event){
            return event.result == "homerun";
        }).length,
        this.steals = 0,
        this.walks = _.filter(seasonEvents, function(event){
            return event.result == "walk";
        }).length,
        this.strikeouts = _.filter(seasonEvents, function(event){
            return event.result == "strikeout";
        }).length,
        this.walkPercentage = this.walks / this.plateAppearences,
        this.strikeoutPercentage = this.strikeouts / this.plateAppearences,
        this.sacrificeFlies =  _.filter(seasonEvents, function(event){
            return event.result == "sacrifice fly";
        }).length,
        this.atBats = this.plateAppearences - this.walks,
        this.hits = this.singles + this.doubles + this.triples + this.homeruns
        this.average = Math.round(this.hits / this.atBats * 1000) / 1000,
        this.obp = Math.round((this.hits + this.walks) / this.atBats * 1000) / 1000,
        this.slg = Math.round((this.singles + this.doubles * 2 + this.triples * 3 + this.homeruns * 4) / this.atBats * 1000) / 1000,
        this.babip = Math.round((this.hits - this.homeruns) / (this.atBats - this.strikeouts - this.homeruns + this.sacrificeFlies) * 1000) / 1000,
        this.woba = Math.round((.7 * this.walks + .9 * this.singles + 1.25 * this.doubles + 1.6 * this.triples + 2 * this.homeruns) / this.plateAppearences * 1000) / 1000 
    }
}