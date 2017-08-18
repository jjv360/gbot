//
// Initialize the bot with actual drivers

console.log("Loading drivers...")

// Drivers
const UltrasonicDistanceSensor = require("./src/drivers/pi/sensors/UltrasonicDistanceSensor")

// Setup bot
const Bot = require("./src/index")
var bot = new Bot();
bot.registerDevice(new UltrasonicDistanceSensor(0, -1, Math.PI, 180, { triggerPin: 16, echoPin: 18 }))

console.log("Starting bot...")
