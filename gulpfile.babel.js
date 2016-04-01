'use strict';

// import
import gulp from 'gulp';
import sass from 'gulp-sass';
import pleeease from 'gulp-pleeease';
import browserify from 'browserify';
import babelify from 'babelify';
import debowerify from 'debowerify';
import jade from 'gulp-jade';
import browserSync from 'browser-sync';
import readConfig from 'read-config';
import eslint from 'gulp-eslint';
import rsync from 'gulp-rsync';

import transform from './lib/vinyl-transform';


// const
const SRC = './src';
const CONFIG = './src/config';
const DEST = './public';


// css
gulp.task('sass', () => {
    const config = readConfig(`${CONFIG}/pleeease.json`);
    return gulp.src(`${SRC}/scss/style.scss`)
        .pipe(sass())
        .pipe(pleeease(config))
        .pipe(gulp.dest(`${DEST}/css`));
});

gulp.task('css', gulp.series('sass'));


// js
gulp.task('copy-bower', () => {
    const config = readConfig(`${CONFIG}/copy-bower.json`);
    return gulp.src(config.src, {
        cwd: 'bower_components'
    }).pipe(gulp.dest(`${DEST}/js/lib`));
});

gulp.task('browserify', () => {
    return gulp.src(`${SRC}/js/kayacSiteMock*`)
        .pipe(transform((file) => {
            return browserify(file.path)
                .transform(babelify)
                .transform(debowerify)
                .bundle();
        }))
        .pipe(gulp.dest(`${DEST}/js`));
});

gulp.task('js', gulp.parallel('browserify', 'copy-bower'));


// html
gulp.task('jade', () => {
    const locals = readConfig(`${CONFIG}/meta.json`);

    return gulp.src(`${SRC}/jade/*.jade`)
        .pipe(jade({
            locals: locals,
            pretty: true
        }))
        .pipe(gulp.dest(`${DEST}`));
});

gulp.task('html', gulp.series('jade'));


// serve
gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: DEST
        }
    });

    gulp.watch([`${SRC}/scss/**/*.scss`], gulp.series('sass', browserSync.reload));
    gulp.watch([`${SRC}/js/**/*.js`], gulp.series('browserify', browserSync.reload));
    gulp.watch([
        `${SRC}/jade/**/*.jade`,
        `${SRC}/config/meta.json`
    ], gulp.series('jade', browserSync.reload));
});

gulp.task('serve', gulp.series('browser-sync'));


// test
gulp.task('eslint', () => {
    return gulp.src(`${SRC}/js/**/*.js`)
        .pipe(eslint({ useEslintrc: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', gulp.parallel('eslint'));


// deploy
gulp.task('deploy-development', () => {
    const config = require(`${CONFIG}/rsync-development.json`);
    config.root = DEST;
    
    return gulp.src(`${DEST}/**/*`)
        .pipe(rsync(config));
});


// default
gulp.task('build', gulp.parallel('css', 'js', 'html'));
gulp.task('default', gulp.series('build', 'serve'));
