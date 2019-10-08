//  Built using jQuery Boilerplate
//  https://jqueryboilerplate.com/


//  the semi-colon before function invocation is a safety net against concatenated
//  scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
        var pluginName = "autoRefresher",
			defaults = {
                //  The total number of seconds to wait before refreshing.
                seconds: 60,
                //  The callback method to execute when the timeout ends.
                callback: function() {
                    location.reload();
                },
                //  Should the start and stop buttons be added.
                showControls: true,
                //  The height of the progress bar element.
                progressBarHeight: '7px',
                //  The css class to apply to the stop button.
                stopButtonClass: 'auto-refresher-button',
                //  The css class to apply to the start button.
                startButtonClass: 'auto-refresher-button',
                //  The content to insert into the stop button.
                stopButtonInner: 'Stop',
                //  The content to insert into the start button.
                startButtonInner: 'Start',
                //  The background color of the progress bar.
                backgroundColor: '#6C757D',
                //  The foreground color of the progress bar.
                foregroundColor: '#007BFF',
                //  the id attribute of the element to insert the time remaining value
                timeRemainingId: '#auto-refresher-time-remaining'
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
            let _ = this;
			_.element = $(element);

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			_.settings = $.extend( {}, defaults, options );
			_._defaults = defaults;
            _._name = pluginName;

            //  The 'seconds' settings must be a positive integer.  If it is not a number
            //  or if it is less than 0, then fallback to the default value
            if(!Number.isInteger(_.settings.seconds) || _.settings.seconds <= 0) {
                _.settings.seconds = _._defaults.seconds;
            }

            //  The 'callback' function provided for settings must be an actual function.
            //  If it is not, fallback to the default function.
            if(!$.isFunction(_.settings.callback)) {
                _.settings.callback = _._defaults.callback;
            }

            //  The 'startButtonClass' setting cannot be null and it cannot be an empty string.
            //  If it is either of the two, fallback to the default value.
            if(_.settings.startButtonClass === null || _.settings.startButtonClass.trim().length === 0) {
                _.settings.startButtonClass = _._defaults.startButtonClass;
            }
            
            //  The 'stopButtonClass' setting cannot be null and it cannot be an empty string.
            //  If it is either of the two, fallback to the default value.
            if(_.settings.stopButtonClass === null || _.settings.startButtonClass.trim().length === 0) {
                _.settings.stopButtonClass = _._defaults.stopButtonClass;
            }

            //  Add a 'start' trigger so that users can call this to start the auto refresh
            //  process from their own external controls
            _.element.on('start', function() {
                _.startAutoRefresh(_);
            });

            //  Add a 'stop' trigger so that users can call this to stop the auto refresh
            //  process from their own external controls.
            _.element.on('stop', function() {
                _.stopAutoRefresh(_);
            });

            //  Add the needed css class for the wrapper
            if(!_.element.hasClass('auto-refresher')) {
                _.element.addClass('auto-refresher');
            }

            //  If the caller opted to have the controls included, create and
            //  append them to the container
            if(_.settings.showControls) {
                $('<button />').attr({ type: 'button', class: _.settings.stopButtonClass })
                               .html(_.settings.stopButtonInner)
                               .on('click', function() {
                                   _.stopAutoRefresh(_);
                                })
                               .appendTo(_.element);

                $('<button />').attr({ type: 'button', class: _.settings.startButtonClass })
                               .html(_.settings.startButtonInner)
                               .on('click', function() {
                                   _.startAutoRefresh(_);
                                })
                               .appendTo(_.element);
            }

            //  Create and append the container div that holds the progress bar
            let container = $('<div />').attr({ class: 'auto-refresher-container' })
                                        .css({ height: _.settings.progressBarHeight, 'background-color': _.settings.backgroundColor })
                                        .appendTo(_.element);

            //  Create and append the progress bar <span> to the container <div>
            _.progressBar = $('<span />').attr({ class: 'auto-refresher-progress-bar' })
                                         .css({ 'background-color': _.settings.foregroundColor })
                                         .appendTo(container);

            //  Start the auto refresh process.
            _.startAutoRefresh(_);
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
            //  Is the auto refresh current in progress.
            inProgress: false,
            //  Cached reference to the progress bar <span> element.
            progressBar: null,
            //  Cached reference to the timeout that is set to the window.
            timeout: null,
            //  Cached reference to the interval that is set to the window.
            interval: null,
            //  Cached reference to the settings object.
            settings: {},
            //  The amount of time remaining before the callback is executed.
            timeRemaining: 0,
            /**
             * Kicks off the auto refresh process.  Creates a timeout that
             * will execute the _.settings.callback function after the period
             * of time defined by _.settings.seconds has passed.
             * @param {object} _ The plugin object
             */
            startAutoRefresh: function(_) {
                //  Don't continue if we are already in progress
                if(_.inProgress) { return; }
                _.inProgress = true;

                //  Set the transition property to the number of seconds to
                //  wait for auto refreshing
                _.progressBar.css({ transition: _.settings.seconds + 's linear' });

                //  Set the width of the progress bar to 100.  This in combination
                //  with setting the transition time above creates a faux animation
                //  of the progress bar filling up for that amount of time.
                _.progressBar.width('100%');

                //  Create the timeout that will execute the callback function
                //  when it's completed.
                _.timeout = window.setTimeout(function() {
                    _.progressBar.css({ transition: '' });
                    window.clearInterval(_.interval);
                    _.settings.callback();
                }, _.settings.seconds * 1000);

                //  Set the amount of time remaining to the initial seconds.
                _.timeRemaining = _.settings.seconds;

                //  Create the interval that will decrement the time remaining
                //  value every second
                _.interval = window.setInterval(function() {
                    _.timeRemaining--;
                    $(_.settings.timeRemainingId).html(_.timeRemaining);
                }, 1000);
            },
            /**
             * Stops the auto refresh process completely by clearing the
             * timeout that was created during startAutoRefresh().
             * @param {object} _ The plugin object
             */
            stopAutoRefresh: function(_) {
                //  Don't continue if we are not in progress
                if(!_.inProgress) { return; }
                _.inProgress = false;

                //  Disable the transition property on the progress bar
                _.progressBar.css({ transition: '' });

                //  Set the width of the progress bar to 0 to visually indicate
                //  that we have stopped
                _.progressBar.width('0%');

                //  Clear the timeout that was created when we started
                window.clearTimeout(_.timeout);

                //  Clear the interval that was created when we started
                window.clearInterval(_.interval);
            }
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
