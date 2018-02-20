'use strict';

var LEASED_PROPERTIES_NUMBER = 8;
var LEASED_PROPERTIES_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];
var LEASED_PROPERTIES_PRICE_MIN = 1000;
var LEASED_PROPERTIES_PRICE_MAX = 1000000;
var LEASED_PROPERTIES_TYPES = [
  'flat',
  'house',
  'bungalo'];
var LEASED_PROPERTIES_ROOMS_MIN = 1;
var LEASED_PROPERTIES_ROOMS_MAX = 5;
var LEASED_PROPERTIES_GUESTS_MAX = 10;
var LEASED_PROPERTIES_CHECKIN_ARRAY = [
  '12:00',
  '13:00',
  '14:00'];
var LEASED_PROPERTIES_CHECKOUT_ARRAY = [
  '12:00',
  '13:00',
  '14:00'];
var LEASED_PROPERTIES_FEAUTURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'];
var LEASED_PROPERTIES_DESCRIPTION = '';
var LEASED_PROPERTIES_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var AUTHOR_AVATAR_FOLDER = 'img/avatars/';
var AUTHOR_AVATAR_FILE_FORMAT = '.png';
var AUTHOR_AVATAR_WIDTH = 40;
var AUTHOR_AVATAR_HEIGHT = 40;
var PROPERTY_PHOTO_WIDTH = 60;
var PROPERTY_PHOTO_HEIGHT = 60;

var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 150;
var LOCATION_Y_MAX = 500;

var mainPinHeight = 70;

var randomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; --i) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var generateAvatarsURL = function (count) {
  var numbers = [];

  for (var i = 0; i < count; ++i) {
    numbers [i] = i + 1;
  }

  var shiffledNumbers = shuffleArray(numbers);

  var avatarsURL = [];

  for (i = 0; i < count; ++i) {
    avatarsURL.push(AUTHOR_AVATAR_FOLDER + 'user0' + shiffledNumbers[i] + AUTHOR_AVATAR_FILE_FORMAT);
  }

  return avatarsURL;
};

var generateLeasedProperties = function (count) {
  var avatarsURL = generateAvatarsURL(count);

  var leasedProperties = [];
  for (var i = 0; i < count; ++i) {
    var shuffledFeatures = shuffleArray(LEASED_PROPERTIES_FEAUTURES);
    var propertyFeatures = [];
    var featuresCount = randomInteger(0, LEASED_PROPERTIES_FEAUTURES.length - 1);
    for (var j = 0; j < featuresCount; ++j) {
      propertyFeatures.push(shuffledFeatures[j]);
    }

    var protertyX = randomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
    var propertyY = randomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);

    leasedProperties[i] = {
      location: {
        x: protertyX,
        y: propertyY
      },
      author: {
        avatarURL: avatarsURL[i],
        title: LEASED_PROPERTIES_TITLES[randomInteger(0, LEASED_PROPERTIES_TITLES.length - 1)],
        adress: protertyX + ', ' + propertyY
      },
      offer: {
        price: randomInteger(LEASED_PROPERTIES_PRICE_MIN, LEASED_PROPERTIES_PRICE_MAX),
        type: LEASED_PROPERTIES_TYPES[randomInteger(0, LEASED_PROPERTIES_TYPES.length - 1)],
        rooms: randomInteger(LEASED_PROPERTIES_ROOMS_MIN, LEASED_PROPERTIES_ROOMS_MAX),
        guests: randomInteger(0, LEASED_PROPERTIES_GUESTS_MAX),
        checkin: LEASED_PROPERTIES_CHECKIN_ARRAY[randomInteger(0, LEASED_PROPERTIES_CHECKIN_ARRAY.length - 1)],
        photos: shuffleArray(LEASED_PROPERTIES_PHOTOS.slice()),
        features: propertyFeatures,
        description: LEASED_PROPERTIES_DESCRIPTION,
        checkout: LEASED_PROPERTIES_CHECKOUT_ARRAY[randomInteger(0, LEASED_PROPERTIES_CHECKOUT_ARRAY.length - 1)]
      }
    };
  }
  return leasedProperties;
};

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

var appartmentsTypes = {
  house: 'Дом',
  flat: 'Квартира',
  bungalo: 'Бунгало'
};

var getLastPartOfString = function (string, separator) {
  var position = string.search(separator) + separator.length;
  return string.substring(position, string.length);
};

var renderFeatures = function (liTemplate, ad, property) {
  var ul = ad.querySelector('.popup__features');

  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  for (var i = 0; i < liTemplate.length; ++i) {
    var feature = getLastPartOfString(liTemplate[i].className, '--');
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

var renderAd = function (property) {
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
  ad.querySelector('h4').textContent = appartmentsTypes[property.offer.type];

  ad.querySelector('p:nth-of-type(3)').textContent = 'Комнат: ' + property.offer.rooms + ' для ' + property.offer.guests + ' гостей';
  ad.querySelector('p:nth-of-type(4)').textContent = 'Заезд: ' + property.offer.checkin + ', выезд: ' + property.offer.checkout;

  var liTemplateFeatures = adTemplate.querySelector('.popup__features').querySelectorAll('li');
  renderFeatures(liTemplateFeatures, ad, property);
  ad.querySelector('p:nth-of-type(5)').textContent = property.offer.description;

  renderPhotos(ad, property);
  var beforeDiv = document.querySelector('.map__filters-container');
  var parentDiv = document.querySelector('.map');
  parentDiv.insertBefore(ad, beforeDiv);
};


var triggerActiveState = function () {
  document.querySelector('.map').classList.remove('map--faded');
  document.querySelector('.notice__form').classList.remove('notice__form--disabled');

  var fieldsets = document.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; ++i) {
    fieldsets[i].disabled = false;
  }
};

var triggerInactiveState = function () {
  document.querySelector('.map').classList.add('map--faded');
  document.querySelector('.notice__form').classList.add('notice__form--disabled');

  var fieldsets = document.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; ++i) {
    fieldsets[i].disabled = true;
  }
};

var setAddressValue = function (x, y) {
  document.querySelector('input[name="address"]').value = x + ' ' + y;
};

var mapPinMainMouseupHandler = function (evt) {
  document.querySelector('.map__pin--main').removeEventListener('mouseup', mapPinMainMouseupHandler);
  triggerActiveState();
  var map = document.querySelector('.map');
  setAddressValue(evt.pageX - map.offsetLeft, evt.pageY - map.offsetTop + mainPinHeight / 2);

  var leasedProperties = generateLeasedProperties(LEASED_PROPERTIES_NUMBER);

  renderPins(LEASED_PROPERTIES_NUMBER, leasedProperties);
};

var pinClickHandler = function (property) {
  renderAd(property);
};

var renderPins = function (numberOfPins, data) {
  var pins = document.createDocumentFragment();
  for (var i = 0; i < numberOfPins; ++i) {
    var pin = createPinFromData(data[i]);
    var evt;
    pin.addEventListener('click', pinClickHandler.bind(evt, data[i]));
    pins.appendChild(pin);
  }
  var mapPins = document.querySelector('.map__pins');
  mapPins.appendChild(pins);
};

var setStartState = function () {
  triggerActiveState();
  triggerInactiveState();
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var pinX = map.clientWidth / 2;
  var pinY = (map.clientHeight + map.scrollTop) / 2;
  setAddressValue(pinX, pinY);
  mainPin.addEventListener('mouseup', mapPinMainMouseupHandler);
};

setStartState();
