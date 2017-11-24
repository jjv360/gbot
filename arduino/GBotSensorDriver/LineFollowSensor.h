//
// This code reads distance from an ultrasonic sensor.

#ifndef LINEFOLLOWSENSOR_H
#define LINEFOLLOWSENSOR_H

#include <Arduino.h>

class LineFollowSensor {

private:

    int _pin;
    int _id;
    unsigned long long _lastPing;

public:

    /** Constructor */
    LineFollowSensor(int id, int pin);

    /** Call on loop */
    void loop();

    /** Check if is following line */
    bool isOn();

};

#endif
