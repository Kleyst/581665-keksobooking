'use strict';
(function () {
  var AUTHOR_AVATAR_FOLDER = 'img/avatars/';
  var AUTHOR_AVATAR_FILE_FORMAT = '.png';

  var LOCATION_X_MIN = 300;
  var LOCATION_X_MAX = 900;
  var LOCATION_Y_MIN = 150;
  var LOCATION_Y_MAX = 500;

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

  var generateAvatarsURL = function (count) {
    var numbers = [];

    for (var i = 0; i < count; ++i) {
      numbers [i] = i + 1;
    }

    var shiffledNumbers = window.utils.shuffleArray(numbers);

    var avatarsURL = [];

    for (i = 0; i < count; ++i) {
      avatarsURL.push(AUTHOR_AVATAR_FOLDER + 'user0' + shiffledNumbers[i] + AUTHOR_AVATAR_FILE_FORMAT);
    }

    return avatarsURL;
  };

  window.data = {
    generateLeasedProperties: function (count) {
      var avatarsURL = generateAvatarsURL(count);

      var leasedProperties = [];
      for (var i = 0; i < count; ++i) {
        var shuffledFeatures = window.utils.shuffleArray(LEASED_PROPERTIES_FEAUTURES);
        var propertyFeatures = [];
        var featuresCount = window.utils.randomInteger(0, LEASED_PROPERTIES_FEAUTURES.length - 1);
        for (var j = 0; j < featuresCount; ++j) {
          propertyFeatures.push(shuffledFeatures[j]);
        }

        var protertyX = window.utils.randomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
        var propertyY = window.utils.randomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);

        leasedProperties[i] = {
          location: {
            x: protertyX,
            y: propertyY
          },
          author: {
            avatarURL: avatarsURL[i],
            title: LEASED_PROPERTIES_TITLES[window.utils.randomInteger(0, LEASED_PROPERTIES_TITLES.length - 1)],
            adress: protertyX + ', ' + propertyY
          },
          offer: {
            price: window.utils.randomInteger(LEASED_PROPERTIES_PRICE_MIN, LEASED_PROPERTIES_PRICE_MAX),
            type: LEASED_PROPERTIES_TYPES[window.utils.randomInteger(0, LEASED_PROPERTIES_TYPES.length - 1)],
            rooms: window.utils.randomInteger(LEASED_PROPERTIES_ROOMS_MIN, LEASED_PROPERTIES_ROOMS_MAX),
            guests: window.utils.randomInteger(0, LEASED_PROPERTIES_GUESTS_MAX),
            checkin: LEASED_PROPERTIES_CHECKIN_ARRAY[window.utils.randomInteger(0, LEASED_PROPERTIES_CHECKIN_ARRAY.length - 1)],
            photos: window.utils.shuffleArray(LEASED_PROPERTIES_PHOTOS.slice()),
            features: propertyFeatures,
            description: LEASED_PROPERTIES_DESCRIPTION,
            checkout: LEASED_PROPERTIES_CHECKOUT_ARRAY[window.utils.randomInteger(0, LEASED_PROPERTIES_CHECKOUT_ARRAY.length - 1)]
          }
        };
      }
      return leasedProperties;
    }
  };
})();
