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

// Back sensor
bot.registerDevice(new UltrasonicDistanceSensor(0, -1, Math.PI, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 1 }))

// Front left sensor
bot.registerDevice(new UltrasonicDistanceSensor(-1, 1, Math.PI, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 2 }))

// Front right sensor
bot.registerDevice(new UltrasonicDistanceSensor(1, 1, Math.PI, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 3 }))

// Left side sensor
bot.registerDevice(new UltrasonicDistanceSensor(-1, 0, -Math.PI/2, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 4 }))

// Right side sensor
bot.registerDevice(new UltrasonicDistanceSensor(1, 0, Math.PI/2, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 5 }))

// LCD screen
bot.registerDevice(new LCD({ serial: "/dev/ttyUSB0" }))

// bot.registerDevice(new Wheel())

console.log("Starting bot...")
