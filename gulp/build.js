var gulp = require('gulp');
var shelljs = require('shelljs');
var $ = require('gulp-load-plugins')();

['win32', 'osx64', 'linux32', 'linux64'].forEach(function (platform) {
  gulp.task('build:' + platform, ['typescript'], function () {
    if (process.argv.indexOf('--toolbar') > 0) {
      shelljs.sed('-i', '"toolbar": false', '"toolbar": true', './src/package.json');
    }

    return gulp.src(['./src/**', '!./src/**/*.ts']).pipe($.nodeWebkitBuilder({
      platforms: [platform],
      version: '0.12.2',
      winIco: process.argv.indexOf('--noicon') > 0 ? void 0 : './assets-windows/icon.ico',
      macIcns: './assets-osx/icon.icns',
      macZip: true,
      macPlist: {
        NSHumanReadableCopyright: 'example.com',
        CFBundleIdentifier: 'com.example.example'
      }
    })).on('end', function () {
      if (process.argv.indexOf('--toolbar') > 0) {
        return shelljs.sed('-i', '"toolbar": true', '"toolbar": false', './src/package.json');
      }
    });
  });
});