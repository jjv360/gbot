//
// Initialize the bot with actual drivers

console.log("Loading drivers...")

// var i2c = require('i2c');
// var address = 0x40;
// var wire = new i2c(address, {device: '/dev/i2c-1'});
//
// wire.scan(function(err, data) {
//   console.log(data)
// });

// Drivers
const UltrasonicDistanceSensor = require("./src/drivers/pi/sensors/UltrasonicDistanceSensor")
const Wheel = require("./src/drivers/pi/actuators/Wheel")

// Setup bot
const Bot = require("./src/index")
var bot = new Bot();
bot.registerDevice(new UltrasonicDistanceSensor(0, -1, Math.PI, 180, { serial: "/dev/ttyUSB0", id: 1 }))
// bot.registerDevice(new Wheel())

console.log("Starting bot...")
