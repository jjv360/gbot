

Install:

https://github.com/alaudet/hcsr04sensor


## Drivers

- 1x Arduino Nano (5v)
- 1x Raspberry Pi (3v3)

## Sensors

- 5x Ultrasonic (Gnd, 5v, Trig, Echo)
- 3x Line Follow (Gnd, 5v, Signal)
- 1x Accelerometer/Gyro (Gnd, 5v, SCL, SDA, XCL, XDA, INT)

## Gateway

- 1x PWM Board (Gnd, 5v, SCL, SDA)

## Actuators

- 1x Motor Driver (Gnd, 5v, ENA -> 5v, ENB -> 5v, IN1, IN2, IN3, IN4)
- 1x LCD Screen (Gnd, 5v, SCL, SDA)

## Commons:

- Gnd: 13
- 5v: 15
- Echo: 6
- SCL: 4
- SDA: 4

## Little rails Board

green = ground
orange = 5v
purple = 8v

------      SCL (orange)
---------   ECHO (red)
---- -      SDA (brown)

## LCD

purple Gnd
blue vcc
green SDA
yellow SCL

## Adafruit PWM Board
