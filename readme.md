# Grunting the Email Campaign #

This package is a starting point in developing a responsive HTML email for an email campaign.

* source.html - Here is where you type in the HTML for the email using the Zurb Ink framework
* my_styles.css - Contains your customized css styles
* \images - put all your images here
* \working - a directory for files that are created and destroyed during the grunt process..always safe to delete contents
* ink.css - Zurb Ink framework.  Replace this file with the latest version

## Grunt commands ##
The default task does it all.
 1. It runs grunt-uncss which creates a \working\tidy.css file that only contains the css that was used.
 2. Using stripcsscomments it creates \working\verytidy.css from \working\tidy.css where all comments are stripped out.
 3. Using replace:css, it removes all the extra lines from \working\verytidy.css and creates working\veryverytidy.css.
 4. Using processhtml, it puts veryverytidy.css into preInlined.html.
 5. Using replace:html, it addes border=0 cellspacing=0 and cellpadding=0 to all &lt;table&gt; elements.
 6. Finally, it clears out email.html to be used to copy and paste in the inlined product.

## Steps to create an email ##
 1. Edit the source.html, add the images to the images directory unless you already have a complete url path for them.
 2. Test source.html using your local dev and make changes as needed.
 3. run the default grunt task
 4. Copy the preInlined.html file it creates and use Zurb Ink inliner to inline the styles.  Paste the product into the email.html file.  Unfortunately, there currently isn't a great inliner for the Windows machine so I still must copy&paste.
 5. run 'grunt zip' to zip up your images folder and the email.html file and send to EmailOnAcid or Litmus for testing.
