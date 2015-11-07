var gulp = require('gulp');
var shelljs = require('shelljs');

gulp.task('run:osx64', ['build:osx64'], function () {
  shelljs.exec('open ./build/Starter/osx64/Starter.app');
});