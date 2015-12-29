var gulp = require('gulp'),
    jade = require('gulp-jade'),
    replace = require('gulp-replace');


var jade_src = ['templates/**/*.jade', '!templates/**/_*.jade', '!templates/includes/**/*.jade'];


gulp.task('templates-django', function () {
  return gulp.src(jade_src)
    //replace vars
    .pipe(replace(/(for [a-z]+ in [a-z\.]+[a-z])$/gm,'  |{% $1 %}'))
    .pipe(replace(/else if ([a-z \.\=]+[a-z0-9])$/gm,'  |{% elif $1 %}'))
    .pipe(replace(/(if [a-z \.\=]+[a-z])$/gm,'  |{% $1 %}'))
    .pipe(replace(/\/\/- ?end(for|if)$/gm,'|{% end$1 %}'))
    .pipe(replace(/( {2,})\|(?:{% ?if [a-z\. \=]+ ?%})\n([^\t]*)\n\1\|(?:{% ?endif ?%})/g, function(s){
      s = s.replace(/^  /gm, '');
      return s;
    }))
    .pipe(replace(/( {2,})\|(?:{% ?for [a-z. ]+ ?%})\n([^\t]*)\n\1\|(?:{% ?endfor ?%})/g, function(s){
      s = s.replace(/^  /gm, '');
      return s;
    }))
    .pipe(replace(/=([a-z.]+)$/gm, ' {{$1}}'))
    .pipe(replace(/#{([a-z.]+)}/g, '{{$1}}'))
    // generates django template
    .pipe(jade({pretty:true}))
    .pipe(gulp.dest('build/django'));
});


gulp.task('templates-html', function () {
  return gulp.src(jade_src)
    // generates html
    .pipe(jade({pretty:true}))
    .pipe(gulp.dest('build/html'));
});


gulp.task('templates', ['templates-django', 'templates-html']);
