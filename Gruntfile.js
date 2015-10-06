
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uncss: {
			dist: {
				files: {
					'working/tidy.css' : ['source.html']
				},
				options: {
					report: 'min', //optional: include to report savings
					ignore: ['#outlook a', '.ExternalClass', '#backgroundTable', '.ExternalClass p',
					'.ExternalClass span', '.ExternalClass font', '.ExternalClass td', '.ExternalClass div']
				}
			}

		},
/*		concat_css: {
			all: {
				src: ["./css/!*.css"],
				dest: 'working/styles.css'
			}

		},*/
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
					'working/tidy.css': 'working/tidy.css'
				}
			}
		},
		replace: {
			css: {
				src: ['working/tidy.css'],             // source files array (supports minimatch)
				overwrite:true,            // destination directory or file
				replacements: [{
					from: /^\s*$/gm,      // regex remove extra lines
					to: ''
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
		premailer: {
			simple: {
				options: {},
				files: {
					'email.html' : ['preInlined.html']
				}
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
		tableAttrib: {
		    main :
		{
			src: 'working/source-tmp.html',
			dest: 'working/source-tmp.html'
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
	grunt.loadNpmTasks('grunt-concat-css');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-premailer');

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
	grunt.registerMultiTask('tableAttrib', 'Checks table tags to add default border, cellpadding, etc', function() {
		var data=this.data;
		src = grunt.file.read(data.src);
		var count = 0, border= 0, cellspacing= 0, cellpadding=0;
		var content = src.replace(/<table(.*)>/gm, function(match,p1){
			if (p1.match(/border=/i) == null) {
				p1 += ' border="0"';
				border += 1;
			}
			if (p1.match(/cellspacing=/i)== null) {
				p1 += ' cellspacing="0"';
				cellspacing += 1;
			}
			if (p1.match(/cellpadding=/i) == null) {
				p1 += ' cellpadding="0"';
				cellpadding += 1;
			}
			count += 1;
			return '<table' + p1 + '>';
		});
		grunt.file.write(data.dest, content);
		grunt.log.writeln(count + ' tables found. '+ border +' border added. '+ cellpadding + ' cellpadding added. ' + cellspacing + ' cellspacing added. File "' + data.dest + '" created.');
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

	grunt.registerTask('default', ['hideTemplate', 'postcss', 'uncss', 'stripCssComments','replace:css','tableAttrib','processhtml','premailer']);
    grunt.registerTask('merge',['showTemplate', 'merget']);
	grunt.registerTask('zip', ['compress']);
	grunt.registerTask('inline', ['premailer']);
};
