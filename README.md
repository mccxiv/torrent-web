# Torrent Web, a proof of concept

Stream and download a torrent through a plain http request :grin:

[![](http://i.imgur.com/M2RgYYR.gif)]()

Torrent Web is a self hosted server. It lets you direct download torrents with a simple web UI.

## Get your own (Easy)
- Sign up for [Heroku](https://dashboard.heroku.com/), this gives you a free server.
- Click the Deploy button below to load this app into your Heroku account.  

[![](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/mccxiv/torrent-web)

## Get your own (Advanced)
- Have [node.js](https://nodejs.org/) installed and port 80 available.
- In a command prompt, type: ```npm install -g torrent-web```
- Once done, run it with: ```torrent-web```
- Visit [http://localhost/](http://localhost/) in your browser.

### Command line options
Change the port with --port= or -p=  
`torrent-web -p=8080`

###### © Andrea Stella, ISC license.
