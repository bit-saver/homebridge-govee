import {
  base64ToHex,
  getTwoItemPosition,
  hexToBase64,
  hexToTwoItems,
  parseError,
  statusToActionCode,
} from '../utils/functions.js'
import platformLang from '../utils/lang-en.js'

/*
  H7123
  {
    "mode": {
      "options": [
        {
          "name": "Low",
          "value": 1
        },
        {
          "name": "Medium",
          "value": 2
        },
        {
          "name": "High",
          "value": 3
        },
        {
          "name": "Auto mode",
          "value": 4
        },
        {
          "name": "Sleep mode",
          "value": 5
        }
      ]
    }
  }
 */

export default class {
  constructor(platform, accessory) {
    // Set up variables from the platform
    this.cusChar = platform.cusChar
    this.hapChar = platform.api.hap.Characteristic
    this.hapErr = platform.api.hap.HapStatusError
    this.hapServ = platform.api.hap.Service
    this.platform = platform

    // Set up variables from the accessory
    this.accessory = accessory

    // Speed codes
    this.value2Code = {
      1: 'OgUFAAAAAAAAAAAAAAAAAAAAADo=', // sleep
      2: 'OgUBAQAAAAAAAAAAAAAAAAAAAD8=', // low
      3: 'OgUBAgAAAAAAAAAAAAAAAAAAADw=', // med
      4: 'OgUBAwAAAAAAAAAAAAAAAAAAAD0=', // high
      5: 'OgUDAAAAAAAAAAAAAAAAAAAAADw=', // auto
    }

    this.value2Label = {
      0: 'off',
      1: 'sleep',
      2: 'low',
      3: 'medium',
      4: 'high',
      5: 'auto',
    }

    this.airValue2Label = {
      1: 'excellent',
      2: 'good',
      3: 'moderate',
      4: 'poor',
    }

    // Add the purifier service if it doesn't already exist
    this.service = this.accessory.getService(this.hapServ.AirPurifier)
    || this.accessory.addService(this.hapServ.AirPurifier)

    // Add the air quality service if it doesn't already exist
    this.airService = this.accessory.getService(this.hapServ.AirQualitySensor)
    || this.accessory.addService(this.hapServ.AirQualitySensor)

    if (this.airService.testCharacteristic(this.hapChar.PM2_5Density)) {
      this.airService.removeCharacteristic(this.airService.getCharacteristic(this.hapChar.PM2_5Density))
    }

    this.cacheAir = this.airService.getCharacteristic(this.hapChar.AirQuality).value

    // Add the set handler to the switch on/off characteristic
    this.service.getCharacteristic(this.hapChar.Active).onSet(async (value) => {
      await this.internalStateUpdate(value)
    })
    this.cacheState = this.service.getCharacteristic(this.hapChar.Active).value === 1 ? 'on' : 'off'

    // Add options to the purifier target state characteristic
    this.service
      .getCharacteristic(this.hapChar.TargetAirPurifierState)
      .updateValue(1)
      .setProps({
        minValue: 1,
        maxValue: 1,
        validValues: [1],
      })

    // Add the set handler to the fan rotation speed characteristic
    this.service
      .getCharacteristic(this.hapChar.RotationSpeed)
      .setProps({
        minStep: 20,
        validValues: [0, 20, 40, 60, 80, 100],
      })
      .onSet(async value => this.internalSpeedUpdate(value))
    this.cacheMode = this.service.getCharacteristic(this.hapChar.RotationSpeed).value / 20

    // Add the set handler to the lock controls characteristic
    this.service.getCharacteristic(this.hapChar.LockPhysicalControls).onSet(async (value) => {
      await this.internalLockUpdate(value)
    })
    this.cacheLock = this.service.getCharacteristic(this.hapChar.LockPhysicalControls).value === 0 ? 'off' : 'on'

    // Add night light Eve characteristic if it doesn't exist already
    if (!this.service.testCharacteristic(this.cusChar.NightLight)) {
      this.service.addCharacteristic(this.cusChar.NightLight)
    }

    // Add display light Eve characteristic if it doesn't exist already
    if (!this.service.testCharacteristic(this.cusChar.DisplayLight)) {
      this.service.addCharacteristic(this.cusChar.DisplayLight)
    }

    // Add the set handler to the custom display light characteristic
    this.service.getCharacteristic(this.cusChar.DisplayLight).onSet(async (value) => {
      await this.internalDisplayLightUpdate(value)
    })
    this.cacheDisplay = this.service.getCharacteristic(this.cusChar.DisplayLight).value
      ? 'on'
      : 'off'

    // Output the customised options to the log
    const opts = JSON.stringify({})
    platform.log('[%s] %s %s.', accessory.displayName, platformLang.devInitOpts, opts)
  }

  async internalStateUpdate(value) {
    try {
      const newValue = value === 1 ? 'on' : 'off'

      // Don't continue if the new value is the same as before
      if (this.cacheState === newValue) {
        return
      }

      // Send the request to the platform sender function
      await this.platform.sendDeviceUpdate(this.accessory, {
        cmd: 'statePuri',
        value: value ? 1 : 0,
      })

      // Update the current state characteristic
      this.service.updateCharacteristic(this.hapChar.CurrentAirPurifierState, value === 1 ? 2 : 0)

      // Cache the new state and log if appropriate
      this.cacheState = newValue
      this.accessory.log(`${platformLang.curState} [${newValue}]`)
    } catch (err) {
      // Catch any errors during the process
      this.accessory.logWarn(`${platformLang.devNotUpdated} ${parseError(err)}`)

      // Throw a 'no response' error and set a timeout to revert this after 2 seconds
      setTimeout(() => {
        this.service.updateCharacteristic(this.hapChar.Active, this.cacheState === 'on' ? 1 : 0)
      }, 2000)
      throw new this.hapErr(-70402)
    }
  }

  async internalSpeedUpdate(value) {
    try {
      // Don't continue if the speed is 0
      if (value === 0) {
        return
      }

      // Get the single Govee value {1, 2, 3, 4}
      const newValueKey = value / 20

      // Don't continue if the speed value won't have effect
      if (!newValueKey || newValueKey === this.cacheMode) {
        return
      }

      // Send the request to the platform sender function
      await this.platform.sendDeviceUpdate(this.accessory, {
        cmd: 'ptReal',
        value: this.value2Code[newValueKey],
      })

      // Cache the new state and log if appropriate
      this.cacheMode = newValueKey
      this.accessory.log(`${platformLang.curMode} [${this.value2Label[this.cacheMode]}]`)
    } catch (err) {
      // Catch any errors during the process
      this.accessory.logWarn(`${platformLang.devNotUpdated} ${parseError(err)}`)

      // Throw a 'no response' error and set a timeout to revert this after 2 seconds
      setTimeout(() => {
        this.service.updateCharacteristic(this.hapChar.RotationSpeed, this.cacheMode * 20)
      }, 2000)
      throw new this.hapErr(-70402)
    }
  }

  async internalLockUpdate(value) {
    try {
      const newValue = value === 1 ? 'on' : 'off'

      // Don't continue if the new value is the same as before
      if (this.cacheLock === newValue) {
        return
      }

      // Send the request to the platform sender function
      await this.platform.sendDeviceUpdate(this.accessory, {
        cmd: 'ptReal',
        value: value ? 'MxABAAAAAAAAAAAAAAAAAAAAACI=' : 'MxAAAAAAAAAAAAAAAAAAAAAAACM=',
      })

      // Cache the new state and log if appropriate
      this.cacheLock = newValue
      this.accessory.log(`${platformLang.curLock} [${newValue}]`)
    } catch (err) {
      // Catch any errors during the process
      this.accessory.logWarn(`${platformLang.devNotUpdated} ${parseError(err)}`)

      // Throw a 'no response' error and set a timeout to revert this after 2 seconds
      setTimeout(() => {
        this.service.updateCharacteristic(
          this.hapChar.LockPhysicalControls,
          this.cacheLock === 'on' ? 1 : 0,
        )
      }, 2000)
      throw new this.hapErr(-70402)
    }
  }

  async internalDisplayLightUpdate(value) {
    try {
      const newValue = value ? 'on' : 'off'

      // Don't continue if the new value is the same as before
      if (this.cacheDisplay === newValue) {
        return
      }

      // Generate the code to send
      let codeToSend
      if (value) {
        codeToSend = this.accessory.context.cacheDisplayCode
          ? hexToBase64(statusToActionCode(this.accessory.context.cacheDisplayCode))
          : 'MxYBAAAAAAAAAAAAAAAAAAAAACQ='
      } else {
        codeToSend = 'MxYAAAAAAAAAAAAAAAAAAAAAACU='
      }

      // Send the request to the platform sender function
      await this.platform.sendDeviceUpdate(this.accessory, {
        cmd: 'ptReal',
        value: codeToSend,
      })

      // Cache the new state and log if appropriate
      this.cacheDisplay = newValue
      this.accessory.log(`${platformLang.curDisplay} [${newValue}]`)
    } catch (err) {
      // Catch any errors during the process
      this.accessory.logWarn(`${platformLang.devNotUpdated} ${parseError(err)}`)

      // Throw a 'no response' error and set a timeout to revert this after 2 seconds
      setTimeout(() => {
        this.service.updateCharacteristic(this.cusChar.DisplayLight, this.cacheDisplay === 'on')
      }, 2000)
      throw new this.hapErr(-70402)
    }
  }

  externalUpdate(params) {
    // Check for an ON/OFF change
    if (params.state && params.state !== this.cacheState) {
      this.cacheState = params.state
      this.service.updateCharacteristic(this.hapChar.Active, this.cacheState === 'on')
      this.service.updateCharacteristic(this.hapChar.CurrentAirPurifierState, this.cacheState === 'on' ? 2 : 0)

      // Log the change
      this.accessory.log(`${platformLang.curState} [${this.cacheState}]`)
    }

    (params.commands || []).forEach((command) => {
      const hexString = base64ToHex(command)
      const hexParts = hexToTwoItems(hexString)

      const deviceFunction = `${getTwoItemPosition(hexParts, 1)}${getTwoItemPosition(hexParts, 2)}`

      switch (deviceFunction) {
        case 'aa05': // speed
        case '3a05': { // speed
          const newSpeedCode = `${getTwoItemPosition(hexParts, 3)}${getTwoItemPosition(hexParts, 4)}`

          // Different behaviour for custom speed
          if (newSpeedCode === '0202') {
            this.accessory.log(`${platformLang.curMode} [custom]`)
            return
          }

          let newMode

          switch (newSpeedCode) {
            case '0500': {
              // Sleep
              newMode = 1
              break
            }
            case '0101': {
              // Low
              newMode = 2
              break
            }
            case '0102': {
              // Medium
              newMode = 3
              break
            }
            case '0103': {
              // High
              newMode = 4
              break
            }
            case '0300': {
              // Auto
              newMode = 5
              break
            }
          }

          if (newMode && newMode !== this.cacheMode) {
            this.cacheMode = newMode
            this.service.updateCharacteristic(this.hapChar.RotationSpeed, this.cacheMode * 20)
            this.accessory.log(`${platformLang.curMode} [${this.value2Label[this.cacheMode]}]`)
          }
          break
        }
        case 'aa10': { // lock
          const newLock = getTwoItemPosition(hexParts, 3) === '01' ? 'on' : 'off'
          if (newLock !== this.cacheLock) {
            this.cacheLock = newLock
            this.service.updateCharacteristic(this.hapChar.LockPhysicalControls, this.cacheLock === 'on' ? 1 : 0)
            this.accessory.log(`${platformLang.curLock} [${this.cacheLock}]`)
          }
          break
        }
        case 'aa16': { // display light
          const newDisplay = getTwoItemPosition(hexParts, 3) === '01' ? 'on' : 'off'
          if (newDisplay === 'on') {
            this.accessory.context.cacheDisplayCode = hexString
          }
          if (newDisplay !== this.cacheDisplay) {
            this.cacheDisplay = newDisplay
            this.service.updateCharacteristic(this.cusChar.DisplayLight, this.cacheDisplay === 'on')

            // Log the change
            this.accessory.log(`${platformLang.curDisplay} [${this.cacheDisplay}]`)
          }
          break
        }
        case 'aa19': {
          // Check air quality reading (i.e. 1=green, 2=blue, 3=yellow, 4=red)
          // Cache will be in {1, 2, 3, 5} which relates to Govee {1, 2, 3, 4}
          let newQual = Number.parseInt(getTwoItemPosition(hexParts, 5), 10)
          if (newQual === 4) {
            newQual = 5
          }

          if (newQual !== this.cacheAir) {
            this.airService.updateCharacteristic(this.hapChar.AirQuality, newQual)
            this.accessory.log(`${platformLang.curAirQual} [${this.airValue2Label[newQual]}]`)
          }
          break
        }
        case 'aa11': // timer
        case 'aa13': // scheduling
        case '3310': // lock (same command for on and off)
        case '3311': // timer
        case '3313': // scheduling
        case '3316': { // display light
          break
        }
        default:
          this.accessory.logWarn(`${platformLang.newScene}: [${command}] [${hexString}]`)
          break
      }
    })
  }
}

// GOOD
// [28/12/2022, 00:44:48] [Govee] [Pet Air Purifier] new scene code: [qhkAKQJdAAAAAAAAAAAAAAAAAMU=] [aa 19 00 29 02 5d 00000000000000000000000000c5].

// EXC
// [28/12/2022, 01:12:05] [Govee] [Pet Air Purifier] new scene code: [qhkAHQFdAAAAAAAAAAAAAAAAAPI=] [aa 19 00 1d 01 5d 00000000000000000000000000f2].
