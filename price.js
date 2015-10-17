var https = require('https');
var async = require('async');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = function (ipc, sendError) {
	var usdToBaht = 0;
	var cnyToBaht = 0;
	var prices = {
		bx : {
			type : {
				buy : {
					'' : '',
					baht : 0
				},
				sell : {
					'' : '',
					baht : 0
				}
			}
		},
		cex : {
			type : {
				buy : {
					usd : 0,
					baht : 0
				},
				sell : {
					usd : 0,
					baht : 0
				}
			}
		},
		btcchina : {
			type : {
				buy : {
					cny : 0,
					baht : 0
				},
				sell : {
					cny : 0,
					baht : 0
				}
			}
		},
		coins : {
			type : {
				buy : {
					'' : '',
					baht : 0
				},
				sell : {
					'' : '',
					baht : 0
				}
			}
		},
		btce : {
			type : {
				buy : {
					usd : 0,
					baht : 0
				},
				sell : {
					usd : 0,
					baht : 0
				}
			}
		},
		bitstamp : {
			type : {
				buy : {
					usd : 0,
					baht : 0
				},
				sell : {
					usd : 0,
					baht : 0
				}
			}
		}
	};
	ipc.on('getPrice', function(event, arg) {
		async.parallel([
		    function(callback){
		        https.get('https://currency-api.appspot.com/api/usd/thb.json', function (res) {
					var currency = '';
					res.on('data', function(chunk) {
						currency += chunk;
					});
					res.on('end', function() {
						try {
							currency = JSON.parse(currency);
							usdToBaht = currency.rate;
						}
						catch (error) {
							sendError('Currency API {usdTobaht}', error);
						}
						callback(null, 'usdtobaht');
					});
				})
				.on('error', function (error) {
					sendError('Currency API {usdTobaht}', error);
				});
		    },
		    function(callback){
		        https.get('https://currency-api.appspot.com/api/cny/thb.json', function (res) {
					var currency = '';
					res.on('data', function(chunk) {
						currency += chunk;
					});
					res.on('end', function() {
						try {
							currency = JSON.parse(currency);
							cnyToBaht = currency.rate;
						}
						catch (error) {
							sendError('Currency API {cnyTobaht}', error);
						}
						callback(null, 'cnytobaht');
					});
				})
				.on('error', function (error) {
					sendError('Currency API {cnyTobaht}', error);
				});
		    }
		],
		function(err, results){
			async.parallel([
				function(callback) {
					https.get('https://bx.in.th/api/', function (res) {
						var ticker = '';
						res.on('data', function(chunk) {
							ticker += chunk;
						});
						res.on('end', function() {
							try {
								ticker = JSON.parse(ticker)['1'].orderbook;
								prices.bx.type.buy.baht = ticker.asks.highbid;
								prices.bx.type.sell.baht = ticker.bids.highbid;
							}
							catch (error) {
								sendError('BX API', error);
							}
							callback(null, 'bx');
						});
					})
					.on('error', function (error) {
						sendError('BX API', error);
					});
				},
				function(callback) {
					https.get('https://cex.io/api/ticker/BTC/USD', function (res) {
						var ticker = '';
						res.on('data', function(chunk) {
							ticker += chunk;
						});
						res.on('end', function() {
							try {
								ticker = JSON.parse(ticker);
								prices.cex.type.buy.usd = ticker.ask;
								prices.cex.type.sell.usd = ticker.bid;
								prices.cex.type.buy.baht = prices.cex.type.buy.usd * usdToBaht;
								prices.cex.type.sell.baht = prices.cex.type.sell.usd * usdToBaht;
							}
							catch (error) {
								sendError('CEX API', error);
							}
							callback(null, 'cex');
						});
					})
					.on('error', function (error) {
						sendError('CEX API', error);
					});
				},
				function(callback) {
					https.get('https://data.btcchina.com/data/ticker?market=btccny', function (res) {
						var ticker = '';
						res.on('data', function(chunk) {
							ticker += chunk;
						});
						res.on('end', function() {
							try {
								ticker = JSON.parse(ticker).ticker;
								prices.btcchina.type.buy.cny = ticker.buy;
								prices.btcchina.type.sell.cny = ticker.sell;
								prices.btcchina.type.buy.baht = prices.btcchina.type.buy.cny * cnyToBaht;
								prices.btcchina.type.sell.baht = prices.btcchina.type.sell.cny * cnyToBaht;
								callback(null, 'btcchina');
							}
							catch (error) {
								sendError('BTCChina API', error);
							}
						});
					})
					.on('error', function (error) {
						sendError('BTCChina API', error);
					});
				},
				function(callback) {
					https.get('https://quote.coins.ph/v1/markets', function (res) {
						var ticker = '';
						res.on('data', function(chunk) {
							ticker += chunk;
						});
						res.on('end', function() {
							try {
								ticker = JSON.parse(ticker).markets[5];
								prices.coins.type.buy.baht = ticker.ask;
								prices.coins.type.sell.baht = ticker.bid;
							}
							catch (error) {
								sendError('COINS API', error);
							}
							callback(null, 'coins');
						});
					})
					.on('error', function (error) {
						sendError('COINS API', error);
					});
				},
				function(callback) {
					https.get('https://btc-e.com/api/2/btc_usd/ticker', function (res) {
						var ticker = '';
						res.on('data', function(chunk) {
							ticker += chunk;
						});
						res.on('end', function() {
							try {
								ticker = JSON.parse(ticker).ticker;
								prices.btce.type.buy.usd = ticker.buy;
								prices.btce.type.sell.usd = ticker.sell;
								prices.btce.type.buy.baht = prices.btce.type.buy.usd * usdToBaht;
								prices.btce.type.sell.baht = prices.btce.type.sell.usd * usdToBaht;
							}
							catch (error) {
								sendError('BTC-E API', error);
							}
							callback(null, 'btce');
						});
					})
					.on('error', function (error) {
						sendError('BTC-E API', error);
					});
				},
				function(callback) {
					https.get('https://www.bitstamp.net/api/ticker/', function (res) {
						var ticker = '';
						res.on('data', function(chunk) {
							ticker += chunk;
						});
						res.on('end', function() {
							try {
								ticker = JSON.parse(ticker);
								prices.bitstamp.type.buy.usd = ticker.ask;
								prices.bitstamp.type.sell.usd = ticker.bid;
								prices.bitstamp.type.buy.baht = prices.bitstamp.type.buy.usd * usdToBaht;
								prices.bitstamp.type.sell.baht = prices.bitstamp.type.sell.usd * usdToBaht;
							}
							catch (error) {
								sendError('BITSTAMP API', error);
							}
							callback(null, 'bitstamp');
						});
					})
					.on('error', function (error) {
						sendError('BITSTAMP API', error);
					});
				}
			], function(err, results) {
					event.sender.send('updatePrice', prices);
			});
		});
	});
	console.log('MSG : Start GET Price Server');
};
