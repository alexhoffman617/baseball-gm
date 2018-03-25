import { Injectable } from '@angular/core';
import { Face } from '../models/face';
import * as _ from 'lodash';

@Injectable()
export class RandomFaceService {
  hairTypes = {
    short: 'short',
    shaggy: 'shaggy',
    long: 'long',
    afro: 'afro',
    bald: 'bald'
  }
  mustacheTypes = {
    none: 'none',
    straight: 'straight',
    pencil: 'pencil'
  }
  constructor() {}

  generateRandomFace() {
    const faceWidth = this.getRandomFaceWidth()
    const mustacheType = this.getMustacheType()
    const noseLength = this.getRandomNoseLength(mustacheType !== this.mustacheTypes.none)
    const hasSideburns = this.hasSideburns()
    const hasBeard = this.hasBeard()
    const sideburnLength = this.getRandomSideburnLength()
    return new Face(this.getRandomSkinTone(), faceWidth, noseLength, this.getRandomNoseSize(),
    this.getRandomNoseCurve(noseLength), this.getRandomEyeColor(), this.getRandomHairType(), this.getRandomHairColor(),
    this.getRandomEyeBrowCurve(), this.getRandomEyeBrowCenter(),
    hasSideburns, hasSideburns ? sideburnLength : 0, hasSideburns ? this.getRandomSideburnWidth(sideburnLength) : 0,
    mustacheType, mustacheType ? this.getRandomMustacheWidth() : 0,
    hasBeard, hasBeard ? this.getRandomBeardWidth() : 0, hasBeard ? this.getRandomBeardLength() : 0)
  }


  getRandomFaceWidth() {
    return _.random(75, 90)
  }

  getRandomEyeBrowCurve() {
    return _.random(-30, 10)
  }

  getRandomEyeBrowCenter() {
    return _.random(-15, 15)
  }

  getRandomNoseSize() {
    return _.random(5, 35)
  }

  getRandomNoseLength(hasMustache) {
    return hasMustache ? _.random(10, 22) : _.random(10, 30) + 10
  }

  getRandomNoseCurve(length) {
    return Math.round(Math.random() * (40 - length / 2)) + length / 2
  }

  getRandomSkinTone() {
    const skinTones = [
      '#ffdbac',
      '#f1c27d',
      '#e0ac69',
      '#c68642',
      '#8d5524'
    ]
    return skinTones[_.random(skinTones.length - 1)]
  }

  getRandomEyeColor() {
    const eyeColors = [
      '#497665',
      '#1c7847',
      '#3d671d',
      '#2e536f',
      '#634e34'
    ]
    return eyeColors[_.random(eyeColors.length - 1)]
  }

  getRandomHairColor() {
    const hairColors = [
      '#090806',
      '#71635A',
      '#B7A69E',
      '#CABFB1',
      '#FFF5E1',
      '#E6CEA8',
      '#DEBC99',
      '#B89778',
      '#A56B46',
      '#B55239',
      '#8D4A43',
      '#91553D',
      '#533D32',
      '#6A4E42',
      '#977961'
    ]
    return hairColors[_.random(hairColors.length - 1)]
  }

  getRandomHairType() {
    const hairTypes = []
    for(let prop in this.hairTypes) {
      hairTypes.push(prop)
    }
    return hairTypes[_.random(hairTypes.length - 1)]
  }

  hasSideburns() {
    if (Math.random() < .4) {
      return true
    } else {
      return false
    }
  }

  getRandomSideburnLength() {
    return Math.round(Math.random() * 40)
  }

  getRandomSideburnWidth(length) {
    if (length > 10) {
      return _.random(0, 25)
    }
    return _.random(0, 15)
  }

  getMustacheType() {
    const random = Math.random()
    if (random < .15) {
      return this.mustacheTypes.pencil
    } else if (random < .3) {
      return this.mustacheTypes.straight
    } else {
      return this.mustacheTypes.none
    }
  }

  getRandomMustacheWidth() {
    return _.random(28, 58)
  }

  hasBeard() {
    if (Math.random() < .25) {
      return true
    } else {
      return false
    }
  }

  getRandomBeardWidth() {
    return _.random(5, 35)
  }

  getRandomBeardLength() {
    return _.random(10, 50)
  }
}
