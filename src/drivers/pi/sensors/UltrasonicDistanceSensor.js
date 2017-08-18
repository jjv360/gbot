//
// Measures distance from obstruction

const Device = require("../../Device")
// const GPIO = require("../../pi/GPIO")
const RPiGPIO = require("rpi-gpio")
const sleep = require("sleep")

module.exports = class UltrasonicDistanceSensor extends Bot.Device{

    constructor(x, y, angle, maxDistance, config) {
		super(x, y, angle);

        // Setup args
		this.type = Bot.Device.Type.ObstructionSensor;
		this.maxDistance = maxDistance;
		this.obstructionAt = -1;
        this.triggerPin = config.triggerPin
        this.echoPin = config.echoPin

        // Setup pins
        RPiGPIO.setup(this.triggerPin, RPiGPIO.DIR_OUT)
        RPiGPIO.setup(this.echoPin, RPiGPIO.DIR_IN, RPiGPIO.EDGE_BOTH)
        RPiGPIO.on("change", this.onChange.bind(this))

        this.log("Loaded, trigger pin = " + this.triggerPin + ", echoPin = " + this.echoPin)

        // Constant ping
        setInterval(this.check.bind(this), 1000)

	}

    check() {

        // Turn pin on and off
        this.triggerStart = Date.now()
        RPiGPIO.write(this.triggerPin, true)
        sleep.usleep(10)
        RPiGPIO.write(this.triggerPin, false)

    }

    onChange(channel, value) {

        // Make sure channel is ours
        if (channel != this.echoPin)
            return

        // Check value
        if (value) {

            // Going high, start timer
            this.triggerStart = Date.now()

        } else {

            // Going low, calculate distance
            var delay = Date.now() - this.triggerStart
            console.log("Delay: " + delay)

        }

    }

}
