var isparta = require('isparta');
var paths = require('./build/paths');

module.exports = function(config) {
    config.set({
        
        frameworks: ['jspm', 'mocha', 'chai'],

        jspm: {
            loadFiles: [paths.tests],
            serveFiles: [paths.source]
        },
        
        files: [],
        
        preprocessors: {
            [paths.tests]: ['babel'],
            [paths.source]: ['babel']
        },

        babelPreprocessor: {
            options: {
                "presets": [
                    ["env", {
                        "targets": {
                            "browsers": [ "last 2 Chrome versions" ]
                        }
                    }]
                ]
            }
        },

        reporters: ['coverage', 'progress'],
        
        coverageReporter: {
            instrumenters: {
                isparta: isparta
            },
            
            instrumenter: {
                [paths.source]: 'isparta'
            },
            
            dir: 'build/reports/coverage/',
            
            reporters: [{
                type: 'text-summary'
            }, {
                type: 'html',
                subdir: 'html'
            }, {
                type: 'lcovonly',
                subdir: 'lcov',
                file: 'report-lcovonly.txt'
            }]
        },
        
        port: 9876,
        
        colors: true,
        
        logLevel: config.LOG_INFO,
        
        autoWatch: true,
        
        browsers: ['Chrome'],
        
        singleRun: false
    });
};
