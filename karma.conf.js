var paths = require('./build/paths');

module.exports = function(config) {

    config.set({
        
        frameworks: ['jspm', 'mocha', 'chai'],

        jspm: {
            loadFiles:  [paths.tests],
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
                    ["@babel/preset-env", {
                        "targets": {
                            "browsers": [ "last 2 Chrome versions" ]
                        }
                    }]
                ]
            }
        },        

        reporters: ['progress'],        
        
        port: 9876,
        
        colors: true,
        
        logLevel: config.LOG_INFO,
        
        autoWatch: true,
        
        browsers: ['Chrome'],
        
        singleRun: false
    });
};
