var path = require('path');

exports.base = function() {
    return {
        sourceMap: false,
        sourceRoot: '',
        moduleRoot: path.resolve('src').replace(/\\/g, '/'),
        moduleIds: false,
        comments: false,
        compact: false,
        code: true,
        plugins: [
            "check-es2015-constants",
            "transform-decorators-legacy",
            "transform-es2015-arrow-functions",
            "transform-es2015-block-scoped-functions",
            "transform-es2015-block-scoping",
            "transform-es2015-classes",
            "transform-es2015-computed-properties",
            "transform-es2015-destructuring",
            "transform-es2015-duplicate-keys",
            "transform-es2015-for-of",
            "transform-es2015-function-name",
            "transform-es2015-literals",
            "transform-es2015-object-super",
            "transform-es2015-parameters",
            "transform-es2015-shorthand-properties",
            "transform-es2015-spread",
            "transform-es2015-sticky-regex",
            "transform-es2015-template-literals",
            "transform-es2015-typeof-symbol",
            "transform-es2015-unicode-regex"
        ]
    };
};

exports.commonjs = function() {
    var options = exports.base();
    options.plugins.push('transform-es2015-modules-commonjs');
    return options;
};

exports.amd = function() {
    var options = exports.base();
    options.plugins.push('transform-es2015-modules-amd');
    return options;
};

exports.system = function() {
    var options = exports.base();
    options.plugins.push('transform-es2015-modules-systemjs');
    return options;
};

exports.es2015 = function() {
    var options = exports.base();
    return options;
};

