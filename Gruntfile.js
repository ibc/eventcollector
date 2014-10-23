module.exports = function(grunt) {
  var files = {
    gruntfile: [ 'Gruntfile.js' ],
    lib:       [ 'lib/**/*.js' ],
    test:      [ 'test/**/*.js' ],
  };

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    jshint: {
      options: {
        // DOC: http://www.jshint.com/docs/options/
        curly: true,
        eqeqeq: true,
        forin: false,
        freeze: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonbsp:  true,
        nonew: true,
        plusplus: false,  // Allow variable++.
        quotmark: 'single',
        undef: true,
        unused: true,
        strict: false,
        // TODO validthis: true,  // Allow 'this' in a non-constructor function.
        node: true,
        globals: {}
      },
      gruntfile: files.gruntfile,
      lib:     files.lib,
      test:    files.test
    },
  });

  // Load Grunt plugins.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Tasks.
  grunt.registerTask('test', function() {
    var done = this.async();  // This is an async task.
    var exec = require('child_process').exec;
    var child;

    child = exec(pkg.scripts.test, function(error, stdout, stderr) {
      if (error) {
        console.error(stderr);
        done(false);
      }

      console.log(stdout);
      done(true);
    });
  });
  grunt.registerTask('lint',    [ 'jshint' ]);
  grunt.registerTask('default', [ 'lint', 'test' ]);
};
