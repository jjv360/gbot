//
// The Smart movement controller

const Controller = require("./Controller")
const Device = require("../Device")

const WHEEL_POWER = 1
const WALL_DISTANCE = 0.5

class SmartControl extends Controller {

	constructor() {
		super()

		// Setup properties
		this.status = SmartControl.Status.Idle;

	}

	get name() {
		return "Smart Control"
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

		// Check current state
		if (this.status == SmartControl.Status.Idle) {

			// Check if there's a forward obstruction
			if (this.hasForwardObstruction())
				return

			// No obstruction, go forward
			this.setForward()

		} else if (this.status == SmartControl.Status.Forward) {

			// Check if there's no forward obstruction
			if (!this.hasForwardObstruction())
				return

			// Stop and wait
			this.setStop()

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

	hasForwardObstruction() {

		// Go through all sensors
		for (var device of this.bot.devices) {

			// Check type
			if (device.type != Device.Type.ObstructionSensor)
				continue;

			// Check if forward facing
			if (!device.isForwardFacing)
				continue;

			// Check if there's a close obstruction
			console.log(device.obstructionAt)
			if (device.obstructionAt == -1 || device.obstructionAt > WALL_DISTANCE)
				continue;

			// We are obstructed! Start turning for a while
			return true;

		}

		// No obstruction
		return false;

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
