from app import app
from flask import render_template, send_from_directory
import json
from get_cult_artist import get_cult_artist

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/get')
def get_artist():
    return json.dumps(get_cult_artist())

@app.route('/static/<path:path>')
def get_static(path):
    return send_from_directory('static', path)