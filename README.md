
# Publeaks
Publeaks safely, privately and anonymously connects whistleblowers with local and national Dutch news publishers. The static pages connect to the GlobaLeaks software package which safely encrypts and sends data onward to participating journalists. 

## Static files
This is a static website and the content of the site is determined by the contents of `nl.lang.json`, which is directly editable.

### An easy method to edit the content:
- Look up the text you want to change in the current website;
- Do a find command (`Ctrl + F` / `Cmd + F`) for that text in `nl.lang.json`;
- Change the text and save.

For `partners` and `cases`:
- You can change the images by adding/removing image files to the relevant folder in the `images` folder, and updating the reference to it in the JSON file.
- It is also possible to add entries by adding a new key (e.g. `"5":`) with a new `{...}` object that looks like the previous entries

#### About Publeaks
Publeaks is an initiative of the Publeaks Foundation. The GlobaLeaks software package is developed by the Hermes Center for Transparency and Digital Human Rights. Publeaks frontend user experience and mobile responsiveness were improved in May 2019.
