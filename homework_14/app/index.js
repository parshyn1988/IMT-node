'use strict';
var http          = require('http'),
	fs            = require('fs'),
	request       = require('request'),
	port          = 3000,
	resultRequest = null;

request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=3&fbclid=IwAR09kATDCdIeqNicAPp3PTXT2tVWWLPxWEbTJnvz0G_pogf7DU1ChyXvfv4', function (error, response, body) {
	if (!error && response.statusCode === 200) {
		resultRequest = body;
	} else {
		console.warn(error);
	}
});

http.createServer(function(req, res) {
	var namePage;
	if (req.url === '/') {
		namePage = 'index';
	} else {
		namePage = req.url;
	}
	if (req.url.endsWith('css')) {
		fs.readFile('../css/main.css', function(err, data) {
			if (err) {
				throw err;
			}
			res.setHeader('Content-Type', 'text/css');
			res.statusCode = 200;
			res.write(data);
			res.end();
		});
	} else if (req.url === '/exchange_rate') {
		var data = JSON.parse(resultRequest);
		var tmp = '';
		for (var i = 0; i < data.length; i++) {
			tmp += data[i].ccy + ': ' + data[i].buy + '/' + data[i].sale + '<br>';
		}
		res.write('<!DOCTYPE html>\n' +
			'<html lang="en">\n' +
			'<head>\n' +
			'\t<meta charset="UTF-8">\n' +
			'\t<title>Exchange rate</title>\n' +
			'\t<link rel="stylesheet" href="css/main.css">\n' +
			'</head>\n' +
			'<body>\n' +
			'<header>\n' +
			'\t<div class="header-menu">\n' +
			'\t\t<a href="/">Main</a>\n' +
			'\t\t<a href="/about_us">About us</a>\n' +
			'\t\t<a href="/blog">Blog</a>\n' +
			'\t\t<a href="/contact">Contact</a>\n' +
			'\t\t<a class="active" href="/exchange_rate">Exchange Rates</a>\n' +
			'\t</div>\n' +
			'</header>\n' +
			'<div class="container">\n' +
			'\t<p>'+ tmp +'</p>\n' +
			'</div>\n' +
			'</body>\n' +
			'</html>');
		res.end();
	} else {
		fs.readFile('../' + namePage + '.html', function(err, data) {
			if (!err) {
				res.statusCode = 200;
				res.write(data);
				res.end();
			} else {
				fs.readFile('../404.html', function(err, data) {
					if (err) {
						throw err;
					}
					res.statusCode = 404;
					res.write(data);
					res.end();
				});
			}
		});
	}
}).listen(port);