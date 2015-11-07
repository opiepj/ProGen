var gulp = require('gulp');
var shelljs = require('shelljs');
var $ = require('gulp-load-plugins')();

['win32', 'osx64', 'linux32', 'linux64'].forEach(function (platform) {
  gulp.task('build:' + platform, function () {
    if (process.argv.indexOf('--toolbar') > 0) {
      shelljs.sed('-i', '"toolbar": false', '"toolbar": true', './src/package.json');
    }

    return gulp.src('./src/**').pipe($.nodeWebkitBuilder({
      platforms: [platform],
      version: '0.12.2',
      winIco: process.argv.indexOf('--noicon') > 0 ? void 0 : './assets-windows/icon.ico',
      macIcns: './assets-osx/icon.icns',
      macZip: true,
      macPlist: {
        NSHumanReadableCopyright: 'aluxian.com',
        CFBundleIdentifier: 'com.aluxian.starter'
      }
    })).on('end', function () {
      if (process.argv.indexOf('--toolbar') > 0) {
        return shelljs.sed('-i', '"toolbar": true', '"toolbar": false', './src/package.json');
      }
    });
  });
});