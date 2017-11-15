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
var mergeStream = require('merge-stream');
var rename = require('gulp-rename');
var moment = require('moment')

var prod = argv.production ? true : false;

var site_url = prod ? 'https://blog.kevashcraft.com/' : 'http://dev.blog.kevashcraft.com/'

var blogs = JSON.parse(fs.readFileSync('blog/blogs.json'))

blogs.forEach(function(blog) {
  var mDate = moment(blog.date, 'YYYY-MM-DD HH:mm:ss')
  blog.year = mDate.format('YYYY')
  blog.safe = blog.title.replace(/[^\W -]/g, '')
  blog.unds = blog.title.toLowerCase().replace(/( |-)/g , '_')
  blog.dash = blog.title.toLowerCase().replace(/( |_)/g , '-')
  blog.slug = blog.year + '_' + blog.unds
  blog.file = blog.year + '/' + blog.unds + '.twig'
  blog.snip = blog.year + '/' + blog.unds + '_snippet.twig'
  blog.page = blog.dash
  blog.url = blog.year + '/' + blog.page
  
})

blogs.sort(function (a, b) {
  if (a.order) {
    if (b.order) {
      if (a.order < b.order) return -1
      if (a.order > b.order) return 1
    } else {
      return -1
    }
  }

  var aDate = new Date(a.date)
  var bDate = new Date(b.date)

  if (aDate > bDate) return -1
  if (aDate < bDate) return 1
  return 0
})

var data = {
  site: {
    production: prod,
    url: site_url
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

// twig rendering
gulp.task('blogs', function() {
  var tasks = []
  for (var i in blogs) {
    var blog = blogs[i]
    var d = {
      site: data.site,
      blog: blog,
    }
    tasks.push(gulp.src('blog/site/templates/blog.twig')
      .pipe(twig({
        errorLogToConsole: true,
        base: 'blog/site',
        data: d,
        extend: twigMarkDown,
      }))
      .pipe(gulpif(prod, minifyHTML({
        collapseWhitespace: true,
      })))
      .pipe(rename("index.html"))
      .pipe(gulp.dest('blog/dist/' + blog.url))
    )
  }
  return mergeStream(tasks);
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

gulp.task('all', ['site', 'styles', 'scripts', 'stuff', 'blogs'])

gulp.task('default', ['clean'], function () {
  gulp.start('all')
})

gulp.task('watch', ['default'], function() {
  gulp.watch('blog/stuff/**/*.*', ['stuff']);
  gulp.watch('blog/styles/**/*.scss', ['styles']);
  gulp.watch('blog/scripts/**/*.js', ['scripts']);
  gulp.watch('blog/site/**/*.*', ['site', 'blogs']);
});
