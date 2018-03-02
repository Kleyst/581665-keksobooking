'use strict';

(function () {
  var PROPERTY_PHOTO_WIDTH = 60;
  var PROPERTY_PHOTO_HEIGHT = 60;

  var APPARTMENTS_TYPES = {
    bungalo: 'Лачуга',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };
  var ESC_KEYCODE = 27;

  var renderFeatures = function (liTemplate, ad, property) {
    var ul = ad.querySelector('.popup__features');

    window.utils.removeAllChildren(ul);

    for (var i = 0; i < liTemplate.length; ++i) {
      var feature = window.utils.getLastPartOfString(liTemplate[i].className, '--');
      for (var j = 0; j < property.offer.features.length; ++j) {
        if (feature === property.offer.features[j]) {
          ul.appendChild(liTemplate[i].cloneNode());
        }
      }
    }
  };

  var renderPhotos = function (ad, property) {
    var ul = ad.querySelector('.popup__pictures');
    for (var i = 0; i < property.offer.photos.length - 1; ++i) {
      ul.appendChild(document.createElement('li'));
    }
    var liPhotos = ul.querySelectorAll('li');
    liPhotos[0].querySelector('img').remove();

    for (i = 0; i < liPhotos.length; ++i) {
      var photoSrc = document.createElement('img');
      photoSrc.src = property.offer.photos[i];
      photoSrc.width = PROPERTY_PHOTO_WIDTH;
      photoSrc.height = PROPERTY_PHOTO_HEIGHT;
      liPhotos[i].appendChild(photoSrc);
    }
  };

  var buttonCloseClickHandler = function () {
    document.querySelector('.map__card.popup').remove();
  };

  var adKeydownEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      document.querySelector('.map__card.popup').remove();
    }
    document.removeEventListener('keydown', adKeydownEscHandler);
  };

  window.ad = {
    renderAd: function (property) {
      var previousAd = document.querySelector('.map__card.popup');
      if (previousAd !== null) {
        document.querySelector('.map__card.popup').remove();
      }
      var adTemplate = document.querySelector('template').content.querySelector('.map__card.popup');
      var ad = adTemplate.cloneNode(true);

      ad.querySelectorAll('img')[0].src = property.author.avatarURL;
      ad.querySelector('h3').textContent = property.author.title;
      ad.querySelector('small').textContent = property.author.adress;
      ad.querySelector('.popup__price').textContent = property.offer.price + ' ночь';
      ad.querySelector('h4').textContent = APPARTMENTS_TYPES[property.offer.type];

      ad.querySelector('p:nth-of-type(3)').textContent = 'Комнат: ' + property.offer.rooms + ' для ' + property.offer.guests + ' гостей';
      ad.querySelector('p:nth-of-type(4)').textContent = 'Заезд: ' + property.offer.checkin + ', выезд: ' + property.offer.checkout;

      var liTemplateFeatures = adTemplate.querySelector('.popup__features').querySelectorAll('li');
      renderFeatures(liTemplateFeatures, ad, property);
      ad.querySelector('p:nth-of-type(5)').textContent = property.offer.description;

      renderPhotos(ad, property);

      var buttonClose = ad.querySelector('.popup__close');
      buttonClose.addEventListener('click', buttonCloseClickHandler);
      document.addEventListener('keydown', adKeydownEscHandler);

      var beforeDiv = document.querySelector('.map__filters-container');
      var parentDiv = document.querySelector('.map');
      parentDiv.insertBefore(ad, beforeDiv);
    }
  };
})();
