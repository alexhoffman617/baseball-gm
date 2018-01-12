import { Component, OnInit } from '@angular/core';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { LeagueDataService } from '../../services/league-data.service';
@Component({
  selector: 'generate-player-test',
  templateUrl: './generate-player-test.component.html',
  styleUrls: ['./generate-player-test.component.css']
})
export class GeneratePlayerTestComponent implements OnInit {
  players;
  generatedPlayer;
  constructor(private generatePlayerSerivce: GeneratePlayerService,
              private leagueDataService: LeagueDataService) { }

  ngOnInit() {
  }

  async generatePlayer() {
    const x = await this.generatePlayerSerivce.generateBatter(null, null, null)
    this.leagueDataService.createPlayer(x);
    this.generatedPlayer = JSON.stringify(x);
  }

}
