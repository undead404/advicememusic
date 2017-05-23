var gulp = require('gulp'), // Сообственно Gulp JS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat') // Склейка файлов

gulp.task('js', function() {
    gulp.src(['./static/js/**/*.js', '!./static/vendor/**/*.js'])
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        .pipe(gulp.dest('./public/js'))
});
gulp.task('images', function() {
    gulp.src('./static/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'))

});