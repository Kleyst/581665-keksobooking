'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  var debounce = function (func) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
  };

  window.debounce = debounce;
})();
