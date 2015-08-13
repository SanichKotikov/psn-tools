module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ['dist/'],

        copy: {
            main: {
                src: 'bower_components/Chart.js/Chart.min.js',
                dest: 'dist/lib/Chart.min.js'
            }
        },

        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded',
                    sourceMap: true,
                    precision: 3
                },
                files: {
                    'dist/styles/styles.css': 'src/styles/styles.scss'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: false,
                    precision: 3
                },
                files: {
                    'dist/styles/styles.css': 'src/styles/styles.scss'
                }
            }
        },

        babel: {
            dev: {
                options: {
                    stage: 0,
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/scripts/',
                    src: '**/*.js',
                    dest: 'dist/scripts/',
                    ext: '.js'
                }]
            },
            dist: {
                options: {
                    stage: 0,
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/scripts/',
                    src: '**/*.js',
                    dest: 'dist/scripts/',
                    ext: '.js'
                }]
            }
        },

        uglify: {
            options: {
                sourceMap: false,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/scripts/',
                    src: '**/*.js',
                    dest: 'dist/scripts/',
                    ext: '.js'
                }]
            }
        },

        watch: {
            sass: {
                files: 'src/styles/**/*.scss',
                tasks: ['sass:dev']
            },
            babel: {
                files: ['src/scripts/**/*.js'],
                tasks: ['babel:dev']
            }
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('dev',     ['clean', 'copy', 'sass:dev', 'babel:dev']);
    grunt.registerTask('dist',    ['clean', 'copy', 'sass:dist', 'babel:dist', 'uglify']);
};
