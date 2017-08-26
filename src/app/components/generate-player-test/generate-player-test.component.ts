import { Component, OnInit } from '@angular/core';
import { GeneratePlayerService } from '../../services/generate-player.service';

@Component({
  selector: 'generate-player-test',
  templateUrl: './generate-player-test.component.html',
  styleUrls: ['./generate-player-test.component.css']
})
export class GeneratePlayerTestComponent implements OnInit {
  generatedPlayer;
  constructor(private generatePlayerSerivce: GeneratePlayerService) { }

  ngOnInit() {
  }

  async generatePlayer(){
    var x = await this.generatePlayerSerivce.generatePlayer()
    this.generatedPlayer = JSON.stringify(x);
  }

}
