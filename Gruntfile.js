/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg:grunt.file.readJSON('package.json'),
        banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat:{
            options:{
                banner:'<%= banner %>',
                stripBanners:true
            },
            dist:{
                src:['src/main/resources/library/library.js',
                    'src/main/resources/library/directives/**/*.js',
                    'src/main/resources/library/services/**/*.js'],
                dest:'dist/<%= pkg.name %>.js'
            }
        },
        uglify:{
            options:{
                banner:'<%= banner %>'
            },
            dist:{
                src:'<%= concat.dist.dest %>',
                dest:'dist/<%= pkg.name %>.min.js'
            }
        },
        watch:{
            gruntfile:{
                files:'<%= jshint.gruntfile.src %>',
                tasks:['jshint:gruntfile']
            },
            lib_test:{
                files:'<%= jshint.lib_test.src %>',
                tasks:['jshint:lib_test', 'qunit']
            }
        },
        karma:{
            unit:{
                configFile:'karma.conf.js'
            },
            build:{
                configFile:'karma.conf.js',
                singleRun:true,
                browsers:['Chrome']
            }
        },
        ngdocs: {
            all: ['src/main/resources/library/**/*.js']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngdocs');

    // Default task.
    grunt.registerTask('default', ['karma:build', 'concat', 'uglify', 'ngdocs']);

};
