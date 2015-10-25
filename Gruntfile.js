module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dev: ['dist/'],
            build: ['temp']
        },

        copy: {
            dev: {
                src: 'bower_components/Chart.js/Chart.min.js',
                dest: 'dist/lib/Chart.min.js'
            },
            build: {
                files: [
                    {
                        expand: true,
                        src: ['dist/**'],
                        dest: 'temp/'
                    },
                    {
                        src: 'images/tray.png',
                        dest: 'temp/images/tray.png'
                    },
                    {
                        src: 'index.html',
                        dest: 'temp/index.html'
                    },
                    {
                        src: 'package.json',
                        dest: 'temp/package.json'
                    }
                ]
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
        },

        nwjs: {
            options: {
                version: '0.12.2', // override version so it stops trying to download the latest
                platforms: ['osx', 'win'],
                buildDir: './builds',
                cacheDir: './cache',
                winIco: './images/nw.ico',
                macIcns: './images/nw.icns'
            },
            src: ['./temp/**/*']
        }
    });

    grunt.registerTask('default', ['clean:dev', 'copy:dev', 'sass:dev', 'babel:dev', 'watch']);
    grunt.registerTask('dev',     ['clean:dev', 'copy:dev', 'sass:dev', 'babel:dev']);
    grunt.registerTask('build',   ['clean:dev', 'copy:dev', 'sass:dist', 'babel:dist', 'uglify', 'copy:build', 'nwjs', 'clean:build']);
};
