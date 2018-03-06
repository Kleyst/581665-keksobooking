'use strict';

(function () {
  var AVATAR_IMG_INDEX = 0;

  var Photo = {
    Width: 60,
    Height: 60
  };

  var AppartmentTypes = {
    bungalo: 'Лачуга',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };
  var ESC_KEYCODE = 27;

  var renderFeatures = function (liTemplate, ad, property) {
    var ulFeaturesfragment = document.createDocumentFragment();
    var ulFeatures = ad.querySelector('.popup__features');

    window.utils.removeAllChildren(ulFeatures);

    liTemplate.forEach(function (liTemplateElement) {
      var feature = window.utils.getLastPartOfString(liTemplateElement.className, '--');
      var arrayFeatures = property.offer.features;
      arrayFeatures.forEach(function (item) {
        if (feature === item) {
          ulFeaturesfragment.appendChild(liTemplateElement.cloneNode());
        }
      });
    });
    ulFeatures.appendChild(ulFeaturesfragment);
  };

  var renderPhotos = function (ad, property) {
    var ulPicturesfragment = document.createDocumentFragment();
    var ulPictures = ad.querySelector('.popup__pictures');
    var arrayPhotos = property.offer.photos;
    arrayPhotos.forEach(function () {
      ulPicturesfragment.appendChild(document.createElement('li'));
    });
    var liPhotos = ulPicturesfragment.querySelector('li');
    for (var i = 0; i < property.offer.photos.length; ++i) {
      var photoSrc = document.createElement('img');
      photoSrc.src = property.offer.photos[i];
      photoSrc.width = Photo.Width;
      photoSrc.height = Photo.Height;
      liPhotos.appendChild(photoSrc);
    }
    ulPictures.appendChild(ulPicturesfragment);
  };

  var removeAd = function () {
    var ad = document.querySelector('.map__card.popup');
    if (ad !== null) {
      ad.remove();
    }
  };

  var buttonCloseClickHandler = function () {
    removeAd();
  };

  var adKeydownEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeAd();
      document.removeEventListener('keydown', adKeydownEscHandler);
    }
  };

  var renderAd = function (property) {
    removeAd();
    var adTemplate = document.querySelector('template').content.querySelector('.map__card.popup');
    var ad = adTemplate.cloneNode(true);

    ad.querySelectorAll('img')[AVATAR_IMG_INDEX].src = property.author.avatar;
    ad.querySelector('h3').textContent = property.offer.title;
    ad.querySelector('small').textContent = property.offer.address;
    ad.querySelector('.popup__price').textContent = property.offer.price + 'р/ночь';
    ad.querySelector('h4').textContent = AppartmentTypes[property.offer.type];

    ad.querySelector('p:nth-of-type(3)').textContent = 'Комнат: ' + property.offer.rooms + ' для ' + property.offer.guests + ' гостей';
    ad.querySelector('p:nth-of-type(4)').textContent = 'Заезд: ' + property.offer.checkin + ', выезд: ' + property.offer.checkout;

    var liTemplateFeatures = adTemplate.querySelector('.popup__features').querySelectorAll('li');
    renderFeatures(liTemplateFeatures, ad, property);
    ad.querySelector('p:nth-of-type(5)').textContent = property.offer.description;

    renderPhotos(ad, property);
    var buttonClose = ad.querySelector('.popup__close');
    buttonClose.addEventListener('click', buttonCloseClickHandler);
    document.addEventListener('keydown', adKeydownEscHandler);

    var parentDiv = document.querySelector('.map');
    var beforeDiv = parentDiv.querySelector('.map__filters-container');
    parentDiv.insertBefore(ad, beforeDiv);
  };

  window.ad = {
    renderAd: renderAd,
    removeAd: removeAd
  };
})();
