import { Component, OnInit } from '@angular/core';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { PlayerProgressionService } from '../../services/player-progression.service';
import { SeasonStats } from '../../models/season-stats';

@Component({
  selector: 'player-progression-test',
  templateUrl: './player-progression-test.component.html',
  styleUrls: ['./player-progression-test.component.css']
})
export class PlayerProgressionTestComponent implements OnInit {
  batter;
  improvement;
  seasonStats: SeasonStats;
  constructor(private generatePlayerService: GeneratePlayerService, private playerProgressionService: PlayerProgressionService) { }

  async ngOnInit() {
    this.batter = await this.generatePlayerService.generateBatter();
    this.seasonStats = new SeasonStats("", 0, 0, 0, 0, 0, 0, 0, 0);
  }

  newSeasonStats(){
    this.seasonStats = new SeasonStats(this.seasonStats.playerId, this.seasonStats.plateAppearences,
       this.seasonStats.singles, this.seasonStats.doubles, this.seasonStats.triples, this.seasonStats.homeruns,
      this.seasonStats.walks, this.seasonStats.strikeouts, this.seasonStats.sacrificeFlies);
  }

  progressPlayer(){
    this.improvement = this.playerProgressionService.progressPlayer(this.batter, this.seasonStats);
  }

}
