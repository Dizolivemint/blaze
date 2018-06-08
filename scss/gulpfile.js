const pkg = require('../package.json'),
  gulp = require('gulp'),
  options = require('gulp-options'),
  cssnano = require('gulp-cssnano'),
  sass = require('gulp-sass'),
  sassLint = require('gulp-sass-lint'),
  rename = require('gulp-rename'),
  header = require('gulp-header'),
  runSequence = require('run-sequence'),
  size = require('gulp-size'),
  fileExists = require('file-exists'),
  source = ['./src/**/*.scss'];


gulp.task('lint', () => gulp.src(source)
    .pipe(sassLint({
      configFile: './.scss-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
);

gulp.task('build', () => {
  let build = gulp.src(source)
    .pipe(sass())
    .pipe(cssnano({
      autoprefixer: {browsers: 'last 2 versions', add: true},
      zindex: false
    }))
    .pipe(rename(function (path) {
      path.extname = '.min.css'
    }))
    .pipe(header('/*!v<%= pkg.version %>*/', {pkg}))
    .pipe(gulp.dest('./dist'));

  return build;
});

gulp.task('file-size', () => gulp.src('../css/blaze.min.css')
    .pipe(size({
      gzip: true,
      showFiles: true
    }))
);

gulp.task('demo', () => gulp.src('./dist/**/blaze*.min.css').pipe(gulp.dest('./demo')));
gulp.task('atoms', () => gulp.src('./dist/blaze.min.css').pipe(gulp.dest('../atoms/www')));
gulp.task('default', done => runSequence('lint', 'build', 'demo', 'atoms', 'file-size', done));
gulp.task('watch', () => gulp.watch(source, ['default']));
