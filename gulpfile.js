// Requires
// ========

var gulp  = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    jshint = require('gulp-jshint'),
    twig = require('gulp-twig'),
    bower = require('gulp-bower'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    uncss = require('gulp-uncss');



// Tasks
// =====

gulp.task('default', ['watch-dev']);

gulp.task('watch-dev', function() {
    livereload.listen();
    gulp.watch('src/scss/**/*.scss', ['build-style']);
    gulp.watch('src/templates/**/*.twig', ['build-template']);
    gulp.watch('src/js/**/*.js', ['build-javascript']);
    gulp.watch('src/img/**/*', ['build-images']);
    gulp.watch('src/img/**/*', ['build-fonts']);
});

gulp.task('compile', [
    'build-style',
    'build-template',
    'build-javascript',
    'build-images',
    'build-fonts'
 ], function() {});


// Build
// -------

// Style

function buildCss (src) {
    gulp.src(src)
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: true,
        remove: true
    }))
    .pipe(uncss({
        html: ['web/index.html'],
        htmlroot: 'web',
    }))
    .pipe(csso())
    .pipe(gulp.dest('web/css'))
    .pipe(livereload());
}

gulp.task('build-style', function() { return buildCss('src/scss/style.scss'); });

// template
gulp.task('build-template', function() {
    return gulp.src('src/templates/*.twig')
        .pipe(twig())
        .pipe(gulp.dest('web'))
        .pipe(livereload());
});

// javascript
gulp.task('build-javascript', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest('web/js'))
        .pipe(livereload());
});

// images
gulp.task('build-images', function() {
    return gulp.src('src/img/**/*')
        .pipe(gulp.dest('web/img'))
        .pipe(livereload());
});

// images
gulp.task('build-fonts', function() {
    return gulp.src('src/font/**/*')
        .pipe(gulp.dest('web/font'))
        .pipe(livereload());
});

// bower
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('web/bower_components'));
});



// Generator
// =========

gulp.task('create:style:brick', function() {
    gutil.log('creating brick : ' + (gutil.env.name ? gutil.env.name : 'pod'));

    // Style
    string_src("_" + gutil.env.name + ".scss", "// " + gutil.env.name + '\n')
        .pipe(gulp.dest('src/scss/bricks')).pipe(gulp.dest('src/scss/parameters'));
        fs.appendFile('src/scss/bricks/bricks.scss', '\n@import \'' + gutil.env.name + '\';\n');
        fs.appendFile('src/scss/parameters/parameters.scss', '\n@import \'' + gutil.env.name + '\';\n');

    // Template
    string_src("_" + gutil.env.name + ".twig", "<div id=\"" + gutil.env.name + "\">\n    <div class=\"container\">\n        <h3>" + gutil.env.name + "</h3>\n    </div>\n</div>")
        .pipe(gulp.dest('src/templates/bricks'));
    fs.appendFile('src/templates/bricks/bricks.twig', '\n{% include \"_' + gutil.env.name + '.twig\" %}<hr>');

    gutil.log(gutil.env.name + " is created !");
});


gulp.task('create:style:layout', function() {
    gutil.log('creating layout : ' + (gutil.env.name ? gutil.env.name : 'pod'));
    string_src("_" + gutil.env.name + ".scss", "// " + gutil.env.name + "\n")
        .pipe(gulp.dest('src/scss/layouts')).pipe(gulp.dest('src/scss/parameters'));

    fs.appendFile('src/scss/layouts/layouts.scss', '\n@import \'' + gutil.env.name + '\';\n');
    fs.appendFile('src/scss/parameters/parameters.scss', '\n@import \'' + gutil.env.name + '\';\n');

    gutil.log(gutil.env.name + " is created !");
});

function string_src(filename, string) {
    var src = require('stream').Readable({objectMode: true});
    src._read = function () {
        this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }));
        this.push(null);
    };
    return src;
}
