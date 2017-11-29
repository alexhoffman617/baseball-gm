import { Component, OnInit } from '@angular/core';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { PlayerProgressionService } from '../../services/player-progression.service';
import { AtBatService } from '../../services/at-bat.service';
import { BatterSeasonStats } from '../../models/season-stats';
import { Player, HittingSkillset } from '../../models/player';
import { GamePlayer } from '../../models/game';

@Component({
  selector: 'player-progression-test',
  templateUrl: './player-progression-test.component.html',
  styleUrls: ['./player-progression-test.component.css']
})
export class PlayerProgressionTestComponent implements OnInit {
  batter;
  pitcher;
  fieldingTeam;
  improvement;
  seasonStats: BatterSeasonStats;
  atBats;
  advance = true;
  constructor(private generatePlayerService: GeneratePlayerService,
    private playerProgressionService: PlayerProgressionService,
    private atBatService: AtBatService) { }

  async ngOnInit() {
    this.reset()
  }

  async reset() {
    this.batter = await this.generatePlayerService.generateBatter(null, null, null);
    this.pitcher = await this.generatePlayerService.generatePitcher(null, null, null);
    this.pitcher.pitchingAbility.velocity = 50;
    this.pitcher.pitchingAbility.control = 50;
    this.pitcher.pitchingAbility.movement = 50;
    this.pitcher.pitchingAbility.type = 'std';
    this.pitcher.hittingAbility.fielding = 50;
    this.seasonStats = new BatterSeasonStats;
    this.seasonStats.buildSeasonStats('', 0, 0, 0, 0, 0, 0, 0, 0);
    this.fieldingTeam = [
        new GamePlayer('C', null, true, this.pitcher),
        new GamePlayer('1B', null, true, this.pitcher),
        new GamePlayer('2B', null, true, this.pitcher),
        new GamePlayer('3B', null, true, this.pitcher),
        new GamePlayer('SS', null, true, this.pitcher),
        new GamePlayer('LF', null, true, this.pitcher),
        new GamePlayer('CF', null, true, this.pitcher),
        new GamePlayer('RF', null, true, this.pitcher),
        new GamePlayer('P', null, true, this.pitcher)
      ]
  }

  newSeasonStats() {
    this.seasonStats = new BatterSeasonStats
    this.seasonStats.buildSeasonStats(this.seasonStats.playerId, this.seasonStats.plateAppearences,
      this.seasonStats.singles, this.seasonStats.doubles, this.seasonStats.triples, this.seasonStats.homeruns,
      this.seasonStats.walks, this.seasonStats.strikeouts, this.seasonStats.sacrificeFlies);
  }

  progressPlayer() {
    this.atBats = [];
    for (let x = 0; x < 650; x++) {
      this.atBats.push(this.atBatService.atBat(this.batter, this.pitcher, this.fieldingTeam, true));
    }
    this.seasonStats = new BatterSeasonStats;
    this.seasonStats.buildSeasonStatsFromGameEvents(this.seasonStats.playerId, this.atBats);
    this.improvement = this.playerProgressionService.progressPlayer(this.batter, this.seasonStats);

    if (this.advance) {
      this.batter.hittingAbility = new HittingSkillset(
        this.batter.hittingAbility.contact + this.improvement.contact,
        this.batter.hittingAbility.power + this.improvement.power,
        this.batter.hittingAbility.patience + this.improvement.patience,
        this.batter.hittingAbility.speed + this.improvement.speed,
        this.batter.hittingAbility.fielding + this.improvement.fielding
      );
      this.batter.age++;
    }
  }

}
