var socket = io();

angular.module('torrents-app', ['ngMaterial', 'ngAnimate']);

angular.module('torrents-app').config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('pink')
		.accentPalette('orange')
		.dark();
});

angular.module('torrents-app').controller('main', function($scope, $mdToast) {
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