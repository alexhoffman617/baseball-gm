import { Component, OnInit } from '@angular/core';
import { GeneratePlayerService } from '../../services/generate-player.service';
import { PlayerService } from '../../backEndServices/player/player.service';
@Component({
  selector: 'generate-player-test',
  templateUrl: './generate-player-test.component.html',
  styleUrls: ['./generate-player-test.component.css']
})
export class GeneratePlayerTestComponent implements OnInit {
  generatedPlayer;
  players;
  constructor(private generatePlayerSerivce: GeneratePlayerService,
              private playerService: PlayerService) { }

  ngOnInit() {
    this.playerService.getAllPlayers().subscribe(players => {
      this.players = players;
    });
  }

  async generatePlayer(){
    var x = await this.generatePlayerSerivce.generateBatter()
    this.playerService.postPlayer(x);
    this.generatedPlayer = JSON.stringify(x);
  }

}
