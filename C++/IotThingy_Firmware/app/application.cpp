#include <user_config.h>
#include <network_config.h>
#include <SmingCore/SmingCore.h>
#include <Libraries/OneWire/OneWire.h>
#include <Libraries/DS18S20/ds18s20.h>

#define USE_SERIAL 1 //set to 1 to enable the serial console
#define SENSOR_ID  "2"
//Constants
#define TEMP_PIN 4
//how many times we will connect
#define MAX_CONNECTION_RETRY 2
void onMessageReceived(String topic, String message); // Forward declaration for our callback
void onNtpReceive(NtpClient& client, time_t timestamp);
String getTemperature();
Timer procTimer;
//temp sensor
DS18S20 temperatureSensor;
// MQTT client connection
MqttClient mqtt(MQTT_SERVER_ADDRESS, MQTT_SERVER_PORT);
//used to track how many times we failed to connect
int connectionFailureCount = 0;

void gotoSleep()
{
    if (USE_SERIAL) Serial.println("going to sleep 15 mins");

    System.deepSleep(15*60000);
}
// Publish our message
void publishMessage()
{
    if (USE_SERIAL) Serial.println("Let's publish message now!");

    mqtt.publish("love/sunshine", String(SENSOR_ID) + "," + getTemperature());
    procTimer.initializeMs(7 * 1000, gotoSleep).startOnce();
}

String getTemperature()
{
    if (!temperatureSensor.MeasureStatus())  // the last measurement completed
    {
        if (temperatureSensor.GetSensorsCount())   // is minimum 1 sensor detected ?
        {
            for(int a=0;a<temperatureSensor.GetSensorsCount();a++)   // prints for all sensors
            {
                if (temperatureSensor.IsValidTemperature(a))   // temperature read correctly ?
                    return String(temperatureSensor.GetFahrenheit(a));
                else
                    if (USE_SERIAL) Serial.println("Temperature not valid");
            }
        }
    }
    else
        if (USE_SERIAL) Serial.println("No valid Measure so far! wait please");

    return "-1111";
}

// Will be called when WiFi station was connected to AP
void connectOk()
{
	if (USE_SERIAL) Serial.println("I'm CONNECTED");
    // Run MQTT client
    mqtt.connect("esp8266");
    publishMessage();
}

// Will be called when WiFi station timeout was reached
void connectFail()
{
	if (USE_SERIAL) Serial.println("I'm NOT CONNECTED. ");
    connectionFailureCount++;
    if (USE_SERIAL) Serial.printf("Connection failure count is %d\r\n", connectionFailureCount);

    if(connectionFailureCount <= MAX_CONNECTION_RETRY)
    {
    	WifiStation.waitConnection(connectOk, 10, connectFail); // We recommend 20+ seconds for connection timeout at start
    }
    else
    {
        gotoSleep();
    }
}

// Will be called when WiFi hardware and software initialization was finished
// And system initialization was completed
void ready()
{
	if (USE_SERIAL) Serial.println("READY");
}


void init()
{
	if (USE_SERIAL)
	{
		Serial.begin(SERIAL_BAUD_RATE); // 115200 by default
		Serial.systemDebugOutput(true); // Debug output to serial
		Serial.println("booting up");
	}
    //Setup temp sensors
    temperatureSensor.Init(TEMP_PIN);
    temperatureSensor.StartMeasure();
    System.onReady(ready);
    WifiStation.config(WIFI_SSID, WIFI_PWD);
    WifiStation.enable(true);
    WifiAccessPoint.enable(false);

    // Run our method when station was connected to AP (or not connected)
    WifiStation.waitConnection(connectOk, 20, connectFail); // We recommend 20+ seconds for connection timeout at start
}
