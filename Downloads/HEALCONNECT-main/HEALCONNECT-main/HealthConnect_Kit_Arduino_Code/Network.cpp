#include "Network.h"
#include "addons/TokenHelper.h"

#define WIFI_SSID "ToXic"
#define WIFI_PASSWORD "pASSwORD"

#define API_KEY "AIzaSyDBKubwqUBiiOrapLr-_Rr_dA24Z_fw7yU"
#define FIREBASE_PROJECT_ID "health-monitoring-system-7885c"
#define USER_EMAIL "kumarpandule20@gmail.com"
#define USER_PASSWORD "PassWord"

static Network *instance = NULL;

Network::Network(){}

Network::Network(FuncPtrInt f){
  instance = this;
  callBackEvent = f;
}

void WiFiEventConnected(WiFiEvent_t event, WiFiEventInfo_t info){
  Serial.println("WIFI CONNECTED! BUT WAIT FOR THE LOCAL IP ADDR");
}

void WiFiEventGotIP(WiFiEvent_t event, WiFiEventInfo_t info){
  Serial.print("LOCAL IP ADDRESS: ");
  Serial.println(WiFi.localIP());
  instance->callBackEvent(NETWORK_CONNECTED);
  instance->firebaseInit();
}

void WiFiEventDisconnected(WiFiEvent_t event, WiFiEventInfo_t info){
  Serial.println("WIFI DISCONNECTED!");
  instance->callBackEvent(NETWORK_DISCONNECTED);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void FirestoreTokenStatusCallback(TokenInfo info){
  Serial.printf("Token Info: type = %s, status = %s\n", getTokenType(info).c_str(), getTokenStatus(info).c_str());
  if(info.status == token_status_ready){
    instance->callBackEvent(FIREBASE_CONNECTED);
  }else{
    instance->callBackEvent(FIREBASE_DISCONNECTED);
  }
}

void Network::initWiFi(){
  WiFi.disconnect();
  WiFi.onEvent(WiFiEventConnected, SYSTEM_EVENT_STA_CONNECTED);
  WiFi.onEvent(WiFiEventGotIP, SYSTEM_EVENT_STA_GOT_IP);
  WiFi.onEvent(WiFiEventDisconnected, SYSTEM_EVENT_STA_DISCONNECTED);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void Network::firebaseInit(){
  config.api_key = API_KEY;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  config.token_status_callback = FirestoreTokenStatusCallback;

  Firebase.begin(&config, &auth);
}

void Network::firestoreDataUpdate(float beatsPerMinute, int beatAvg, int oxygen, float temp, bool finger){
  if(WiFi.status() == WL_CONNECTED && Firebase.ready()){
    String documentPath = "devices/0001";

    FirebaseJson content;
    content.set("fields/status/booleanValue", true);
    content.set("fields/beatsPerMinute/doubleValue", String(beatsPerMinute).c_str());
    content.set("fields/beatAvg/doubleValue", String(beatAvg).c_str());
    content.set("fields/oxygen/doubleValue", String(oxygen).c_str());
    content.set("fields/temp/doubleValue", String(temp).c_str());
    content.set("fields/finger/booleanValue", finger);

    if(Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw(), "status,beatsPerMinute,beatAvg,oxygen,temp,finger")){
      Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
      return;
    }else{
      Serial.println(fbdo.errorReason());
    }

    if(Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw())){
      Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
      return;
    }else{
      Serial.println(fbdo.errorReason());
    }
  }
}
