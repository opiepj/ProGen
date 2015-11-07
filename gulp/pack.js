var gulp = require('gulp');
var shelljs = require('shelljs');
var mergeStream = require('merge-stream');
var runSequence = require('run-sequence');

gulp.task('pack:osx64', ['sign:osx64'], function () {
  shelljs.mkdir('-p', './dist');
  shelljs.rm('-f', './dist/Starter.dmg');
  return gulp.src([]).pipe(require('gulp-appdmg')({
    source: './assets-osx/dmg.json',
    target: './dist/Starter.dmg'
  }));
});

gulp.task('pack:win32', ['build:win32'], function () {
  shelljs.exec('makensis ./assets-windows/installer.nsi');
});

[32, 64].forEach(function (arch) {
  return ['deb', 'rpm'].forEach(function (target) {
    return gulp.task("pack:linux" + arch + ":" + target, ['build:linux' + arch], function () {
      var move_opt, move_png256, move_png48, move_svg;
      shelljs.rm('-rf', './build/linux');
      move_opt = gulp.src(['./assets-linux/starter.desktop', './assets-linux/after-install.sh', './assets-linux/after-remove.sh', './build/Starter/linux' + arch + '/**']).pipe(gulp.dest('./build/linux/opt/starter'));
      move_png48 = gulp.src('./assets-linux/icons/48/starter.png').pipe(gulp.dest('./build/linux/usr/share/icons/hicolor/48x48/apps'));
      move_png256 = gulp.src('./assets-linux/icons/256/starter.png').pipe(gulp.dest('./build/linux/usr/share/icons/hicolor/256x256/apps'));
      move_svg = gulp.src('./assets-linux/icons/scalable/starter.png').pipe(gulp.dest('./build/linux/usr/share/icons/hicolor/scalable/apps'));
      return mergeStream(move_opt, move_png48, move_png256, move_svg).on('end', function () {
        var output, port;
        shelljs.cd('./build/linux');
        port = arch === 32 ? 'i386' : 'x86_64';
        output = "../../dist/Starter_linux" + arch + "." + target;
        shelljs.mkdir('-p', '../../dist');
        shelljs.rm('-f', output);
        shelljs.exec("fpm -s dir -t " + target + " -a " + port + " --rpm-os linux -n starter --after-install ./opt/starter/after-install.sh --after-remove ./opt/starter/after-remove.sh --license MIT --category Chat --url \"https://example.com\" --description \"A sample NW.js app.\" -m \"Alexandru Rosianu <me@aluxian.com>\" -p " + output + " -v " + manifest.version + " .");
        shelljs.cd('../..');
      });
    });
  });
});

gulp.task('pack:all', function (callback) {
  runSequence('pack:osx64', 'pack:win32', 'pack:linux32:deb', 'pack:linux64:deb', callback);
});