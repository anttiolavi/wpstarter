'use strict';

var gulp = require('gulp'),
  util = require('gulp-util'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  jscs = require('gulp-jscs'),
  rename = require('gulp-rename'),
  htmlreplace = require('gulp-html-replace'),
  sass = require('gulp-sass'),
  cssglobbing = require('gulp-css-globbing'),
  csso = require('gulp-csso'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer-core'),

  options = require('./config'),
  sourcePath = options.sourcePath,
  outputPath = options.outputPath,
  sassOptions = options.sass,
  processors = [
    autoprefixer({
      browsers: ['last 2 versions', '> 1% in FI', 'ie 9']
    })
  ],

  isProd = Boolean(util.env.prod);

gulp.task('assets', function() {
  return gulp.src(sourcePath + '/assets/**/*')
    .pipe(gulp.dest(assetOutputPath));
});

gulp.task('build:page-templates', function() {
  var timestamp = Date.now();
  return gulp.src(sourcePath + '/pages/*.php')
    .pipe(htmlreplace({
      js: {
        src: 'scripts.js?' + timestamp,
        tpl: '<script type="text/javascript" src="assets/js/%s"></script>'
      },
      css: {
        src: 'style.css?' + timestamp,
        tpl: '<link rel="stylesheet" type="text/css" href="assets/css/%s">'
      }
    }))
    .pipe(gulp.dest(templateOutputPath));
});

gulp.task('build:components', function() {
  return gulp.src(sourcePath + '/components/*.php')
    .pipe(gulp.dest('.'));
});

gulp.task('jscs', function() {
  return gulp.src(sourcePath + '/**/*.js')
    .pipe(jscs());
});

gulp.task('build:js', ['jscs'], function() {
  return gulp.src([
    sourcePath + '/js/**/*.js',
    sourcePath + '/components/**/*.js'
  ])
  .pipe(concat('scripts.js'))
  .pipe(gulpif(isProd, uglify()))
  .pipe(gulp.dest(assetOutputPath + '/js'));
});

gulp.task('build:css', function() {
  return gulp.src(sourcePath + '/**/*.scss')
    .pipe(cssglobbing({
      extensions: ['.css', '.scss']
    }))
    .pipe(sass(sassOptions))
    .pipe(postcss(processors))
    .pipe(gulpif(isProd, csso()))
    .pipe(gulp.dest(assetOutputPath + '/css'));
});

gulp.task('watch', ['build:all'], function() {
  gulp.watch([
    sourcePath + '/*.scss',
    sourcePath + '/**/*.scss',
    '!' + sourcePath + '/vendor/**'
  ], ['build:css']);

  gulp.watch([
    sourcePath + '/*.js',
    sourcePath + '/**/*.js'
  ], ['build:js']);

  gulp.watch([
    sourcePath + '/pages/*.php'
  ], ['build:page-templates']);

  gulp.watch([
    sourcePath + '/components/*.php'
  ], ['build:components']);

  gulp.watch([
    sourcePath + '/assets/**/*'
  ], ['assets']);

});

gulp.task('build:all', [
  'build:css',
  'build:js',
  'build:page-templates',
  'build:components',
  'assets'
]);

gulp.task('default', ['watch']);
