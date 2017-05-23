import json
import requests
from roulettewheel import RouletteWheel
import sys
from pprint import pprint

LASTFM_API_KEY = '053c2f4d20bda39f8e353be6e277d6d0'
LASTFM_SHARED_SECRET = '573e5a2995048342d40070134835c0e1'
# new_genres = set()

def urlize(name):
    return name.replace('%', '%25').replace('&', '%26').replace('+', '%2B').replace('#', '%23')


class Artist(object):
    __cache = {}
    __genres = None
    __GETINFO_URL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist={artist}&api_key={api_key}&format=json'
    __GETTOPTAGS_URL = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist={artist}&api_key={api_key}&format=json'
    __name = None
    __popularity = None
    __TAG_LIMIT = 2
    __url_name = None

    def __init__(self, name):
        self.__name = name
        self.__url_name = urlize(name)

    @staticmethod
    def get(name, genres_data=None):
        if name.startswith('#REDIRECT'):
            return None
        if name not in Artist.__cache:
            Artist.__cache[name] = Artist(name)
        if genres_data is not None:
            self.__genres = genres_data
        return Artist.__cache[name]

    def get_genres(self):
        if self.__genres is None:
            print('\tFetching tags of {artist}...'.format(artist=self.__name))
            self.__genres = {}
            response = requests.get(Artist.__GETTOPTAGS_URL.format(api_key=LASTFM_API_KEY, artist=self.__url_name))
            data = json.loads(response.text)
            genres_num = 0
            prev_weight = 0
            try:
                for tag_data in data['toptags']['tag']:
                    tag = tag_data['name'].lower()
                    tag_count = tag_data['count']
                    if genres_num >= Artist.__TAG_LIMIT and tag_count < prev_weight:
                        break
                    if tag.lower() != self.__name.lower() and tag not in Genre.DISALLOWED:
                        # if self.get_popularity() >= 1000:
                        #    new_genres.add(tag)
                        self.__genres[tag] = tag_count * self.get_popularity() // 100
                        genres_num += 1
                        prev_weight = tag_count
            except KeyError:
                pprint(data)
                print(self.__name, self.__url_name)
                sys.exit()
        # pprint(self.__genres)
        return self.__genres

    def get_popularity(self):
        if self.__popularity is None:
            print('\tFetching {artist}\'s popularity...'.format(artist=self.__name))
            response = requests.get(Artist.__GETINFO_URL.format(api_key=LASTFM_API_KEY, artist=self.__url_name))
            data = json.loads(response.text)
            self.__popularity = int(data['artist']['stats']['listeners'])
        return self.__popularity


class Genre(object):
    __cache = {}
    __artists = None
    # __GETINFO_URL = 'http://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag={tag}&api_key={api_key}&format=json'
    __GETTOPARTISTS_URL = 'http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag={tag}&api_key={api_key}&format=json&page={page}'
    __name = None
    __ARTIST_LIMIT = 10
    __url_name = None
    DISALLOWED = ['all', 'seen live']

    def __init__(self, name):
        self.__name = name
        self.__url_name = urlize(name)

    @staticmethod
    def get(name):
        if name not in Genre.__cache:
            Genre.__cache[name] = Genre(name)
        return Genre.__cache[name]

    def get_artists(self):
        if self.__artists is None:
            self.__artists = {}
            page = 1
            total_pages = None
            artists_num = 0
            while (total_pages is None or page <= total_pages) and page <= 2 ** len(self.__artists):
                print('Fetching {genre} artists, page {page}...'.format(genre=self.__name, page=page))
                request_url = Genre.__GETTOPARTISTS_URL.format(api_key=LASTFM_API_KEY, tag=self.__url_name, page=page)
                print(request_url)
                response = requests.get(request_url)
                data = json.loads(response.text)
                total_pages = int(data['topartists']['@attr']['totalPages'])
                for artist_data in data['topartists']['artist']:
                    artist_name = artist_data['name']
                    artist = Artist.get(artist_name, data.get(artist_name, None))
                    if artist is not None:
                        artist_genres = artist.get_genres()
                        if self.__name in artist_genres:
                           if artist.get_popularity() >= 100:
                                print('\t\t{artist} play {genre}!'.format(artist=artist_name, genre=self.__name))
                                self.__artists[artist_name] = artist_genres[self.__name]
                                artists_num += 1
                                # print(artist_name, artist.get_popularity(), self.__name, artist_genres[self.__name])
                                if artists_num >= Genre.__ARTIST_LIMIT:
                                    return self.__artists
                page += 1
        return self.__artists


data = None
try:
    with open('cult_artists.json') as infile:
        data = json.load(infile)
except FileNotFoundError:
    data = {}
try:
    for genre_name in (genre.rstrip() for genre in open('genres.txt')):
        if genre_name.startswith('!'):
            continue
        if genre_name.startswith('#'):
            genre_name = genre_name[2:]
        genre = Genre.get(genre_name)
        for artist_name, artist_count in genre.get_artists().items():
            if artist_name in data:
                data[artist_name][genre_name] = artist_count
            else:
                data[artist_name] = {genre_name: artist_count}
finally:
    with open('cult_artists.json', 'w') as outfile:
        print('Saving data to cult_artists.json...')
        json.dump(data, outfile)
    
    """with open('new_genres.txt', 'w') as outfile:
        print('Saving new genres to new_genres.txt...')
        for new_genre in new_genres:
            outfile.write('{}\n'.format(new_genre))"""
