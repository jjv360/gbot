#include "USB.h"
#include "UltrasonicSensor.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_PWMServoDriver.h>

// Sensors
UltrasonicSensor sensor1(1, 3, 2);
UltrasonicSensor sensor2(2, 4, 2);
UltrasonicSensor sensor3(3, 5, 2);
UltrasonicSensor sensor4(4, 6, 2);
UltrasonicSensor sensor5(5, 7, 2);

// LCD
LiquidCrystal_I2C lcd(0x38, 16, 2);

// PWM (motors/servos)
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

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

}

// From https://stackoverflow.com/a/4771038/1008736
bool startsWith(const char *pre, const char *str) {
    size_t lenpre = strlen(pre),
           lenstr = strlen(str);
    return lenstr < lenpre ? false : strncmp(pre, str, lenpre) == 0;
}

void loop() {

    // Run loop for components
    sensor1.loop();
    sensor2.loop();
    sensor3.loop();
    sensor4.loop();
    sensor5.loop();

    // Process incoming commands
    char inputBuffer[256];
    if (!USB::readLine(inputBuffer, 256))
        return;

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

        } else if (speed < 0) {

            // Go backward
            pwm.setPin(0, (unsigned int) (max(-1, min(1, -speed)) * 4095));
            pwm.setPin(1, 0);
            pwm.setPin(2, 4096);

        } else if (speed == 0) {

            // Stop
            pwm.setPin(0, 0);
            pwm.setPin(1, 0);
            pwm.setPin(2, 0);

        }

    } else if (startsWith("WHEEL2 ", inputBuffer)) {

        // Apply PWM speed
        float speed = atof(inputBuffer + 7);
        if (speed > 0) {

            // Go forward
            pwm.setPin(3, (unsigned int) (max(-1, min(1, speed)) * 4095));
            pwm.setPin(5, 4096);
            pwm.setPin(4, 0);

        } else if (speed < 0) {

            // Go backward
            pwm.setPin(3, (unsigned int) (max(-1, min(1, -speed)) * 4095));
            pwm.setPin(5, 0);
            pwm.setPin(4, 4096);

        } else if (speed == 0) {

            // Stop
            pwm.setPin(3, 0);
            pwm.setPin(5, 0);
            pwm.setPin(4, 0);

        }

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
