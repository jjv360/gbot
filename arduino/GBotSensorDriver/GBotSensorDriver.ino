#include "USB.h"
#include "UltrasonicSensor.h"
#include "LineFollowSensor.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_PWMServoDriver.h>

// Sensors
// UltrasonicSensor sensor1(1, 3, 2);
UltrasonicSensor sensor2(2, 4, 2);
// UltrasonicSensor sensor3(3, 5, 3);
// UltrasonicSensor sensor4(4, 6, 2);
// UltrasonicSensor sensor5(5, 7, 2);
LineFollowSensor lineSensor1(0, 8);
LineFollowSensor lineSensor2(0, 9);
LineFollowSensor lineSensor3(0, 10);

// LCD
LiquidCrystal_I2C lcd(0x38, 16, 2);

// PWM (motors/servos)
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

// State
bool isMoving = false;

void emergencyStop() {

    // Check if moving
    if (!isMoving)
        return;

    // Stop motors
    setMotors(0.0f, 0.0f);
    isMoving = false;

}

void setup() {

  // Setup USB
  USB::setup();
  USB::log("Main", "Driver board running");

  // Setup LCD
  lcd.init();
  lcd.backlight();
  writeLCD("Starting...");

  // Setup PWM
  pwm.begin();
  pwm.setPWMFreq(1600);

  // Setup emergency stop interrupts
  attachInterrupt(digitalPinToInterrupt(8), emergencyStop, RISING);
  attachInterrupt(digitalPinToInterrupt(9), emergencyStop, RISING);
  attachInterrupt(digitalPinToInterrupt(10), emergencyStop, RISING);

}

// From https://stackoverflow.com/a/4771038/1008736
bool startsWith(const char *pre, const char *str) {
    size_t lenpre = strlen(pre),
           lenstr = strlen(str);
    return lenstr < lenpre ? false : strncmp(pre, str, lenpre) == 0;
}

void loop() {

    // Run loop for components
    // sensor1.loop();
    sensor2.loop();
    // sensor3.loop();
    // sensor4.loop();
    // sensor5.loop();
    lineSensor1.loop();
    lineSensor2.loop();
    lineSensor3.loop();

    // Process incoming commands
    char inputBuffer[256];
    if (USB::readLine(inputBuffer, 256)) {

        // Process input command
        if (startsWith("LCD ", inputBuffer)) {

            // Write to screen
            writeLCD(inputBuffer + 4);

        } else if (startsWith("WHEEL1 ", inputBuffer)) {

            // Apply PWM speed
            float speed = atof(inputBuffer + 7);
            if (speed > 0) {

                // Go forward
                pwm.setPin(0, (unsigned int) (max(-1, min(1, speed)) * 4095));
                pwm.setPin(1, 4096);
                pwm.setPin(2, 0);
                isMoving = true;

            } else if (speed < 0) {

                // Go backward
                pwm.setPin(0, (unsigned int) (max(-1, min(1, -speed)) * 4095));
                pwm.setPin(1, 0);
                pwm.setPin(2, 4096);
                isMoving = true;

            } else if (speed == 0) {

                // Stop
                pwm.setPin(0, 0);
                pwm.setPin(1, 0);
                pwm.setPin(2, 0);
                isMoving = false;

            }

        } else if (startsWith("WHEEL2 ", inputBuffer)) {

            // Apply PWM speed
            float speed = atof(inputBuffer + 7);
            if (speed > 0) {

                // Go forward
                pwm.setPin(3, (unsigned int) (max(-1, min(1, speed)) * 4095));
                pwm.setPin(5, 4096);
                pwm.setPin(4, 0);
                isMoving = true;

            } else if (speed < 0) {

                // Go backward
                pwm.setPin(3, (unsigned int) (max(-1, min(1, -speed)) * 4095));
                pwm.setPin(5, 0);
                pwm.setPin(4, 4096);
                isMoving = true;

            } else if (speed == 0) {

                // Stop
                pwm.setPin(3, 0);
                pwm.setPin(5, 0);
                pwm.setPin(4, 0);
                isMoving = false;

            }

        }

    }

    // Check if obstructed
    if (lineSensor1.isOn() || lineSensor2.isOn() || lineSensor3.isOn()) {

        // Check if moving
        if (isMoving) {

            // We're going off an edge! Move back a bit
            setMotors(-1.0f, -1.0f);
            delay(100);
            setMotors(-1.0f, 1.0f);
            delay(500);
            setMotors(0, 0);
            isMoving = false;

        }

    }

}

void setMotors(float left, float right) {

    // Apply PWM speed
    float speed = left;
    if (speed > 0) {

        // Go forward
        pwm.setPin(0, (unsigned int) (max(-1, min(1, speed)) * 4095));
        pwm.setPin(1, 4096);
        pwm.setPin(2, 0);
        isMoving = true;

    } else if (speed < 0) {

        // Go backward
        pwm.setPin(0, (unsigned int) (max(-1, min(1, -speed)) * 4095));
        pwm.setPin(1, 0);
        pwm.setPin(2, 4096);
        isMoving = true;

    } else if (speed == 0) {

        // Stop
        pwm.setPin(0, 0);
        pwm.setPin(1, 0);
        pwm.setPin(2, 0);
        isMoving = false;

    }

    // Apply PWM speed
    speed = right;
    if (speed > 0) {

        // Go forward
        pwm.setPin(3, (unsigned int) (max(-1, min(1, speed)) * 4095));
        pwm.setPin(5, 4096);
        pwm.setPin(4, 0);
        isMoving = true;

    } else if (speed < 0) {

        // Go backward
        pwm.setPin(3, (unsigned int) (max(-1, min(1, -speed)) * 4095));
        pwm.setPin(5, 0);
        pwm.setPin(4, 4096);
        isMoving = true;

    } else if (speed == 0) {

        // Stop
        pwm.setPin(3, 0);
        pwm.setPin(5, 0);
        pwm.setPin(4, 0);
        isMoving = false;

    }

}

void writeLCD(const char* str) {

  lcd.clear();
  int len = strlen(str);
  char bfr[2] = {0};
  for (int i = 0 ; i < min(len, 16) ; i++) {
    bfr[0] = str[i];
    lcd.print(bfr);
  }
  lcd.setCursor(0, 1);
  for (int i = 16 ; i < min(len, 16) ; i++) {
    bfr[0] = str[i];
    lcd.print(bfr);
  }

}
