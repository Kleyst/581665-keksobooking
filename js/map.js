'use strict';

(function () {
  var LEASED_PROPERTIES_NUMBER = 8;

  var MAIN_PIN_HEIGHT = 70;

  var NOTICE_TITLE_PATTERN = '.{30,100}';

  var NOTICE_PRICE_MAX = 1000000;

  var pinX;
  var pinY;
  var mainPin;
  window.map = {
    setActiveForm: function () {
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
      noticePrice.min = window.notice.NOTICE_PRICE_MIN_FOR_TYPE[noticeType.querySelector('option:checked').value];
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
      noticeGuests.addEventListener('change', window.notice.noticeGuestsCheckErrorMessage);

      notice.querySelector('.form__reset').addEventListener('click', window.map.formResetClickHandler);

      notice.addEventListener('submit', window.notice.formSubmitHandler, false);
    },

    mapPinMainMouseupHandler: function (evt) {
      document.querySelector('.map__pin--main').removeEventListener('mouseup', window.map.mapPinMainMouseupHandler);
      window.states.triggerActiveState();
      var map = document.querySelector('.map');
      pinX = evt.pageX - map.offsetLeft;
      pinY = evt.pageY - map.offsetTop + MAIN_PIN_HEIGHT / 2;
      document.querySelector('input[name="address"]').value = pinX + ', ' + pinY;

      var leasedProperties = window.data.generateLeasedProperties(LEASED_PROPERTIES_NUMBER);

      window.pin.renderPins(LEASED_PROPERTIES_NUMBER, leasedProperties);
    },
    setStartState: function () {
      window.states.triggerActiveState();
      window.states.triggerInactiveState();
      mainPin = document.querySelector('.map__pin--main');
      var map = document.querySelector('.map');
      pinX = map.clientWidth / 2;
      pinY = (map.clientHeight + map.scrollTop) / 2;
      document.querySelector('input[name="address"]').value = pinX + ', ' + pinY;
      mainPin.addEventListener('mouseup', window.map.mapPinMainMouseupHandler);
    },
    formResetClickHandler: function () {
      window.states.triggerInactiveState();
      var pins = document.querySelectorAll('.map__pin');
      for (var i = 0; i < pins.length; ++i) {
        if (pins[i].classList[1] !== 'map__pin--main') {
          pins[i].remove();
        } else {
          pins[i].addEventListener('mouseup', window.map.mapPinMainMouseupHandler);
        }
      }
      var notice = document.querySelector('.notice');
      var noticePrice = notice.querySelector('input[name="price"]');
      var noticeTitle = notice.querySelector('input[name="title"]');
      var noticeGuests = notice.querySelector('select[name="capacity"]');
      window.notice.removeErrorMessage(noticePrice, noticePrice.id + window.notice.NOTICE_ERROR_CLASS);
      window.notice.removeErrorMessage(noticeTitle, noticeTitle.id + window.notice.NOTICE_ERROR_CLASS);
      window.notice.removeErrorMessage(noticeGuests, noticeGuests.id + window.notice.NOTICE_ERROR_CLASS);
      var map = document.querySelector('.map');
      pinX = map.clientWidth / 2;
      pinY = (map.clientHeight + map.scrollTop) / 2;
      document.querySelector('input[name="address"]').value = pinX + ', ' + pinY;
    }
  };
})();

