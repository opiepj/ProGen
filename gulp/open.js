var gulp = require('gulp');
var shelljs = require('shelljs');

gulp.task('open:osx64', function () {
  shelljs.exec('open ./build/Starter/osx64/Starter.app');
});