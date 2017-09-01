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
const LCD = require("./src/drivers/pi/actuators/LCD")

// Controllers
const RemoteControl = require("./src/controllers/RemoteControl")
const SmartControl = require("./src/controllers/SmartControl")

// Setup bot
const Bot = require("./src/index")
var bot = new Bot();

// Back sensor
bot.registerDevice(new UltrasonicDistanceSensor(0, -1, Math.PI, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 1 }))

// Front left sensor
bot.registerDevice(new UltrasonicDistanceSensor(-1, 1, 0, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 2 }))

// Front right sensor
bot.registerDevice(new UltrasonicDistanceSensor(1, 1, 0, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 3 }))

// Left side sensor
bot.registerDevice(new UltrasonicDistanceSensor(-1, 0, Math.PI/2, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 4 }))

// Right side sensor
bot.registerDevice(new UltrasonicDistanceSensor(1, 0, -Math.PI/2, { maxDistance: 1, serial: "/dev/ttyUSB0", id: 5 }))

// LCD screen
bot.registerDevice(new LCD({ serial: "/dev/ttyUSB0" }))

// Left wheel
bot.registerDevice(new Wheel(-1, 0, 0, { serial: "/dev/ttyUSB0", id: 1 }))

// Right wheel
bot.registerDevice(new Wheel(1, 0, 0, { serial: "/dev/ttyUSB0", id: 2 }))

// bot.registerDevice(new Wheel())

console.log("Starting bot...")

// Add initial controller
bot.controller = new RemoteControl()




// Setup web site
const ip = require('ip')
const express = require("express")
const app = express()

// Serve files from web folder
app.use(express.static("web"))

// Add support for WebSocket connections
require('express-ws')(app);

// On websocket connection...
app.ws('/', (ws, res) => {

	// Say hello
	ws.send("Hi")

	// Notify info every so often
	setInterval(function() {

		// Stop if not in smart mode
		if (!(bot.controller instanceof SmartControl))
			return

		// Send info
		ws.send("Nearest obstruction: " + bot.controller.forwardObstructionAt)

	}, 1000)

	// Listen for incoming messages
	ws.on("message", msg => {

		// Check what to do
		console.log("WS: " + msg)
		if (msg == "smart") {

			// Switch to smart mode
			console.log("Switching to Smart mode")
			ws.send("Switching to Smart mode")
			bot.controller = new SmartControl()

		} else if (msg == "remote") {

			// Switch to smart mode
			console.log("Switching to Remote Control mode")
			ws.send("Switching to Remote Control mode")
			bot.controller = new RemoteControl()

		} else {

			// Pass to remote control controller
			if (bot.controller && bot.controller.do)
				bot.controller.do(msg)

		}

	})

})

// Start listening
app.listen(process.env.PORT || 8081)
var addr = ip.address() + ":" + (process.env.PORT || 8081)
console.log("Web server listening on " + addr)
bot.log(addr)
