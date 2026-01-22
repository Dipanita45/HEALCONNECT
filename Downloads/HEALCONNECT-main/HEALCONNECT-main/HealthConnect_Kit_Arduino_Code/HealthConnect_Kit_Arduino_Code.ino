 #include <Wire.h>
 #include <Ticker.h> 
 #include "Network.h"
 #include "MAX30105.h" //sparkfun MAX3010X library 
 #include "Protocentral_MAX30205.h" 
 #include "heartRate.h" 
 #include "SH1106Wire.h" 

 #ifndef ESP32
 #pragma message(THIS EXAMPLE IS FOR ESP32 ONLY!)
 #error Select ESP32 board.
 #endif
 
 Network *network;
 SH1106Wire display(0x3c, SDA, SCL);     // ADDRESS, SDA, SCL 
 #define DEMO_DURATION 3000 
  
 MAX30105 particleSensor; 
 MAX30205 tempSensor; 
 int progress; 
 int counter = 1; 
 int switchPin = 5;              // switch is connected to pin 2 
 int val;                        // variable for reading the pin status 
 int buttonState;                // variable to hold the button state 
 int buttonPresses = 0; 
 float temp; 
 int period = 2000; 
 unsigned long time_now = 0; 
 double avered = 0; 
 double aveir = 0; 
 double sumirrms = 0; 
 double sumredrms = 0; 
 int i = 0; 
 int Num = 100; //calculate SpO2 by this sampling interval 
 long irValue; 
 int oxygen; 
 double ESpO2 = 95.0;    //initial value of estimated SpO2 
 double FSpO2 = 0.7;     //filter factor for estimated SpO2 
 double frate = 0.95;    //low pass filter for IR/red LED value to eliminate AC component 
 #define TIMETOBOOT 3000 // wait for this time(msec) to output SpO2 
 #define SCALE 88.0      //adjust to display heart beat and SpO2 in the same scale 
 #define SAMPLING 5      //if you want to see heart beat more precisely , set SAMPLING to 1 
 #define FINGER_ON 3000  // if red signal is lower than this , it indicates your finger is not on the sensor 
 #define MINIMUM_SPO2 0.0 
 #define BPM_Logo_width 60 
 #define BPM_Logo_height 36 
 const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good. 
 byte rates[RATE_SIZE];    //Array of heart rates 
 byte rateSpot = 0; 
 long lastBeat = 0; //Time at which the last beat occurred 
 float beatsPerMinute; 
 int beatAvg; 
 float fahrenheit; 
 bool finger = false;
  
 #define SCREEN_WIDTH 128 // OLED display width, in pixels 
 #define SCREEN_HEIGHT 64 // OLED display height, in pixels 
 #define OLED_RESET 4    // Reset pin # (or -1 if sharing Arduino reset pin) 
 #define USEFIFO 

/** Task handle for the light value read task */
TaskHandle_t dataTaskHandle = NULL;
/** Ticker for temperature reading */
Ticker dataTicker;
/** Flag if task should run */
bool tasksEnabled = false;

bool initData() {
  // Start task to get temperature
  xTaskCreatePinnedToCore(
      dataTask,                       /* Function to implement the task */
      "dataTask ",                    /* Name of the task */
      10000,                          /* Stack size in words */
      NULL,                           /* Task input parameter */
      5,                              /* Priority of the task */
      &dataTaskHandle,                /* Task handle. */
      1);                             /* Core where the task should run */

  if (dataTaskHandle == NULL) {
    Serial.println("Failed to start task for data update");
    return false;
  } else {
    // Start update of environment data every 20 seconds
    dataTicker.attach_ms(100, triggerGetData);
  }
  return true;
}

void triggerGetData() {
  if (dataTaskHandle != NULL) {
     xTaskResumeFromISR(dataTaskHandle);
  }
}

void dataTask(void *pvParameters) {
  Serial.println("dataTask loop started");
  while (1) // tempTask loop
  {
    if (tasksEnabled) {
      // Get temperature values
      updateData();
    }
    // Got sleep again
    vTaskSuspend(NULL);
  }
}
  
 void setup() 
 { 
   Serial.begin(115200); 
   Serial.println("Initializing...");
   initNetwork(); 
   display.init(); 
   display.flipScreenVertically(); 
   display.setFont(ArialMT_Plain_16); 
   display.clear();  
   pinMode(switchPin, INPUT_PULLUP); 
   buttonState = digitalRead(switchPin); 
   // Initialize sensor 
   while (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed 
   { 
     Serial.println("MAX30102 was not found. Please check wiring/power/solder jumper at MH-ET LIVE MAX30102 board. "); 
   } 
   Serial.println("Place your index finger on the sensor with steady pressure."); 
   while (!tempSensor.scanAvailableSensors()) { 
     Serial.println("Couldn't find the temperature sensor, please connect the sensor." ); 
     delay(3000); 
   } 
   tempSensor.begin(); 
   //Setup to sense a nice looking saw tooth on the plotter 
   byte ledBrightness = 255; // 0x7F Options: 0=Off to 255=50mA 
   byte sampleAverage = 4;   //Options: 1, 2, 4, 8, 16, 32 
   byte ledMode = 2;         //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green 
   int sampleRate = 400;     //1000 is best but needs processing power//Options: 50, 100, 200, 400, 800, 1000, 1600, 3200 
   int pulseWidth = 411;     //Options: 69, 118, 215, 411 
   int adcRange = 16384;     //Options: 2048, 4096, 8192, 16384 
   // Set up the wanted parameters 
   particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings 
   particleSensor.enableDIETEMPRDY(); 
   particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running 
   particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED 

  initData();
  // Signal end of setup() to tasks
  tasksEnabled = true;
 } 

 void updateData(){
      network->firestoreDataUpdate(beatsPerMinute, beatAvg, oxygen, fahrenheit, finger);
  }
   
 void loop() 
 { 
   Switch(); 
   Cal_SpO2(); 
   Cal_BPM(); 
   Cal_temp(); 
   Print_Statements(); 

    if (!tasksEnabled) {
    
    tasksEnabled = true;
    if (dataTaskHandle != NULL) {
      vTaskResume(dataTaskHandle);
    }
  }
 }

  void initNetwork(){
  void (*ptr)(Network_State_t) = &networkEvent;
  network = new Network(ptr);
  network->initWiFi();
}

void networkEvent(Network_State_t event){
  switch(event){
    case NETWORK_CONNECTED:
      break;
    case NETWORK_DISCONNECTED:
      break; 
    case FIREBASE_CONNECTED:  
      break;
    case FIREBASE_DISCONNECTED:  
      break;
    default: break;
  }
}
  
 void drawProgressBarDemo() { 
   display.clear(); 
   if(WiFi.status() != WL_CONNECTED){      
   display.setFont(ArialMT_Plain_10); 
   display.drawString(60, 0, "-----Heath Monitoring-----"); 
   int progress = (counter / 5) % 100;  
   // draw the percentage as String 
   display.setTextAlignment(TEXT_ALIGN_CENTER); 
   display.drawString(64, 15, "Connecting to WiFi..."); 
   // draw the progress bar 
   display.drawProgressBar(0, 32, 120, 10, progress);
 }
   display.display();
 } 
  
  
 void Switch() 
 { 
   val = digitalRead(switchPin);      // read input value and store it in val 
   if (val != buttonState) {          // the button state has changed! 
     if (val == LOW) {                // check if the button is pressed 
       buttonPresses++;               // increment the buttonPresses variable 
     } 
   } 
   buttonState = val; 
 } 
  
 void Cal_temp() 
 { 
   temp = tempSensor.getTemperature(); // read temperature for every 100ms 
   fahrenheit = (temp * 1.8) + 32; 
   //  delay(100); 
 } 
 void Cal_BPM() { 
   irValue = particleSensor.getIR(); 
  
   if (checkForBeat(irValue) == true) 
   { 
     //We sensed a beat! 
     long delta = millis() - lastBeat; 
     lastBeat = millis(); 
  
     beatsPerMinute = 60 / (delta / 1000.0); 
  
     if (beatsPerMinute < 255 && beatsPerMinute > 20) 
     { 
       rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array 
       rateSpot %= RATE_SIZE; //Wrap variable 
  
       //Take average of readings 
       beatAvg = 0; 
       for (byte x = 0 ; x < RATE_SIZE ; x++) 
         beatAvg += rates[x]; 
       beatAvg /= RATE_SIZE; 
     } 
   } 
   
    if (irValue < 50000){
      finger = false;
      //  Serial.print("No Finger!");
    }else{
      finger = true;
      } 
 } 
 void Cal_SpO2() { 
   uint32_t ir, red, green; 
   double fred, fir; 
   double SpO2 = 0; //raw SpO2 before low pass filtered 
  
 #ifdef USEFIFO 
   particleSensor.check(); //Check the sensor, read up to 3 samples 
  
   while (particleSensor.available()) 
  
   { //do we have new data 
 #ifdef MAX30105 
     red = particleSensor.getFIFORed(); //Sparkfun's MAX30105 
     ir = particleSensor.getFIFOIR();   //Sparkfun's MAX30105 
 #else 
     red = particleSensor.getFIFOIR(); //why getFOFOIR output Red data by MAX30102 on MH-ET LIVE breakout board 
     ir = particleSensor.getFIFORed(); //why getFIFORed output IR data by MAX30102 on MH-ET LIVE breakout board 
 #endif 
  
     i++; 
     fred = (double)red; 
     fir = (double)ir; 
     avered = avered * frate + (double)red * (1.0 - frate); //average red level by low pass filter 
     aveir = aveir * frate + (double)ir * (1.0 - frate);    //average IR level by low pass filter 
     sumredrms += (fred - avered) * (fred - avered);        //square sum of alternate component of red level 
     sumirrms += (fir - aveir) * (fir - aveir);             //square sum of alternate component of IR level 
     if ((i % SAMPLING) == 0) 
     { //slow down graph plotting speed for arduino Serial plotter by thin out 
       if (millis() > TIMETOBOOT) 
       { 
         if (ir < FINGER_ON) 
         ESpO2 = MINIMUM_SPO2; //indicator for finger detached 
         float temperature = particleSensor.readTemperatureF(); 
         if (ESpO2 <= -1) 
         { 
           ESpO2 = 0; 
         } 
         if (ESpO2 > 100) 
         { 
           ESpO2 = 100; 
         } 
         oxygen = ESpO2; 
  
       } 
     }
     if ((i % Num) == 0) 
     { 
       double R = (sqrt(sumredrms) / avered) / (sqrt(sumirrms) / aveir); 
       SpO2 = -23.3 * (R - 0.4) + 100;               //http://ww1.microchip.com/downloads/jp/AppNotes/00001525B_JP.pdf 
       ESpO2 = FSpO2 * ESpO2 + (1.0 - FSpO2) * SpO2; //low pass filter 
       sumredrms = 0.0; 
       sumirrms = 0.0; 
       i = 0; 
       break; 
     } 
     particleSensor.nextSample(); //We're finished with this sample so move to next sample 
   } 
  
   long irValue = particleSensor.getIR(); 
  
 #endif 
 } 
  
 void Print_Statements() { 
  
   switch (buttonPresses) 
   { 
     case 0: 
       drawProgressBarDemo();
       counter++; 
       delayMicroseconds(1); 
       if (counter == 250) 
       { 
         buttonPresses = 1; 
         counter = 0; 
         display.clear(); 
       } 
  
       break; 
  
     case 1: 
       display.clear();                             //Clear the display 
       display.setFont(ArialMT_Plain_10); 
       display.drawString(60, 0, "-----Heath Monitoring-----"); 
       display.drawString(20, 30, "Spo2 :"); 
       display.drawString(75, 30, String(oxygen) + "%"); 
       display.display(); 
       //      } 
       break; 
     case 2: 
       display.clear();                             //Clear the display 
       display.setFont(ArialMT_Plain_10); 
       display.drawString(60, 0, "-----Heath Monitoring-----"); 
       display.drawString(20, 25, "BPM :"); 
       display.drawString(75, 25, String(beatsPerMinute)); 
       display.drawString(33, 35, "AVG. BPM :"); 
       display.drawString(75, 35, String(beatAvg)); 
       display.display(); 
       //      } 
       break; 
     case 3: 
       display.clear();                             //Clear the display 
       display.setFont(ArialMT_Plain_10); 
       display.drawString(60, 0, "-----Heath Monitoring-----"); 
       display.drawString(20, 30, "Temp :"); 
       display.drawString(75, 30, String(temp) + "'C"); 
       display.drawString(20, 45, "Temp :"); 
       display.drawString(75, 45, String(fahrenheit) + "'F"); 
  
       display.display(); 
       break; 
     case 4: 
       display.clear();                             //Clear the display 
       display.setFont(ArialMT_Plain_10); 
       display.drawString(60, 0, "-----Heath Monitoring-----"); 
       display.drawString(20, 15, "Spo2 :"); 
       display.drawString(75, 15, String(oxygen) + "%"); 
       display.drawString(20, 25, "BPM :"); 
       display.drawString(75, 25, String(beatsPerMinute)); 
       display.drawString(33, 35, "AVG. BPM :"); 
       display.drawString(75, 35, String(beatAvg)); 
 //      display.drawString(20, 45, "Temp :"); 
 //      display.drawString(75, 45, String(temp) + "'C"); 
       display.drawString(20, 45, "Temp :"); 
       display.drawString(75, 45, String(fahrenheit) + "'F"); 
       display.display(); 
       break; 
  
  
   } 
   if (buttonPresses == 5) { 
     buttonPresses = 1; 
   } 
}
