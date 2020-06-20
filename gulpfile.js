const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const args = getCommandLineArguments(process.argv);

gulp.task('tinymcesass', () => {
  return gulp
    .src('./src/assets/scss/custom.scss')
    .pipe(
      sass({ includePaths: ['node_modules/bootstrap/scss'] }).on(
        'error',
        sass.logError
      )
    )
    .pipe(
      gulp.dest(isProd(args.env) ? './build/static/css' : './public/assets/css')
    );
});

gulp.task('tinymce', gulp.series('tinymcesass'));

function getCommandLineArguments(argList) {
  let arg = {},
    a,
    opt,
    thisOpt,
    curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;
}

function isProd(env) {
  return env === 'prod';
}
