var gulp = require('gulp');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var del = require('del');
var sass = require('gulp-sass');
var twig = require('gulp-twig');
var minifyJS = require('gulp-minify');
var minifyCSS = require('gulp-clean-css');
var minifyHTML = require('gulp-htmlmin');
var vulcanize = require('gulp-vulcanize');
var sequence = require('run-sequence');
var fs = require('fs');

var prod = false;

gulp.task('www-clean', function(cb) {
  return del('www/dist');
});

// twig rendering
gulp.task('www-site', function() {
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
gulp.task('www-styles', function(cb) {
  var stream = gulp.src('www/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(prod, minifyCSS()))
    .pipe(gulp.dest('www/dist/styles/'));
  return stream;
});

// minify JS
gulp.task('www-scripts', function(cb) {
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

gulp.task('www-stuff', function(cb) {
  return gulp.src(['www/stuff/**/*', 'www/stuff/**/.*'])
    .pipe(gulp.dest('www/dist'));
});

gulp.task('www', ['www-site', 'www-styles', 'www-scripts', 'www-stuff'])

gulp.task('default', ['www-clean'], function () {
  gulp.start('www')
})

gulp.task('www-watch', ['default'], function() {
  gulp.watch('www/stuff/**/*.*', ['www-stuff']);
  gulp.watch('www/styles/**/*.scss', ['www-styles']);
  gulp.watch('www/scripts/**/*.js', ['www-scripts']);
  gulp.watch('www/site/**/*.twig', ['www-site']);
});
