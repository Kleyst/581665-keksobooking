'use strict';

(function () {

  var fieldsets = document.querySelectorAll('fieldset');
  var map = document.querySelector('.map');
  var form = document.querySelector('.notice__form');

  var disableElements = function (elements, isDisable) {
    for (var i = 0; i < elements.length; ++i) {
      elements[i].disabled = isDisable;
    }
  };

  var triggerActiveState = function () {
    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    disableElements(fieldsets, false);
    window.notice.setActiveForm();
  };

  var triggerInactiveState = function () {
    map.classList.add('map--faded');
    form.classList.add('notice__form--disabled');
    form.noValidate = true;
    disableElements(fieldsets, true);
  };

  window.states = {
    triggerActiveState: triggerActiveState,
    triggerInactiveState: triggerInactiveState
  };
})();
