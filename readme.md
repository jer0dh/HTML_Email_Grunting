# Grunting the Email Campaign #

This package is a starting point in developing a responsive HTML email for an email campaign.

* source.html - Here is where you type in the HTML for the email using the Zurb Ink framework
* my_styles.css - Contains your customized css styles
* \images - put all your images here
* \working - a directory for files that are created and destroyed during the grunt process..always safe to delete contents
* ink.css - Zurb Ink framework.  Replace this file with the latest version


## Grunt commands ##
The default task does it all.
 1. It runs grunt-uncss which creates a `\working\tidy.css` file that only contains the css that was used.
 2. Using stripcsscomments it creates `\working\verytidy.css` from `\working\tidy.css` where all comments are stripped out.
 3. Using replace:css, it removes all the extra lines from `\working\verytidy.css` and creates `working\veryverytidy.css`.
 4. Using processhtml, it puts `veryverytidy.css` into `preInlined.html`.
 5. Using replace:html, it adds `border=0 cellspacing=0 and cellpadding=0` to all `<table>` elements. `preInlined.html` is kept so one could use another inliner if needed.
 6. It runs a gulp task to create an inlined version as `email.html`  (no good grunt inliners for Windows machines, yet)
 7. Finally, creates a zip file containing the `/images` folder and the `email.html`.

## Steps to create an email ##
 1. Edit the `source.html`, add the images to the images directory unless you already have a complete url path for them in the HTML source.
 2. Test `source.html` using your local dev and make changes as needed.
 3. run the default grunt task
 4. Send the `email.zip` file to EmailOnAcid or Litmus for testing.

 ## Notes ##

 Make sure your full file paths do not contain spaces otherwise uncss will fail.

I haven't tested this with a new project yet so I'm unsure of how well the inliner is compared to Zurb Ink's inliner or the premailer inliner.  If there is an issue
One can use the `preInlined.html` file it creates and use Zurb Ink inliner to inline the styles.  Paste the produced code into the email.html file and then run grunt zip
to create the `email.zip` file.

When I first started this, I was hoping to do everything with grunt, but had to add a gulp task for the inliner for Windows machines.

## Update ##
Ok.  Worked with this on a project.  Finding that there are differences between the gulp-inliner-css and the Zurb Ink inliner.  Unfortunately, the Zurb
Inliner appears to give me better results during my Email On Acid testing.  So for now, run `grunt`, copy and paste preInlined.html into Zurb's Inliner, then paste results to email.html, and finally, run `grunt zip`

## Thanks ##
Special Thanks to Victor Garcia's article [A workflow for responsive emails using Ink and Grunt](https://medium.com/@victorgarcia/a-workflow-for-responsive-emails-using-ink-and-grunt-32d607879082)

Thanks to JonKemp for making [gulp-inline-css](https://www.npmjs.com/package/gulp-inline-css)

Check out the awesome Zurb's Ink: [A framework for Responsive HTML email](http://zurb.com/ink/)

Check out CodeSchool's [Unmaksing HTML Emails course](http://campus.codeschool.com/courses/unmasking-html-emails) (Does not' use Ink but very helpful!)