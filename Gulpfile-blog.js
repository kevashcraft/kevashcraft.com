var gulp = require('gulp');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var del = require('del');
var sass = require('gulp-sass');
var twig = require('gulp-twig');
var twigMarkDown = require('twig-markdown');
var minifyJS = require('gulp-minify');
var minifyCSS = require('gulp-clean-css');
var minifyHTML = require('gulp-htmlmin');
var sequence = require('run-sequence');
var fs = require('fs');
var argv = require('yargs').argv;

var prod = argv.production ? true : false;

var blogs = JSON.parse(fs.readFileSync('blog/blogs.json'))



var data = {
  site: {
    production: prod,
  },
  blogs: blogs,
}

gulp.task('clean', function(cb) {
  return del('blog/dist');
});

// twig rendering
gulp.task('site', function() {
  'use strict';
  var stream = gulp.src('blog/site/pages/**/*.twig')
    .pipe(twig({
      errorLogToConsole: true,
      base: 'blog/site',
      data: data,
      extend: twigMarkDown,
    }))
    .pipe(gulpif(prod, minifyHTML({
      collapseWhitespace: true,
    })))
    .pipe(gulp.dest('blog/dist'));
  return stream;
});

// sass compilation
gulp.task('styles', function(cb) {
  var stream = gulp.src('blog/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(prod, minifyCSS()))
    .pipe(gulp.dest('blog/dist/styles/'));
  return stream;
});

// minify JS
gulp.task('scripts', function(cb) {
  var stream = gulp.src('blog/scripts/**/*.js')
    .pipe(gulpif(prod, minifyJS({
      ext: {
        min: '.js',
      },
      noSource: true,
    })))
    .pipe(gulp.dest('blog/dist/scripts/'));
  return stream;
});

gulp.task('stuff', function(cb) {
  return gulp.src(['blog/stuff/**/*', 'blog/stuff/**/.*'])
    .pipe(gulp.dest('blog/dist'));
});

gulp.task('all', ['site', 'styles', 'scripts', 'stuff'])

gulp.task('default', ['clean'], function () {
  gulp.start('all')
})

gulp.task('watch', ['default'], function() {
  gulp.watch('blog/stuff/**/*.*', ['stuff']);
  gulp.watch('blog/styles/**/*.scss', ['styles']);
  gulp.watch('blog/scripts/**/*.js', ['scripts']);
  gulp.watch('blog/site/**/*.*', ['site']);
});
