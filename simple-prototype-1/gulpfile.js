var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync');

var pages = ["about", "committees", "contact", "place", "sponsors", "timeline",
              "theme"];
/* processTemplate(path_name_of_template, options_of_file_types)
 * Take Everything inside the template folder,
 * process everything (jade, uglify, minify, etc),
 * and output it into the public/template folder
 * If the template is 'home', put in public_root
*/
function processTemplate(file, ops) {
  gutil.log('Going To Process content in ' + file);

  var end = 'public/' + file;
  var start = 'templates/' + file;

  if(file == 'home') {
    end = 'public';
  }

  if(ops.jade || ops.all) {
    gutil.log('--Doing Jade...');
    gulp.src(start+"/*.jade")
      .pipe(jade({pretty: true}))
      //TODO Inject uglify and minify
      .pipe(gulp.dest(end));
    gutil.log('--Finished Jade');
  }
  if(ops.rest || ops.all) {
    gutil.log('--Doing Rest...');
    gulp.src([start+'/*.*', '!'+start+'/*.html', '!'+start+'/*.jade'])
    //TODO Inject uglify and minify
      .pipe(gulp.dest(end));
    gutil.log('--Finished Rest');
  }
}

function compile(ops) {

  var doJade = ops.jade || ops.all || false;
  var doRest = ops.rest || ops.all || false;
  var doCss  = ops.css  || ops.all || false;

  fs.readdir(__dirname+'/templates', function(err, files) {
    if(err)
      return gutil.log('Error while reading files from: ' + __dirname);
    // Read Each File that starts with '_'
    files
      //file.startsWith('_')
      .filter((file) => ['template.jade'].indexOf(file) === -1 )
      .forEach((file) => {
        gutil.log('File to be Processed: ' + file);
        processTemplate(file, ops);
      });
      gutil.log('Finished Compiling Templates!');
  });
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

gulp.task('browserSync', function() {
    browserSync.init({
      server: {
        baseDir: './public'
      }
    });
    gulp.watch('public/**/*.*', browserSync.reload);
    //gulp.watch(['./**/*.css', './**/*.jade', '!public'], ['build'])
    // Everything that is a jade file should be rebuilt
    gulp.watch(['templates/**/*.jade'], ['jade']);
    // Everything that is note a jade file should be passed
    gulp.watch(['templates/**/*.*', '!templates/**/*.jade', '!templates/**/*.html'], function(event) {
      // Get Name Of the Template Page
      var rel = event.path.substring(__dirname.length+'/templates/'.length);
      rel = rel.split('/')[0];
      gutil.log(rel);
      processTemplate(rel, {rest: true});
    });
});

gulp.task('clean', function() {
  gutil.log('Cleaning...');
  // Remove everything in Public/
  // Remove every .html from templates
});

gulp.task('default', ['build']);
