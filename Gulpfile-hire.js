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
var sitemap = require('gulp-sitemap');

var prod = argv.production ? true : false;

gulp.task('clean', function(cb) {
  return del('hire/dist');
});

// twig rendering
gulp.task('site', function() {
  'use strict';
  var stream = gulp.src('hire/site/pages/**/*.twig')
    .pipe(twig({
      errorLogToConsole: true,
      base: 'hire/site',
    }))
    .pipe(gulpif(prod, minifyHTML({
      collapseWhitespace: true,
    })))
    .pipe(gulp.dest('hire/dist'));
  return stream;
});

// sass compilation
gulp.task('styles', function(cb) {
  var stream = gulp.src('hire/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(prod, minifyCSS()))
    .pipe(gulp.dest('hire/dist/styles/'));
  return stream;
});

// minify JS
gulp.task('scripts', function(cb) {
  var stream = gulp.src('hire/scripts/**/*.js')
    .pipe(gulpif(prod, minifyJS({
      ext: {
        min: '.js',
      },
      noSource: true,
    })))
    .pipe(gulp.dest('hire/dist/scripts/'));
  return stream;
});

gulp.task('stuff', function(cb) {
  return gulp.src(['hire/stuff/**/*', 'hire/stuff/**/.*', 'common/stuff/**/*', '*node_modules/font-awesome/css/**/*', '*node_modules/font-awesome/fonts/**/*', '*node_modules/chart.js/dist/Chart.min.js'])
    .pipe(gulp.dest('hire/dist'));
});

gulp.task('sitemap', function(cb) {
  var stream = gulp.src('hire/dist/**/*.html', {
    read: false
  })
  .pipe(sitemap({
    siteUrl: 'https://hire.kevashcraft.com'
  }))
  .pipe(gulp.dest('hire/dist'))
  
  return stream
})

gulp.task('all', ['site', 'styles', 'scripts', 'stuff'])

gulp.task('default', ['clean'], function () {
  sequence('all', 'sitemap')
})

gulp.task('watch', ['default'], function() {
  gulp.watch('hire/stuff/**/*.*', ['stuff']);
  gulp.watch('hire/styles/**/*.scss', ['styles']);
  gulp.watch('hire/scripts/**/*.js', ['scripts']);
  gulp.watch('hire/site/**/*.twig', ['site']);
});

gulp.task('watch-styles', ['default'], function() {
  gulp.watch(['hire/styles/**/*.scss', 'common/styles/**/*.scss'], ['styles']);
});

gulp.task('watch-scripts', ['default'], function() {
  gulp.watch(['hire/scripts/**/*.js', 'common/scripts/**/*.js'], ['scripts']);
});
