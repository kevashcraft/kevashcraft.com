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

gulp.task('watch-www', function () {
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

gulp.task('watch-blog', function () {
  gulp.src('Gulpfile-blog.js')
    .pipe(chug({
      tasks: ['watch'],
      args: ['--development'],
    }))
})

gulp.task('default', ['www', 'blog'])

gulp.task('watch', ['watch-www', 'watch-blog'])
