var ipc = require('ipc');

function nameToSite(name) {
	switch(name) {
		case 'bx' : return 'BX.IN.TH';
		case 'cex' : return 'CEX.IO';
		case 'btcchina' : return 'BTCCHINA';
		case 'coins' : return 'COINS.CO.TH';
		case 'btce' : return 'BTC-E';
		case 'bitstamp' : return 'BITSTAMP';
	}
}

(function() {
	$(function() {
		setInterval(function () {
			ipc.send('getPrice');
			console.log("getPrice");
		},5000);
	});
	var app = angular.module('bitwebapp', [])
		.directive('cryptoPrice', function() {
			return {
				restrict: 'A',
				templateUrl : 'crypto-price.html',
				controller : function ($scope) {
					$scope.prices = {
						bx : {
							img : {
								src : 'bx.svg',
								alt : 'BX.IN.TH'
							},
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
							img : {
								src : 'cex.svg',
								alt : 'CEX.IO'
							},
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
							img : {
								src : 'btcchina.png',
								alt : 'BTCChina'
							},
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
							img : {
								src : 'coins.png',
								alt : 'COINS.CO.TH'
							},
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
							img : {
								src : 'btce.png',
								alt : 'BTC-E'
							},
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
							img : {
								src : 'bitstamp.png',
								alt : 'BITSTAMP'
							},
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
				},
				link : function(scope, element) {
					ipc.send('getPrice');
					ipc.on('updatePrice', function(prices) {
						scope.$apply(function () {
							for (var key in prices) {
								scope.prices[key] = prices[key];
							}
						});
						var topSite = {
								buy : {
									site : '',
									price : Number.POSITIVE_INFINITY
								},
								sell : {
									site : '',
									price : 0
								},
								bc : 0,
								cb : 0
						};
						topSite.bc =  prices.coins.type.sell.baht - prices.bx.type.buy.baht;
						topSite.cb =  prices.bx.type.sell.baht - prices.coins.type.buy.baht;
						for (var site in prices) {
							var buyPrice = prices[site].type.buy.baht;
							var sellPrice = prices[site].type.sell.baht;
							if(topSite.buy.price > buyPrice) {
								topSite.buy.price = buyPrice;
								topSite.buy.site = nameToSite(site);
							}
							if(topSite.sell.price < sellPrice) {
								topSite.sell.price = sellPrice;
								topSite.sell.site = nameToSite(site);
							}
						}
						scope.$apply(function () {
							scope.topSite = topSite;
						});
					});
				}
			}
		})
		.controller("BeepCtrl", function($scope, $interval) {
			$scope.beepMode = false;
			$scope.beepPriceInput = true;
			var beepFn;
			$scope.beepAudio = {
				mode : false,
				player : new Audio('beep.mp3')
			};
			$scope.beepAudio.player.loop = true;
			$scope.beep = function() {
				if($scope.beepPrice) {
					if($scope.beepMode) {
						$scope.beepMode = false;
						$scope.beepPriceInput = true;
						$interval.cancel(beepFn);
						$scope.beepAudio.mode = false;
						$scope.beepAudio.player.pause();
						$scope.beepAudio.player.currentTime = 0;
					}
					else {
						$scope.beepMode = true;
						$scope.beepPriceInput = false;
						beepFn = $interval(function() {
									if($scope.topSite) {
										if(($scope.topSite.bc >= $scope.beepPrice) || ($scope.topSite.cb >= $scope.beepPrice)) {
											if(!$scope.beepAudio.mode) {
												$scope.beepAudio.mode = true;
												$scope.beepAudio.player.play();
											}
										}
										else {
											$scope.beepAudio.mode = false;
											$scope.beepAudio.player.pause();
											$scope.beepAudio.player.currentTime = 0;
										}
									}
								}, 1000);
					}
				}
			};
		});
		;
})();
