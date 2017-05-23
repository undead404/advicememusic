from app import app
from flask import render_template, send_from_directory
import json
from get_cult_artist import get_cult_artist
from pprint import pprint

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/get')
def get_artist():
    cult_artist = get_cult_artist()
    pprint(cult_artist)
    return json.dumps(cult_artist)

@app.route('/static/<path:path>')
def get_static(path):
    return send_from_directory('static', path)