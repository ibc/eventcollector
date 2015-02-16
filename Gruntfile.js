module.exports = function(grunt) {
  var files = {
    gruntfile: [ 'Gruntfile.js' ],
    lib:       [ 'lib/**/*.js'  ],
    test:      [ 'test/**/*.js' ],
  };

  var pkg = grunt.file.readJSON('package.json');
  var bundle_files = {};

  bundle_files['dist/' + pkg.name + '.bundle.js'] = [ pkg.main ];

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
        validthis: true,  // Allow 'this' in a non-constructor function.
        node: true,
        globals: {}
      },
      gruntfile: files.gruntfile,
      lib:     files.lib,
      test:    files.test
    },

    nodeunit: {
      all: files.test,
      options: {
        reporter: 'default'
      }
    },

    browserify: {
      bundle: {
        files: bundle_files,
        options: {
          browserifyOptions: {
            standalone: pkg.name
          }
        }
      }
    }
  });

  // Load Grunt plugins.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-browserify');

  // Tasks.
  grunt.registerTask('test', [ 'nodeunit:all' ]);
  grunt.registerTask('lint',    [ 'jshint' ]);
  grunt.registerTask('default', [ 'lint', 'test', 'browserify' ]);
};
