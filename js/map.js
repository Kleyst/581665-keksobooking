'use strict';

(function () {
  var PROPERTIES_NUMBER = 5;

  var MAIN_PIN_HEIGHT = 70;
  var Border = {
    top: 150,
    right: 50,
    left: 50,
    bottom: 100
  };

  var NOTICE_TITLE_PATTERN = '.{30,100}';
  var NOTICE_PRICE_MAX = 1000000;

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var delta = {
    x: null,
    y: null
  };

  var properties = [];

  var filtersContainer = document.querySelector('.map__filters-container');

  var filterType = filtersContainer.querySelector('select[name="housing-type"]');

  var filterPrice = filtersContainer.querySelector('select[name="housing-price"]');

  var filterRooms = filtersContainer.querySelector('select[name="housing-rooms"]');

  var filterGuests = filtersContainer.querySelector('select[name="housing-guests"]');

  var filterFeatures = filtersContainer.querySelector('fieldset[id="housing-features"]');

  var filterFeaturesWifi = filterFeatures.querySelector('input[id="filter-wifi"]');

  var filterFeaturesDishwasher = filterFeatures.querySelector('input[id="filter-dishwasher"]');

  var filterFeaturesParking = filterFeatures.querySelector('input[id="filter-parking"]');

  var filterFeaturesWasher = filterFeatures.querySelector('input[id="filter-washer"]');

  var filterFeaturesElevator = filterFeatures.querySelector('input[id="filter-elevator"]');

  var filterFeaturesConditioner = filterFeatures.querySelector('input[id="filter-conditioner"]');

  var PriceBorders = [
    10000,
    50000,
    100000
  ];
  var PriceTypes = [
    'low',
    'middle',
    'high'
  ];

  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var NO_FILTER = 'any';

  var getPropertyTypeForPrice = function (price) {
    if (price <= PriceBorders[0]) {
      return PriceTypes[0];
    } else if (price > PriceBorders[0] && price <= PriceBorders[1]) {
      return PriceTypes[1];
    }
    return PriceTypes[2];
  };

  var isFeaturesValidForFilter = function (featuresProperty, featuresFilter) {
    for (var i = 0; i < featuresFilter.length; ++i) {
      var IsfeatureExist = false;
      for (var j = 0; j < featuresProperty.length; ++j) {
        if (featuresFilter[i] === featuresProperty[j]) {
          IsfeatureExist = true;
        }
      }
      if (IsfeatureExist === false) {
        return false;
      }
    }
    return true;
  };

  var createFeaturesFilterArray = function () {
    var featuresArray = [];
    var i = 0;
    if (filterFeaturesWifi.checked) {
      featuresArray[i] = FEATURES[0];
      ++i;
    }

    if (filterFeaturesDishwasher.checked) {
      featuresArray[i] = FEATURES[1];
      ++i;
    }

    if (filterFeaturesParking.checked) {
      featuresArray[i] = FEATURES[2];
      ++i;
    }

    if (filterFeaturesWasher.checked) {
      featuresArray[i] = FEATURES[3];
      ++i;
    }

    if (filterFeaturesElevator.checked) {
      featuresArray[i] = FEATURES[4];
      ++i;
    }

    if (filterFeaturesConditioner.checked) {
      featuresArray[i] = FEATURES[5];
      ++i;
    }
    return featuresArray;
  };

  var setDeltaBetweenClickAndMainPinCenter = function (clickX, clickY) {
    var mainPinRectangle = mainPin.getBoundingClientRect();

    var center = {
      x: mainPinRectangle.width / 2 + mainPinRectangle.left,
      y: mainPinRectangle.height / 2 + mainPinRectangle.top
    };

    delta.x = clickX - center.x;
    delta.y = clickY - center.y;
  };

  var getMainPinCoordinatesRestrictions = function () {
    var mapRectangle = map.getBoundingClientRect();
    var mapHeight = mapRectangle.height - window.pageYOffset;
    return {
      x: {
        min: mapRectangle.x + Border.left,
        max: window.innerWidth - mapRectangle.x - Border.right
      },
      y: {
        min: Border.top,
        max: mapHeight - Border.bottom
      }
    };
  };

  var setActiveForm = function () {
    var notice = document.querySelector('.notice');

    var noticeTitle = notice.querySelector('input[name="title"]');
    noticeTitle.required = true;
    noticeTitle.pattern = NOTICE_TITLE_PATTERN;
    noticeTitle.addEventListener('change', window.notice.noticeTitleCheckValidityHandler);

    var noticeType = notice.querySelector('select[name="type"]');
    noticeType.addEventListener('change', window.notice.noticeTypeChangeHandler);
    noticeType.addEventListener('change', window.notice.noticePriceCheckValidityHandler);

    var noticePrice = notice.querySelector('input[name="price"]');
    noticePrice.required = true;
    noticePrice.min = window.notice.MIN_PRICE_FOR_TYPE[noticeType.querySelector('option:checked').value];
    noticePrice.max = NOTICE_PRICE_MAX;
    noticePrice.addEventListener('change', window.notice.noticePriceCheckValidityHandler);

    var noticeAddress = notice.querySelector('input[name="address"]');
    noticeAddress.readOnly = true;

    var noticeTimein = notice.querySelector('select[name="timein"]');
    noticeTimein.addEventListener('change', window.notice.noticeTimeinChangeHandler);

    var noticeTimeout = notice.querySelector('select[name="timeout"]');
    noticeTimeout.addEventListener('change', window.notice.noticeTimeoutChangeHandler);

    var noticeRooms = notice.querySelector('select[name="rooms"]');
    noticeRooms.addEventListener('change', window.notice.noticeRoomsDisableInvalidOptionsHandler);
    noticeRooms.addEventListener('change', window.notice.noticeRoomsCheckValidityHandler);
    window.notice.noticeRoomsDisableInvalidOptionsHandler();

    var noticeGuests = notice.querySelector('select[name="capacity"]');
    var guests = window.notice.GUESTS_FOR_ROOMS[noticeRooms[noticeRooms.selectedIndex].value];
    for (var i = 0; i < noticeGuests.options.length; ++i) {
      if (noticeGuests.options[i].value === guests[0].toString()) {
        noticeGuests.options.selectedIndex = i;
      }
    }
    noticeGuests.addEventListener('change', window.map.noticeGuestsCheckErrorMessageHandler);

    filterType.addEventListener('change', filterTypeChangeHandler);

    filterPrice.addEventListener('change', filterPriceChangeHandler);

    filterRooms.addEventListener('change', filterRoomsChangeHandler);

    filterGuests.addEventListener('change', filterGuestsChangeHandler);

    filterFeaturesWifi.addEventListener('change', filterFeaturesWifiChangeHandler);

    filterFeaturesDishwasher.addEventListener('change', filterFeaturesDishwasherChangeHandler);

    filterFeaturesParking.addEventListener('change', filterFeaturesParkingChangeHandler);

    filterFeaturesWasher.addEventListener('change', filterFeaturesWasherChangeHandler);

    filterFeaturesElevator.addEventListener('change', filterFeaturesElevatorChangeHandler);

    filterFeaturesConditioner.addEventListener('change', filterFeaturesConditionerChangeHandler);

    notice.querySelector('.form__reset').addEventListener('click', window.notice.formResetClickHandler);

    notice.addEventListener('submit', window.notice.formSubmitHandler, false);
  };

  var removeAllPins = function () {
    var pins = document.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; ++i) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pins[i].remove();
      }
    }
  };

  var renderPinsWithFilters = function () {
    removeAllPins();
    var ad = document.querySelector('.map__card.popup');
    if (ad !== null) {
      ad.remove();
    }

    var filteredProperties = [];
    var newProperties = [];
    var j = 0;

    for (var i = 0; i < 10; ++i) {
      filteredProperties[i] = Object.assign({}, properties[i]);
    }

    for (i = 0; i < 10; ++i) {
      var propertyTypeValue = filteredProperties[i].offer.type;
      var propertyRoomsValue = filteredProperties[i].offer.rooms;
      var propertyGuestsValue = filteredProperties[i].offer.guests;
      var porpertyFeaturesValues = filteredProperties[i].offer.features;

      var propertyPriceValue = getPropertyTypeForPrice(filteredProperties[i].offer.price);

      var filterTypeValue = filterType[filterType.selectedIndex].value;

      if (propertyTypeValue === filterTypeValue || filterTypeValue === NO_FILTER) {
        var filterRoomsValue = filterRooms[filterRooms.selectedIndex].value;

        if (propertyRoomsValue.toString() === filterRoomsValue || filterRoomsValue === NO_FILTER) {
          var filterGuestsValue = filterGuests[filterGuests.selectedIndex].value;

          if (propertyGuestsValue.toString() === filterGuestsValue || filterGuestsValue === NO_FILTER) {
            var filterPriceValue = filterPrice[filterPrice.selectedIndex].value;

            if (propertyPriceValue === filterPriceValue || filterPriceValue === NO_FILTER) {
              var featuresFilterArray = createFeaturesFilterArray();

              if (isFeaturesValidForFilter(porpertyFeaturesValues, featuresFilterArray)) {
                newProperties[j] = Object.assign({}, filteredProperties[i]);
                ++j;
              }
            }
          }
        }
      }
    }
    window.pin.renderPins(newProperties.length, newProperties);
  };


  var filterTypeChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterPriceChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterRoomsChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterGuestsChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterFeaturesWifiChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterFeaturesDishwasherChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterFeaturesParkingChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterFeaturesWasherChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterFeaturesElevatorChangeHandler = function () {
    renderPinsWithFilters();
  };

  var filterFeaturesConditionerChangeHandler = function () {
    renderPinsWithFilters();
  };

  var noticeGuestsCheckErrorMessageHandler = function () {
    window.notice.noticeGuestsCheckErrorMessage();
  };
  var mapPinMainMouseupHandler = function (evt) {
    window.states.triggerActiveState();
    document.querySelector('.map__pin--main').removeEventListener('mouseup', window.map.mapPinMainMouseupHandler);
    var pin = {
      x: evt.pageX - map.offsetLeft,
      y: evt.pageY - map.offsetTop + MAIN_PIN_HEIGHT / 2
    };
    document.querySelector('input[name="address"]').value = pin.x + ', ' + pin.y;
    window.backend.load(function (loadedProperties) {
      properties = loadedProperties;
      window.pin.renderPins(PROPERTIES_NUMBER, loadedProperties);
    }, function (errorMessage) {
      window.notice.showDownloadErrorMessage('Ошибка при загрузке данных с сервера (' + errorMessage + ')', map);
    });
  };

  var mapPinMainMouseDownHandler = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    setDeltaBetweenClickAndMainPinCenter(startCoords.x, startCoords.y);

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var restrictions = getMainPinCoordinatesRestrictions();
      if (moveEvt.clientX - delta.x > restrictions.x.min &&
          moveEvt.clientX - delta.x < restrictions.x.max &&
          moveEvt.clientY - delta.y > restrictions.y.min - window.pageYOffset &&
          moveEvt.clientY - delta.y < restrictions.y.max) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        var newCoords = {
          x: mainPin.offsetLeft - shift.x,
          y: mainPin.offsetTop - shift.y
        };
        var adressValueY = newCoords.y + MAIN_PIN_HEIGHT / 2;
        document.querySelector('input[name="address"]').value = newCoords.x + ', ' + adressValueY;
        mainPin.style.top = newCoords.y + 'px';
        mainPin.style.left = newCoords.x + 'px';
      }
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      var restrictions = getMainPinCoordinatesRestrictions();
      if (upEvt.clientX > restrictions.x.min &&
          upEvt.clientX < restrictions.x.max &&
          upEvt.clientY > restrictions.y.min &&
          upEvt.clientY < restrictions.y.max) {
        upEvt.preventDefault();

        var shift = {
          x: startCoords.x - upEvt.clientX,
          y: startCoords.y - upEvt.clientY
        };
        startCoords = {
          x: upEvt.clientX,
          y: upEvt.clientY
        };
        var newCoords = {
          x: mainPin.offsetLeft - shift.x,
          y: mainPin.offsetTop - shift.y
        };
        var adressValueY = newCoords.y + MAIN_PIN_HEIGHT / 2;
        document.querySelector('input[name="address"]').value = newCoords.x + ', ' + adressValueY;
        mainPin.style.top = newCoords.y + 'px';
        mainPin.style.left = newCoords.x + 'px';
      }
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  window.map = {
    setActiveForm: setActiveForm,
    noticeGuestsCheckErrorMessageHandler: noticeGuestsCheckErrorMessageHandler,
    mapPinMainMouseupHandler: mapPinMainMouseupHandler,
    mapPinMainMouseDownHandler: mapPinMainMouseDownHandler,
  };
})();

