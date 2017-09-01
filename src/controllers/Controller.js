//
// Represents an abstract base class controller.

const Device = require("../Device")

module.exports = class Controller {

	get name() {
		return "Null Controller"
	}

	/** @private Start using this controller on the specified bot */
	start(bot) {

		// Store bot
		this.bot = bot

		// Log new controller name
		// this.bot.log("Using " + this.name)

	}

	/** @private Stop using this controller on our bot */
	stop() {

		// Check if stopped already
		if (!this.bot)
			return

		// Reset all actuators
		for (var device of this.bot.devices) {

			// Stop wheels
			if (device.type == Device.Type.Wheel)
				device.setSpeed(0);

		}

		// Remove bot
		this.bot = null

	}

}
