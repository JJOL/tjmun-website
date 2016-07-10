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
      //.pipe(gulp.dest(file));
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
  /*if(doJade) {
    gutil.log('Transfering Jade root files to public!');
    gulp.src(['*.jade', '!template.jade'])
      .pipe(jade())
      .pipe(gulp.dest('public'));
  }*/
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
    gulp.watch(['./**/*.css', './**/*.jade', '!public'], function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      //event.path.split('/', )
      console.log('Dirname: ' + __dirname);
      var relativePath = event.path.substring(__dirname.length);
      console.log('Relative: ' + relativePath);
      //processTemplate(file, {all: true});
    });
});

gulp.task('clean', function() {
  gutil.log('Cleaning...');
  // Remove everything in Public/
  // Remove every .html from templates
});

gulp.task('default', ['build']);
