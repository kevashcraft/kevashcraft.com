var gulp = require('gulp')
var debug = require('gulp-debug')
var gulpif = require('gulp-if')
var del = require('del')
var sass = require('gulp-sass')
var twig = require('gulp-twig')
var twigMarkDown = require('twig-markdown')
var minifyJS = require('gulp-minify')
var minifyCSS = require('gulp-clean-css')
var minifyHTML = require('gulp-htmlmin')
var sequence = require('run-sequence')
var fs = require('fs')
var argv = require('yargs').argv
var mergeStream = require('merge-stream')
var rename = require('gulp-rename')
var sitemap = require('gulp-sitemap')

var prod = !!argv.production

var tutorials = JSON.parse(fs.readFileSync('tutorials/tutorials.json'))

var folderNames = JSON.parse(fs.readFileSync('tutorials/folders.json'))

var folders = []
var tags = []

tutorials.forEach(function (tutorial) {
  var t = tutorial.tags[0]
  // create list of tags and most ecent posts
  var d = new Date(tutorial.date)

  // add/update tag list
  var tagIndex = tags.findIndex(function (element) {
    return element.tag === t
  })

  if (tagIndex < 0) {
    tags.push({
      tag: t,
      date: d,
      tutorials: [tutorial]
    })
  } else {
    var tag = tags[tagIndex]
    if (d > tag.date) tag.date = d
    tag.tutorials.push(tutorial)
    tags[tagIndex] = tag
  }

  // add/update folder list
  var f = tutorial.folder
  var folderIndex = folders.findIndex(function (element) {
    return element.folder === f
  })

  if (folderIndex < 0) {
    folders.push({
      folder: f,
      folderName: folderNames[f].name,
      folderLogo: folderNames[f].logo,
      tutorials: [tutorial]
    })
  } else {
    var folder = folders[folderIndex]
    folder.tutorials.push(tutorial)
    folders[folderIndex] = folder
  }
})

tags.sort(function (a, b) {
  if (a.date > b.date) return -1
  if (a.date < b.date) return 1
  if (a.tag.toLowerCase() > b.tag.toLowerCase()) return -1
  if (a.tag.toLowerCase() < b.tag.toLowerCase()) return 1
  return 0
})

tags.forEach(function (element) {
  element.tutorials.sort(function (a, b) {
    var aDate = new Date(a.date)
    var bDate = new Date(b.date)
    if (aDate > bDate) return -1
    if (aDate < bDate) return 1
    if (a.title.toLowerCase() > b.title.toLowerCase()) return -1
    if (a.title.toLowerCase() < b.title.toLowerCase()) return 1
    return 0
  })
})

folders.forEach(function (element) {
  element.tutorials.sort(function (a, b) {
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
    production: prod
  },
  tutorials: tutorials,
  folders: folders,
  tags: tags
}

gulp.task('clean', function (cb) {
  return del('tutorials/dist')
})

// twig rendering
gulp.task('site', function () {
  'use strict'
  var stream = gulp.src('tutorials/site/pages/**/*.twig')
    .pipe(twig({
      errorLogToConsole: true,
      base: 'tutorials/site',
      data: data,
      extend: twigMarkDown
    }))
    .pipe(gulpif(prod, minifyHTML({
      collapseWhitespace: true
    })))
    .pipe(gulp.dest('tutorials/dist'))
  return stream
})

// tags rendering
gulp.task('tags', function () {
  var tasks = []
  for (var i in tags) {
    var tag = tags[i]
    var d = {
      tag: tag.tag,
      tags: tags,
      folders: folders,
      tutorials: tag.tutorials
    }
    tasks.push(gulp.src('tutorials/site/templates/tag.twig')
      .pipe(twig({
        errorLogToConsole: true,
        base: 'tutorials/site',
        data: d,
        extend: twigMarkDown
      }))
      .pipe(gulpif(prod, minifyHTML({
        collapseWhitespace: true
      })))
      .pipe(rename('index.html'))
      .pipe(gulp.dest('tutorials/dist/tags/' + tag.tag.toLowerCase()))
    )
  }
  return mergeStream(tasks)
})

// folders rendering
gulp.task('folders', function () {
  var tasks = []
  for (var i in folders) {
    var folder = folders[i]
    var d = {
      folders: folders,
      folder: folder
    }
    tasks.push(gulp.src('tutorials/site/templates/folder.twig')
      .pipe(twig({
        errorLogToConsole: true,
        base: 'tutorials/site',
        data: d,
        extend: twigMarkDown
      }))
      .pipe(gulpif(prod, minifyHTML({
        collapseWhitespace: true
      })))
      .pipe(rename('index.html'))
      .pipe(gulp.dest('tutorials/dist/' + folder.folder.toLowerCase()))
    )
  }
  return mergeStream(tasks)
})

// sass compilation
gulp.task('styles', function (cb) {
  var stream = gulp.src('tutorials/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(prod, minifyCSS()))
    .pipe(gulp.dest('tutorials/dist/styles/'))
  return stream
})

// minify JS
gulp.task('scripts', function (cb) {
  var stream = gulp.src('tutorials/scripts/**/*.js')
    .pipe(gulpif(prod, minifyJS({
      ext: {
        min: '.js'
      },
      noSource: true
    })))
    .pipe(gulp.dest('tutorials/dist/scripts/'))
  return stream
})

gulp.task('stuff', function (cb) {
  return gulp.src(['tutorials/stuff/**/*', 'tutorials/stuff/**/.*', 'common/stuff/**/*', '*submodules/code-prettify/src/prettify.*'])
    .pipe(gulp.dest('tutorials/dist'))
})

gulp.task('sitemap', function (cb) {
  var stream = gulp.src('tutorials/dist/**/*.html', {
    read: false
  })
  .pipe(sitemap({
    siteUrl: 'https://tutorials.kevashcraft.com'
  }))
  .pipe(gulp.dest('tutorials/dist'))

  return stream
})

gulp.task('all', ['site', 'styles', 'scripts', 'stuff', 'tags', 'folders'])

gulp.task('default', ['clean'], function (cb) {
  sequence('all', 'sitemap')
})

gulp.task('watch', ['all'], function () {
  gulp.watch('tutorials/stuff/**/*.*', ['stuff'])
  gulp.watch('tutorials/styles/**/*.scss', ['styles'])
  gulp.watch('tutorials/scripts/**/*.js', ['scripts'])
  gulp.watch('tutorials/site/**/*.*', ['site', 'blogs'])
  gulp.watch('common/**/*.*', ['site', 'stuff', 'styles', 'scripts'])
})

gulp.task('watch-site', ['all'], function () {
  gulp.watch(['tutorials/site/**/*.twig', 'common/site/**/*.twig'], ['site'])
})

gulp.task('watch-styles', ['all'], function () {
  gulp.watch(['tutorials/styles/**/*.scss', 'common/styles/**/*.scss'], ['styles'])
})

gulp.task('watch-scripts', ['all'], function () {
  gulp.watch(['tutorials/scripts/**/*.js', 'common/scripts/**/*.js'], ['scripts'])
})
