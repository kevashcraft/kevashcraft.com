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
var sitemap = require('gulp-sitemap');

var prod = argv.production ? true : false;

var site_url = prod ? 'https://blog.kevashcraft.com/' : 'http://dev.blog.kevashcraft.com/'

/*  Blogs Array */
var blogs = JSON.parse(fs.readFileSync('blog/blogs.json'))
var years = []
var tags = []

blogs.forEach(function(blog) {
  blog.mDate = moment(blog.date, 'YYYY-MM-DD HH:mm:ss')
  blog.year = blog.mDate.format('YYYY')
  blog.safe = blog.title.replace(/[^\W -]/g, '')
  blog.unds = blog.title.toLowerCase().replace(/( |-)/g , '_')
  blog.dash = blog.title.toLowerCase().replace(/( |_)/g , '-')
  blog.slug = blog.year + '_' + blog.unds
  blog.file = blog.year + '/' + blog.unds + '.twig'
  blog.snip = blog.year + '/' + blog.unds + '_snippet.twig'
  blog.page = blog.dash
  blog.url = blog.year + '/' + blog.page
  
  var yearIndex = years.findIndex(function(el) {
    el.year === blog.year
  })
  if (yearIndex < 0) {
    years.push({
      year: blog.year,
      blogs: [blog],
    })
  } else {
    years[yearIndex].blogs.push(blog)
  }

  blog.tags.forEach(function(tag) {
    var tagIndex = tags.findIndex(function(el) {
      el.tag === tag
    })
    if (tagIndex < 0) {
      tags.push({
        tag: tag,
        date: blog.mDate,
        blogs: [blog],
      })
    } else {
      tags[tagIndex].blogs.push(blog)
      if (tags[tagIndex].date < blog.mDate) {
        tags[tagIndex].date = blog.mDate
      }
    }
  })
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

tags.sort(function(a, b) {
  if (a.date > b.date) return -1
  if (a.date < b.date) return 1
  if (a.tag.toLowerCase() > b.tag.toLowerCase()) return -1
  if (a.tag.toLowerCase() < b.tag.toLowerCase()) return 1
  return 0
})

tags.forEach(function(element) {
  element.blogs.sort(function(a, b) {
    var aDate = new Date(a.date)
    var bDate = new Date(b.date)
    if (aDate > bDate) return -1
    if (aDate < bDate) return 1
    if (a.title.toLowerCase() > b.title.toLowerCase()) return -1
    if (a.title.toLowerCase() < b.title.toLowerCase()) return 1
    return 0
  })
})

years.forEach(function(element) {
  element.blogs.sort(function(a, b) {
    var aDate = new Date(a.date)
    var bDate = new Date(b.date)
    if (aDate > bDate) return -1
    if (aDate < bDate) return 1
    if (a.title.toLowerCase() > b.title.toLowerCase()) return -1
    if (a.title.toLowerCase() < b.title.toLowerCase()) return 1
    return 0
  })
})


var data = {
  site: {
    production: prod,
    url: site_url
  },
  tags: tags,
  years: years,
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

// tags rendering
gulp.task('tags', function() {
  var tasks = []
  for (var i in tags) {
    var tag = tags[i]
    var d = {
      tag: tag.tag,
      blogs: tag.blogs,
    }
    tasks.push(gulp.src('blog/site/templates/tag.twig')
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
      .pipe(gulp.dest('blog/dist/tags/' + tag.tag.toLowerCase()))
    )
  }
  return mergeStream(tasks);
});

// years rendering
gulp.task('years', function() {
  var tasks = []
  for (var i in years) {
    var year = years[i]
    var d = {
      year: year,
    }
    tasks.push(gulp.src('blog/site/templates/year.twig')
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
      .pipe(gulp.dest('blog/dist/' + year.year.toLowerCase()))
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
  return gulp.src(['blog/stuff/**/*', 'blog/stuff/**/.*', 'common/stuff/**/*'])
    .pipe(gulp.dest('blog/dist'));
});

gulp.task('sitemap', function(cb) {
  var stream = gulp.src('tutorials/dist/**/*.html', {
    read: false
  })
  .pipe(sitemap({
    siteUrl: 'https://tutorials.kevashcraft.com'
  }))
  .pipe(gulp.dest('tutorials/dist'))
  
  return stream
})

gulp.task('all', ['site', 'styles', 'scripts', 'stuff', 'blogs', 'tags', 'years'])

gulp.task('default', ['clean'], function () {
  sequence('all', 'sitemap')
})

gulp.task('watch', ['default'], function() {
  gulp.watch('blog/stuff/**/*.*', ['stuff']);
  gulp.watch('blog/styles/**/*.scss', ['styles']);
  gulp.watch('blog/scripts/**/*.js', ['scripts']);
  gulp.watch('blog/site/**/*.*', ['site', 'blogs']);
});
