"use strict";
// ARTIST_GETINFO_URL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist={artist}&api_key={api_key}&format=json"
window.LASTFM_API_KEY = "053c2f4d20bda39f8e353be6e277d6d0";
window.LASTFM_API_ROOT = "https://ws.audioscrobbler.com/2.0/";

function flush() {
    $("#magic-results").hide();
}

function request_magic(event) {
    flush();
    console.log("magic...");
    event.preventDefault();
    return $.getJSON("/get")
        .pipe(function (response) {
            // console.log(response);
            // window.response = response;
            $("#artist-name").text(response["name"]);
            $("#artist-genres").text(response["tags"] + ", " + response["popularity"] + " fans.");
            return window.showArtist(response["name"]);
        });
}

function showArtist(artist_name) {
    console.log(artist_name);
    return $.getJSON(window.LASTFM_API_ROOT, {
        "api_key": window.LASTFM_API_KEY,
        "autocorrect": 1,
        "artist": artist_name,
        "format": "json",
        "method": "artist.getinfo"
        })
        .pipe(function (response) {
            // console.log(encodeURIComponent(artist_name));
            // console.log(response);
            $("#artist-image").attr("src", _.find(response["artist"]["image"], function (image_data) {
                return image_data["size"] === "extralarge";
            })["#text"]);
            $("#artist-description").html(response["artist"]["bio"]["summary"]);
            $("#lastfm-url").attr("href", response["artist"]["url"]);
        })
        .pipe(function () {
            // console.log("success");
            $("#magic-results").show();
            $("#go-magic").click();
        });
}

$(function () {
    $("#magic-button").click(request_magic);
});