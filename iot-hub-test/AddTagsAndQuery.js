'use strict';
 var iothub = require('azure-iothub');
 var connectionString = 'HostName=ChiragTestHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=pEuSLk+HUPM5o9E+KtjMNxsWdIZ5rBFV+y4kO8qBiE0=';
 var registry = iothub.Registry.fromConnectionString(connectionString);

 registry.getTwin('testDevice', function(err, twin){
     if (err) {
         console.error(err.constructor.name + ': ' + err.message);
     } else {
         var patch = {
             tags: {
                 location: {
                     region: 'US',
                     plant: 'Redmond43'
               }
             }
         };

		 var props = {
			 properties: {
				 desired : {
					 room1 : {
						 light1 : "on"
					 }
				 }
			 }
		 }

		 twin.update(props, function(err)
		 {
			 if(err)
			 {
				 console.log("Unable to update device twin! Error: " + err.message)
			 }
			 else
			 {
				 console.log("Device twin updated successfully!")
				 queryProperties()
			 }
		 });

         twin.update(patch, function(err) {
           if (err) {
             console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
           } else {
             console.log(twin.deviceId + ' twin updated successfully');
             queryTwins();
           }
         });
     }
 });

 var queryProperties = function()
 {
	 var query = registry.createQuery("SELECT properties.desired from devices WHERE deviceId='testDevice'",100)
	 query.nextAsTwin(function(err,results)
	 {
		 if(err)
		 {
			 console.log("Error: " + err.message)
		 }
		 else
		 {
			 console.log("testDevice reported state is: " + results.map(function(twin) {return twin.deviceId}).join(','))
		 }
	 }
 }

 var queryTwins = function() {
     var query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'", 100);
     query.nextAsTwin(function(err, results) {
         if (err) {
             console.error('Failed to fetch the results: ' + err.message);
         } else {
             console.log("Devices in Redmond43: " + results.map(function(twin) {return twin.deviceId}).join(','));
         }
     });

     query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43' AND properties.reported.connectivity.type = 'cellular'", 100);
     query.nextAsTwin(function(err, results) {
         if (err) {
             console.error('Failed to fetch the results: ' + err.message);
         } else {
             console.log("Devices in Redmond43 using cellular network: " + results.map(function(twin) {return twin.deviceId}).join(','));
         }
     });
 };
