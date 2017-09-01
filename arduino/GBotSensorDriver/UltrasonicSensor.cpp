#include "UltrasonicSensor.h"
#include "USB.h"

UltrasonicSensor::UltrasonicSensor(int id, int triggerPin, int echoPin) {

    // Store values
    _id = id;
    _triggerPin = triggerPin;
    _echoPin = echoPin;
	_lastPing = 0;

    // Setup pins
    pinMode(triggerPin, OUTPUT);
    pinMode(echoPin, INPUT);

}

unsigned int UltrasonicSensor::measureDistance() {

    // Send pulse
    digitalWrite(_triggerPin, LOW);
    delayMicroseconds(2);
    digitalWrite(_triggerPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(_triggerPin, LOW);

    // Read pulse duration
    long duration = pulseIn(_echoPin, HIGH, 100000);

    // Calculate distance in centimeters
    return duration / 58.2;

}

void UltrasonicSensor::loop() {

    // Check if enough time has passed
    if (_lastPing + 500 > millis()) return;
    _lastPing = millis();

    // Calculate distance
    int distance = measureDistance();

    // Log it
    USB::log("DST", "%i %i", _id, distance);

}
