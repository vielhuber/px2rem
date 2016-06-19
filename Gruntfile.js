'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    px2rem: {
      options: {
        base: 16,
        init: 1920,
        iterations: 150,
        smoothness: 0.075
      },
      dist: {
        src: 'input.css',
        dest: 'output.css'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadTasks('tasks');
  grunt.registerTask('default', ['px2rem']);

};
