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
    for (var j = 0; i < randomInteger(0, LEASED_PROPERTIES_FEAUTURES.length - 1); ++j) {
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
        checkout: LEASED_PROPERTIES_CHECKOUT_ARRAY[randomInteger(0, LEASED_PROPERTIES_CHECKOUT_ARRAY.length - 1)],
        features: propertyFeatures,
        description: LEASED_PROPERTIES_DESCRIPTION,
        photos: shuffleArray(LEASED_PROPERTIES_PHOTOS, LEASED_PROPERTIES_PHOTOS.length)
      }
    };
  }
  return leasedProperties;
};

var removeMapFaded = function () {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
};

var createPinFromData = function (data) {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = data.location.x + 'px';
  pin.style.top = data.location.y + 'px';

  var img = pin.querySelector('img');
  img.src = data.author.avatarURL;
  img.width = AUTHOR_AVATAR_WIDTH;
  img.height = AUTHOR_AVATAR_HEIGHT;
  img.draggable = 'false';

  return pin;
};

var renderPins = function (numberOfPins, data) {
  var pins = document.createDocumentFragment();
  for (var i = 0; i < numberOfPins; ++i) {
    pins.appendChild(createPinFromData(data[i]));
  }
  var mapPins = document.querySelector('.map__pins');
  mapPins.appendChild(pins);
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

var renderAd = function (property) {

  var adTemplate = document.querySelector('template').content.querySelector('.map__card.popup');
  var ad = adTemplate.cloneNode(true);
  var paragraphs = ad.querySelectorAll('p');
  var ulList = ad.querySelectorAll('ul');

  ad.querySelectorAll('img')[0].src = property.author.avatarURL;
  ad.querySelector('h3').textContent = property.author.title;
  ad.querySelector('small').textContent = property.author.adress;
  ad.querySelector('.popup__price').textContent = property.offer.price + ' ночь';
  ad.querySelector('h4').textContent = appartmentsTypes[property.offer.type];
  paragraphs[2].textContent = 'Комнат: ' + property.offer.rooms + ' для ' + property.offer.guests + ' гостей';
  paragraphs[3].textContent = 'Заезд: ' + property.offer.checkin + ', выезд: ' + property.offer.checkout;

  var liTemplateFeatures = adTemplate.querySelectorAll('ul')[0].querySelectorAll('li');

  while (ulList[0].firstChild) {
    ulList[0].removeChild(ulList[0].firstChild);
  }

  for (var i = 0; i < liTemplateFeatures.length; ++i) {
    var feature = getLastPartOfString(liTemplateFeatures[i].className, '--');
    for (var j = 0; j < property.offer.features.length; ++j) {
      if (feature === property.offer.features[j]) {
        ulList[0].appendChild(liTemplateFeatures[i]);
      }
    }
  }

  paragraphs[4].textContent = property.offer.description;

  for (i = 0; i < property.offer.photos.length - 1; ++i) {
    ulList[1].appendChild(document.createElement('li'));
  }
  var liPhotos = ulList[1].querySelectorAll('li');
  liPhotos[0].querySelector('img').remove();

  for (i = 0; i < liPhotos.length; ++i) {
    var photoSrc = document.createElement('img');
    photoSrc.src = property.offer.photos[i];
    photoSrc.width = PROPERTY_PHOTO_WIDTH;
    photoSrc.height = PROPERTY_PHOTO_HEIGHT;
    liPhotos[i].appendChild(photoSrc);
  }

  var beforeDiv = document.querySelector('.map__filters-container');
  var parentDiv = document.querySelector('.map');
  parentDiv.insertBefore(ad, beforeDiv);
};

removeMapFaded();

var leasedProperties = generateLeasedProperties(LEASED_PROPERTIES_NUMBER);

renderPins(LEASED_PROPERTIES_NUMBER, leasedProperties);

renderAd(leasedProperties[0]);
