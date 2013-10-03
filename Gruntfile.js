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
        src: ['test/**/*_test.js']
      }
    }
  })
  
  // Load extra Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jison');
  grunt.loadNpmTasks('grunt-mocha-test');
  
  // Set up aliases
  grunt.registerTask('build', ['jison']); // , 'jison_amd_define']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('check', ['jshint', 'test']);
}
