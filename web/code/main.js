//
// App entry point

var socket = null

document.addEventListener("DOMContentLoaded", function() {

	// Connect to web socket
	log("info", "Connecting...")
	var ws = new WebSocket("ws://" + location.host + "/")
	ws.onerror = function(err) {
		log("error", err.message || err || "WebSocket error")
	}
	ws.onclose = function() {
		socket = null
		log("error", "WebSocket closed")
	}
	ws.onopen = function() {
		socket = ws
		log("success", "WebSocket connected")
	}
	ws.onmessage = function(msg) {
		log("info", "Received: " + msg.data)
	}

	// Add action handlers for button
	document.getElementById("forward").addEventListener("mousedown", send.bind(null, "forward"))
	// document.getElementById("forward").addEventListener("mouseup", send.bind(null, "stop"))
	document.getElementById("forward").addEventListener("touchstart", send.bind(null, "forward"))
	// document.getElementById("forward").addEventListener("touchend", send.bind(null, "stop"))
	document.getElementById("left").addEventListener("mousedown", send.bind(null, "left"))
	// document.getElementById("left").addEventListener("mouseup", send.bind(null, "stop"))
	document.getElementById("left").addEventListener("touchstart", send.bind(null, "left"))
	// document.getElementById("left").addEventListener("touchend", send.bind(null, "stop"))
	document.getElementById("right").addEventListener("mousedown", send.bind(null, "right"))
	// document.getElementById("right").addEventListener("mouseup", send.bind(null, "stop"))
	document.getElementById("right").addEventListener("touchstart", send.bind(null, "right"))
	// document.getElementById("right").addEventListener("touchend", send.bind(null, "stop"))
	document.getElementById("backward").addEventListener("mousedown", send.bind(null, "backward"))
	// document.getElementById("backward").addEventListener("mouseup", send.bind(null, "stop"))
	document.getElementById("backward").addEventListener("touchstart", send.bind(null, "backward"))
	// document.getElementById("backward").addEventListener("touchend", send.bind(null, "stop"))
	document.getElementById("smart").addEventListener("mousedown", send.bind(null, "smart"))
	// document.getElementById("backward").addEventListener("mouseup", send.bind(null, "stop"))
	document.getElementById("smart").addEventListener("touchstart", send.bind(null, "smart"))
	// document.getElementById("backward").addEventListener("touchend", send.bind(null, "stop"))
	document.getElementById("remote").addEventListener("mousedown", send.bind(null, "remote"))
	// document.getElementById("backward").addEventListener("mouseup", send.bind(null, "stop"))
	document.getElementById("remote").addEventListener("touchstart", send.bind(null, "remote"))
	// document.getElementById("backward").addEventListener("touchend", send.bind(null, "stop"))
	window.addEventListener("touchend", send.bind(null, "stop"))
	window.addEventListener("mouseup", send.bind(null, "stop"))

})

function send(msg, e) {
	if (e) e.preventDefault()
	if (!socket) return
	log("info", "Sending: " + msg)
	socket.send(msg)
}

function log(type, txt) {

	// Create log entry
	var div = document.createElement("div")
	div.className = type
	div.innerText = txt
	document.getElementById("log").insertBefore(div, document.getElementById("log").firstChild)

}
