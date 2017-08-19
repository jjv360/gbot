
const Serial = require("./src/drivers/pi/gateway/Serial")

// Write to serial
Serial.get("/dev/ttyUSB0").writeln("WHEEL1 0");
Serial.get("/dev/ttyUSB0").writeln("WHEEL2 0");
