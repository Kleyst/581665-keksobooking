'use strict';

var LEASED_PROPERTIES_NUMBER = 8;
var LEASED_PROPERTIES_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var LEASED_PROPERTIES_PRICE_MIN = 1000;
var LEASED_PROPERTIES_PRICE_MAX = 1000000;
var LEASED_PROPERTIES_TYPES = ['flat', 'house', 'bungalo'];
var LEASED_PROPERTIES_ROOMS_MIN = 1;
var LEASED_PROPERTIES_ROOMS_MAX = 5;
var LEASED_PROPERTIES_GUESTS_MAX = 10;
var LEASED_PROPERTIES_CHECKIN_ARRAY = ['12:00', '13:00', '14:00'];
var LEASED_PROPERTIES_CHECKOUT_ARRAY = ['12:00', '13:00', '14:00'];
var LEASED_PROPERTIES_FEAUTURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var LEASED_PROPERTIES_DESCRIPTION = '';
var LEASED_PROPERTIES_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 150;
var LOCATION_Y_MAX = 500;

var randomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
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

var generateAvatarsURL = function (length) {
  var numbers = [];

  for (var i = 0; i < length; ++i) {
    numbers [i] = i + 1;
  }

  var shiffledNumbers = shuffleArray(numbers);

  var avatarsURL = [];

  for (i = 0; i < length; ++i) {
    avatarsURL.push('img/avatars/user0' + shiffledNumbers[i] + '.png');
  }

  return avatarsURL;
};

var generateLeasedProperties = function (length) {
  var avatarsURL = generateAvatarsURL(length);

  var leasedProperties = [];

  for (var i = 0; i < length; ++i) {
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
  map.classList.remove('.map--faded');
};

var createPinFromData = function (data) {
  var button = document.createElement('button');
  button.className = 'map__pin';
  var x = data.location.x;
  var y = data.location.y;
  button.style = 'left: ' + x + 'px; top: ' + y + 'px;';

  var img = document.createElement('img');
  img.src = data.author.avatarURL;
  img.width = 40;
  img.height = 40;
  img.draggable = 'false';

  button.appendChild(img);

  return button;
};

var renderPins = function (numberOfPins, data) {
  var pins = document.createDocumentFragment();
  for (var i = 0; i < numberOfPins; ++i) {
    pins.appendChild(createPinFromData(data[i]));
  }
  var mapPins = document.querySelector('.map__pins');
  mapPins.appendChild(pins);
};

var getPropertyType = function (type) {
  if (type === 'flat') {
    return 'Квартира';
  } else if (type === 'bungalo') {
    return 'Бунгало';
  }
  return 'Дом';
};

var getLastPartOfString = function (string, separator) {
  var position = string.search(separator) + separator.length;
  return string.substring(position, string.length);
};

var renderAd = function (property) {

  var ad = document.querySelector('template').content.querySelector('.map__card.popup').cloneNode(true);

  var paragraphs = ad.querySelectorAll('p');
  var ulList = ad.querySelectorAll('ul');

  ad.querySelector('img').src = property.author.avatarURL;
  ad.querySelector('h3').textContent = property.author.title;
  ad.querySelector('small').textContent = property.author.adress;
  ad.querySelector('.popup__price').textContent = property.offer.price + ' ночь';
  ad.querySelector('h4').textContent = getPropertyType(property.offer.type);
  paragraphs[2].textContent = property.offer.rooms + ' комнаты для ' + property.offer.guests + ' гостей';
  paragraphs[3].textContent = 'Заезд после ' + property.offer.checkin + ', выезд до ' + property.offer.checkout;

  var liFeatures = ulList[0].querySelectorAll('li');

  for (var i = 0; i < liFeatures.length; ++i) {
    liFeatures[i].style.visibility = 'hidden';
    var feature = getLastPartOfString(liFeatures[i].className, '--');
    for (var j = 0; j < property.offer.features.length; ++j) {
      if (feature === property.offer.features[j]) {
        liFeatures[i].style.visibility = 'visible';
      }
    }
  }

  paragraphs[4].textContent = property.offer.description;

  for (i = 0; i < property.offer.photos.length - 1; ++i) {
    var liPhoto = document.createElement('li');
    ulList[1].appendChild(liPhoto);
  }

  var liPhotos = ulList[1].querySelectorAll('li');

  for (i = 0; i < liPhotos.length; ++i) {
    var photoSrc = document.createElement('src');
    photoSrc.textContent = property.offer.photos[i];
  }

  var beforeDiv = document.querySelector('.map__filters-container');
  var parentDiv = document.querySelector('.map');
  parentDiv.insertBefore(ad, beforeDiv);
};

removeMapFaded();

var leasedProperties = generateLeasedProperties(LEASED_PROPERTIES_NUMBER);

renderPins(LEASED_PROPERTIES_NUMBER, leasedProperties);

renderAd(leasedProperties[0]);
