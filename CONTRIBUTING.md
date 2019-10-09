# Contributing
Let me start out by saying thank you for wanting to contribute to this repository. This document serves as a guide to contributing.  Each section should be completed in order.  If you have any questions, please feel free to reach out to me.  The best place to reach me is going to be [twitter](https://www.twitter.com/manbeardgames)

## 1. Fork The Repository
The first thing you'll want to do is fork the repository. The simplest way to do this is by clicking the **Fork** button at the top-right of the repository page. Doing this will create an identical repository under your account.

## 2. Clone Your Forked Repo
Next, do a `git clone` of your forked repository.

## 3. Create a New Branch For Your Feature/Change
You need to make a new branch in your forked repository where you'll be adding the new feature or doing the code changes.  The name you choose for the branch needs to be indicative of the feature/change you are doing.  Run the following command to create the branch (replace **my-new-feature** with the name of your branch)

```
git checkout -b my-new-feature
```

## 4. Restore the NPM Packages
While this is just a simple jQuery plugin, there are various NPM packages that you'll need to restore before working on your change/feature.  The plugin source code itself does not rely on any of the NPM packages to run. Instead, the NPM packages are there to run the *build*, *rebuild*, and *clean* scripts for when you finish your change. 

These scripts perform various things such as linting the JS and SCSS, compiling the SCSS to CSS, compiling the JS code into a backwards compatible version, and finally minifying and creating the files from all of this into the /dist directory.

To restore the NPM packages, you can just run the following command

```
npm instal
```

## 5. Make Your Changes
Now you can start making the code changes and/or adding in your feature.  Code should follow [jQuery Core Style Guide](http://contribute.jquery.org/style-guide/js/) as best as possible.  All of your changes should happen only in the `/src` directory, never in the `/dist` directory.  This is because once you have finished making your change, you'll need to run a command which will clean the `/dist` directory completely and do all the fancy stuff to compile and add it all back in. 

### 5.1 Build and Rebuild commands
While making your changes, you going to run into situations where you might want to test it out and ensure the changes are valid.  There are two NPM scripts setup in `package.json` that you can use to **build** and/or **rebuild** the code into the `/dist` directory.  While both of the build the code, there is a slight difference.  Doing a Build will just compile the code into the `/dist` directory and overwrite anything there.  Performing a Rebuild will first completely clean the `/dist` directory by deleting everything from it, then it will compile everything into it.  The following table shows the build and rebuild commands you can use:

| Name | Command | Description |
| --- | --- | --- |
| **build:all** | `npm run build:all` | This will execute the **build:only:css** and **build:only:js** commands in that order. |
| **build:only:css** | `npm run build:only:css` | This will run the build command for the css only.  The steps performed during this command, in order are: <ul><li> linting of the SCSS using **stylelint**.</li><li>Compiling the SCSS to CSS using **node-sass**.  This creates the .css file in the `/dist` directory.</li><li>Compiling the SCSS to minified CSS using **node-sass**.  This creates the .min.css file and the .min.css.map file in the `/dist` directory |</li></ul> |
| **build:only:js** | `npm run build:only:js` | This will run the build command for the js only.  The steps performed during this command, in order, are <ul><li>linting of the JS using **eslint**.</li><li>Compiling the JS using **babel**. This creates the .js file in the `/dist` directory</li><li>Compiling the minified JS using **babel**. This creates the .min.js file in the `/dist` directory.</li></ul> |
| **rebuild:all** | `npm run rebuild:all` | This will execute the **clean:all** and **build:all** commands in that order. |

For each of these commands, linting is performed first on the CSS and/or JS.  If the linting fails, then the build will fail.  Read the information that is output in the console and make the necessary changes in order to pass the linting.

## 6. Commit Your changes
Once you have completed all of your changes, you'll need to perform one final rebuild, and if it passes, commit your changes then push to your branch.  You can run the following commands, in the order shown below, to do that.  Replace the **Added new feature** with you comment on what changes were made. Also remember to replace **my-new-feature** below with the name of the branch you created in section 3 above.

```
npm run rebuild:all
git add .
git commit -m "Added new feature"
git push -u origin my-new-feature
```

## 7. Submit a Pull Request
The final step you need to perform is to submit a pull request.  To do this, go to [the pull request page](https://github.com/manbeardgames/auto-refresher/pulls) for the auto-refresher repo and create a new pull request. Once your request is made, the changes will be reviewed before accepting to merge in with the master.