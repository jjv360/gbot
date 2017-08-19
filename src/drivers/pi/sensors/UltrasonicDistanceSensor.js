//
// Measures distance from obstruction

const Device = require("../../../Device")
// const GPIO = require("../../pi/GPIO")
// const RPiGPIO = require("rpi-gpio")
// const usonic = require('mmm-usonic');
const Serial = require("../gateway/Serial")

module.exports = class UltrasonicDistanceSensor extends Device {

    constructor(x, y, angle, config) {
		super(x, y, angle);

        // Setup args
		this.type = Device.Type.ObstructionSensor;
		this.maxDistance = config.maxDistance;
        this.triggerPin = config.triggerPin
        this.echoPin = config.echoPin
        this.sensorID = config.id

        /** Obstruction distance in meters */
		this.obstructionAt = 0;

        // Setup listener
        Serial.get(config.serial).addListener(this.onIncomingLine.bind(this))

        this.log("Loaded")

        // Constant ping
        // setInterval(this.check.bind(this), 200)

	}

    onIncomingLine(txt) {

        // Get components
        let comps = txt.split(" ")
        if (comps.length < 4)
            return

        // Check module
        if (comps[0] != "[UltrasonicSensor]")
            return

        // Check ID
        if (comps[1] != this.sensorID)
            return

        // Store distance in meters
        this.obstructionAt = Math.max(0, Math.min(this.maxDistance, parseFloat(comps[3]) / 100))
        // console.log(this.obstructionAt)

    }

    // check() {
    //
    //     // Log distance
    //     console.log("Distance in meters: " + this.distance)
    //
    // }

}
