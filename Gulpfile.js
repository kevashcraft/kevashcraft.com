var gulp = require('gulp')
var chug = require('gulp-chug')
var argv = require('yargs').argv

var production = argv.devel ? '--development' : '--production';

gulp.task('www', function () {
  gulp.src('Gulpfile-www.js')
    .pipe(chug({
      args: [production],
    }))
})

gulp.task('www-watch', function () {
  gulp.src('Gulpfile-www.js')
    .pipe(chug({
      tasks: ['watch'],
      args: ['--development'],
    }))
})

gulp.task('blog', function () {
  gulp.src('Gulpfile-blog.js')
    .pipe(chug({
      args: [production],
    }))
})

gulp.task('blog-watch', function () {
  gulp.src('Gulpfile-blog.js')
    .pipe(chug({
      tasks: ['watch'],
      args: ['--development'],
    }))
})

gulp.task('tutorials', function () {
  gulp.src('Gulpfile-tutorials.js')
    .pipe(chug({
      args: [production],
    }))
})

gulp.task('tutorials-watch', function () {
  gulp.src('Gulpfile-tutorials.js')
    .pipe(chug({
      tasks: ['watch'],
      args: ['--development'],
    }))
})

gulp.task('default', ['www', 'blog', 'tutorials'])

gulp.task('watch', ['www-watch', 'blog-watch', 'tutorials-watch'])
