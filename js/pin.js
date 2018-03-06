'use strict';

(function () {
  var AVATAR = {
    WIDTH: 40,
    HEIGHT: 40
  };

  var createPinFromData = function (data) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = data.location.x + 'px';
    pin.style.top = data.location.y + 'px';

    var img = pin.firstChild;
    img.src = data.author.avatar;
    img.width = AVATAR.WIDTH;
    img.height = AVATAR.HEIGHT;
    img.draggable = 'false';

    return pin;
  };

  var renderPins = function (numberOfPins, data) {
    var mapPinsFragment = document.createDocumentFragment();
    var mapPins = document.querySelector('.map__pins');
    for (var i = 0; i < numberOfPins; ++i) {
      var pin = createPinFromData(data[i]);
      pin.addEventListener('click', window.ad.renderAd.bind(null, data[i]));
      mapPinsFragment.appendChild(pin);
    }
    mapPins.appendChild(mapPinsFragment);
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; ++i) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pins[i].remove();
      }
    }
  };

  window.pin = {
    renderPins: renderPins,
    removePins: removePins
  };
})();
