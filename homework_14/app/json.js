'use strict';
var request    = require('request');
var aaa;

request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=3&fbclid=IwAR09kATDCdIeqNicAPp3PTXT2tVWWLPxWEbTJnvz0G_pogf7DU1ChyXvfv4', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var data = JSON.parse(body);
		console.log(data[0].buy);
	} else {
		console.warn(error);
	}
	// console.log('error:', error);
	// console.log('statusCode:', response && response.statusCode);
	// console.log('body:', body);
});