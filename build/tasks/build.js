var gulp             = require('gulp');
var runSequence      = require('run-sequence');
var paths            = require('../paths');
var compilerOptions  = require('../babel-options');
var rollup           = require("rollup").rollup;
var rollupMultiEntry = require("rollup-plugin-multi-entry");
var rollupBabel      = require("rollup-plugin-babel");

var jsName = paths.packageName + '.js';

gulp.task("rollup", function(done) {
    rollup({
        entry:   paths.source,
        plugins: [
            rollupMultiEntry(),
            rollupBabel(compilerOptions.es2015())
        ]
    })
    .then(function(bundle) {
        var moduleTypes = ["amd", "cjs", "es", "iife"];
        moduleTypes.forEach(function(moduleType){
            bundle.write({
                dest:       paths.output + moduleType + '/' + jsName,
                format:     moduleType,
                moduleName: paths.packageName
            });
        }); 
        console.log('Build complete');
    })
    .catch(function(err) {
        console.log('rollup error');
        console.log(err);
    })
    .then(done, done);
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    'rollup',
    callback
  );
});
