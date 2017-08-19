//
// This code reads distance from an ultrasonic sensor.

#ifndef ULTRASONICSENSOR_H
#define ULTRASONICSENSOR_H

#include <Arduino.h>

class UltrasonicSensor {

private:

    int _triggerPin;
    int _echoPin;
    int _id;
    unsigned long long _lastPing;

public:

    /** Constructor */
    UltrasonicSensor(int id, int triggerPin, int echoPin);

    /** Call on loop */
    void loop();

    /** Read distance */
    unsigned int measureDistance();

};

#endif
