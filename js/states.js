'use strict';

(function () {
  window.states = {
    triggerActiveState: function () {
      document.querySelector('.map').classList.remove('map--faded');
      document.querySelector('.notice__form').classList.remove('notice__form--disabled');

      var fieldsets = document.querySelectorAll('fieldset');
      for (var i = 0; i < fieldsets.length; ++i) {
        fieldsets[i].disabled = false;
      }
      window.map.setActiveForm();
    },
    triggerInactiveState: function () {
      document.querySelector('.map').classList.add('map--faded');
      var form = document.querySelector('.notice__form');
      form.classList.add('notice__form--disabled');
      form.noValidate = true;
      var fieldsets = document.querySelectorAll('fieldset');
      for (var i = 0; i < fieldsets.length; ++i) {
        fieldsets[i].disabled = true;
      }
    }
  };
})();
