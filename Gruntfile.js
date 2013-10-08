module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jison: {
      parser: {
        options: {
          moduleType: 'amd',
        },
        src: ["src/relalg.jison"],
        dest: "lib/parser.js",
      }
    },
    jshint: {
      options: {
        ignores: 'lib/relalg/parser.js', // The parser is auto-generated
        asi: true, // I'm not a great fan of unneeded semicolons 
        laxcomma: true // And I like having commas first
      },
      lib: ['lib/**/*.js'],
      test: {
        options: {
          loopfunc: true // For the tests, it's convient to define them in a loop
        },
        src: ['test/**/*.js']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'dot'
        },
        src: ['test/*_test.js', 'test/util/*_test.js']
      }
    },
    karma: {
      options: {
        basePath: '',
        frameworks: ['mocha', 'requirejs', 'sinon'],
        files: [
          {pattern: 'bower_components/es5-shim/es5-shim.js', included: false},
          {pattern: 'bower_components/chai/**/*.js', included: false},
          {pattern: 'bower_components/flight/lib/**/*.js', included: false},
          {pattern: 'bower_components/mocha-flight/lib/**/*.js', included: false},
          {pattern: 'bower_components/jquery/**/*.js', included: false},
          {pattern: 'bower_components/deep-equal/**/*.js', included: false},
          {pattern: 'lib/relalg/**/*.js', included: false},
          {pattern: 'test/**/*_test.js', included: false},
          'test/karma-setup.js'
        ],
        reporters: ['dots'],
        singleRun: true
      },
      chrome: {
        browsers: ['Chrome'],
      },
      test: {
        browsers: ['PhantomJS'],
      }
    }
  })
  
  // Load extra Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jison');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  
  // Set up aliases
  grunt.registerTask('build', ['jison']);
  grunt.registerTask('test', ['mochaTest:test', 'karma:test']);
  grunt.registerTask('check', ['jshint', 'test']);
}
