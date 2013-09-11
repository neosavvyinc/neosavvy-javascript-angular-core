// Karma configuration
// Generated on Fri Aug 09 2013 19:08:30 GMT-0400 (EDT)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'src/main/resources/lib/lodash/lodash.js',
            'src/main/resources/lib/zepto/zepto.js',
            'src/main/resources/lib/zepto/compatibility/zepto-jquery-compatibility.js',
            'src/main/resources/lib/neosavvy/neosavvy-core.js',
            'src/main/resources/lib/angular/angular.js',
            'src/test/resources/lib/**/*.js',
            'src/main/resources/library/library.js',
            'src/main/resources/library/directives/**/*.js',
            'src/main/resources/library/filters/**/*.js',
            'src/main/resources/library/services/**/*.js',
            'src/test/resources/**/*-spec.js'
        ],


        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
