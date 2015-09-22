# Grunting the Email Campaign #

This package is a starting point in developing a responsive HTML email for an email campaign.
It currently includes a gulp inliner (the best one for a Windows machine), but after using in production, I have found Zurb's Inliner
better in my Email on Acid results.  Hoping to figure out why in the future.

The main benefit is using grunt's template capabilities.  Just like the old mail merge in Word, you can
setup merge codes in the `source.html` file and have it create many html files with the merged data.  The
data is put in the `mergeData.json` file.

For example, here I have a name field.

```html
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width"/>
<title> <%= name %>, what fun it is to save!</title>

</head>
<body>
```
I can have a `mergeData.json` file.
```javascript
[
  {
    "company" : "Acme",
    "name" : "John Doe",
    "email" : "j.doe@gmail.com",
    "phone" : "206-555-1111",
    "linkedin" : "https://www.linkedin.com/pub/john/doe"
  },
  {
    "company" : "Fred Inc.",
    "filename" : "fred",
    "name" : "Fred Flint",
    "email" : "f.flint@somewhere.net",
    "phone" : "334-555-2345",
    "linkedin" : "https://www.linkedin.com/pub/fred-flint/3dd"
  }]
```

There are some helper functions in the grunt config you can alter to determine how you want the resulting files named.

Recently, I added postcss and postcss-simple-variables so I can add color variables and such.

* source.html - Here is where you type in the HTML for the email using the Zurb Ink framework
* css\my_styles.scss - Contains your customized css styles.  Not SASS but using Postcss-simple-variables
* \images - put all your images here
* \working - a directory for files that are created and destroyed during the grunt process..always safe to delete contents
* css\ink.css - Zurb Ink framework.  Replace this file with the latest version
* `preInlined.html` - compiled - contains all styles in the `<body>` ready to be inlined.  (All template, merge fields, are encoded otherwise the Zurb Inliner will remove them)
* `email.html` - this is emptied during the default grunt process as this is where you paste results of your inlining of `preInlined.html`

## Grunt commands ##
The default task:
 1. Task 'hideTemplate' - encodes any merge fields you may have placed in source.html.
 2. Task 'postcss' - creates `my_styles.css` expanding out any css variables.
 3. Task 'concat_css - concatenates `ink.css` and `my_styles.css` into `working/styles.css`
 4. Task 'stripcsscomments' - all comments are stripped out of `working/styles.css`.
 5. Task 'replace:css' - removes all the extra lines from `\working\styles.css`.
 6. Task 'processhtml' - takes `source.html` and `working/styles.css` and puts into `preInlined.html`.
 7. Task 'emptyFile' - creates or empties out `email.html` for you to paste the inlined results into.

The `grunt merge` task:
  1. Task 'showTemplate' - takes `email.html` and re-encodes the merge fields so grunt can see them into `working/email-tmp.html`
  2. Task 'merget' - merges the data from `mergeData.json` and creates multiple files based on that data.  Uses grunt's default templating engine
   NOTE: you can edit the gruntfile.js and the `helpers` object in the config has functions you can edit to change how it computes the filenames and reformatting of data before merging.

## Steps to create an email ##
 1. Edit the `source.html`, add the images to the images directory unless you already have a complete url path for them in the HTML source.
 2. Test `source.html` using your local dev and make changes as needed.
 3. run the default grunt task
 4. copy the html in `preInlined.html` and use whatever inliner you like.  I prefer Zurb's Inliner
 5. Paste the inliner's results into email.html
 6. Run the `grunt merge` command if ready to merge this.

 ## Notes ##

 Make sure your full file paths do not contain spaces otherwise uncss will fail...but not using uncss now.  But keep in mind if you have problems


## Thanks ##
Special Thanks to Victor Garcia's article [A workflow for responsive emails using Ink and Grunt](https://medium.com/@victorgarcia/a-workflow-for-responsive-emails-using-ink-and-grunt-32d607879082)

Thanks to JonKemp for making [gulp-inline-css](https://www.npmjs.com/package/gulp-inline-css)

Check out the awesome Zurb's Ink: [A framework for Responsive HTML email](http://zurb.com/ink/)

Check out CodeSchool's [Unmasking HTML Emails course](http://campus.codeschool.com/courses/unmasking-html-emails) (Does not' use Ink but very helpful!)