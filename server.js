#!/usr/bin/env node

var torrentStream = require('torrent-stream');
var express = require('express');
var request = require('request').defaults({encoding: null});
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var os = require('os');
var del = require('del');
var mime = require('mime');

var client, url;

var DIR = os.tmpdir()+'/torrent-web-poc';
var PORT = process.env.PORT || 80;

server.listen(PORT);
app.use(express.static('public'));
console.log('Torrent Web started on port '+PORT+' ...');

//===============================
// API
//===============================

io.on('connection', function (socket) {
	console.log('New socket connection.');
	if (client && client.files.length) socket.emit('torrent', torrentRepresentation());
	else socket.emit('no-torrent');
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

function addTorrent(incoming) {
	removeTorrent();
	url = incoming;
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
	deleteFiles();
}

//===============================
// Helper functions
//===============================

function deleteFiles() {
	setTimeout(function() {
		del.sync(DIR+'/**', {force: true});
	}, 1000)
}

function createTorrentEngine(torrent) {
	try {
		client = torrentStream(torrent, {
			uploads: 3,
			connections: 30,
			path: DIR
		});
		client.ready(torrentReady);
	}

	catch(e) {
		console.log('Error creating torrent', e);
		io.emit('bad-torrent');
	}
}

function torrentReady() {
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
		url: url,
		name: client.torrent.name,
		comment: client.torrent.comment,
		infoHash: client.infoHash,
		files: simplifyFilesArray(client.files)
	};
}