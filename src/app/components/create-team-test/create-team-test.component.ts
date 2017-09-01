import { Component, OnInit } from '@angular/core';
import { GenerateTeamService } from '../../services/generate-team.service';
import * as _ from "lodash";

@Component({
  selector: 'create-team-test',
  templateUrl: './create-team-test.component.html',
  styleUrls: ['./create-team-test.component.css']
})
export class CreateTeamTestComponent implements OnInit {
  generatedTeam;
  constructor(private generateTeamService: GenerateTeamService) { }

  async generateTeam(){
    this.generatedTeam = await this.generateTeamService.generateTeam()
  }

  getPlayerById(id){
    var x = _.find(this.generateTeamService.players, function(player){
      return player.id == id;
    });
    return x;
  }

  onPositionChange(setBatter, event){
    _.each(this.generatedTeam.roster.batters, function(batter){
      if(batter.position == event.value && batter.playerId != setBatter.playerId){
        batter.position = "";
        batter.orderNumber = "";
      }
    })
  }

  onOrderChange(setBatter, event){
    _.each(this.generatedTeam.roster.batters, function(batter){
      if(batter.position == event.value && batter.playerId != setBatter.playerId){
        batter.orderNumber = "";
      }
    })
  }

  onPitcherRoleChange(setPitcher, event){
    _.each(this.generatedTeam.roster.pitchers, function(pitcher){
      if(pitcher.position == event.value && pitcher.playerId != setPitcher.playerId){
        pitcher.position = "";
        pitcher.orderNumber = "";
      }
    })
  }

  positions=[
    "",
    "C",
    "1B",
    "2B",
    "3B",
    "SS",
    "LF",
    "CF",
    "RF"
  ]

  orderNumbers=[
    "",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
  ]

  pitcherRoles=[
    "",
    "SP1",
    "SP2",
    "SP3",
    "SP4",
    "SP5"
  ]

  ngOnInit() {
    this.generateTeam();
    }

}
