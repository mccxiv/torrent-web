

angular.module('torrent-web-poc', ['ngMaterial', 'ngAnimate']);

angular.module('torrent-web-poc').config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('deep-orange')
		.accentPalette('orange');
});

angular.module('torrent-web-poc').controller('main', function($scope, $mdToast) {
	var socket = io();

	$scope.m = {
		url: '',
		torrent: null,
		submitting: null,
		bgColor: '#f5f5f5'
	};

	checkHash();

	function checkHash() {
		var hash = window.location.hash.substring(1);
		if (hash) {
			setTimeout(function() {
				if ($scope.m.torrent && $scope.m.torrent.url === hash) return;
				if ($scope.m.torrent) $scope.back();
				$scope.m.url = hash;
				$scope.add();
				$scope.$apply();
			}, 500);
		}
	}

	$scope.add = function() {
		$scope.m.submitting = true;
		window.location.hash = '#'+$scope.m.url;
		socket.emit('add-torrent', $scope.m.url);
	};

	$scope.back = function() {
		socket.emit('remove-torrent');
		window.location.hash = '';
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
			case 'add-page': color = '#f5f5f5'; break;
			case 'loading-page': color = '#f5f5f5'; break;
			case 'torrents-page': color = '#f5f5f5'; break;
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
