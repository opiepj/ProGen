var gulp = require('gulp');
var manifest = require('../package.json');

gulp.task('release', ['pack:all'], function (callback) {
  return gulp.src('./dist/*').pipe($.githubRelease({
    draft: true,
    manifest: manifest
  }));
});