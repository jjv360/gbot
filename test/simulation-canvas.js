//
// Create the simulation environment

document.addEventListener("DOMContentLoaded", function() {

	// Create cimulation environment
	var env = new SimulationEnvironment(document.getElementById("simulation-canvas"));

});

var FloorColors = [ "#500", "#050", "#005", "#055", "#550", "#555" ]

class SimulationEnvironment {

	constructor(canvas) {

		// Properties
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.lastFrame = Date.now();
		this.floorSquares = [];
		this.floorSquareSize = 30;

		// Create bot
		console.log(Bot.Affine);
		this.bot = new Bot();
		this.bot.x = 200;
		this.bot.y = 200;
		this.bot.rotation = 0;
		this.bot.walls = [];

		// Add wheels
		this.bot.registerDevice(new Wheel(-0.8, 0.8, 0));
		this.bot.registerDevice(new Wheel(0.8, 0.8, 0));
		this.bot.registerDevice(new Wheel(-0.8, -0.8, 0));
		this.bot.registerDevice(new Wheel(0.8, -0.8, 0));

		// Add sensors
		this.bot.registerDevice(new ObstructionSensor(0, -1, Math.PI, 180));
		// this.bot.registerDevice(new ObstructionSensor(0, 1, 0, 180));
		// this.bot.registerDevice(new ObstructionSensor(1, 1, -Math.PI/4, 180));
		// this.bot.registerDevice(new ObstructionSensor(-1, 1, Math.PI/4, 180));

		// Add handlers
		window.addEventListener("resize", this.onResize.bind(this));
		this.onResize();

		// Start draw loop
		this.bDraw = this.draw.bind(this);
		this.draw();

	}

	onResize() {

		// Set canvas content size
		var size = this.canvas.getBoundingClientRect();
		var pixelRatio = 1;//window.devicePixelRatio || 1;
		this.canvas.width = size.width * pixelRatio;
		this.canvas.height = size.height * pixelRatio;

		// Reload walls
		this.bot.walls = [];
		this.bot.walls.push([0, 0, size.width, 0]);
		this.bot.walls.push([0, 0, 0, size.height]);
		this.bot.walls.push([size.width, 0, size.width, size.height]);
		this.bot.walls.push([0, size.height, size.width, size.height]);

	}

	/** Mark the area of floor as clean */
	markClean(x, y) {

		// Round it
		x = Math.floor(x / this.floorSquareSize) * this.floorSquareSize;
		y = Math.floor(y / this.floorSquareSize) * this.floorSquareSize;

		// Ignore if same as last square
		if (x == this.lastCleanX && y == this.lastCleanY) return;
		this.lastCleanX = x;
		this.lastCleanY = y;

		// See if done already
		for (var sq of this.floorSquares) {
			if (sq.x == x && sq.y == y) {
				sq.count += 1;
				return;
			}
		}

		// Add clean square
		this.floorSquares.push({
			x: x,
			y: y,
			count: 1
		});

	}

	draw() {

		// Do again
		requestAnimationFrame(this.bDraw);

		// Calculate delta
		var delta = Date.now() - this.lastFrame;
		this.lastFrame = Date.now();

		// Apply reality - Change environment based on actuators
		for (var device of this.bot.devices)
			device.apply(delta);

		// Clear screen
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Mark this square as seen
		this.markClean(this.bot.x, this.bot.y);

		// Draw areas where the bot has been before
		for (var sq of this.floorSquares) {
			this.ctx.fillStyle = FloorColors[sq.count % FloorColors.length];
			this.ctx.fillRect(sq.x, sq.y, this.floorSquareSize, this.floorSquareSize);
		}

		// Rotate context to bot's direction and position
		this.ctx.translate(this.bot.x, this.bot.y);
		this.ctx.rotate(this.bot.rotation);

		// Draw bot outline
		this.ctx.strokeStyle = "#FFF";
		this.ctx.strokeRect(-16, -16, 32, 32);

		// Draw hardware
		for (var device of this.bot.devices)
			device.draw(this.ctx);

		// Draw bot info
		this.ctx.fillStyle = "#FFF";
		this.ctx.font = "10px Arial";
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.fillText("Status: " + this.bot.status, 10, 20 + 18 * 0);

		// Draw device info
		for (var i = 0 ; i < this.bot.devices.length ; i++)
			this.ctx.fillText(i + " " + this.bot.devices[i].type + ": " + this.bot.devices[i].status, 10, 20 + 18 * (i+1));

	}

}

class SimulatedDevice extends Bot.Device {

	draw(ctx) {

		// Rotate context to bot's direction and position
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(this.bot.x, this.bot.y);
		ctx.rotate(this.bot.rotation);

		// Center on device position
		ctx.translate(-this.x * 16, -this.y * 16);

		// Rotate device's angle
		ctx.rotate(this.angle);

	}

	/** @abstract Used by subclasses to "apply" the actuator device to the simulation environment */
	apply(delta) {

	}

}

class Wheel extends SimulatedDevice {

	constructor(x, y, angle) {
		super(x, y, angle);
		this.type = Bot.Device.Type.Wheel;
		this.speed = 0;
	}

	get status() {
		return this.speed == 0 ? "None" : this.speed < 0 ? "Backward " + Math.abs(this.speed) : "Forward " + this.speed;
	}

	draw(ctx) {
		super.draw(ctx);

		// Draw wheel
		ctx.fillStyle = this.speed < 0 ? "#A66" : this.speed > 0 ? "#6A6" : "#666";
		ctx.fillRect(-2, -3, 4, 6);

	}

	apply(delta) {

		// TODO: Rotate based on wheel position as well
		// Calculate current rotation vector
		var vRot = Bot.Vector2.rotate([0, -1], this.bot.rotation);

		// Apply movement based on rotation vector
		this.bot.x += vRot[0] * delta / 100 * this.speed;
		this.bot.y += vRot[1] * delta / 100 * this.speed;

		// Apply rotation
		this.bot.rotation += this.speed * this.x * delta * 0.0001;

	}

	setSpeed(s) {
		this.speed = s;
	}

}

class ObstructionSensor extends SimulatedDevice {

	constructor(x, y, angle, maxDistance) {
		super(x, y, angle);
		this.type = Bot.Device.Type.ObstructionSensor;
		this.maxDistance = maxDistance;
		this.obstructionAt = -1;
	}

	get status() {
		return this.obstructionAt == -1 ? "No obstruction" : "Obstruction at " + this.obstructionAt.toFixed(0);
	}

	draw(ctx) {
		super.draw(ctx);

		// Clear obstruction reading
		this.obstructionAt = -1;

		// Draw obstruction sensor
		ctx.strokeStyle = "#222";

		// Draw lines
		var offsetRange = 100;
		for (var offsetX = -offsetRange/2 ; offsetX < offsetRange/2 ; offsetX += 10) {

			// Draw sensor line
			ctx.beginPath();
			ctx.moveTo(offsetX * 0.1, -1);
			ctx.lineTo(offsetX, -this.maxDistance);
			ctx.stroke();

		}

		// Reset transform
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = "#F00";

		// Calculate intersections
		for (var offsetX = -offsetRange/2 ; offsetX < offsetRange/2 ; offsetX += 10) {

			// Calculate X/Y of line segment
			var affine = new Bot.Affine.scaling(1, 1);
			affine.translate(this.bot.x, this.bot.y);
			affine.rotate(this.bot.rotation);
			affine.translate(-this.x * 16, -this.y * 16);
			affine.rotate(this.angle);
			var lineStart = affine.copy();
			lineStart.translate(offsetX * 0.1, -1);
			var lineEnd = affine.copy();
			lineEnd.translate(offsetX, -this.maxDistance);
			var segment = [lineStart.getXCenter(), lineStart.getYCenter(), lineEnd.getXCenter(), lineEnd.getYCenter()];

			// Check if intersects with walls
			for (var wall of this.bot.walls) {

				// Check for intersection
				var p = segseg(wall[0], wall[1], wall[2], wall[3], segment[0], segment[1], segment[2], segment[3])
				if (!p || p === true)
					continue;

				// Draw red dot
				ctx.fillRect(p[0] - 2, p[1] - 2, 4, 4);

				// Store closest distance
				var dist = Bot.Vector2.distance([segment[0], segment[1]], [p[0], p[1]]);
				if (this.obstructionAt == -1 || this.obstructionAt > dist)
					this.obstructionAt = dist;

			}

		}

	}

}
