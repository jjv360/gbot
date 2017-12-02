#include "LineFollowSensor.h"
#include "USB.h"

LineFollowSensor::LineFollowSensor(int id, int pin) {

    // Store values
    _id = id;
    _pin = pin;
	_isOn = false;

    // Setup pins
    pinMode(pin, INPUT);

}

bool LineFollowSensor::isOn() {
    return digitalRead(_pin);
}

void LineFollowSensor::loop() {

}
