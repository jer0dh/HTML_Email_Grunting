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
		concat_css: {
			all: {
				src: ["./css/*.css"],
				dest: 'working/styles.css'
			}

		},
		processhtml: {
			dist: {
				files: {
					'preInlined.html' : ['working/source-tmp.html']
				}
			}
		},

		stripCssComments: {
			dist: {
				files: {
					'working/styles.css': 'working/styles.css'
				}
			}
		},
		replace: {
			css: {
				src: ['working/styles.css'],             // source files array (supports minimatch)
				overwrite:true,            // destination directory or file
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


		mergeData : grunt.file.exists('mergeData.json')? grunt.file.readJSON('mergeData.json') : null,

		hideTemplate: {
			main: {
				src: ['source.html'],
				dest: 'working/source-tmp.html'
			}
		},
		showTemplate: {
			main: {
				src: ['email.html'],
				dest: 'working/email-tmp.html'
			}
		},
		merget: {
			main: {
				src: ['working/email-tmp.html'],
				dest: '.'
			}
		},
		helpers : {
			filename: function(f) {
				filename = f.toLowerCase();
				filename = filename.replace(/\s/g, '');
				filename = filename.replace('&', 'and');
				return filename;
			},
			fixupMergeData: function(data) {

				data.tel = data.phone.replace(/-/g,'');
				data.tel = data.tel.match(/\d{10,10}/)[0];
				return data;
			}
		},
		postcss: {
			options: {
				//map: true, // inline sourcemaps

				// or
				map: {
					inline: false, // save all sourcemaps as separate files...
					annotation: './css/maps/' // ...to the specified directory
				},

				processors: [
					require('postcss-simple-vars')({silent:true})
				]
			},
			dist: {
				src: 'css/*.scss',
				dest: 'css/my_styles.css'

			}
		},

		watch: {
			css: {
				files: ['css/my_styles.scss'],
				tasks: ['postcss'],
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
	grunt.loadNpmTasks('grunt-concat-css');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerMultiTask('hideTemplate','Converts template tags to prevent inliner from messing with them', function () {
		var data = this.data;
		src = grunt.file.read(data.src);
		var content = src.replace(/<%/gm,'&lt;%');
		content = content.replace(/%>/gm, '%&gt;');
		grunt.file.write(data.dest, content);
		grunt.log.writeln('File "' + data.dest + '" created.');

	});
	grunt.registerMultiTask('showTemplate','Puts template tags back the way they were', function () {
		var data = this.data;
		src = grunt.file.read(data.src);
		var content = src.replace(/&lt;%/gm,'<%');
		content = content.replace(/%&gt;/gm, '%>');
		grunt.file.write(data.dest, content);
		grunt.log.writeln('File "' + data.dest + '" created.');

	});
	grunt.registerMultiTask('merget', 'Merges data with source using grunt templates', function() {
		var data = this.data,
			mergeData = grunt.config('mergeData'),
			helpers = grunt.config('helpers'),
			src = grunt.file.read(data.src);
		    if (mergeData !== null) {
				mergeData.forEach(function (c) {
					if (typeof c.filename === 'undefined') {
						c.filename = helpers.filename(c.company);
					}
					var p = data.dest + '/i-' + c.filename + '.html';
					c = helpers.fixupMergeData(c);
					grunt.file.write(p, grunt.template.process(src, {data: c}));
					grunt.log.writeln('File "' + p + '" created.');
				});
			} else {
				grunt.log.writeln('No data found to merge.')
			}
	});



	grunt.registerTask('emptyFile', 'Removes Inlined file', function() {
		grunt.file.write('email.html', '');
	});

	grunt.registerTask('default', ['hideTemplate', 'postcss', 'concat_css', 'stripCssComments','replace:css','processhtml','emptyFile']);
    grunt.registerTask('merge',['showTemplate', 'merget']);
	grunt.registerTask('zip', ['compress']);
};
