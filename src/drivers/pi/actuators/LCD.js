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
        this.buffer = "..."

        // Write to screen all the time
        setInterval(this.update.bind(this), 1000)

    }

    log(txt) {

        // Update buffer
        this.buffer = txt
        this.update()

    }

    /** Update the screen */
    update() {

        // Write to serial
        Serial.get(this.serial).writeln("LCD " + this.buffer);

    }

}
