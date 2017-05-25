from flask_assets import Bundle, Environment
from app import app

bundles = {

    'en_js': Bundle(
        'vendor/jquery/jquery.min.js',
        'js/jquery.easing.min.js',
        'js/grayscale.js',
        'vendor/bootstrap/js/bootstrap.min.js',
        'js/lodash.min.js',
        'js/vue.js',
        'js/en_transpiled.js',
        output='js/packed_en.js',
        filters='jsmin'),

    'home_css': Bundle(
        'vendor/bootstrap/css/bootstrap.min.css',
        'vendor/font-awesome/css/font-awesome.min.css',
        'css/lora.css',
        'css/montserrat.css',
        'css/grayscale.min.css',
        'css/style.css',
        output='css/packed.css',
        filters='cssmin'),
    'ru_js': Bundle(
        'vendor/jquery/jquery.min.js',
        'js/jquery.easing.min.js',
        'js/grayscale.js',
        'vendor/bootstrap/js/bootstrap.min.js',
        'js/lodash.min.js',
        'js/vue.js',
        'js/ru_transpiled.js',
        output='js/packed_ru.js',
        filters='jsmin'),
}

assets = Environment(app)

assets.register(bundles)