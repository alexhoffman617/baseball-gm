export class Face {
  skinTone: string
  faceWidth: number
  noseLength: number
  noseSize: number
  noseCurve: number
  eyeColor: string
  hairType: string
  hairColor: string
  eyebrowCurve: number
  eyebrowCenter: number

  constructor(skinTone: string, faceWidth: number, noseLength: number, noseSize: number, noseCurve: number,
              eyeColor: string, hairType: string, hairColor: string, eyebrowCurve: number, eyebrowCenter: number) {
    this.skinTone = skinTone
    this.faceWidth = faceWidth
    this.noseLength = noseLength
    this.noseSize = noseSize
    this.noseCurve = noseCurve
    this.eyeColor = eyeColor
    this.hairType = hairType
    this.hairColor = hairColor
    this.eyebrowCurve = eyebrowCurve
    this.eyebrowCenter = eyebrowCenter
  }
}
