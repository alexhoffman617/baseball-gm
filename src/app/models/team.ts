export class Team {
  name: string;
  location: string;
  mainColor: string;
  secondaryColor: string;
  roster: Roster;
  leagueId: string;
  ownerAccountId: string;
  _id: string;

  constructor(name: string, location: string, mainColor: string, secondaryColor: string, roster: Roster, leagueId: string) {
    this.name = name;
    this.location = location;
    this.mainColor = mainColor;
    this.secondaryColor = secondaryColor;
    this.roster = roster;
    this.leagueId = leagueId;
  }
}

export class Roster {
  batters: Array<RosterSpot>
  pitchers: Array<RosterSpot>
  pitcherReserves: Array<RosterSpot>
  batterReserves: Array<RosterSpot>
  constructor(batters: Array<RosterSpot>, pitchers: Array<RosterSpot>,
    batterReserves: Array<RosterSpot>, pitcherReserves: Array<RosterSpot>) {
    this.batters = batters
    this.pitchers = pitchers
    this.pitcherReserves = pitcherReserves
    this.batterReserves = batterReserves
  }
}

export class RosterSpot {
  playerId: string;
  startingPosition: string;
  orderNumber: number;
  tempId: number;
  constructor(playerId: string, startingPosition: string, orderNumber: number) {
    this.playerId = playerId
    this.startingPosition = startingPosition
    this.orderNumber = orderNumber
  }
}
