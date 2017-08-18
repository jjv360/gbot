//
// Bot class - Represents the bot and all it's sensors, etc.

var Device = require("./Device");

class Bot {

	constructor() {

		// Properties
		this.devices = [];
		this.status = Bot.Status.Idle;

		// Start event loop
		this.timer = setInterval(this.loop.bind(this), 100);

	}

	/** Adds a hardware driver */
	registerDevice(device) {

		// Add device to array
		this.devices.push(device);

		// Notify device that it's been registered
		if (device.onRegister)
			device.onRegister(this);

	}

	/** Event loop - Checks devices and decides if it's time to change our activity */
	loop() {

		// Check current activity
		if (this.status == Bot.Status.Idle) {

			// Move forward!
			this.forward();

		} else if (this.status == Bot.Status.Forward) {

			// Check forward-facing sensors for obstructions
			this.checkObstruction();

		}

	}

	/** Start moving forward */
	forward() {

		// Check for obstruction first
		if (this.checkObstruction())
			return;

		// To move forward, power all wheels
		for (var device of this.devices) {
			if (device.type == Device.Type.Wheel) {
				device.setSpeed(1);
			}
		}

		// Set status
		this.status = Bot.Status.Forward;

	}

	/** Turn to the right */
	turnRight() {

		// To move forward, power all wheels
		for (var device of this.devices) {
			if (device.type == Device.Type.Wheel) {
				device.setSpeed(device.x > 0 ? 1 : -1);
			}
		}

		// Set status
		this.status = Bot.Status.Turning;

	}

	/** Checks the sensors for obstruction */
	checkObstruction() {

		// Go through all sensors
		for (var device of this.devices) {

			// Check type
			if (device.type != Device.Type.ObstructionSensor)
				continue;

			// Check if forward facing
			if (!device.isForwardFacing)
				continue;

			// Check if there's a close obstruction
			if (device.obstructionAt == -1 || device.obstructionAt > 20)
				continue;

			// We are obstructed! Start turning for a while
			this.turnRight();
			setTimeout(e => {
				this.forward();
			}, 1000 + 2000 * Math.random());
			return true;

		}

		// No obstruction
		return false;

	}

}

// Bot statuses
Bot.Status = {

	/** Not doing anything */
	Idle: "Idle",

	/** Moving forward, waiting for an obstruction */
	Forward: "Forward",

	/** Turning, can be interruped */
	Turning: "Turning",

}

// Expose classes
module.exports = Bot;
module.exports.Device = Device;
module.exports.Vector2 = require("./Vector2");
module.exports.Affine = require("affine").affine;