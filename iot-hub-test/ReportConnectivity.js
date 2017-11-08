'use strict';
 var Client = require('azure-iot-device').Client;
 var Protocol = require('azure-iot-device-mqtt').Mqtt;

 var connectionString = 'HostName=ChiragTestHub.azure-devices.net;DeviceId=testDevice;SharedAccessKey=k4peTTBZFqstY5MJBG+r1gfv1q+KSxpA3g/v4raEw0M=';
 var client = Client.fromConnectionString(connectionString, Protocol);

 client.open(function(err) {
 if (err) {
     console.error('could not open IotHub client');
 }  else {
     console.log('client opened');

     client.getTwin(function(err, twin) {
     if (err) {
         console.error('could not get twin');
     } else {
         var patch = {
             connectivity: {
                 type: 'cellular'
             },
			 room1 : {
				 light1:'off'
			 }
         };

         twin.properties.reported.update(patch, function(err) {
             if (err) {
                 console.error('could not update twin');
             } else {
                 console.log('twin state reported');
                 process.exit();
             }
         });
     }
     });
 }
 });