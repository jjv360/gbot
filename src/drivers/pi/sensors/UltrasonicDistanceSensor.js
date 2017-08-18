//
// Measures distance from obstruction

const Device = require("../../../Device")
// const GPIO = require("../../pi/GPIO")
// const RPiGPIO = require("rpi-gpio")
const usonic = require('r-pi-usonic');

module.exports = class UltrasonicDistanceSensor extends Device{

    constructor(x, y, angle, maxDistance, config) {
		super(x, y, angle);

        // Setup args
		this.type = Device.Type.ObstructionSensor;
		this.maxDistance = maxDistance;
		this.obstructionAt = -1;
        this.triggerPin = config.triggerPin
        this.echoPin = config.echoPin

        // Setup pins
        usonic.init(err => {
            if (err) console.log(err)
        })

        this.sensor = usonic.createSensor(this.echoPin, this.triggerPin);

        this.log("Loaded, trigger pin = " + this.triggerPin + ", echoPin = " + this.echoPin)

        // Constant ping
        setInterval(this.check.bind(this), 500)

	}

    check() {

        // Turn pin on and off
        this.distance = this.sensor()
        console.log("Distance: " + this.distance)

    }

}
