"use strict";
var app;
class Artist{
    constructor(){
        this.description = "[unknown] is a standard artist name used at MusicBrainz for indicating where an artist name is lacking or not provided. <a href=\"https://www.last.fm/music/%5Bunknown%5D\">Read more on Last.fm</a>";
        this.getBandcampLink = () => {
            return "https://bandcamp.com/search?q=" + encodeURIComponent(this.name);
        };
        this.getIncustunesLink = () => {
            return "https://incustunes.com/?q=" + encodeURIComponent(this.name);
        };
        this.getMyspaceLink = () => {
            return "https://myspace.com/search?q=" + this.getSearchQuery();
        };
        this.getNapsterLink = () => {
            return "http://us.napster.com/search?query=" + encodeURIComponent(this.name);
        };
        this.getSearchQuery = () => {
            return encodeURIComponent("\"" + this.name + "\" " + this.tags);
        };
        this.getSoundcloudLink = () => {
            return "https://soundcloud.com/search?q=" + this.getSearchQuery();
        };
        this.getYoutubeLink = () => {
            return "https://www.youtube.com/results?search_query=" + this.getSearchQuery();
        };
        this.imageUrl = "https://lastfm-img2.akamaized.net/i/u/300x300/e833f8859fc5e1cc230d68c6c269dd39.png";
        this.tags = "all";
        this.name = "[unknown]";
        this.popularity = undefined;
    }
    
}

Vue.component("artist-card", {
    data: () => {
        return {};
    },
    props: ['artist'],
    template: '<div><img class="img-circle" id="artist-image" ' +
        'v-bind:src="artist.imageUrl"/><h2 id="artist-name" ' +
        'v-html="artist.name"></h2><h4 id="artist-tags">{{artist.tags}} ' +
        '({{artist.popularity}} fans).</h4><p>' +
        '<a class="btn btn-info btn-small" target="_blank" ' +
        'v-bind:href="artist.getBandcampLink()">Bandcamp</a>' +
        '<a class="btn btn-info btn-small" target="_blank" ' +
        'v-bind:href="artist.getIncustunesLink()">IncusTunes</a>' +
        '<a class="btn btn-info btn-small" target="_blank" ' +
        'v-bind:href="artist.getMyspaceLink()">MySpace</a>' +
        '<a class="btn btn-info btn-small" target="_blank" ' +
        'v-bind:href="artist.getNapsterLink()">Napster</a>' +
        '<a class="btn btn-info btn-small" target="_blank" ' +
        'v-bind:href="artist.getSoundcloudLink()">Soundcloud</a>' +
        '<a class="btn btn-info btn-small" target="_blank" ' +
        'v-bind:href="artist.getYoutubeLink()">YouTube</a>' +
        '</p><p id="artist-description" v-html="artist.description">' +
        '</p><a href="#page-top" class="btn btn-large page-scroll" ' +
        'id="try-again-button" style="font-size: 2.5em;"><i class="fa ' +
        'fa-chevron-up animated"></i>TRY AGAIN<i class="fa fa-chevron-up ' +
        'animated"></i></a></div>'
});

app = new Vue({
    el: "#app",
    data: {
        artist: new Artist(),
        lang: "en",
        LASTFM_API_KEY: "053c2f4d20bda39f8e353be6e277d6d0",
        LASTFM_API_ROOT: "//ws.audioscrobbler.com/2.0/"
    },
    methods: {
        requestLastfm: () => {
            return fetch(app.LASTFM_API_ROOT + "?api_key=" +
                app.LASTFM_API_KEY + "&autocorrect=1&artist=" +
                app.artist.name + "&format=json&method=artist.getinfo");
        },
        requestMagic: () => {
            app.artist = new Artist();
            // console.log("magic...");
            return fetch("/get")
                .then(response => {
                    return response.json();
                })
                .then(app.showBasicData)
                //.then(app.showBasicData)
                .then(app.requestLastfm)
                .then(response => {
                    return response.json();
                })
                .then(app.showLastfmData)
                .then(app.scrollToResults);
        },
        scrollToResults: () => {
            $("#go-magic").click();
        },
        showBasicData: (response) => {
            // console.log(response);
            app.artist.name = response.name;
            app.artist.tags = response.tags;
            app.artist.popularity = response.popularity;
        },
        showLastfmData: (response) => {
            // console.log(response);
            app.artist.imageUrl = _.find(response.artist.image, (image_data) => {
                return image_data.size === "extralarge";
            })["#text"];
            // console.log(app.artist.imageUrl);
            app.artist.description = response.artist.bio.summary;
        }
    }
});