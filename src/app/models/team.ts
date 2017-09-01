export class Team {
  name: string;
  location: string;
  roster: Roster;

  constructor(name: string, location: string, roster: Roster) {
    this.name = name;
    this.location = location;
    this.roster = roster;
  }
}

export class Roster{
  batters: Array<RosterSpot>;
  pitchers: Array<RosterSpot>;

  constructor(batters: Array<RosterSpot>, pitchers: Array<RosterSpot>){
    this.batters = batters;
    this.pitchers = pitchers;
  }
  
}

export class RosterSpot{
  playerId: string;
  startingPosition: string;

  constructor(playerId: string, startingPosition: string){
    this.playerId = playerId;
    this.startingPosition = startingPosition;
  }
  
}