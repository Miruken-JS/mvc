var gulp             = require("gulp");
var runSequence      = require("run-sequence");
var paths            = require("../paths");
var rollup           = require("rollup").rollup;
var resolve          = require("rollup-plugin-node-resolve");
var rollupMultiEntry = require("rollup-plugin-multi-entry");
var rollupBabel      = require("rollup-plugin-babel");
var camelCase        = require("camelcase");

var jsName = paths.packageName + '.js';

gulp.task("rollup", function(done) {
    rollup({
        input:   paths.source,
        external: [
            "miruken-core",
            "miruken-callback",
            "miruken-context",
            "miruken-validate",
            "miruken-error",            
        ],
        plugins: [
            rollupMultiEntry(),
            rollupBabel(),
            resolve()
        ]
    })
    .then(function(bundle) {
        var moduleTypes = ["amd", "cjs", "es", "iife", "system", "umd"];
        moduleTypes.forEach(function(moduleType){
            bundle.write({
                file:       paths.output + moduleType + '/' + jsName,
                format:     moduleType,
                name: camelCase(paths.packageName),
                output: {
                    globals: {
                        "miruken-core": "mirukenCore",
                        "miruken-callback": "mirukenCallback",
                        "miruken-context": "mirukenContext",
                        "miruken-validate": "mirukenValidate",
                        "miruken-error": "mirukenError",                        
                    }
                }
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
