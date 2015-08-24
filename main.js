var torrentStream = require('torrent-stream');
var express = require('express');
var request = require('request').defaults({encoding: null});
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mem = require('torrent-memory-storage');
var client;

server.listen(80);
app.use(express.static('public'));

//===============================
// API
//===============================

io.on('connection', function (socket) {
	console.log('New socket connection.');
	socket.on('add-torrent', addTorrent);
	socket.on('remove-torrent', removeTorrent);
});

app.get('/torrent/:index', function(req, res) {
	console.log('Torrent file request.');
	var file = client.files[req.params.index];
	var stream = file.createReadStream();
	stream.pipe(res);
});

//===============================
// Main functions
//===============================

function addTorrent(url) {
	removeTorrent();
	request.get(url, function(err, res, body) {
		client = torrentStream(body, {storage: mem});
		client.ready(torrentReady);
	});
}

function removeTorrent() {
	if (client) {
		client.destroy();
		io.emit('torrent-removed');
	}
}

//===============================
// Helper functions
//===============================

function torrentReady() {
	console.log('Client loaded:', client.infoHash);
	io.emit('torrent', simplifyFilesArray(client.files));
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