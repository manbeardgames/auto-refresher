"use strict";

;

(function ($) {
  "use strict";

  (function ($, window) {
    var pluginName = "autoRefresher";

    function Plugin(element, options) {
      this.element = element;
      this._name = pluginName;
      this._defaults = $.fn[pluginName].defaults;
      this.settings = $.extend({}, this._defaults, options);

      if (typeof this.settings.seconds !== "number" || this.settings.seconds <= 0) {
        this.settings.seconds = this._defaults.seconds;
      }

      if (!$.isFunction(this.settings.callback)) {
        this.settings.callback = this._defaults.callback;
      }

      if (this.settings.startButtonClass === null || typeof this.settings.startButtonClass === "string" && this.settings.startButtonClass.trim().length === 0) {
        this.settings.startButtonClass = this._defaults.startButtonClass;
      }

      if (this.settings.stopButtonClass === null || typeof this.settings.stopButtonClass === "string" && this.settings.stopButtonClass.trim().length === 0) {
        this.settings.stopButtonClass = this._defaults.stopButtonClass;
      }

      this._init();
    }

    $.extend(Plugin.prototype, {
      _init: function _init() {
        var self = this,
            $el = $(this.element);
        $el.on("autoRefresher.start", function () {
          self._startAutoRefresh();
        });
        $el.on("autoRefresher.stop", function () {
          self._stopAutoRefresh();
        });

        if (!$el.hasClass("auto-refresher")) {
          $el.addClass("auto-refresher");
        }

        if (self.settings.showControls) {
          $("<button />").attr("type", "button").addClass(self.settings.stopButtonClass).html(self.settings.stopButtonInner).on("click", function () {
            self._stopAutoRefresh();
          }).appendTo($el);
          $("<button />").attr("type", "button").addClass(self.settings.startButtonClass).html(self.settings.startButtonInner).on("click", function () {
            self._startAutoRefresh();
          }).appendTo($el);
        }

        var container = $("<div />").attr("class", "auto-refresher-container").css({
          "height": self.settings.progressBarHeight,
          "background-color": self.settings.backgroundColor
        }).appendTo($el);
        self.progressBar = $("<span />").attr("class", "auto-refresher-progress-bar").css("background-color", self.settings.foregroundColor).appendTo(container);

        self._startAutoRefresh();
      },
      _startAutoRefresh: function _startAutoRefresh() {
        var self = this;

        if (this.inProgress) {
          return;
        }

        var progressBar = $(self.progressBar);
        self.inProgress = true;
        progressBar.css("transition", self.settings.seconds + "s linear");
        progressBar.width("100%");
        self.timeout = window.setTimeout(function () {
          progressBar.css("transition", "");

          if (self.interval !== null) {
            window.clearInterval(self.interval);
          }

          self.settings.callback();
        }, self.settings.seconds * 1000);
        self.timeRemaining = self.settings.seconds;
        self.interval = window.setInterval(function () {
          self.timeRemaining--;
          $(self.settings.timeRemainingId).html(self.timeRemaining);
        }, 1000);
      },
      _stopAutoRefresh: function _stopAutoRefresh() {
        var self = this;

        if (!self.inProgress) {
          return;
        }

        var progressBar = $(self.progressBar);
        self.inProgress = false;
        progressBar.css("transition", "");
        progressBar.width("0%");
        window.clearTimeout(self.timeout);
        window.clearInterval(self.interval);
      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };

    $.fn[pluginName].defaults = {
      seconds: 60,
      callback: function callback() {
        window.location.reload();
      },
      showControls: true,
      progressBarHeight: "7px",
      stopButtonClass: "auto-refresher-button",
      startButtonClass: "auto-refresher-button",
      stopButtonInner: "Stop",
      startButtonInner: "Start",
      backgroundColor: "#6C757D",
      foregroundColor: "#007BFF",
      timeRemainingId: "#auto-refresher-time-remaining"
    };
  })($, window);
})(jQuery);
