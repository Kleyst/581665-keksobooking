'use strict';

(function () {

  var PROPERTIES = {
    LOCATION: {
      X_MIN: 300,
      X_MAX: 900,
      Y_MIN: 150,
      Y_MAX: 500
    },
    AUTHOR: {
      AVATAR_FOLDER: 'img/avatars/',
      AVATAR_FILE_FORMAT: '.png'
    },
    OFFER: {
      TITLES: [
        'Большая уютная квартира',
        'Маленькая неуютная квартира',
        'Огромный прекрасный дворец',
        'Маленький ужасный дворец',
        'Красивый гостевой домик',
        'Некрасивый негостеприимный домик',
        'Уютное бунгало далеко от моря',
        'Неуютное бунгало по колено в воде'],
      PRICE: {
        MIN: 1000,
        MAX: 1000000
      },
      TYPES: [
        'flat',
        'house',
        'bungalo'],
      ROOMS: {
        MIN: 1,
        MAX: 5
      },
      GUESTS: {
        MIN: 1,
        MAX: 10
      },
      CHECKIN_ARRAY: [
        '12:00',
        '13:00',
        '14:00'],
      CHECKOUT_ARRAY: [
        '12:00',
        '13:00',
        '14:00'],
      FEAUTURES: [
        'wifi',
        'dishwasher',
        'parking',
        'washer',
        'elevator',
        'conditioner'],
      DESCRIPTION: 'Маленькая чистая квартира. Без интернета, регистрации и СМС.',
      PHOTOS: [
        'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
    }
  };

  var generateAvatars = function (count) {
    var numbers = [];

    for (var i = 0; i < count; ++i) {
      numbers [i] = i + 1;
    }

    var shiffledNumbers = window.utils.shuffleArray(numbers);

    var avatars = [];

    for (i = 0; i < count; ++i) {
      avatars.push(PROPERTIES.AUTHOR.AVATAR_FOLDER + 'user0'
      + shiffledNumbers[i] + PROPERTIES.AUTHOR.AVATAR_FILE_FORMAT);
    }

    return avatars;
  };

  window.data = {
    generateLeasedProperties: function (count) {
      var avatars = generateAvatars(count);

      var leasedProperties = [];
      for (var i = 0; i < count; ++i) {
        var shuffledFeatures = window.utils.shuffleArray(PROPERTIES.OFFER.FEAUTURES);
        var propertyFeatures = [];
        var featuresCount = window.utils.randomInteger(0, PROPERTIES.OFFER.FEAUTURES.length - 1);
        for (var j = 0; j < featuresCount; ++j) {
          propertyFeatures.push(shuffledFeatures[j]);
        }

        var protertyX = window.utils.randomInteger(PROPERTIES.LOCATION.X_MIN, PROPERTIES.LOCATION.X_MAX);
        var propertyY = window.utils.randomInteger(PROPERTIES.LOCATION.Y_MIN, PROPERTIES.LOCATION.Y_MAX);

        leasedProperties[i] = {
          location: {
            x: protertyX,
            y: propertyY
          },
          author: {
            avatar: avatars[i],
          },
          offer: {
            address: protertyX + ', ' + propertyY,
            title: PROPERTIES.OFFER.TITLES[window.utils.randomInteger(0, PROPERTIES.OFFER.TITLES.length - 1)],
            price: window.utils.randomInteger(PROPERTIES.OFFER.PRICE.MIN, PROPERTIES.OFFER.PRICE.MAX),
            type: PROPERTIES.OFFER.TYPES[window.utils.randomInteger(0, PROPERTIES.OFFER.TYPES.length - 1)],
            rooms: window.utils.randomInteger(PROPERTIES.OFFER.ROOMS.MIN, PROPERTIES.OFFER.ROOMS.MAX),
            guests: window.utils.randomInteger(0, PROPERTIES.OFFER.GUESTS.MAX),
            checkin: PROPERTIES.OFFER.CHECKIN_ARRAY[window.utils.randomInteger(0, PROPERTIES.OFFER.CHECKIN_ARRAY.length - 1)],
            photos: window.utils.shuffleArray(PROPERTIES.OFFER.PHOTOS.slice()),
            features: propertyFeatures,
            description: PROPERTIES.OFFER.DESCRIPTION,
            checkout: PROPERTIES.OFFER.CHECKOUT_ARRAY[window.utils.randomInteger(0, PROPERTIES.OFFER.CHECKOUT_ARRAY.length - 1)]
          }
        };
      }
      return leasedProperties;
    }
  };
})();
