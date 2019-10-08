//  the semi-colon before function invocation is a safety net against concatenated
//  scripts and/or other plugins which may not be closed properly.
;( function( $ ){
    "use strict";

    ( function ( $, window, document, undefined) {
		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
        // can no longer be modified.
        
		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
        // minified (especially when both are regularly referenced in your plugin).
        
        var pluginName = "autoRefresher";

        //  The constructor for the plugin
        function Plugin( element, options ) {
            this.element = element;
            this._name = pluginName;
            this._defaults = $.fn[ pluginName ].defaults;
            this.settings = $.extend( {}, this._defaults, options );

            //  The 'seconds' settings must be a 'number' type and must be positive.
            //  If either of those validations fail, fallback to the default value.
            if( typeof this.settings.seconds !== "number"  || this.settings.seconds <= 0 ) {
                this.settings.seconds = this._defaults.seconds;
            }

            //  The 'callback' function must be an action function.
            //  If it is not, fallback to the default function
            if(!$.isFunction( this.settings.callback )) {
                this.settings.callback = this._defaults.callback;
            }

            //  If the user does not add a value for 'startButtonClass', or if the user
            //  set the value as '', then we fallback to the default value
            if( this.settings.startButtonClass === null || 
                ( typeof this.settings.startButtonClass === "string" && this.settings.startButtonClass.trim().length === 0 ) ) {
                    this.settings.startButtonClass = this._defaults.startButtonClass;
                }

            //  If the user does not add a value for 'stopButtonClass', or if the user
            //  set the value as '', then we fallback to the default value
            if( this.settings.stopButtonClass === null ||
                ( typeof this.settings.stopButtonClass === "string" && this.settings.stopButtonClass.trim().length === 0 ) ) {
                    this.settings.stopButtonClass = this._defaults.stopButtonClass;                    
                }

            this._init();
        }

        $.extend( Plugin.prototype, {
            _init: function() {
                var self = this,
                    $el = $( this.element );

                    //  Attach a namespaced start event to the element.
                    //  This will allow users to start the process externally
                    //  using their own controls if they want.
                    $el.on( "autoRefresher.start", function() {
                        self._startAutoRefresh();
                    } );

                    //  Attach a namespaced stop even to the element.
                    //  This will allow users to stop the process externally
                    //  using their own controls if they want.
                    $el.on( "autoRefresher.stop", function() {
                        self._stopAutoRefresh();
                    } );

                    //  Check if $el has the auto-refresher class, add it
                    //  if it does not
                    if( !$el.hasClass( "auto-refresher" ) ) {
                        $el.addClass( "auto-refresher" );
                    }

                    //  If the user opted to have the controls included,
                    //  create and append them to $el
                    if( self.settings.showControls ) {
                        $( "<button />" ).attr( "type", "button" )
                                         .addClass( self.settings.stopButtonClass )
                                         .html( self.settings.stopButtonInner )
                                         .on( "click", function() {
                                             self._stopAutoRefresh();
                                         } )
                                         .appendTo( $el );

                        $( "<button />" ).attr( "type", "button" )
                                         .addClass( self.settings.startButtonClass )
                                         .html( self.settings.startButtonInner )
                                         .on( "click", function() {
                                             self._startAutoRefresh();
                                         } )
                                         .appendTo( $el );
                    }

                    //  Create a container <div>, which holds the progress bar
                    //  and append it to the $el
                    let container = $( "<div />" ).attr( "class", "auto-refresher-container" )
                                                  .css({
                                                      "height": self.settings.progressBarHeight,
                                                      "background-color": self.settings.backgroundColor
                                                  } )
                                                  .appendTo( $el );
                                                  
                    //  Create the progress bar <span> and append it to the container <div>
                    self.progressBar = $( "<span />" ).attr( "class", "auto-refresher-progress-bar" )
                                                      .css( "background-color", self.settings.foregroundColor )
                                                      .appendTo( container );

                    //  Kickoff the auto refresh process
                    self._startAutoRefresh();
            },

            //  Kicks off the auto refresh process.  Creates a timeout that will
            //  execute the settings.callback function after the period of time
            //  defined by settings.seconds has passed.
            _startAutoRefresh: function() {
                let self = this;

                //  Don't continue if we are already in progress
                if( this.inProgress ) {
                    return;
                }

                let progressBar = $( self.progressBar );

                //  Set that we are in progress
                self.inProgress = true;

                //  Set the transition property to the number of seconds to
                //  wait for auto refreshing
                progressBar.css( "transition", self.settings.seconds + "s linear" );

                //  Set the width of the progress bar to 100$. This in combination
                //  with setting the transition time above creates a faux animation
                //  of the progress bar filling up for that amount of time.
                progressBar.width( "100%" );

                //  Create the timeout that will execute the callback function
                //  when it is completed.
                self.timeout = window.setTimeout( function() {
                    //  Remove the transition from the progress bar
                    progressBar.css( "transition", "" );

                    //  Clear the interval
                    if( self.interval !== null) {
                        window.clearInterval( self.interval );
                    }

                    //  Call the callback function
                    self.settings.callback();

                }, self.settings.seconds * 1000 );

                //  Set the amount of time remaining to the initial seconds
                self.timeRemaining = self.settings.seconds;

                //  Create the interval that will decrement the time remaining
                //  value every second
                self.interval = window.setInterval( function() {
                    //  Decrement the time remaining
                    self.timeRemaining--;

                    //  Update the time remaining element
                    $( self.settings.timeRemainingId ).html( self.timeRemaining );                    
                }, 1000 );
                
            },

            //  Stops the auto refresh process completely by clearing the
            //  timeout that was created during _startAutoRefresh()
            _stopAutoRefresh: function() {
                let self = this;

                //  Do not continue if we are not in progress
                if( !self.inProgress ) {
                    return;
                }

                let progressBar = $( self.progressBar );

                //  Set that we are no longer in progress
                self.inProgress = false;

                //  disable the transition property on the progress bar
                progressBar.css( "transition", "" );

                //  Set the width of the progress bar to 0 to visually indicate
                //  that we have stopped
                progressBar.width( "0%" );

                //  Clear the timeout that was created when we started
                window.clearTimeout( self.timeout );

                //  Clear the interval that was created when we started
                window.clearInterval( self.interval );
            }
        } );

        //  A lightweight plugin wrapper around the constructor,
        //  preventing against multiple instantiations
        $.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
        };

        //  The default settings for this plugin
        $.fn[ pluginName ].defaults = {
            //  The total number of seconds to wait before refreshing
            seconds: 60,

            //  The callback function to execute when the timeout ends.
            callback: function() {
                window.location.reload();
            },

            //  Should the start and stop buttons be added.
            showControls: true,

            //  The height of the progress bar
            progressBarHeight: "7px",

            //  The css class to apply to the stop button
            stopButtonClass: "auto-refresher-button",

            //  The css class to apply to the start button
            startButtonClass: "auto-refresher-button",

            //  The content to insert into the stop button
            stopButtonInner: "Stop",

            //  The content to insert into the start button
            startButtonInner: "Start",

            //  The background color of the progress bar.
            backgroundColor: "#6C757D",

            //  The foreground color of the progress bar.
            foregroundColor: "#007BFF",

            //  The ID selector of the element to insert the time remaining value
            timeRemainingId: "#auto-refresher-time-remaining"
        };
    } )( $, window, document );
} )( jQuery );