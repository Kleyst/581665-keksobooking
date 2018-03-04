'use strict';

(function () {
  var startPage = function () {
    window.states.triggerActiveState();
    window.states.triggerInactiveState();
    var mainPin = document.querySelector('.map__pin--main');
    var map = document.querySelector('.map');
    var pin = {
      x: map.clientWidth / 2,
      y: (map.clientHeight + map.scrollTop) / 2
    };
    document.querySelector('input[name="address"]').value = pin.x + ', ' + pin.y;
    mainPin.addEventListener('mousedown', window.map.mapPinMainMouseDownHandler);
    mainPin.addEventListener('mouseup', window.map.mapPinMainMouseupHandler);
  };

  window.up = {
    startPage: startPage
  };
})();

window.up.startPage();
