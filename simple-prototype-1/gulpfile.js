var gulp = require('gulp');
require('./gulp-build-tasks')();

gulp.task('default', ['all-compile']);
