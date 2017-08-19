
const Serial = require("./src/drivers/pi/gateway/Serial")

// Write to serial
Serial.get("/dev/ttyUSB0").writeln(this.buffer);
