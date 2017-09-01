//
// Bot class - Represents the bot and all it's sensors, etc.

const Device = require("./Device")

class Bot {

	constructor() {

		// Properties
		this.devices = [];
		this._controller = null

	}

	get controller() {
		return this._controller
	}

	set controller(s) {

		// Disable old controller
		if (this._controller)
			this._controller.stop()

		// Start new controller
		this._controller = s
		if (this._controller && this._controller)
			this._controller.start(this)

	}

	/** Adds a hardware driver */
	registerDevice(device) {

		// Add device to array
		this.devices.push(device);

		// Notify device that it's been registered
		if (device.onRegister)
			device.onRegister(this);

	}

	log(txt) {

		// Log to console
		console.log("GBot: " + txt);

		// Log to log devices
		for (var device of this.devices)
			if (device.type == Device.Type.Log)
				device.log(txt);

	}

}

// Expose classes
module.exports = Bot;
module.exports.Device = Device;
module.exports.Vector2 = require("./Vector2");
module.exports.Affine = require("affine").affine;
module.exports.RemoteControl = require("./controllers/RemoteControl")
module.exports.SmartControl = require("./controllers/SmartControl")
