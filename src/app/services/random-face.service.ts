import { Injectable } from '@angular/core';
import { Face } from '../models/face';
import * as _ from 'lodash';

@Injectable()
export class RandomFaceService {
  hairTypes = {
    short: 'short',
    shaggy: 'shaggy',
    long: 'long',
    bald: 'bald'
  }
  constructor() {}

  generateRandomFace() {
    const faceWidth = this.getRandomFaceWidth()
    const noseLength = this.getRandomNoseLength()
    return new Face(this.getRandomSkinTone(), faceWidth, noseLength, this.getRandomNoseSize(),
    this.getRandomNoseCurve(noseLength), this.getRandomEyeColor(), this.getRandomHairType(), this.getRandomHairColor(),
    this.getRandomEyeBrowCurve(), this.getRandomEyeBrowCenter())
  }


  getRandomFaceWidth() {
    return Math.round(Math.random() * 15) + 75
  }

  getRandomEyeBrowCurve() {
    return Math.round(Math.random() * 40) - 30
  }

  getRandomEyeBrowCenter() {
    return Math.round(Math.random() * 30) - 15
  }

  getRandomNoseSize() {
    return Math.round(Math.random() * 30) + 5
  }

  getRandomNoseLength() {
    return Math.round(Math.random() * 20) + 10
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
}
