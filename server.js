var torrentStream = require('torrent-stream');
var express = require('express');
var request = require('request').defaults({encoding: null});
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mime = require('mime');
var client;

server.listen(process.env.PORT || 80);
app.use(express.static('public'));

//===============================
// API
//===============================

io.on('connection', function (socket) {
	console.log('New socket connection.');
	if (client && client.files.length) socket.emit('torrent', torrentRepresentation());
	socket.on('add-torrent', addTorrent);
	socket.on('remove-torrent', removeTorrent);
});

app.get('/torrent/:filename', function(req, res) {
	console.log('Torrent file request.');
	var file = findFile(req.params.filename);
	if (file) {
		var stream = file.createReadStream();
		res.set('Content-Type', mime.lookup(file.name));
		res.set('Content-Length', file.length);
		stream.pipe(res);
	}
	else res.status(404).end();
});

//===============================
// Main functions
//===============================

function findFile(filename) {
	var f = null;
	client.files.forEach(function(file) {
		if (file.name === filename) f = file;
	});
	return f;
}

function addTorrent(url) {
	removeTorrent();
	if (url.indexOf('magnet:') === 0) createTorrentEngine(url);
	else {
		request.get(url, function(err, res, body) {
			createTorrentEngine(body);
		});
	}
}

function removeTorrent() {
	if (client) {
		console.log('Destroying client.');
		client.destroy();
		client = null;
		io.emit('torrent-removed');
	}
}

//===============================
// Helper functions
//===============================

function createTorrentEngine(torrent) {
	try {
		//client = torrentStream(torrent, {storage: mem});
		client = torrentStream(torrent);
		client.ready(torrentReady);
	}

	catch(e) {
		console.log('Error creating torrent', e);
		io.emit('bad-torrent');
	}

}

function torrentReady() {
	console.log('Client loaded:', client);
	io.emit('torrent', torrentRepresentation());
}

function simplifyFilesArray(files) {
	return files.map(function(file) {
		return {
			name: file.name,
			path: file.path,
			length: file.length
		};
	});
}

function torrentRepresentation() {
	return {
		name: client.torrent.name,
		comment: client.torrent.comment,
		infoHash: client.infoHash,
		files: simplifyFilesArray(client.files)
	};
}