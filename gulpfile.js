var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var minify = require('gulp-minify');
var sequence = require('run-sequence');
var del = require('del');

gulp.task('default', function (done) {
  sequence(
  'clean',
  'lint',
  'test',
  'build',
  done);
});

gulp.task('clean', function () { del('dist/'); });

gulp.task('lint', function () {
  return gulp.src('**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', shell.task([
  'tape test/**/*.test.js | faucet'
]));

gulp.task('build', function () {
  return gulp
    .src('negator.js')
    .pipe(minify({
      ext: '.min.js'
    }))
    .pipe(gulp.dest('dist/'));
});
