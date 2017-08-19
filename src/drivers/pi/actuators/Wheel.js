//
// Control a wheel

const Device = require("../../../Device")
const Serial = require("../gateway/Serial")

module.exports = class Wheel extends Device {

    constructor(x, y, angle, config) {
        super(x, y, angle)

        // Store values
        this.serial = config.serial
		this.type = Device.Type.Wheel
        this.wheelID = config.id
        this.buffer = ""

        // Write to wheel all the time
        setInterval(this.update.bind(this), 500)

    }

    setSpeed(val) {

        // Update buffer
        this.buffer = "" + Math.min(1, Math.max(-1, val || 0))
        this.update()

    }

    /** Update the screen */
    update() {

        // Ignore if no buffer
        if (!this.buffer)
            return

        // Write to serial
        Serial.get(this.serial).writeln("WHEEL" + this.wheelID + " " + this.buffer);

    }

}
