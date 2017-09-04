import { Component, OnInit } from '@angular/core';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { PlayerProgressionService } from '../../services/player-progression.service';
import { AtBatService } from '../../services/at-bat.service';
import { SeasonStats } from '../../models/season-stats';
import { Player, HittingSkillset } from '../../models/player';

@Component({
  selector: 'player-progression-test',
  templateUrl: './player-progression-test.component.html',
  styleUrls: ['./player-progression-test.component.css']
})
export class PlayerProgressionTestComponent implements OnInit {
  batter;
  pitcher;
  improvement;
  seasonStats: SeasonStats;
  atBats;
  advance = true;
  constructor(private generatePlayerService: GeneratePlayerService, 
    private playerProgressionService: PlayerProgressionService,
    private atBatService: AtBatService) { }

  async ngOnInit() { 
    this.reset()
  }

  async reset(){
    this.batter = await this.generatePlayerService.generateBatter();
    this.pitcher = await this.generatePlayerService.generatePitcher();
    this.pitcher.pitchingAbility.velocity = 50;
    this.pitcher.pitchingAbility.control = 50;
    this.pitcher.pitchingAbility.movement = 50;
    this.pitcher.pitchingAbility.type = "std";
    this.seasonStats = new SeasonStats;
    this.seasonStats.buildSeasonStats("", 0, 0, 0, 0, 0, 0, 0, 0);
  }

  newSeasonStats(){
    this.seasonStats = new SeasonStats
    this.seasonStats.buildSeasonStats(this.seasonStats.playerId, this.seasonStats.plateAppearences,
      this.seasonStats.singles, this.seasonStats.doubles, this.seasonStats.triples, this.seasonStats.homeruns,
      this.seasonStats.walks, this.seasonStats.strikeouts, this.seasonStats.sacrificeFlies);
  }

  progressPlayer(){
    this.atBats = [];
    for(var x = 0; x < 650; x++){
      this.atBats.push(this.atBatService.atBat(this.batter, this.pitcher));
    } 
    this.seasonStats = new SeasonStats;
    this.seasonStats.buildSeasonStatsFromGameEvents(this.seasonStats.playerId, this.atBats);
    this.improvement = this.playerProgressionService.progressPlayer(this.batter, this.seasonStats);

    if(this.advance){
      this.batter.hittingAbility = new HittingSkillset(
        this.batter.hittingAbility.contact + this.improvement.contact,
        this.batter.hittingAbility.power + this.improvement.power,
        this.batter.hittingAbility.patience + this.improvement.patience,
        this.batter.hittingAbility.speed + this.improvement.speed
      );
      this.batter.age++;
    }
  }

}
