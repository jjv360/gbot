//
// This code controls the interaction with the computer over the USB serial port.

#include "USB.h"
  
// Vars
static boolean isInitialized = 0;
static String inputBuffer = "";
static boolean isInputReady = false;

/** Initializes the serial communication. Must be called on startup. */
void USB::setup() {
  
  // Ignore if already initialized
  if (isInitialized)
    return;
    
  // Reserve space in the input buffer
  inputBuffer.reserve(256);
  
  // Start serial communication
  Serial.begin(9600);
  isInitialized = 1;
  USB::log("USB", "Initialized");
  
}

/** Sends a log message over USB */
void USB::log(const char* module, const char* format, ...) {
  
  // Ignore if not initialized yet
  if (!isInitialized)
    return;
    
  // Get variable argument list
  va_list args;
  va_start(args, format);
    
  // Apply formatting args in message
  char buffer[256];
  vsprintf(buffer, format, args);
  va_end(args);
    
  // Write to output
  Serial.print("[");
  Serial.print(module);
  Serial.print("] ");
  Serial.println(buffer);
  
}

/** This is triggered when new serial data is available */
void serialEvent() {
  
  // Stop if we already have pending input
  if (isInputReady)
    return;
  
  // While data is available, read all of it
  while (Serial.available()) {
    
    // get the new byte:
    char inChar = (char) Serial.read();
    
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      isInputReady = true;
      break;
    }
    
    // add it to the inputString:
    inputBuffer += inChar;
    
  }
  
}

/** This should be called in the Arduino loop. If a line is ready, it will be returned, otherwise NULL will be returned. */
boolean USB::readLine(char* buffer, int maxLength) {
  
  // Read input if necessary
  serialEvent();
  
  // Check if input is ready
  if (!isInputReady)
    return false;
    
  // Return a copy of the string, and clear the buffer
  strncpy(buffer, inputBuffer.c_str(), maxLength);
  inputBuffer = "";
  isInputReady = false;
  return true;
  
}
