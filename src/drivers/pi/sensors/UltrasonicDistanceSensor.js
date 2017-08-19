//
// Measures distance from obstruction

const Device = require("../../../Device")
// const GPIO = require("../../pi/GPIO")
// const RPiGPIO = require("rpi-gpio")
// const usonic = require('mmm-usonic');
const Serial = require("../gateway/Serial")

module.exports = class UltrasonicDistanceSensor extends Device{

    constructor(x, y, angle, maxDistance, config) {
		super(x, y, angle);

        // Setup args
		this.type = Device.Type.ObstructionSensor;
		this.maxDistance = maxDistance;
		this.obstructionAt = -1;
        this.triggerPin = config.triggerPin
        this.echoPin = config.echoPin
        this.sendorID = config.id

        // Setup listener
        Serial.get(config.serial, this.onIncomingLine.bind(this))

        this.log("Loaded, trigger pin = " + this.triggerPin + ", echoPin = " + this.echoPin)

        // Constant ping
        setInterval(this.check.bind(this), 500)

	}

    onIncomingLine(txt) {
        console.log("Got line for " + this.sensorID + ": " + txt)
    }

    check() {

        // Wait until ready
        if (!this.sensor)
            return

        // Turn pin on and off
        this.distance = this.sensor()
        console.log("Distance: " + this.distance)

    }

}
