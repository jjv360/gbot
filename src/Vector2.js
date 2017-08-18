//
// 2D vector utilities

module.exports.add = require("vectors/add")(2);
module.exports.copy = require("vectors/copy")(2);
module.exports.cross = require("vectors/cross")(2);
module.exports.distance = require("vectors/dist")(2);
module.exports.divide = require("vectors/div")(2);

/** Calculates the angle from the first vector to the second, i radians */
module.exports.heading = require("vectors/heading")(2);

module.exports.limit = require("vectors/limit")(2);
module.exports.magnitude = require("vectors/mag")(2);
module.exports.multiply = require("vectors/mult")(2);
module.exports.normalize = require("vectors/normalize")(2);
module.exports.subtract = require("vectors/sub")(2);

/** Rotate the vector around the origin */
module.exports.rotate = function(v, radians) {
	return [
		v[0] * Math.cos(radians) - v[1] * Math.sin(radians),
		v[0] * Math.sin(radians) + v[1] * Math.cos(radians),
	]
}
