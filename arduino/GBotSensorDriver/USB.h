//
// This code controls the interaction with the computer over the USB serial port.

#ifndef USB_H
#define USB_H

#include <Arduino.h>

namespace USB {
  
  /** Initializes the serial communication. Must be called on startup. */
  void setup();
  
  /** Sends a log message over USB */
  void log(const char* module, const char* msg, ...);
  
  /** This should be called in the Arduino loop. If a line is ready, it will be returned, otherwise NULL will be returned. */
  boolean readLine(char* buffer, int maxLength);
  
};

#endif
