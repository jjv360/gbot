#include "USB.h"
#include "UltrasonicSensor.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Sensors
UltrasonicSensor sensor1(1, 3, 2);
UltrasonicSensor sensor2(2, 4, 2);
UltrasonicSensor sensor3(3, 5, 2);
UltrasonicSensor sensor4(4, 6, 2);
UltrasonicSensor sensor5(5, 7, 2);

// LCD
LiquidCrystal_I2C lcd(0x38, 16, 2);

void setup() {

  // Setup USB
  USB::setup();

  // Setup LCD
  lcd.init();
  lcd.backlight();
  writeLCD("Starting...");

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
