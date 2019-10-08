# Auto-Refresher
Auto-refresher is a jQuery plugin to auto refresh a page, with a visual progress bar.

## Dependencies
Auto-Refresher is a jQuery plugin, which means it requires jQuery to work.  Ensure that you have setup jQuery correctly in your project.  Visit [https://jquery.com/download/](https://jquery.com/download/) for more information.

## Installation
Download latest release: [v1.2.0](https://github.com/manbeardgames/auto-refresher/releases/latest) 

The download includes the following directories and files

```
├───css
│       autorefresher.css
│       autorefresher.min.css
│
└───js
        autorefresher.js
        autorefresher.min.js
```

Extract the CSS and JS files to the appropriate directories for your project.

## Usage
To use auto-refresher, first add the stylesheet into your document's `<head>`

```html
<link rel="stylesheet" type="text/css" href="path/to/autorefresher.css">
```


Include jQuery (required for plugin to work)
```html
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
```

Include the auto-refresher script 
**Note: The `<script>` tag to load auto-refresher must come AFTER the one that loads jQuery.  This is because auto-refresher requires jQuery to work.**

```html
<script src="path/to/autorefresher.js"></script>
```

Next, add a new empty `<div>` in your document with an `id` attribute. The name of the id can be whatever you like, just remember what you put as we'll need to reference it.

```html
<div id="auto-refresher"></div>
```

Finally, call the plugin in your script
```html
<script type="text/javascript">
    $(document).ready(function() {
        $('#auto-refresher').autoRefresher();
    });
</script>
```

Calling the plugin like above will load the plugin using its default settings.  You can override any of the default settings by passing an object with the correct properties and values for the settings.  Refer to the next section for more information on settings.

# Options
When calling auto-refresher, you can override any of the default settings for auto-refresher by providing an object with the correct properties and values.  The following is an example of doing this using all of the configurable options.

```html
<script type="text/javascript">
    $(document).ready(function() {
        $('#auto-refresher').autoRefresher({
            //  The total number of seconds to wait before refreshing
            seconds: 60,
            //  The function to call when the configured time has passed.
            callback: function () {
                location.reload();
            },
            //  The height of the progress bar
            progressBarHeight: '7px',
            //  The background color of the progress bar
            backgroundColor: '#6c757d',
            //  The foreground color of the progress bar
            foregroundColor: '#007bff',
            //  Show the start & stop buttons
            showControls: true,
            //  The CSS class to apply to the stop button
            stopButtonClass: 'auto-refresher-button',
            //  What to display inside the stop button
            stopButtonInner: 'Stop',
            //  The CSS class to apply to the start button
            startButtonClass: 'auto-refresher-button',
            //  What to display inside the stop button
            startButtonInner: 'Start',
            //  the id attribute of the element to insert the time remaining value
            timeRemainingId: '#auto-refresher-time-remaining'            
        });
    });
</script>
```

The following table explains in more detail what each option is for

|Attribute|Type|Default|Description|
|---|---|---|---|
|`seconds`| *Number* | `60` | The amount of time to wait before executing the callback function |
|`callback`| *Function* | `function() {location.reload();}` | The function to execute when the time limit has passed.  You can provide any function to callback to once the amount of time to wait has been reached if you'd rather it do something other than refresh the page. |
|`progressBarHeight`| *String* | `'7px'` | The height of the progress bar.  Values must be a positive number + css unit of measurement (e.g %, px, em, rem). |
|`backgroundColor`| *String* | `'#6c757d'` | The background color of the progress bar.  You can provide any CSS compliant color code. |
|`foregroundColor`| *String* | `'#007bff'` | The foreground color of the progress bar.  You can provide any CSS compliant color code. |
|`showcontrols`| *Boolean* | `true` | If true, then the start and stop buttons are shown; otherwise they are not shown. If you would like to use your own start and stop controls, refer to the next section of this document. |
|`stopButtonClass`| *String* | `'auto-refresher-button'` | Any CSS classes to use for the stop button.  If an empty string `''` or `null` is supplied, the default value will be used.  |
|`startButtonClass`| *String* | `'auto-refresher-button'` | Any CSS classes to use for the start button.  If an empty string `''` or `null` is supplied, the default value will be used. |
|`stopButtonInner`| *String* | `'Stop'` | What to include inside the stop button. You can provide a simple string or an html tag to include.  For instance, if you wanted to use the stop icon from fontawesome, you could set this to `'<i class="fas fa-stop"></i>'`. |
|`startButtonInner`| *String* | `'Start'` |  What to include inside the start button. You can provide a simple string or an html tag to include.  For instance, if you wanted to use the stop icon from fontawesome, you could set this to `'<i class="fas fa-start"></i>'`. |
|`timeRemainingId`| *String* | `'#auto-refresher-timer-remaining'` | Will inject the amount of time remaining into this DOM element with the id attribute value. Must include the `#` at the beginning like any normal jQuery id selector. |


# Using Custom Start and Stop Controls
Auto-refresher has two triggers you can use to start and stop the progress bar.  These are useful in situations where you want to hide the default controls and instead use your own controls somewhere else within the page.  Once you have setup your own controls, you just need to call the start and stop triggers for autoRefresher.  The following is an example of doing this using two custom buttons

```html
<!DOCTYPE html>
<html>
    <head>
        <!-- Load the Auto-Refresher css from the path you have it stored at. -->
        <link rel="stylesheet" type="text/css" href="path/to/autorefresher.css">
    </head>
    <body>
        <!-- Add AutoRefresher like normal -->
        <div id="auto-refresher"></div>

        <!-- 
            Add your own start and stop buttons on the page. Give them
            id's so you can call them later in the script section.
        -->
        <button type="button" id="start-button">Start</button>
        <button type="button" id="stop-button">Stop</button>

        <!-- Load jQuery from CDN. -->
        <script src="https://code.jquery.com/jquery-3.4.1.min.js" 
                integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" 
                crossorigin="anonymous"></script>

        <!-- Load Auto-Refresher from the path you have it stored at. -->
        <script src="path/to/autorefresher.js"></script>
        <script type="text/javascript">
            $(document).ready(function() {
                //  Call the autoRefresher() method like usual, but with
                //  the controls hidden.
                $('#auto-refresher').autoRefresher({
                    showControls: false
                });

                // Add a trigger to stop auto-refresher using the stop button
                $('#stop-button').on('click', function() {
                    $('#auto-refresher').trigger('stop');
                });

                //  Add trigger to start auto-refresher using the start button
                $('#start-button').on('click', function() {
                    $('#auto-refresher').trigger('start');
                });
            });
        </script>
    </body>
</html>
```
# Contributing
If you would like to contribute to this repository, check out [CONTRIBUTING.md](https://github.com/manbeardgames/auto-refresher/blob/master/CONTRIBUTING.md) for more info.

# License
[MIT License](https://github.com/manbeardgames/auto-refresher/blob/master/LICENSE) © [Christopher Whitley](https://github.com/manbeardgames)



