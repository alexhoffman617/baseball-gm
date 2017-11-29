import { Component, OnInit } from '@angular/core';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { PlayerService } from '../../backendServices/player/player.service';
@Component({
  selector: 'generate-player-test',
  templateUrl: './generate-player-test.component.html',
  styleUrls: ['./generate-player-test.component.css']
})
export class GeneratePlayerTestComponent implements OnInit {
  players;
  generatedPlayer;
  constructor(private generatePlayerSerivce: GeneratePlayerService,
              private playerService: PlayerService) { }

  ngOnInit() {
    this.players = this.playerService.players$().map(p => p.data)
  }

  async generatePlayer() {
    const x = await this.generatePlayerSerivce.generateBatter(null, null, null)
    this.playerService.createPlayer(x);
    this.generatedPlayer = JSON.stringify(x);
  }

}
