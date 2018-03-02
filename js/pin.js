'use strict';

(function () {
  var AUTHOR_AVATAR_WIDTH = 40;
  var AUTHOR_AVATAR_HEIGHT = 40;

  var createPinFromData = function (data) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = data.location.x + 'px';
    pin.style.top = data.location.y + 'px';

    var img = pin.firstChild;
    img.src = data.author.avatarURL;
    img.width = AUTHOR_AVATAR_WIDTH;
    img.height = AUTHOR_AVATAR_HEIGHT;
    img.draggable = 'false';

    return pin;
  };

  window.pin = {
    renderPins: function (numberOfPins, data) {
      var pins = document.createDocumentFragment();
      for (var i = 0; i < numberOfPins; ++i) {
        var pin = createPinFromData(data[i]);
        pin.addEventListener('click', window.ad.renderAd.bind(null, data[i]));
        pins.appendChild(pin);
      }
      var mapPins = document.querySelector('.map__pins');
      mapPins.appendChild(pins);
    }
  };
})();
