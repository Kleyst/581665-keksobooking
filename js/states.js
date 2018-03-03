'use strict';

(function () {
  var disableElements = function (elements, bool) {
    for (var i = 0; i < elements.length; ++i) {
      elements[i].disabled = bool;
    }
  };
  var fieldsets = document.querySelectorAll('fieldset');
  var map = document.querySelector('.map');

  window.states = {
    triggerActiveState: function () {
      map.classList.remove('map--faded');
      document.querySelector('.notice__form').classList.remove('notice__form--disabled');
      disableElements(fieldsets, false);
      window.map.setActiveForm();
    },
    triggerInactiveState: function () {
      map.classList.add('map--faded');
      var form = document.querySelector('.notice__form');
      form.classList.add('notice__form--disabled');
      form.noValidate = true;
      disableElements(fieldsets, true);
    }
  };
})();
