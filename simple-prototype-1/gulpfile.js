var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    jade = require('gulp-jade');

var pages = ["about", "committees", "contact", "place", "sponsors", "timeline",
              "theme"];

function compile(ops) {

  var doJade = ops.jade || ops.all || false;
  var doRest = ops.rest || ops.all || false;
  var doCss  = ops.css  || ops.all || false;

  fs.readdir(__dirname, function(err, files) {
    if(err)
      return gutil.log('Error while reading files from: ' + __dirname);
    // Read Each File that starts with '_'
    files
      //file.startsWith('_')
      .filter((file) => pages.indexOf(file) !== -1 )
      .forEach((file) => {
        gutil.log('Going To Process content in ' + file);
        var end = 'public/' + file;
        if(doJade) {
          gutil.log('Doing Jade...');
          gulp.src(file+"/*.jade")
            .pipe(jade({pretty: true}))
            .pipe(gulp.dest(end));
            //.pipe(gulp.dest(file));
        }
        if(doRest) {
          gutil.log('Doing Rest...');
          gulp.src([file+'/*.*', '!'+file+'/*.html', '!'+file+'/*.jade'])
            .pipe(gulp.dest(end));
        }
      });

  });
  if(doJade) {
    gulp.src(['*.jade', '!template.jade'])
      .pipe(jade())
      .pipe(gulp.dest('public'));
  }
}

function transfer() {
  gutil.log('Transfering Assets...');
  gulp.src('assets/**/*.*')
    .pipe(gulp.dest('public/assets'));
}

gulp.task('jade', function() {
  compile({jade: true});
});

gulp.task('css', function() {
  compile({css: true})
});

gulp.task('build', function() {
  compile({all: true});

});

gulp.task('release', function() {
  compile({all: true});
  transfer();
});

gulp.task('clean', function() {
  gutil.log('Cleaning...');
  // Remove everything in Public/
  // Remove every .html from templates
});


gulp.task('default', ['build']);
