"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app;

var Artist = function Artist() {
    var _this = this;

    _classCallCheck(this, Artist);

    this.description = "<a href=\"https://www.last.fm/music/%5Bunknown%5D\">Read more on Last.fm</a>";
    this.getBandcampLink = function () {
        return "https://bandcamp.com/search?q=" + encodeURIComponent(_this.name);
    };
    this.getIncustunesLink = function () {
        return "https://incustunes.com/?q=" + encodeURIComponent(_this.name);
    };
    this.getMyspaceLink = function () {
        return "https://myspace.com/search?q=" + _this.getSearchQuery();
    };
    this.getNapsterLink = function () {
        return "http://us.napster.com/search?query=" + encodeURIComponent(_this.name);
    };
    this.getSearchQuery = function () {
        return encodeURIComponent("\"" + _this.name + "\" " + _this.tags);
    };
    this.getSoundcloudLink = function () {
        return "https://soundcloud.com/search?q=" + _this.getSearchQuery();
    };
    this.getYoutubeLink = function () {
        return "https://www.youtube.com/results?search_query=" + _this.getSearchQuery();
    };
    this.imageUrl = "https://lastfm-img2.akamaized.net/i/u/300x300/e833f8859fc5e1cc230d68c6c269dd39.png";
    this.isBeingLoaded = false;
    this.tags = "all";
    this.name = "[unknown]";
    this.popularity = undefined;
};

Vue.component("artist-card", {
    data: function data() {
        return {};
    },
    props: ['artist'],
    template: '<div><img class="img-circle" id="artist-image" ' + 'v-bind:src="artist.imageUrl"/><h2 id="artist-name" ' + 'v-html="artist.name"></h2><h4 id="artist-tags">{{artist.tags}} ' + '({{artist.popularity}} fans).</h4><p>' + '<a class="btn btn-default btn-default tn-small" target="_blank" ' + 'v-bind:href="artist.getBandcampLink()">Bandcamp</a>' + '<a class="btn btn-default btn-small" target="_blank" ' + 'v-bind:href="artist.getIncustunesLink()">IncusTunes</a>' + '<a class="btn btn-default btn-small" target="_blank" ' + 'v-bind:href="artist.getMyspaceLink()">MySpace</a>' + '<a class="btn btn-default btn-small" target="_blank" ' + 'v-bind:href="artist.getNapsterLink()">Napster</a>' + '<a class="btn btn-default btn-small" target="_blank" ' + 'v-bind:href="artist.getSoundcloudLink()">Soundcloud</a>' + '<a class="btn btn-default btn-small" target="_blank" ' + 'v-bind:href="artist.getYoutubeLink()">YouTube</a>' + '</p><p id="artist-description" v-html="artist.description">' + '</p><a href="#page-top" class="btn btn-large page-scroll" ' + 'id="try-again-button" style="font-size: 2.5em;"><i class="fa ' + 'fa-chevron-up animated"></i>ПО НОВОЙ<i class="fa fa-chevron-up ' + 'animated"></i></a></div>'
});

app = new Vue({
    el: "#app",
    data: {
        artist: new Artist(),
        lang: "ru",
        LASTFM_API_KEY: "053c2f4d20bda39f8e353be6e277d6d0",
        LASTFM_API_ROOT: "//ws.audioscrobbler.com/2.0/"
    },
    methods: {
        requestLastfm: function requestLastfm() {
            return fetch(app.LASTFM_API_ROOT + "?api_key=" + app.LASTFM_API_KEY + "&autocorrect=1&artist=" + app.artist.name + "&format=json&method=artist.getinfo&lang=" + app.lang);
        },
        requestMagic: function requestMagic() {
            app.artist = new Artist();
            app.artist.isBeingLoaded = true;
            // console.log("magic...");
            return fetch("/get").then(function (response) {
                return response.json();
            }).then(app.showBasicData
            //.then(app.showBasicData)
            ).then(app.requestLastfm).then(function (response) {
                return response.json();
            }).then(app.showLastfmData).then(app.scrollToResults);
        },
        scrollToResults: function scrollToResults() {
            $("#go-magic").click();
        },
        showBasicData: function showBasicData(response) {
            // console.log(response);
            app.artist.name = response.name;
            app.artist.tags = response.tags;
            app.artist.popularity = response.popularity;
        },
        showLastfmData: function showLastfmData(response) {
            // console.log(response);
            // window.image_data = response.artist.image;
            // console.log(response.artist.image);
            app.artist.imageUrl = _.find(response.artist.image, function (image_data) {
                return image_data.size === "extralarge";
            })["#text"];
            // console.log(app.artist.imageUrl);
            app.artist.description = response.artist.bio.summary;
            app.artist.isBeingLoaded = false;
        }
    }
});