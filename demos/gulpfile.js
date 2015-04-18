'use strict';

var path = require('path');
var gulp = require('gulp');
var del = require('del');
var util = require('gulp-util');
var chalk = require('chalk');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

/* JS */
var browserify = require('browserify');
var ngAnnotate = require('browserify-ngannotate');

/* CSS */
var less = require('gulp-less');

/* Lint */
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish-source');

/* Paths */
var outdir = GLOBAL.outdir || 'out';

/* Port to serve demos on */
var demoPort = 3003;

/* NPM files to add to demo */
var npmAssets = '../node_modules/**/*.@(png|jpg|woff|woff2|ttf|otf|eot|svg)';

gulp.task('default', ['demo']);

gulp.task('modules', function () {
	return gulp.src(npmAssets, { base: '../', buffer: false })
		.pipe(gulp.dest(outdir))
		;
});

gulp.task('demo', ['html', 'js', 'less', 'modules'], function () {
	var http = require('http');
	var connect = require('connect');
	var compression = require('compression');
	var serveStatic = require('serve-static');
	var app = connect();
	app.use(compression());
	app.use(serveStatic(outdir));
	util.log('Starting HTTP server on port ' + demoPort);
	http.createServer(app)
		.listen(demoPort);
});

gulp.task('html', function () {
	return gulp.src('index.html')
		.pipe(gulp.dest(outdir))
		;
});

gulp.task('js', function () {
	return browserify({ entries: ['./script.js'], debug: true })
		.transform(ngAnnotate)
		.bundle()
		.pipe(source('script.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(outdir))
		;
});

gulp.task('less', function () {
	return gulp.src('style.less')
		.pipe(less({ relativeUrls: true }))
		.pipe(gulp.dest(outdir))
		;
});

gulp.task('lint', function () {
	return gulp.src(['../*.js', './*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter))
		;
});

gulp.task('clean', function (cb) {
	del(outdir, cb);
});
