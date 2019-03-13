var gulp = require("gulp"),
  gutil = require("gulp-util"),
  fs = require("fs"),
  concat = require("gulp-concat"),
  path = require("path"),
  merge = require("merge-stream");

var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
  fs
    .readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);
getComponentNameFromDirectory = directory => {
  const directoryNameRegex = /[\/\\]+([\w\d_-]+)$/gm;
  const componentName = directoryNameRegex.exec(directory)[1];
  return componentName;
};
gulp.task("build", () => {
  return gutil.log("Gulp is running!");
});
gulp.task("merge", () => {
  const directories = getDirectories("src/templates");
  const tmpPathJs = directories.length === 1 ? "tmp" : `tmp/${componentName}`;
  const tasks = directories.map(x => {
    const componentName = getComponentNameFromDirectory(x);
    return gulp
      .src([
        "models/part1.html",
        `${x}/metadata.json`,
        "models/part2.html",
        `${x}/template.css`,
        "models/part3.html",
        `${tmpPathJs}/template.js`,
        "models/part4.html",
        `${x}/template.html`,
        "models/part5.html",
        `${x}/placeholder.css`,
        "models/part6.html",
        `${tmpPathJs}/placeholder.js`,
        "models/part7.html",
        `${x}/placeholder.html`,
        "models/part8.html"
      ])
      .pipe(concat(`${componentName}.html`))
      .pipe(gulp.dest("dist"));
  });
  return merge(tasks);
});
gulp.task("transpile", () => {
  const directories = getDirectories("src/templates");
  return gulp
    .src(
      directories
        .map(x => `${x}/template.ts`)
        .concat(directories.map(x => `${x}/placeholder.ts`))
    )
    .pipe(tsProject())
    .js.pipe(gulp.dest(`tmp`));
});
