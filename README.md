# Publeaks website static files
The content of the site is determined by the contents of `nl.lang.json`, which is directly editable.

### An easy method to edit the content:
- Look up the text you want to change in the current website;
- Do a find command (`Ctrl + F` / `Cmd + F`) for that text in `nl.lang.json`;
- Change the text and save.

For `partners` and `cases`:
- You can change the images by adding/removing image files to the relevant folder in the `images` folder, and updating the reference to it in the JSON file.
- It is also possible to add entries by adding a new key (e.g. `"5":`) with a new `{...}` object that looks like the previous entries

The folder `media` contains the explanatory videos in Dutch and is not in the directory, view them at https://publeaks.nl 
