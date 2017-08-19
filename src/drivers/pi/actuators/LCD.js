//
// The screen on the Pi

const Device = require("../../../Device")
const Serial = require("../gateway/Serial")

module.exports = class LCD extends Device {

    constructor(config) {
        super(0, 0, 0)

        // Store values
        this.serial = config.serial
		this.type = Device.Type.Log

    }

    log(txt) {

        Serial.get(this.serial).writeln("LCD " + txt);

    }

}