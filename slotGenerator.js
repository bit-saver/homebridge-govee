import fs from 'fs';

const chunks = [];

const replaceAll = (original, root, words, digits) => {
    let result = original;
    const capFirst = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const capWords = (camel = false) => {
      return words.map((w, i) => (!camel || !!i) ? capFirst(w) : w).join('');
    }
    original = original
      .replaceAll('Extra Two', `${capFirst(root)} ${capWords(false)}`)
      .replaceAll('extratwo', `${root.toLowerCase()}${words.join('').toLowerCase()}`)
      .replaceAll('ExtraTwo', `${capFirst(root)}${capWords(false)}`)
      .replaceAll('extraTwo', `${root.toLowerCase()}${capWords(true)}`)
      .replaceAll('Extra 2', `${capFirst(root)} ${digits}`)
      .replaceAll('extra2', `${root.toLowerCase}${digits}`)
      .replaceAll('Extra2', `${capFirst(root)}${digits}`);
    return original;
};

/**
 * config.schema.json
 **/
let original = `
"extraTwo": {
    "title": "Extra 2",
    "type": "object",
    "properties": {
      "sceneCode": {
        "title": "Extra 2 (AWS): Scene Code",
        "type": "string",
        "description": "Enter a scene code from the logs to create a button named 'Extra 2' (in Eve app).",
        "condition": {
          "functionBody": "return (model.lightDevices && model.lightDevices[arrayIndices] && model.lightDevices[arrayIndices].deviceId && model.lightDevices[arrayIndices].deviceId.length === 23 && !['switch'].includes(model.lightDevices[arrayIndices].showAs) && !model.lightDevices[arrayIndices].ignoreDevice);"
        }
      },
      "bleCode": {
        "title": "Extra 2 (BLE): Scene Code",
        "type": "string",
        "description": "Can be (1) left blank, (2) used instead of, or (3) used along with the above AWS code. In the case of (3) please make sure both codes correspond to the same Govee mode.",
        "condition": {
          "functionBody": "return (model.lightDevices && model.lightDevices[arrayIndices] && model.lightDevices[arrayIndices].deviceId && model.lightDevices[arrayIndices].deviceId.length === 23 && !['switch'].includes(model.lightDevices[arrayIndices].showAs) && !model.lightDevices[arrayIndices].ignoreDevice);"
        }
      },
      "showAs": {
        "type": "string",
        "title": "Extra 2: Show As",
        "description": "Change this setting to Accessory Switch to show this as an extra switch in the Home app.",
        "oneOf": [
          {
            "title": "Eve Switch (Default)",
            "enum": [
              "default"
            ]
          },
          {
            "title": "Accessory Switch",
            "enum": [
              "switch"
            ]
          }
        ],
        "condition": {
          "functionBody": "return (model.lightDevices && model.lightDevices[arrayIndices] && model.lightDevices[arrayIndices].deviceId && model.lightDevices[arrayIndices].deviceId.length === 23 && !['switch'].includes(model.lightDevices[arrayIndices].showAs) && !model.lightDevices[arrayIndices].ignoreDevice && model.lightDevices[arrayIndices].extraTwo && (model.lightDevices[arrayIndices].extraTwo.sceneCode || model.lightDevices[arrayIndices].extraTwo.bleCode));"
        }
      }
    }
  },
`;

chunks.push(replaceAll(original, 'extra', ['Thirty', 'One'], 31));

/**
 * utils/constants.js
 */


/**
 * utils/customer-chars.js
 */
original = `
      extraTwo: 'E964F024-079E-48FF-8F27-9C2605A29F52',
    this.ExtraTwo = function ExtraTwo() {
      self.hapChar.call(this, 'Extra 2', self.uuids.extraTwo);
      this.setProps({
        format: self.hapChar.Formats.BOOL,
        perms: [self.hapChar.Perms.READ, self.hapChar.Perms.WRITE, self.hapChar.Perms.NOTIFY],
      });
      this.value = this.getDefaultValue();
    };
    inherits(this.ExtraTwo, this.hapChar);
    this.ExtraTwo.UUID = this.uuids.extraTwo;
}
`;

chunks.push(replaceAll(original, 'extra', ['Thirty', 'One'], 31));

/** 
 * light.js
 */

/**
 * platform.js
 */

fs.writeFileSync('new_slot.txt', chunks.join('\n\n'))