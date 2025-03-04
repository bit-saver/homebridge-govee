import { inherits } from 'node:util'

export default class {
  constructor(api) {
    this.hapServ = api.hap.Service
    this.hapChar = api.hap.Characteristic
    this.uuids = {
      /* deprecated
      bluetooth: 'E964F001-079E-48FF-8F27-9C2605A29F52'
      bluetoothConn: 'E964F002-079E-48FF-8F27-9C2605A29F52'
      musicMode: 'E964F003-079E-48FF-8F27-9C2605A29F52'
      */
      colourMode: 'E964F004-079E-48FF-8F27-9C2605A29F52',
      musicMode: 'E964F005-079E-48FF-8F27-9C2605A29F52',
      musicModeTwo: 'E964F006-079E-48FF-8F27-9C2605A29F52',
      scene: 'E964F007-079E-48FF-8F27-9C2605A29F52',
      sceneTwo: 'E964F008-079E-48FF-8F27-9C2605A29F52',
      diyMode: 'E964F009-079E-48FF-8F27-9C2605A29F52',
      diyModeTwo: 'E964F010-079E-48FF-8F27-9C2605A29F52',
      sceneThree: 'E964F011-079E-48FF-8F27-9C2605A29F52',
      sceneFour: 'E964F012-079E-48FF-8F27-9C2605A29F52',
      diyModeThree: 'E964F013-079E-48FF-8F27-9C2605A29F52',
      diyModeFour: 'E964F014-079E-48FF-8F27-9C2605A29F52',
      segmented: 'E964F015-079E-48FF-8F27-9C2605A29F52',
      segmentedTwo: 'E964F016-079E-48FF-8F27-9C2605A29F52',
      segmentedThree: 'E964F017-079E-48FF-8F27-9C2605A29F52',
      segmentedFour: 'E964F018-079E-48FF-8F27-9C2605A29F52',
      videoMode: 'E964F019-079E-48FF-8F27-9C2605A29F52',
      videoModeTwo: 'E964F020-079E-48FF-8F27-9C2605A29F52',
      extra: 'E964F023-079E-48FF-8F27-9C2605A29F52',
      extraTwo: 'E964F024-079E-48FF-8F27-9C2605A29F52',
      extraThree: 'E964F025-079E-48FF-8F27-9C2605A29F52',
      extraFour: 'E964F026-079E-48FF-8F27-9C2605A29F52',
      extraFive: 'E964F027-079E-48FF-8F27-9C2605A29F52',
      extraSix: 'E964F028-079E-48FF-8F27-9C2605A29F52',
      extraSeven: 'E964F029-079E-48FF-8F27-9C2605A29F52',
      extraEight: 'E964F030-079E-48FF-8F27-9C2605A29F52',
      extraNine: 'E964F031-079E-48FF-8F27-9C2605A29F52',
      extraTen: 'E964F032-079E-48FF-8F27-9C2605A29F52',
      extraEleven: 'E964F033-079E-48FF-8F27-9C2605A29F52',
      extraTwelve: 'E964F034-079E-48FF-8F27-9C2605A29F52',
      extraThirteen: 'E964F035-079E-48FF-8F27-9C2605A29F52',
      extraFourteen: 'E964F036-079E-48FF-8F27-9C2605A29F52',
      extraFifteen: 'E964F037-079E-48FF-8F27-9C2605A29F52',
      extraSixteen: 'E964F038-079E-48FF-8F27-9C2605A29F52',
      extraSeventeen: 'E964F039-079E-48FF-8F27-9C2605A29F52',
      extraEighteen: 'E964F040-079E-48FF-8F27-9C2605A29F52',
      extraNineteen: 'E964F041-079E-48FF-8F27-9C2605A29F52',
      extraTwenty: 'E964F042-079E-48FF-8F27-9C2605A29F52',
      extraTwentyOne: 'E964F043-079E-48FF-8F27-9C2605A29F52',
      extraTwentyTwo: 'E964F044-079E-48FF-8F27-9C2605A29F52',
      extraTwentyThree: 'E964F045-079E-48FF-8F27-9C2605A29F52',
      extraTwentyFour: 'E964F046-079E-48FF-8F27-9C2605A29F52',
      extraTwentyFive: 'E964F047-079E-48FF-8F27-9C2605A29F52',
      extraTwentySix: 'E964F048-079E-48FF-8F27-9C2605A29F52',
      extraTwentySeven: 'E964F049-079E-48FF-8F27-9C2605A29F52',
      extraTwentyEight: 'E964F050-079E-48FF-8F27-9C2605A29F52',
      extraTwentyNine: 'E964F051-079E-48FF-8F27-9C2605A29F52',
      extraThirty: 'E964F052-079E-48FF-8F27-9C2605A29F52',
      extraThirtyOne: 'E964F053-079E-48FF-8F27-9C2605A29F52',
      extraThirtyTwo: 'E964F054-079E-48FF-8F27-9C2605A29F52',
      extraThirtyThree: 'E964F055-079E-48FF-8F27-9C2605A29F52',
      extraThirtyFour: 'E964F056-079E-48FF-8F27-9C2605A29F52',
      extraThirtyFive: 'E964F057-079E-48FF-8F27-9C2605A29F52',
      extraThirtySix: 'E964F058-079E-48FF-8F27-9C2605A29F52',
      extraThirtySeven: 'E964F059-079E-48FF-8F27-9C2605A29F52',
      extraThirtyEight: 'E964F060-079E-48FF-8F27-9C2605A29F52',
      extraThirtyNine: 'E964F061-079E-48FF-8F27-9C2605A29F52',
      nightLight: 'E964F021-079E-48FF-8F27-9C2605A29F52',
      displayLight: 'E964F022-079E-48FF-8F27-9C2605A29F52',
    }
    const self = this
    this.ColourMode = function ColourMode() {
      self.hapChar.call(this, 'Colour Mode', self.uuids.colourMode)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.MusicMode = function MusicMode() {
      self.hapChar.call(this, 'Music Mode', self.uuids.musicMode)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.MusicModeTwo = function MusicModeTwo() {
      self.hapChar.call(this, 'Music Mode 2', self.uuids.musicModeTwo)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.Scene = function Scene() {
      self.hapChar.call(this, 'Scene', self.uuids.scene)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.SceneTwo = function SceneTwo() {
      self.hapChar.call(this, 'Scene 2', self.uuids.sceneTwo)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.SceneThree = function SceneThree() {
      self.hapChar.call(this, 'Scene 3', self.uuids.sceneThree)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.SceneFour = function SceneFour() {
      self.hapChar.call(this, 'Scene 4', self.uuids.sceneFour)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.DiyMode = function DiyMode() {
      self.hapChar.call(this, 'DIY Mode', self.uuids.diyMode)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.DiyModeTwo = function DiyModeTwo() {
      self.hapChar.call(this, 'DIY Mode 2', self.uuids.diyModeTwo)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.DiyModeThree = function DiyModeThree() {
      self.hapChar.call(this, 'DIY Mode 3', self.uuids.diyModeThree)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.DiyModeFour = function DiyModeFour() {
      self.hapChar.call(this, 'DIY Mode 4', self.uuids.diyModeFour)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.Segmented = function Segmented() {
      self.hapChar.call(this, 'Segmented', self.uuids.segmented)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.SegmentedTwo = function SegmentedTwo() {
      self.hapChar.call(this, 'Segmented 2', self.uuids.segmentedTwo)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.SegmentedThree = function SegmentedThree() {
      self.hapChar.call(this, 'Segmented 3', self.uuids.segmentedThree)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.SegmentedFour = function SegmentedFour() {
      self.hapChar.call(this, 'Segmented 4', self.uuids.segmentedFour)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.VideoMode = function VideoMode() {
      self.hapChar.call(this, 'Video Mode', self.uuids.videoMode)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.VideoModeTwo = function VideoModeTwo() {
      self.hapChar.call(this, 'Video Mode 2', self.uuids.videoModeTwo)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.Extra = function Extra() {
      self.hapChar.call(this, 'Extra 1', self.uuids.extra)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwo = function ExtraTwo() {
      self.hapChar.call(this, 'Extra 2', self.uuids.extraTwo)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThree = function ExtraThree() {
      self.hapChar.call(this, 'Extra 3', self.uuids.extraThree)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraFour = function ExtraFour() {
      self.hapChar.call(this, 'Extra 4', self.uuids.extraFour)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraFive = function ExtraFive() {
      self.hapChar.call(this, 'Extra 5', self.uuids.extraFive)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraSix = function ExtraSix() {
      self.hapChar.call(this, 'Extra 6', self.uuids.extraSix)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraSeven = function ExtraSeven() {
      self.hapChar.call(this, 'Extra 7', self.uuids.extraSeven)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraEight = function ExtraEight() {
      self.hapChar.call(this, 'Extra 8', self.uuids.extraEight)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraNine = function ExtraNine() {
      self.hapChar.call(this, 'Extra 9', self.uuids.extraNine)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTen = function ExtraTen() {
      self.hapChar.call(this, 'Extra 10', self.uuids.extraTen)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraEleven = function ExtraEleven() {
      self.hapChar.call(this, 'Extra 11', self.uuids.extraEleven)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwelve = function ExtraTwelve() {
      self.hapChar.call(this, 'Extra 12', self.uuids.extraTwelve)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirteen = function ExtraThirteen() {
      self.hapChar.call(this, 'Extra 13', self.uuids.extraThirteen)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraFourteen = function ExtraFourteen() {
      self.hapChar.call(this, 'Extra 14', self.uuids.extraFourteen)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraFifteen = function ExtraFifteen() {
      self.hapChar.call(this, 'Extra 15', self.uuids.extraFifteen)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraSixteen = function ExtraSixteen() {
      self.hapChar.call(this, 'Extra 16', self.uuids.extraSixteen)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraSeventeen = function ExtraSeventeen() {
      self.hapChar.call(this, 'Extra 17', self.uuids.extraSeventeen)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraEighteen = function ExtraEighteen() {
      self.hapChar.call(this, 'Extra 18', self.uuids.extraEighteen)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraNineteen = function ExtraNineteen() {
      self.hapChar.call(this, 'Extra 19', self.uuids.extraNineteen)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwenty = function ExtraTwenty() {
      self.hapChar.call(this, 'Extra 20', self.uuids.extraTwenty)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentyOne = function ExtraTwentyOne() {
      self.hapChar.call(this, 'Extra 21', self.uuids.extraTwentyOne)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentyTwo = function ExtraTwentyTwo() {
      self.hapChar.call(this, 'Extra 22', self.uuids.extraTwentyTwo)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentyThree = function ExtraTwentyThree() {
      self.hapChar.call(this, 'Extra 23', self.uuids.extraTwentyThree)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentyFour = function ExtraTwentyFour() {
      self.hapChar.call(this, 'Extra 24', self.uuids.extraTwentyFour)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentyFive = function ExtraTwentyFive() {
      self.hapChar.call(this, 'Extra 25', self.uuids.extraTwentyFive)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentySix = function ExtraTwentySix() {
      self.hapChar.call(this, 'Extra 26', self.uuids.extraTwentySix)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentySeven = function ExtraTwentySeven() {
      self.hapChar.call(this, 'Extra 27', self.uuids.extraTwentySeven)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentyEight = function ExtraTwentyEight() {
      self.hapChar.call(this, 'Extra 28', self.uuids.extraTwentyEight)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraTwentyNine = function ExtraTwentyNine() {
      self.hapChar.call(this, 'Extra 29', self.uuids.extraTwentyNine)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirty = function ExtraThirty() {
      self.hapChar.call(this, 'Extra 30', self.uuids.extraThirty)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtyOne = function ExtraThirtyOne() {
      self.hapChar.call(this, 'Extra 31', self.uuids.extraThirtyOne)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtyTwo = function ExtraThirtyTwo() {
      self.hapChar.call(this, 'Extra 32', self.uuids.extraThirtyTwo)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtyThree = function ExtraThirtyThree() {
      self.hapChar.call(this, 'Extra 33', self.uuids.extraThirtyThree)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtyFour = function ExtraThirtyFour() {
      self.hapChar.call(this, 'Extra 34', self.uuids.extraThirtyFour)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtyFive = function ExtraThirtyFive() {
      self.hapChar.call(this, 'Extra 35', self.uuids.extraThirtyFive)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtySix = function ExtraThirtySix() {
      self.hapChar.call(this, 'Extra 36', self.uuids.extraThirtySix)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtySeven = function ExtraThirtySeven() {
      self.hapChar.call(this, 'Extra 37', self.uuids.extraThirtySeven)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtyEight = function ExtraThirtyEight() {
      self.hapChar.call(this, 'Extra 38', self.uuids.extraThirtyEight)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.ExtraThirtyNine = function ExtraThirtyNine() {
      self.hapChar.call(this, 'Extra 39', self.uuids.extraThirtyNine)
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.NightLight = function NightLight() {
      self.hapChar.call(this, 'Night Light', self.uuids.nightLight)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    this.DisplayLight = function DisplayLight() {
      self.hapChar.call(this, 'Display Light', self.uuids.displayLight)
      this.setProps({
        format: api.hap.Formats.BOOL,
        perms: [api.hap.Perms.READ, api.hap.Perms.WRITE, api.hap.Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
    inherits(this.ColourMode, this.hapChar)
    inherits(this.MusicMode, this.hapChar)
    inherits(this.MusicModeTwo, this.hapChar)
    inherits(this.Scene, this.hapChar)
    inherits(this.SceneTwo, this.hapChar)
    inherits(this.SceneThree, this.hapChar)
    inherits(this.SceneFour, this.hapChar)
    inherits(this.DiyMode, this.hapChar)
    inherits(this.DiyModeTwo, this.hapChar)
    inherits(this.DiyModeThree, this.hapChar)
    inherits(this.DiyModeFour, this.hapChar)
    inherits(this.Segmented, this.hapChar)
    inherits(this.SegmentedTwo, this.hapChar)
    inherits(this.SegmentedThree, this.hapChar)
    inherits(this.SegmentedFour, this.hapChar)
    inherits(this.VideoMode, this.hapChar)
    inherits(this.VideoModeTwo, this.hapChar)
    inherits(this.Extra, this.hapChar)
    inherits(this.ExtraTwo, this.hapChar)
    inherits(this.ExtraThree, this.hapChar)
    inherits(this.ExtraFour, this.hapChar)
    inherits(this.ExtraFive, this.hapChar)
    inherits(this.ExtraSix, this.hapChar)
    inherits(this.ExtraSeven, this.hapChar)
    inherits(this.ExtraEight, this.hapChar)
    inherits(this.ExtraNine, this.hapChar)
    inherits(this.ExtraTen, this.hapChar)
    inherits(this.ExtraEleven, this.hapChar)
    inherits(this.ExtraTwelve, this.hapChar)
    inherits(this.ExtraThirteen, this.hapChar)
    inherits(this.ExtraFourteen, this.hapChar)
    inherits(this.ExtraFifteen, this.hapChar)
    inherits(this.ExtraSixteen, this.hapChar)
    inherits(this.ExtraSeventeen, this.hapChar)
    inherits(this.ExtraEighteen, this.hapChar)
    inherits(this.ExtraNineteen, this.hapChar)
    inherits(this.ExtraTwenty, this.hapChar)
    inherits(this.ExtraTwentyOne, this.hapChar)
    inherits(this.ExtraTwentyTwo, this.hapChar)
    inherits(this.ExtraTwentyThree, this.hapChar)
    inherits(this.ExtraTwentyFour, this.hapChar)
    inherits(this.ExtraTwentyFive, this.hapChar)
    inherits(this.ExtraTwentySix, this.hapChar)
    inherits(this.ExtraTwentySeven, this.hapChar)
    inherits(this.ExtraTwentyEight, this.hapChar)
    inherits(this.ExtraTwentyNine, this.hapChar)
    inherits(this.ExtraThirty, this.hapChar)
    inherits(this.ExtraThirtyOne, this.hapChar)
    inherits(this.ExtraThirtyTwo, this.hapChar);
    inherits(this.ExtraThirtyThree, this.hapChar);
    inherits(this.ExtraThirtyFour, this.hapChar);
    inherits(this.ExtraThirtyFive, this.hapChar);
    inherits(this.ExtraThirtySix, this.hapChar);
    inherits(this.ExtraThirtySeven, this.hapChar);
    inherits(this.ExtraThirtyEight, this.hapChar);
    inherits(this.ExtraThirtyNine, this.hapChar);
    inherits(this.NightLight, this.hapChar)
    inherits(this.DisplayLight, this.hapChar)
    this.ColourMode.UUID = this.uuids.colourMode
    this.MusicMode.UUID = this.uuids.musicMode
    this.MusicModeTwo.UUID = this.uuids.musicModeTwo
    this.Scene.UUID = this.uuids.scene
    this.SceneTwo.UUID = this.uuids.sceneTwo
    this.SceneThree.UUID = this.uuids.sceneThree
    this.SceneFour.UUID = this.uuids.sceneFour
    this.DiyMode.UUID = this.uuids.diyMode
    this.DiyModeTwo.UUID = this.uuids.diyModeTwo
    this.DiyModeThree.UUID = this.uuids.diyModeThree
    this.DiyModeFour.UUID = this.uuids.diyModeFour
    this.Segmented.UUID = this.uuids.segmented
    this.SegmentedTwo.UUID = this.uuids.segmentedTwo
    this.SegmentedThree.UUID = this.uuids.segmentedThree
    this.SegmentedFour.UUID = this.uuids.segmentedFour
    this.VideoMode.UUID = this.uuids.videoMode
    this.VideoModeTwo.UUID = this.uuids.videoModeTwo
    this.Extra.UUID = this.uuids.extra
    this.ExtraTwo.UUID = this.uuids.extraTwo
    this.ExtraThree.UUID = this.uuids.extraThree
    this.ExtraFour.UUID = this.uuids.extraFour
    this.ExtraFive.UUID = this.uuids.extraFive
    this.ExtraSix.UUID = this.uuids.extraSix
    this.ExtraSeven.UUID = this.uuids.extraSeven
    this.ExtraEight.UUID = this.uuids.extraEight
    this.ExtraNine.UUID = this.uuids.extraNine
    this.ExtraTen.UUID = this.uuids.extraTen
    this.ExtraEleven.UUID = this.uuids.extraEleven
    this.ExtraTwelve.UUID = this.uuids.extraTwelve
    this.ExtraThirteen.UUID = this.uuids.extraThirteen
    this.ExtraFourteen.UUID = this.uuids.extraFourteen
    this.ExtraFifteen.UUID = this.uuids.extraFifteen
    this.ExtraSixteen.UUID = this.uuids.extraSixteen
    this.ExtraSeventeen.UUID = this.uuids.extraSeventeen
    this.ExtraEighteen.UUID = this.uuids.extraEighteen
    this.ExtraNineteen.UUID = this.uuids.extraNineteen
    this.ExtraTwenty.UUID = this.uuids.extraTwenty
    this.ExtraTwentyOne.UUID = this.uuids.extraTwentyOne
    this.ExtraTwentyTwo.UUID = this.uuids.extraTwentyTwo
    this.ExtraTwentyThree.UUID = this.uuids.extraTwentyThree
    this.ExtraTwentyFour.UUID = this.uuids.extraTwentyFour
    this.ExtraTwentyFive.UUID = this.uuids.extraTwentyFive
    this.ExtraTwentySix.UUID = this.uuids.extraTwentySix
    this.ExtraTwentySeven.UUID = this.uuids.extraTwentySeven
    this.ExtraTwentyEight.UUID = this.uuids.extraTwentyEight
    this.ExtraTwentyNine.UUID = this.uuids.extraTwentyNine
    this.ExtraThirty.UUID = this.uuids.extraThirty
    this.ExtraThirtyOne.UUID = this.uuids.extraThirtyOne
    this.ExtraThirtyTwo.UUID = this.uuids.extraThirtyTwo;
    this.ExtraThirtyThree.UUID = this.uuids.extraThirtyThree;
    this.ExtraThirtyFour.UUID = this.uuids.extraThirtyFour;
    this.ExtraThirtyFive.UUID = this.uuids.extraThirtyFive;
    this.ExtraThirtySix.UUID = this.uuids.extraThirtySix;
    this.ExtraThirtySeven.UUID = this.uuids.extraThirtySeven;
    this.ExtraThirtyEight.UUID = this.uuids.extraThirtyEight;
    this.ExtraThirtyNine.UUID = this.uuids.extraThirtyNine;
    this.NightLight.UUID = this.uuids.nightLight
    this.DisplayLight.UUID = this.uuids.displayLight
  }
}
