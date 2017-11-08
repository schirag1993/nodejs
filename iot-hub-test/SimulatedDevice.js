'use strict';

 var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
 var Message = require('azure-iot-device').Message;

 var connectionString = 'HostName=****.azure-devices.net;DeviceId=Pi;SharedAccessKey=qVLZtAR*************fbGWLf0BNeCgs0=';

 var client = clientFromConnectionString(connectionString);

  function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }

  var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');

     // Create a message and send it to the IoT Hub every second
     setInterval(function(){
		 console.log("Attempting connection")
         var temperature = 20 + (Math.random() * 15);
		 console.log(new Date().toISOString());
		 var datetime = new Date().toISOString();
         var data = JSON.stringify({ deviceId: 'raspberryPi', temperature: temperature, datetime: datetime});
         var message = new Message(data);
         message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');
         console.log("Sending message: " + message.getData());
         client.sendEvent(message, printResultFor('send'));
     }, 1000);
   }
 };

 client.open(connectCallback);
