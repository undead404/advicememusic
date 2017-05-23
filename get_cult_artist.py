import json
from roulettewheel import RouletteWheel

cult_rw = RouletteWheel()

ARTIST_INFO = '{artist} ({tags}, {popularity} fans)'

def get_cult_artist():
    with open('cult_artists.json') as infile:
        data = json.load(infile)
        for artist_name in data:
            cult_rw.add_variant(variant=artist_name, probability=sum(data[artist_name].values()))
    artist_choice = cult_rw.get_choice()
    artist_tags = data[artist_choice].keys()
    artist_popularity = sum(data[artist_choice].values())
    # return ARTIST_INFO.format(artist=artist_choice, tags=', '.join(artist_tags), popularity=artist_popularity)
    return {'name': artist_choice, 'tags': ', '.join(artist_tags), 'popularity': artist_popularity}

if __name__ == '__main__':
    print(get_cult_artist())