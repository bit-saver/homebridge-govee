import {
  base64ToHex,
  getTwoItemPosition,
  hexToTwoItems,
  parseError,
} from '../utils/functions.js'
import platformLang from '../utils/lang-en.js'

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

    // Rotation speed to value in {1, 2, 3}
    this.speed2Value = speed => Math.min(Math.max(Number.parseInt(speed / 33, 10), 1), 3)

    // Speed codes
    this.value2Code = {
      1: 'MwUBAQAAAAAAAAAAAAAAAAAAADY=', // sleep
      2: 'MwUBAgAAAAAAAAAAAAAAAAAAADU=', // low
      3: 'MwUBAwAAAAAAAAAAAAAAAAAAADQ=', // high
    }

    // Lock codes
    this.lock2Code = {
      on: 'MxABAAAAAAAAAAAAAAAAAAAAACI=',
      off: 'MxAAAAAAAAAAAAAAAAAAAAAAACM=',
    }

    // Display codes
    this.display2Code = {
      on: 'MxYBAAAAAAAAAAAAAAAAAAAAACQ=',
      off: 'MxYAAAAAAAAAAAAAAAAAAAAAACU=',
    }

    // Add the purifier service if it doesn't already exist
    this.service = this.accessory.getService(this.hapServ.AirPurifier)
    || this.accessory.addService(this.hapServ.AirPurifier)

    // Add the set handler to the switch on/off characteristic
    this.service.getCharacteristic(this.hapChar.Active).onSet(async (value) => {
      await this.internalStateUpdate(value)
    })
    this.cacheState = this.service.getCharacteristic(this.hapChar.Active).value === 1 ? 'on' : 'off'

    // Add options to the purifier target state characteristic
    this.service
      .getCharacteristic(this.hapChar.TargetAirPurifierState)
      .updateValue(1)
      // .setProps({
      //   minValue: 1,
      //   maxValue: 1,
      //   validValues: [1],
      // })

    // Add the set handler to the fan rotation speed characteristic
    this.service
      .getCharacteristic(this.hapChar.RotationSpeed)
      .setProps({
        minStep: 25,
        validValues: [0, 33, 66, 99],
      })
      .onSet(async value => this.internalSpeedUpdate(value))
    this.cacheSpeed = this.service.getCharacteristic(this.hapChar.RotationSpeed).value

    // Add the set handler to the lock controls characteristic
    this.service.getCharacteristic(this.hapChar.LockPhysicalControls).onSet(async (value) => {
      await this.internalLockUpdate(value)
    })
    this.cacheLock = this.service.getCharacteristic(this.hapChar.LockPhysicalControls).value === 1 ? 'on' : 'off'

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

    // Add a switch service for Sleep
    this.service1 = this.accessory.getService('Sleep')
    if (!this.service1) {
      this.service1 = this.accessory.addService(this.hapServ.Switch, 'Sleep', 'sleep')
      this.service1.addCharacteristic(this.hapChar.ConfiguredName)
      this.service1.updateCharacteristic(this.hapChar.ConfiguredName, 'Sleep')
      this.service1.addCharacteristic(this.hapChar.ServiceLabelIndex)
      this.service1.updateCharacteristic(this.hapChar.ServiceLabelIndex, 1)
    }

    // Add a switch service for Low
    this.service2 = this.accessory.getService('Low')
    if (!this.service2) {
      this.service2 = this.accessory.addService(this.hapServ.Switch, 'Low', 'low')
      this.service2.addCharacteristic(this.hapChar.ConfiguredName)
      this.service2.updateCharacteristic(this.hapChar.ConfiguredName, 'Low')
      this.service2.addCharacteristic(this.hapChar.ServiceLabelIndex)
      this.service2.updateCharacteristic(this.hapChar.ServiceLabelIndex, 2)
    }

    // Add a switch service for High
    this.service3 = this.accessory.getService('High')
    if (!this.service3) {
      this.service3 = this.accessory.addService(this.hapServ.Switch, 'High', 'high')
      this.service3.addCharacteristic(this.hapChar.ConfiguredName)
      this.service3.updateCharacteristic(this.hapChar.ConfiguredName, 'High')
      this.service3.addCharacteristic(this.hapChar.ServiceLabelIndex)
      this.service3.updateCharacteristic(this.hapChar.ServiceLabelIndex, 3)
    }

    const speed = this.speed2Value(this.cacheSpeed)

    // Add the set handler to the Sleep switch if it exists
    if (this.service1) {
      this.service1.getCharacteristic(this.hapChar.On)
        .updateValue(speed === 1)
        .onSet(async value => this.internalSpeedUpdate(33, value))
    }
    // Add the set handler to the Low switch if it exists
    if (this.service2) {
      this.service2.getCharacteristic(this.hapChar.On)
        .updateValue(speed === 2)
        .onSet(async value => this.internalSpeedUpdate(66, value))
    }
    // Add the set handler to the High switch if it exists
    if (this.service3) {
      this.service3.getCharacteristic(this.hapChar.On)
        .updateValue(speed === 3)
        .onSet(async value => this.internalSpeedUpdate(99, value))
    }

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

      // Get the single Govee value {1, 2, ..., 8}
      const newValue = this.speed2Value(value)

      // Don't continue if the speed value won't have effect
      if (newValue * 33 === this.cacheSpeed) {
        return
      }

      // Get the scene code for this value
      const newCode = this.value2Code[newValue]

      if (newValue !== 1) {
        this.service1.updateCharacteristic(this.hapChar.On, false)
      } else {
        this.service1.updateCharacteristic(this.hapChar.On, true)
      }
      if (newValue !== 2) {
        this.service2.updateCharacteristic(this.hapChar.On, false)
      } else {
        this.service2.updateCharacteristic(this.hapChar.On, true)
      }
      if (newValue !== 3) {
        this.service3.updateCharacteristic(this.hapChar.On, false)
      } else {
        this.service3.updateCharacteristic(this.hapChar.On, true)
      }

      // Send the request to the platform sender function
      await this.platform.sendDeviceUpdate(this.accessory, {
        cmd: 'ptReal',
        value: newCode,
      })

      // Cache the new state and log if appropriate
      this.cacheSpeed = newValue * 33
      this.accessory.log(`${platformLang.curSpeed} [${this.cacheSpeed}%]`)
    } catch (err) {
      // Catch any errors during the process
      this.accessory.logWarn(`${platformLang.devNotUpdated} ${parseError(err)}`)

      // Throw a 'no response' error and set a timeout to revert this after 2 seconds
      setTimeout(() => {
        this.service.updateCharacteristic(this.hapChar.RotationSpeed, this.cacheSpeed)
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
        value: this.lock2Code[newValue],
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

      // Send the request to the platform sender function
      await this.platform.sendDeviceUpdate(this.accessory, {
        cmd: 'ptReal',
        value: this.display2Code[newValue],
      })

      // Cache the new state and log if appropriate
      this.cacheDisplay = newValue
      this.accessory.log(`${platformLang.curDisplay} [${newValue}]`)
    } catch (err) {
      // Catch any errors during the process
      this.accessory.logWarn(`${platformLang.devNotUpdated} ${parseError(err)}`)

      // Throw a 'no response' error and set a timeout to revert this after 2 seconds
      setTimeout(() => {
        this.service.updateCharacteristic(this.cusChar.DisplayLight, this.cacheLight === 'on')
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

    // Check for some other scene/mode change
    (params.commands || []).forEach((command) => {
      const hexString = base64ToHex(command)
      const hexParts = hexToTwoItems(hexString)

      // Return now if not a device query update code
      if (getTwoItemPosition(hexParts, 1) !== 'aa') {
        return
      }

      const deviceFunction = `${getTwoItemPosition(hexParts, 2)}${getTwoItemPosition(hexParts, 3)}`

      switch (deviceFunction) {
        case '0501': {
          // Manual speed
          const newSpeedRaw = getTwoItemPosition(hexParts, 4)
          if (newSpeedRaw !== this.cacheSpeedRaw) {
            this.cacheSpeedRaw = newSpeedRaw
            this.cacheSpeed = Number.parseInt(newSpeedRaw, 10) * 10
            this.service.updateCharacteristic(this.hapChar.RotationSpeed, this.cacheSpeed)
            this.accessory.log(`${platformLang.curSpeed} [${this.cacheSpeed}]`)
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
        default:
          this.accessory.logWarn(`${platformLang.newScene}: [${command}] [${hexString}]`)
          break
      }
    })
  }
}
