//
// A hardware device

class Device {

	constructor(x, y, angle) {

		// Properties
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.bot = null;
		this.type = Bot.Device.Type.Unknown;

	}

	onRegister(bot) {
		this.bot = bot;
	}

	/** Check if forward-facing */
	get isForwardFacing() {
		return Math.abs(this.angle) < Math.PI/2;
	}

}

// DeviceType enum
Device.Type = {
	Wheel: "wheel",
	ObstructionSensor: "obstruction-sensor",
	Unknown: "unknown"
}

module.exports = Device;
