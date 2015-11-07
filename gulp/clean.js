var gulp = require('gulp');
var shelljs = require('shelljs');

gulp.task('clean', function () {
  shelljs.rm('-rf', './build');
  shelljs.rm('-rf', './dist');
});