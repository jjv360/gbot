//
// Controls the bot based on inputs from to do("action") function

const Controller = require("./Controller")
const Device = require("../Device")

const WHEEL_POWER = 1

module.exports = class RemoteControl extends Controller {

	get name() {
		return "Remote Control"
	}

	// Perform remote control action
	do(action) {

		// Check action name
		if (action == "stop") {

			for (var device of this.bot.devices)
				if (device.type == Device.Type.Wheel)
					device.setSpeed(0)

		} else if (action == "forward") {

			for (var device of this.bot.devices) {
				if (device.type == Device.Type.Wheel) {
					device.setSpeed(WHEEL_POWER)
					console.log("Setting device " + device.ID + " to speed " + WHEEL_POWER)
				}
			}

		} else if (action == "backward") {

			for (var device of this.bot.devices)
				if (device.type == Device.Type.Wheel)
					device.setSpeed(-WHEEL_POWER)

		} else if (action == "left") {

			for (var device of this.bot.devices)
				if (device.type == Device.Type.Wheel)
					device.setSpeed(device.x > 0 ? WHEEL_POWER : -WHEEL_POWER)

		} else if (action == "right") {

			for (var device of this.bot.devices)
				if (device.type == Device.Type.Wheel)
					device.setSpeed(device.x < 0 ? WHEEL_POWER : -WHEEL_POWER)

		}

	}

}
