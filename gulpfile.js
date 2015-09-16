/**
 * Created by jerod on 9/16/2015.
 */
var gulp = require('gulp'),
    inlineCss = require('gulp-inline-css'),
    rename = require('gulp-rename');

gulp.task('default', function() {
    return gulp.src('./preInlined.html')
        .pipe(inlineCss({
            preserveMediaQueries: true
        }))
        .pipe(rename('email.html'))
        .pipe(gulp.dest('.'));
});