'use strict';

(function () {
  var PROPERTIES_NUMBER = 5;

  var MAIN_PIN_HEIGHT = 70;

  var MapBorder = {
    top: 150,
    right: 50,
    left: 50,
    bottom: 100
  };

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var delta = {
    x: null,
    y: null
  };

  var properties = [];

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
        min: mapRectangle.x + MapBorder.left,
        max: window.innerWidth - mapRectangle.x - MapBorder.right
      },
      y: {
        min: MapBorder.top,
        max: mapHeight - MapBorder.bottom
      }
    };
  };


  var renderFilteredPins = function () {
    window.pin.removePins();
    var filteredProperties = window.filters.getFilteredProperties(properties);
    var propertiesLength = filteredProperties.length > PROPERTIES_NUMBER ? PROPERTIES_NUMBER : filteredProperties.length;
    window.pin.renderPins(propertiesLength, filteredProperties);
  };

  var filterChangeHandler = function (evt) {
    if (evt.target.type === 'checkbox') {
      var filterName = evt.target.value;
      var filterValue = evt.target.checked;
    } else {
      filterName = window.utils.getLastPartOfString(evt.target.name, '-');
      filterValue = evt.target[evt.target.selectedIndex].value;
    }
    window.filters.setFilter(filterName, filterValue);
    window.debounce(renderFilteredPins);
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
      if (upEvt.clientX - delta.x > restrictions.x.min &&
        upEvt.clientX - delta.x < restrictions.x.max &&
        upEvt.clientY - delta.y > restrictions.y.min - window.pageYOffset &&
        upEvt.clientY - delta.y < restrictions.y.max) {
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
    mapPinMainMouseupHandler: mapPinMainMouseupHandler,
    mapPinMainMouseDownHandler: mapPinMainMouseDownHandler,
    filterChangeHandler: filterChangeHandler
  };
})();

