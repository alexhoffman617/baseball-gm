import { Component, OnInit } from '@angular/core';
import { LeagueDataService } from 'app/services/league-data.service';

@Component({
  selector: 'app-messeges-test',
  templateUrl: './messeges-test.component.html',
  styleUrls: ['./messeges-test.component.css']
})
export class MessegesTestComponent implements OnInit {
  messages: any
  constructor(private leagueDataService: LeagueDataService) { }

  ngOnInit() {
    this.leagueDataService.getMessages().subscribe(messages => {
      this.messages = messages;
    })
  }

  sendMessage(){
    this.leagueDataService.sendMessage('message')
  }

}
