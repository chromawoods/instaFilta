var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('scripts', function() {
    gulp.src('./instaFilta.js')
        .pipe(jshint())
        .pipe(rename('instaFilta.min.js'))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', function() {
    gulp.watch('instaFilta.js', ['scripts']);
});