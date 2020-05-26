const { src, dest, watch, series, parallel } = require("gulp"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  concat = require("gulp-concat"),
  postcss = require("gulp-postcss"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  htmlmin = require("gulp-htmlmin"),
  inject = require("gulp-inject"),
  clean = require("gulp-clean"),
  uglify = require("gulp-uglify"),
  image = require("gulp-image"),
  webpack = require("webpack-stream");
browserSync = require("browser-sync").create();

const path = {
  scssPath: "src/scss/**/*.scss",
  jsPath: "src/app/**/*.js",
  jsMain: "src/app/main.js",
  htmlPath: "src/**/*.html",
  indexHtml: "src/index.html",
  imagesPath: "src/assets/**/*.*",
};

const scssTask = () => {
  return src("src/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist"));
};

const jsTask = () => {
  return src(path.jsMain)
    .pipe(
      webpack({
        module: {
          rules: [
            {
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          ],
        },
        output: {
          filename: "bundle.js",
        },
        mode: "production",
      })
    )
    .pipe(uglify())
    .pipe(dest("dist"));
};

const htmlInject = () => {
  const target = src("./src/index.html");
  const sources = src(["./*.js", "./*.css"], {
    read: false,
    cwd: `${__dirname}/dist`,
    allowEmpty: true,
  });

  return target.pipe(inject(sources)).pipe(dest("dist"));
};

const htmlMin = () => {
  return src("dist/index.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
};

const cacheBustTask = () => {
  const s = new Date().getTime();
  return src(["dist/bundle.js", "dist/style.css"])
    .pipe(
      rename((path) => {
        path.basename += `-${s}`;
      })
    )
    .pipe(dest("dist"));
};

const handleImages = () => {
  return src(path.imagesPath)
    .pipe(
      image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        guetzli: false,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        quiet: true,
      })
    )
    .pipe(dest("dist/assets"));
};

const cleanBefore = () => {
  return src("dist/*", {
    read: false,
    allowEmpty: true,
    force: true,
  }).pipe(clean());
};

const cleanAfter = () => {
  return src(["dist/bundle.js", "dist/style.css"], {
    read: false,
    allowEmpty: true,
    force: true,
  }).pipe(clean());
};

const watchTask = () => {
  watch(
    [path.scssPath, path.jsPath, path.indexHtml, path.imagesPath],
    series(
      cleanBefore,
      handleImages,
      parallel(scssTask, jsTask),
      cacheBustTask,
      cleanAfter,
      htmlInject,
      htmlMin,
      bowserSyncReload
    )
  );
};

const browserSyncInit = (done) => {
  browserSync.init({ server: { baseDir: "dist" } });
  done();
};

const bowserSyncReload = (done) => {
  browserSync.reload();
  done();
};

exports.default = series(
  cleanBefore,
  handleImages,
  parallel(scssTask, jsTask),
  cacheBustTask,
  cleanAfter,
  htmlInject,
  htmlMin,
  browserSyncInit,
  watchTask
);
