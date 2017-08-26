var gulp = require('gulp');

// require other packages

var concat = require('gulp-concat');
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
var nano = require('gulp-cssnano');
var notifier = require('node-notifier');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var msg = function( title, message ){
	notifier.notify({
		title: title,
		message: message
	});
};

var scriptInput = [
	'./src/js/Gdz.Base.js',

	'./src/packages/jquery/dist/jquery.min.js',
	'./src/packages/magnific-popup/dist/jquery.magnific-popup.js',
	'./src/packages/mustache.js/mustache.min.js',
	'./src/packages/Sortable/Sortable.min.js',
	'./src/packages/clipboard/dist/clipboard.min.js',

	'./src/js/modules/*.js',

	'./src/js/modules/pubsub/main.js',
	'./src/js/modules/pubsub/pubsub.js',
	'./src/js/modules/pubsub/inputModule.js',
	'./src/js/modules/pubsub/listModule.js',
	'./src/js/modules/pubsub/outputModule.js',
	'./src/js/modules/pubsub/psEvents.js',
	'./src/js/Gdz.Scripts.js',
	'./src/js/Gdz.Ready.js',
	'./src/js/Gdz.Load.js'
];

var sassInput = [
	'./src/sass/*.scss'
];

var sassOutput = './dist/css/';
var scriptOutput = './dist/js/';

var sassOpts = {
	errLogToConsole: true,
	outputStyle: 'nested',
	includePaths: [
		'./src/sass',
		'./src/packages/fontawesome/scss'
	]
};

var criticalSassOpts = {
	outputStyle: 'nested'
};

var autoprefixerOpts = {
	browsers: ['> 2% in GB', 'IE >= 9']
};


gulp.task('icons', function() {
	return gulp
		.src('./src/packages/fontawesome/fonts/**.*')
		.pipe(gulp.dest('./dist/fonts'));
});


// autoprefix debug info
gulp.task('autoprefix-debug', function() {
	var info = autoprefixer( autoprefixerOpts ).info();
	console.log( info );
});


// scripts task
gulp.task('scripts', function() {
	return gulp.src( scriptInput )
		.pipe(concat('app.js'))
		.pipe(gulp.dest( scriptOutput ))
		.pipe(uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest( scriptOutput ));
});

// styles task
gulp.task('styles', function() {
	return gulp.src( sassInput )
		.pipe(sass( sassOpts))
		.pipe(gulp.dest( sassOutput ))
		.pipe(sourcemaps.init())
		.pipe(cssmin({compatibility: 'ie8'}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest( sassOutput ));
});

// critical styles task
gulp.task('critical', function() {
	return gulp.src('./src/sass/base/critical.scss')
		.pipe(sass({includePaths: ['./src/sass/base'], outputStyle: 'expanded'}))
		.pipe(gulp.dest('./dist/css/'));
});

// watch task
gulp.task('watch', function() {
	gulp.watch([
		'./src/js/*.js',
		'./src/js/**/*.js'
	], ['scripts'], msg( 'Javascript Build', 'Built app.js' ));
	gulp.watch([
		'./src/sass/*.scss',
		'./src/sass/**/*.scss'
	], ['styles'], msg( 'Sass Build', 'Built styles.css' ));
});

gulp.task('default', ['scripts', 'styles', 'watch']);
