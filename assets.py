from flask_assets import Bundle, Environment
from app import app

bundles = {

    'home_js': Bundle(
        'vendor/jquery/jquery.min.js',
        'js/jquery.easing.min.js',
        'js/grayscale.js',
        'vendor/bootstrap/js/bootstrap.min.js',
        'js/lodash.min.js',
        'js/vue.js',
        'js/main.js',
        output='js/packed.js',
        filters='jsmin'),

    'home_css': Bundle(
        'vendor/bootstrap/css/bootstrap.min.css',
        'vendor/font-awesome/css/font-awesome.min.css',
        'css/lora.css',
        'css/montserrat.css',
        'css/grayscale.min.css',
        output='css/packed.css',
        filters='cssmin'),
}

assets = Environment(app)

assets.register(bundles)