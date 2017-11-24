//
// The Smart movement controller

const Controller = require("./Controller")
const Device = require("../Device")

const WHEEL_POWER = 0.7
const WALL_DISTANCE = 0.4

class SmartControl extends Controller {

	constructor() {
		super()

		// Setup properties
		this.status = SmartControl.Status.Idle;

	}

	get name() {
		return "Smart Control"
	}

	/** Returns the nearest forward obstruction from the sensors */
	get forwardObstructionAt() {

		// Go through all sensors
		var obstructionAt = 99999
		for (var device of this.bot.devices) {

			// Check type
			if (device.type != Device.Type.ObstructionSensor)
				continue;

			// Check if forward facing
			if (!device.isForwardFacing)
				continue;

            // Ignore if problem with sensor
            if (device.obstructionAt <= 0)
                continue;

			// Check if there's a close obstruction
			console.log(device.obstructionAt)
			if (obstructionAt > device.obstructionAt)
				obstructionAt = device.obstructionAt

		}

		// No obstruction
		return obstructionAt

	}

	start(bot) {
		super.start(bot)

		// Start logic loop
		this.timer = setInterval(this.loop.bind(this), 100)

	}

	stop() {
		super.stop()

		// Stop logic loop
		clearInterval(this.timer)

	}

	/** Logic loop */
	loop() {

        // Log status
        this.log("Status: " + this.status + ", obstruction: " + this.forwardObstructionAt)

		// Check current state
		if (this.status == SmartControl.Status.Idle) {

            // We are IDLE
			// Check if there's a forward obstruction
			if (this.isForwardObstructed)
				return

			// No obstruction, go forward
			this.setForward()

		} else if (this.status == SmartControl.Status.Forward) {

            // We are going FORWARD
			// Check if there's no forward obstruction
			if (!this.isForwardObstructed)
				return

			// Turn to the right
            this.setTurn()

		} else if (this.status == SmartControl.Status.Turning) {

            // We are TURNING
			// Check if there's a forward obstruction
			if (this.isForwardObstructed)
				return

			// No more obstruction, go forward again
            this.setForward()

		}

	}

	setForward() {

		// Set state
		this.status = SmartControl.Status.Forward

		// Set motors
		for (var device of this.bot.devices)
			if (device.type == Device.Type.Wheel)
				device.setSpeed(WHEEL_POWER)

	}

	setStop() {

		// Set state
		this.status = SmartControl.Status.Idle

		// Set motors
		for (var device of this.bot.devices)
			if (device.type == Device.Type.Wheel)
				device.setSpeed(0)

	}

    /** Turn to the right */
	setTurn() {

		// Set state
		this.status = SmartControl.Status.Turning

		// Set motors
		for (var device of this.bot.devices)
			if (device.type == Device.Type.Wheel)
				device.setSpeed(device.x < 0 ? -1.0 : 1.0)

	}

	get isForwardObstructed() {
		return this.forwardObstructionAt < WALL_DISTANCE
	}

}

module.exports = SmartControl





// Bot statuses
SmartControl.Status = {

	/** Not doing anything */
	Idle: "Idle",

	/** Moving forward, waiting for an obstruction */
	Forward: "Forward",

	/** Turning, can be interruped */
	Turning: "Turning",

}
