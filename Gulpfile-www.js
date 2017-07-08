var gulp = require('gulp');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var del = require('del');
var sass = require('gulp-sass');
var twig = require('gulp-twig');
var minifyJS = require('gulp-minify');
var minifyCSS = require('gulp-clean-css');
var minifyHTML = require('gulp-htmlmin');
var sequence = require('run-sequence');
var fs = require('fs');
var argv = require('yargs').argv;

var prod = argv.production ? true : false;

gulp.task('clean', function(cb) {
  return del('www/dist');
});

// twig rendering
gulp.task('site', function() {
  'use strict';
  var stream = gulp.src('www/site/pages/**/*.twig')
    .pipe(twig({
      errorLogToConsole: true,
      base: 'www/site',
    }))
    .pipe(gulpif(prod, minifyHTML({
      collapseWhitespace: true,
    })))
    .pipe(gulp.dest('www/dist'));
  return stream;
});

// sass compilation
gulp.task('styles', function(cb) {
  var stream = gulp.src('www/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(prod, minifyCSS()))
    .pipe(gulp.dest('www/dist/styles/'));
  return stream;
});

// minify JS
gulp.task('scripts', function(cb) {
  var stream = gulp.src('www/scripts/**/*.js')
    .pipe(gulpif(prod, minifyJS({
      ext: {
        min: '.js',
      },
      noSource: true,
    })))
    .pipe(gulp.dest('www/dist/scripts/'));
  return stream;
});

gulp.task('stuff', function(cb) {
  return gulp.src(['www/stuff/**/*', 'www/stuff/**/.*'])
    .pipe(gulp.dest('www/dist'));
});

gulp.task('all', ['site', 'styles', 'scripts', 'stuff'])

gulp.task('default', ['clean'], function () {
  gulp.start('all')
})

gulp.task('watch', ['default'], function() {
  gulp.watch('www/stuff/**/*.*', ['stuff']);
  gulp.watch('www/styles/**/*.scss', ['styles']);
  gulp.watch('www/scripts/**/*.js', ['scripts']);
  gulp.watch('www/site/**/*.twig', ['site']);
});
