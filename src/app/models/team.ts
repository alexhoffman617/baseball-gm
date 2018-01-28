export class Team {
  name: string;
  location: string;
  roster: Roster;
  leagueId: string;
  ownerAccountId: string;
  _id: string;

  constructor(name: string, location: string, roster: Roster, leagueId: string) {
    this.name = name;
    this.location = location;
    this.roster = roster;
    this.leagueId = leagueId;
  }
}

export class Roster {
  batters: Array<RosterSpot>;
  pitchers: Array<RosterSpot>;

  constructor(batters: Array<RosterSpot>, pitchers: Array<RosterSpot>) {
    this.batters = batters;
    this.pitchers = pitchers;
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
