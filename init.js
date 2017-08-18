//
// Initialize the bot with actual drivers

console.log("Loading drivers...")

// Drivers
const UltrasonicDistanceSensor = require("./drivers/sensors/UltrasonicDistanceSensor")

var bot = new Bot();
bot.registerDevice(new UltrasonicDistanceSensor(0, -1, Math.PI, 180))

console.log("Starting bot...")
