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
  sideburns: boolean
  sideburnLength: number
  sideburnWidth: number
  mustacheType: string
  mustacheWidth: number
  beard: boolean
  beardWidth: number
  beardLength: number

  constructor(skinTone: string, faceWidth: number, noseLength: number, noseSize: number, noseCurve: number,
              eyeColor: string, hairType: string, hairColor: string, eyebrowCurve: number, eyebrowCenter: number,
              sideburns: boolean, sideburnLength: number, sideburnWidth: number, mustacheType: string,
              mustacheWidth: number, beard: boolean, beardWidth: number, beardLength: number) {
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
    this.sideburns = sideburns
    this.sideburnLength = sideburnLength
    this.sideburnWidth = sideburnWidth
    this.mustacheType = mustacheType
    this.mustacheWidth = mustacheWidth
    this.beard = beard
    this.beardWidth = beardWidth
    this.beardLength = beardLength
  }
}
