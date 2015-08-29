var socket = io();

angular.module('torrents-web-poc', ['ngMaterial', 'ngAnimate']);

angular.module('torrents-web-poc').config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('pink')
		.accentPalette('orange')
		.dark();
});

angular.module('torrents-web-poc').controller('main', function($scope, $mdToast) {
	$scope.m = {
		url: '',
		torrent: null,
		submitting: null,
		bgColor: 'white'
	};

	$scope.add = function() {
		$scope.m.submitting = true;
		socket.emit('add-torrent', $scope.m.url);
	};

	$scope.back = function() {
		socket.emit('remove-torrent');
		$scope.m.torrent = null;
		$scope.m.submitting = null;
	};

	$scope.currentPage = function() {
		if ($scope.m.torrent) return 'torrents-page';
		if ($scope.m.submitting) return 'loading-page';
		return 'add-page';
	};

	$scope.getBgColorStyle = function() {
		var color;
		switch($scope.currentPage()) {
			case 'add-page': color = '#212121'; break;
			case 'loading-page': color = '#212121'; break;
			case 'torrents-page': color = '#455A64'; break;
		}
		return {'background-color': color};
	};

	$scope.size = byteSize;

	socket.on('torrent', function(torrent) {
		$scope.m.url = '';
		$scope.m.torrent = torrent;
		$scope.m.submitting = false;
		$scope.$apply();
	});

	socket.on('bad-torrent', function() {
		$mdToast.show($mdToast.simple().content('Invalid Torrent'));
		$scope.m.submitting = false;
		$scope.$apply();
	});
});

function byteSize(bytes, precision) {
	var kilobyte = 1024,
		megabyte = kilobyte * 1024,
		gigabyte = megabyte * 1024,
		terabyte = gigabyte * 1024;

	if ((bytes >= 0) && (bytes < kilobyte)) {
		return bytes + " B";

	} else if ((bytes >= kilobyte) && (bytes < megabyte)) {
		return (bytes / kilobyte).toFixed(precision) + " KB";

	} else if ((bytes >= megabyte) && (bytes < gigabyte)) {
		return (bytes / megabyte).toFixed(precision) + " MB";

	} else if ((bytes >= gigabyte) && (bytes < terabyte)) {
		return (bytes / gigabyte).toFixed(precision) + " GB";

	} else if (bytes >= terabyte) {
		return (bytes / terabyte).toFixed(precision) + " TB";

	} else {
		return bytes + " B";
	}
}