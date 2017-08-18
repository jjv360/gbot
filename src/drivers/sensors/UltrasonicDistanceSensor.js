//
// Measures distance from obstruction

const Device = require("../../Device")

module.exports = class UltrasonicDistanceSensor extends Bot.Device{

    constructor(x, y, angle, maxDistance) {
		super(x, y, angle);
		this.type = Bot.Device.Type.ObstructionSensor;
		this.maxDistance = maxDistance;
		this.obstructionAt = -1;

        this.log("Loaded")

	}

}
