module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    jshint: {
      files: [ 'gruntfile.js','./src/*.js','./spec/javascripts/*.spec.js'],
      options: {
        //"undef": true,
        'loopfunc': true,
        globals: {
          '_': true,
          'Backbone': true,
          'console': true,
          'esri': true,
          'dojo': true,
          'window': true,
          'setTimeout': true,
          'clearTimeout': true,
          'document': true,
          'localStorage': true,
          'location': true,
          'FileReader': true,
          'describe':true,
          'it': true,
          'afterEach': true,
          'beforeEach': true,
          'expect': true
        }
      }
      
    },

    watch: {
      scripts: {
        files: ['gruntfile.js','./src/*.js','./spec/javascripts/*.spec.js'],
        tasks: ['jshint', 'jasmine'],
        options: {
          nospawn: true
        }
      }
    },

    jasmine: {
      composer: {
        src: ['./src/*.js'],
        //unclear why this helper is not loading this way...
        //added below under vendor and it works
        helpers: ['./spec/javascripts/helpers/maphelper.js'],
        options: {
          template:'./spec/MapRunner.tmpl',
          vendor:[
            './lib/jquery-1.8.3.js',
            './lib/underscore-min.js',
            './lib/jasmine-jquery.js',
            './spec/javascripts/helpers/maphelper.js'
          ],
          keepRunner: true,
          specs: [
            './spec/javascripts/*.spec.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', [ 'jshint', 'jasmine' ]);

};
