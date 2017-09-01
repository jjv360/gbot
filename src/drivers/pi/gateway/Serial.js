//
// Read and write data to/from the serial ports

const fs = require('fs')

var openedPorts = {}


module.exports = class Serial {

    constructor(filePath) {

        // Create vars
        this.listeners = []

        // Open file
        this.file = filePath
        this.fileOut = fs.createWriteStream(filePath)
		this.fileIn = fs.createReadStream(filePath)
        var lineReader = require('readline').createInterface({
            input: this.fileIn
        });

		// Catch errors
		this.fileOut.on('error', function(err) {
		  console.log("ERROR: " + err);
		});
		this.fileIn.on('error', function(err) {
		  console.log("ERROR: " + err);
		});

        // Add line listener
        lineReader.on('line', line => {

            // Notify listeners
            this.listeners.forEach(cb => cb(line))

        });

    }

    /** Open a serial oprt or get an already opened one */
    static get(fileName) {

        // Check if exists already
        var port = openedPorts[fileName]
        if (port)
            return port

        // Create it
        port = new Serial(fileName)
        openedPorts[fileName] = port
        return port

    }

    /** Add an input listener */
    addListener(cb) {
        this.listeners.push(cb)
    }

    /** Write a line of text to the port */
    writeln(txt) {

        this.fileOut.write(txt + "\n")

    }

}
