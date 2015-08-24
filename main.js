var WebTorrent = require('webtorrent');

var client = new WebTorrent({
	//storage: false
});
//var magnetUri = 'http://bt.ocremix.org/torrents/sonic2project_-_Hedgehog_Heaven.torrent';
var magnetUri = 'http://bt.ocremix.org/torrents/dkcproject-Kong_in_Concert_CD_Album.torrent';

client.add(magnetUri, function (torrent) {
	// Got torrent metadata!
	console.log('Client is downloading:', torrent.infoHash);

	torrent.files.forEach(function(file) {
		file.deselect();
	});

	var server = torrent.createServer();
	server.listen(80); // start the server listening to a port
});