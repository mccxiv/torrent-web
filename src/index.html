<!doctype html>
<html ng-app="torrent-web-poc">
    <head>
        <meta charset="UTF-8">
        <title>Torrent Web, a proof of concept</title>
        <link rel="icon" type="image/png" href="logo.png">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <style>
          body {background-color: rgb(33, 33, 33);}
          [ng-cloak] {display: none;}
        </style>
    </head>
    <body ng-controller="main" ng-style="getBgColorStyle()" ng-cloak>

        <div class="panels" ng-switch on="currentPage()">
            <md-content ng-switch-when="add-page" class="add-page" layout="row" layout-align="center center">
                <form ng-submit="add()" class="torrent-input-box">
                    <md-input-container>
                        <label>Torrent or Magnet link</label>
                        <input type="text" ng-model="m.url">
                    </md-input-container>
                </form>
            </md-content>

            <md-content ng-switch-when="loading-page" class="loading-page" layout="row" layout-align="center center" flex>
                <md-progress-circular md-diameter="20" md-mode="indeterminate"></md-progress-circular>
                <span>Fetching Torrent Metadata...</span>
            </md-content>

            <md-content ng-switch-when="torrents-page" class="torrents-page" layout="column" layout-align="start center">
                <h1 class="md-display-1">
                    <md-button ng-href="torrent" class="md-icon-button zip-download" aria-label="Download as zip">
                        <md-tooltip>Download as Zip</md-tooltip>
                        <md-icon class="material-icons">file_download</md-icon>
                    </md-button>
                    {{m.torrent.name}}
                </h1>
                <div class="torrent" ng-repeat="file in m.torrent.files" layout="row">
                    <md-button ng-href="torrent/{{file.name}}" target="_blank" class="md-icon-button open-button" aria-label="Open in browser">
                        <md-tooltip>Open in browser</md-tooltip>
                        <md-icon class="material-icons">open_in_new</md-icon>
                    </md-button>
                    <a flex class="filename" ng-href="torrent/{{file.name}}" download="{{file.name}}">{{file.name}}</a>
                    <span>{{size(file.length, 1)}}</span>
                </div>
            </md-content>
        </div>

        <md-button class="md-icon-button back-button" aria-label="Cancel" ng-click="back();" ng-if="m.torrent || m.submitting">
            <md-tooltip md-direction="right">
                Go Back. Stops torrent
            </md-tooltip>
            <md-icon class="material-icons">keyboard_backspace</md-icon>
        </md-button>

        <script src="script.js"></script>
    </body>
</html>
