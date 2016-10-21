module.exports = function() {
// Gulp File Starts Here ********************/

// Dependencies
const gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    browserSync = require('browser-sync'),
    autoprefixer = require('autoprefixer'),
    postCss = require('gulp-postcss'),
    jade = require('gulp-jade');

// Configurations
const routes = {
  root: __dirname,
  release: this.root+'/public',
  jade: {
    _start: [''],
    _end: ''
  },
  css: {
    _start: [this.root+'/templates/**/*.css', this.root+'/assets/**/*.css'],
    _end: this.release
  },
  assets: {
    _start: [this.root+'/assets/**/*.*', '!'+this.root+'/assets/**/*.css'],
    _end: this.release+'/assets'
  }
}

const config = {
  uglyRelease: false
}

function warn() {
  gutil.log("![WARNING]!  ->  Process("
    + operation
    + ") - Message: "
    + message
  );
}

function addExt(obj, ext) {
  if(typeof obj == 'object') {
    gutil.log("Is An Array");
    return obj.map((val) => {return val + ext;});
  }
  gutil.log("Is A String");
  return obj + ext;
}

// Test

if(typeof addExt(['dsadasd', 'lol'], 'jade') == 'object')
  gutil.log("Add Ext Returns Right Type")
else {
  gutil.log(typeof addExt(['dsadasd', 'lol'], 'jade'));
  throw new Error("addExt doesnt work!")
}

function getSourceFromTemplate(path, type) {
  var pathParts = path.split('\\');
  if(pathParts.length > 1) {
    gutil.log('File is a template file');
    if(pathParts[0] == 'home') {
      // Home page should be sent differently
      return ["templates/home/*." + type];
      return addExt(["templates/home/*."], type);
    } else {
      var templateName = pathParts[0];
      // Anything else compile and send to release root
      return addExt(["templates/**/" + templateName + "/*."], type);
    }
  } else {
    // A base file so we should update every jade file
    gutil.log('File is a base file');
    return addExt(["templates/home/*.", "templates/**/*.", "!templates/*."], type);
  }
}

const cssProcessors = [
  autoprefixer({browsers: ['last 3 version']})
];


function doJade(path, dest) {
  gutil.log('Starting to process Jade files');
  try {
    gulp.src(path)
      .pipe(jade({pretty: !config.uglyRelease}))
      .pipe(gulp.dest(dest));
  } catch(e) {
    warn("doJade", "Couldn't Process File '" + path + "' into " + dest);
  }

  gutil.log('Jade Files Processed!');
}

function doCss(path, dest) {
  gutil.log('Starting to process CSS files');
  gutil.log('SRC: "' + path + '"');
  gutil.log('DEST: "' + dest + '"');
  gulp.src(path)
    .pipe(postCss(cssProcessors))
    .pipe(gulp.dest(dest));
  gutil.log('Css Files Processed!');
}

function doAssets(path, dest) {
  gutil.log('Starting to process Assets files');

  gulp.src(path)
    .pipe(gulp.dest(dest));
  gutil.log('Assets Files Processed!');
}

// Build Tasks
gulp.task('all-jade', function() {
  var src = ["templates/home/*.jade", "templates/**/*.jade", "!templates/*.jade"],
      dest = "public";
  doJade(src, dest);
});

gulp.task('all-css', function() {
  doCss("templates/**/*.css", "public");
  doCss("assets/**/*.css", "public/assets");
});

gulp.task('all-assets', function() {
  var src = ["assets/**/*.*", "!assets/**/*.css"],
      dest = "public/assets";
  doAssets(src, dest);
});

gulp.task('all-template-files', function() {
  gutil.log('Doing Template Files!');
  var src= ["templates/home/*.js", "templates/home/*.mf", "templates/**/*.*", "!templates/**/*.css", "!templates/**/*.jade"],
      dest = "public";
  doAssets(src, dest);
});

gulp.task('all-compile', ['all-jade', 'all-css', 'all-assets', 'all-template-files']);

gulp.task('browserSync', function() {
    browserSync.init({
      server: {
        baseDir: './public'
      }
    });
    gulp.watch('public/**/*.*', browserSync.reload);
});

/*
* Watch any changes in Jade Templates to compile(process template+main) them and put them in public
* Watch any changes in css to compile them (autoprefixer,..) and put them in public
* Watch any Changes in Assets (Images, js, files, not css/jade) and put them in public
*/
gulp.task('watch-all', function() {

  // Everything that is a jade file should be rebuilt
  gulp.watch('templates/**/*.jade', _getRelPath((path) => {

    gutil.log('Detected Change in Jade Files!!!');
    path = path.substring("templates/".length, path.length);
    var src = getSourceFromTemplate(path, "jade"),
        dest = "public";

    // var pathParts = path.split('\\');
    //
    // if(pathParts.length > 1) {
    //   gutil.log('File is a template file');
    //   if(pathParts[0] == 'home') {
    //     // Home page should be sent differently
    //     src = ["templates/home/*.jade"];
    //   } else {
    //     var templateName = pathParts[0];
    //     // Anything else compile and send to release root
    //     src = ["templates/**/" + templateName + "/*.jade"];
    //   }
    // } else {
    //   // A base file so we should update every jade file
    //   gutil.log('File is a base file');
    //   src = ["templates/home/*.jade", "templates/**/*.jade", "!templates/*.jade"];
    // }
    doJade(src, dest);
  }));


  // Everything in Css   -  Files are done separately
  gulp.watch(["templates/**/*.css", "assets/**/*.css"], _getRelPath((path) => {
    gutil.log("Path to css file: " + path);

    var pathParts = path.split('\\');
    var src = pathParts[0] + "/**/*.css"
        dest = (pathParts[0] == 'assets') ? "public/assets" : "public";
    doCss(src, dest);
  }));

  gulp.watch(["templates/**/*.*", "!templates/**/*.css", "!templates/**/*.jade"], _getRelPath((path) => {
    var src = getSourceFromTemplate(path, "*"),
        dest = "public";
    src.push('!templates/**/*.jade', '!templates/**/*.css');
    doAssets(src, dest);
  }));

  // Everythin that is Assets   - Process separately
  gulp.watch(["assets/**/*.*", "!assets/**/*.css"], _getRelPath((path) => {
    gutil.log(path + " was changed!");
    gutil.log("Processing it...");

    var src = ["assets/**/*.*", "!assets/**/*.css"],
        dest = "public/assets";

    doAssets(src, dest);
  }));


});

function _getRelPath(cb) {
  //TODO CHANGE SYNTAXIS TO AN IMPERATIVE FUNCTION
  return function(event) {
      // Start From App Section ('Assets/Templates')
      var relativePath = event.path.slice(__dirname.length+1); // +1 To get rid of the last slash '/' as well
      return cb(relativePath);
  }
}

// Main Tasks

gulp.task('run', ['all-compile', 'browserSync', 'watch-all']);

gulp.task('release', function() {

});
// Gulp File Ends Here **************************/
}
