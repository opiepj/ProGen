var gulp = require('gulp');
var ts = require('gulp-typescript');
var shelljs = require('shelljs');
var $ = require('gulp-load-plugins')();

gulp.task('typescript', function () {
  return gulp.src(['./src/**/*.ts')
    .pipe(ts({
      noImplicitAny: true,
      out: 'app.js'
    }))
	  .pipe($.nodeWebkitBuilder({
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
