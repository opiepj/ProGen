var gulp = require('gulp');
var shelljs = require('shelljs');

gulp.task('sign:osx64', ['build:osx64'], function () {
  shelljs.exec('codesign -v -f -s "Alexandru Rosianu Apps" ./build/Starter/osx64/Starter.app/Contents/Frameworks/*');
  shelljs.exec('codesign -v -f -s "Alexandru Rosianu Apps" ./build/Starter/osx64/Starter.app');
  shelljs.exec('codesign -v --display ./build/Starter/osx64/Starter.app');
  shelljs.exec('codesign -v --verify ./build/Starter/osx64/Starter.app');
});