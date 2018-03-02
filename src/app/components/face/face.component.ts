import { Component, OnChanges, Input } from '@angular/core';
import * as _ from 'lodash';
import { RandomFaceService } from '../../services/random-face.service';
import { Player } from '../../models/player';
import { LeagueDataService } from '../../services/league-data.service';
import { Team } from '../../models/team';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss']
})
export class FaceComponent implements OnChanges {
  face
  eyes
  mouth
  cap
  hair
  @Input() player: Player
  constructor(private randomFaceService: RandomFaceService, private leagueDataService: LeagueDataService) { }

  ngOnChanges() {
    if (this.player) {
      this.setFace(this.player.face.faceWidth, this.player.face.skinTone, this.player.face.noseSize,
      this.player.face.noseLength, this.player.face.noseCurve)
      this.setEyes(this.player.face.eyeColor)
      this.setMouth()
      this.setCap(this.player.face.faceWidth, this.leagueDataService.getTeamById(this.player.teamId))
      this.setHair(this.player.face.faceWidth, this.player.face.hairType, this.player.face.hairColor,
        this.player.face.eyebrowCurve, this.player.face.eyebrowCenter)

    }
  }

  randomFace() {
    const faceWidth = this.randomFaceService.getRandomFaceWidth()
    const noseLength = this.randomFaceService.getRandomNoseLength()
    this.setFace(faceWidth, this.randomFaceService.getRandomSkinTone(), this.randomFaceService.getRandomNoseSize(),
     noseLength, this.randomFaceService.getRandomNoseCurve(noseLength))
    this.setEyes(this.randomFaceService.getRandomEyeColor())
    this.setMouth()
    this.setCap(faceWidth, null)
    this.setHair(faceWidth, this.randomFaceService.getRandomHairType(), this.randomFaceService.getRandomHairColor(),
    this.randomFaceService.getRandomEyeBrowCurve(), this.randomFaceService.getRandomEyeBrowCenter())
  }

  setFace(width, color, nSize, nLength, nCurve) {
    this.face =  {
      cx: 128,
      cy: 154,
      rx: width,
      ry: 105,
      fill: color,
      noseD: 'M 125 170 q ' + nSize + ' ' + nCurve + ' 0 ' + nLength
    }
  }

  setEyes(color) {
    this.eyes = {
      leftCx: 100,
      rightCx: 156,
      eyeR: 12,
      pupilR: 6,
      cy: 158,
      pupilFill: color,
      eyeFill: 'white'
    }
  }

  setMouth() {
    this.mouth = {
      d: 'M 100 210 q 27 30 55 0',
      width: 5
    }
  }

  setCap(faceWidth, team: Team) {
    this.cap = {
      mainD: 'M' + (190 + (faceWidth - 75) / 1.5) + ' 100 A13 12 0 1,0'
              + (65 - (faceWidth - 75) / 1.5) +  ' 100 40 12 0 1 1 '
              + (190 + (faceWidth - 75) / 1.5) + ' 100z',
      mainColor: team ? team.mainColor : 'white',
      billD: 'M' + (190 + (faceWidth - 75) / 1.5) + ' 120 A40 12 0 1,0 '
      + (65 - (faceWidth - 75) / 1.5) +  ' 120 l 0 -20 A40 12 0 1 1 '
      + (190 + (faceWidth - 75) / 1.5) + ' 100 l0 20',
      secondaryColor: team ? team.secondaryColor : 'black',
      teamAbv: team ? team.location[0].toUpperCase() : 'FA'
    }
  }

  setHair(faceWidth, hairType, color, eyebrowCurve, eyebrowCenter) {
    this.hair = {
      eyebrowLeftD: 'M 85 130 q ' + (15 + eyebrowCenter) + ' ' + eyebrowCurve + ' 30 0',
      eyebrowRightD: 'M 140 130 q ' + (15 - eyebrowCenter) + ' ' + eyebrowCurve + ' 30 0',
      eyebrowWidth: 5,
      color: color,
    }
    if (hairType === this.randomFaceService.hairTypes.short) {
      this.hair.hairFrontD = 'M' + (200 + (faceWidth - 75) / 1.5) + ' 132 A12 12 0 1,0 '
      + (55 - (faceWidth - 75) / 1.5) + ' 132 40 12 0 1 1' + (200 + (faceWidth - 75) / 1.5) + ' 132z'
      this.hair.hairBackD = ''
    } else if (hairType === this.randomFaceService.hairTypes.shaggy) {
      this.hair.hairFrontD = 'M' + (58 - (faceWidth - 75) / 2) + ' 115 q 15 -15 30 10 q 0 0 5 -10'
      + ' q 15 -15 35 10 q 0 0 5 -10'
      + ' q 15 -15 35 10 q 0 0 5 -10'
      + ' q 15 -15 35 10 q 0 0 ' + (-15 + (faceWidth - 75) * 2) + ' -10'
      + ' q ' + (-140 - (faceWidth - 75) * 2) / 2 + ' -150 ' + (-140 - (faceWidth - 75) * 2) + ' 0'
      this.hair.hairBackD = ''
    }else if (hairType === this.randomFaceService.hairTypes.long) {
      this.hair.hairBackD = 'M 30 250 q 7 -7 15 0 q 7 7 15 0 q 7 -7 15 0 q 7 7 15 0 q 7 -7 15 0 q 7 7 15 0 q 7 -7 15 0 q 7 7 15 0 q 7 -7 15 0 q 7 7 15 0 q 7 -7 15 0 q 7 7 15 0 q 7 -7 15 0 q 20 -90 -40 -180 l -115 0 q -50 90 -40 180'
      this.hair.hairFrontD = ''
    }else if (hairType === this.randomFaceService.hairTypes.bald) {
      this.hair.hairFrontD = ''
      this.hair.hairBackD = ''
    }
  }
}
