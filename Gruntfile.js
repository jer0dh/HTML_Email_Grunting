// See: http://24ways.org/2013/grunt-is-not-weird-and-hard/
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uncss: {
			dist: {
				src: ['source.html'],
				dest: 'working/tidy.css',
				options: {
					report: 'min' //optional: include to report savings
				}
			}

		},
		processhtml: {
			dist: {
				files: {
					'preInlined.html' : ['source.html']
				}
			}
		},
		stripCssComments: {
			dist: {
				files: {
					'working/verytidy.css': 'working/tidy.css'
				}
			}
		},
		replace: {
			css: {
				src: ['working/verytidy.css'],             // source files array (supports minimatch)
				dest: 'working/veryverytidy.css',             // destination directory or file
				replacements: [{
					from: /^\s*$/gm,      // regex remove extra lines
					to: ''
				}]
			},
			html: {
				src: ['preInlined.html'],
				overwrite: true,
				replacements: [{
						from: '<table',
						to: '<table border="0" cellpadding="0" cellspacing="0"'
					}]
			}
		},
		compress: {
			main: {
				options: {
					archive: 'email.zip'
				},
				files: [
					{src: ['images/*'], dest: '/', filter: 'isFile'}, // includes files in path
					{src: ['email.html'], dest: '/'}
				]
			}
		},
		exec: {
			inline: {
				command: 'gulp',
				stdout: true
			}

		},
		watch: {
			js: {
				files: ['source.html', 'my_styles.css'],
				tasks: ['uncss', 'processhtml'],
				options: {
					spawn: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-strip-css-comments');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask('emptyFile', 'Removes Inlined file', function() {
		grunt.file.write('email.html', '');
	});
	grunt.registerTask('default', ['uncss', 'stripCssComments','replace:css','processhtml', 'replace:html','exec:inline','compress']);
	grunt.registerTask('zip', ['compress']);
};
