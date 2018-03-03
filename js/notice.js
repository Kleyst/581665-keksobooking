'use strict';

(function () {
  var TITLE = {
    MIN: 30,
    MAX: 100
  };

  var NOTICE_ERROR_ELEMENT_BORDERCOLOR = 'red';
  var NOTICE_ERROR_GUESTS_MESSAGE = 'Число гостей не соответствует числу комнат';
  var NOTICE_ERROR_TITLE_MESSAGE = 'Заголовок должн быть не меньше ' + TITLE.MIN
  + ' символов и не больше ' + TITLE.MAX + ' символов';
  var NOTICE_ERROR_PRICE_MESSAGE = 'Цена за ночь не указана или ниже минимуна для выбранного типа жилья';

  var NOTICE_ERROR_COLOR = 'red';

  window.notice = {
    NOTICE_ERROR_CLASS: '__error',
    MIN_PRICE_FOR_TYPE: {
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 10000
    },
    GUESTS_FOR_ROOMS: {
      1: [1],
      2: [1, 2],
      3: [1, 2, 3],
      100: [0]
    },
    noticeTimeinChangeHandler: function (evt) {
      document.querySelector('select[name ="timeout"]').value = evt.target.value;
    },
    noticeTimeoutChangeHandler: function (evt) {
      document.querySelector('select[name ="timein"]').value = evt.target.value;
    },
    noticeRoomsDisableInvalidOptionsHandler: function () {
      var notice = document.querySelector('.notice');
      var noticeRooms = notice.querySelector('select[name="rooms"]');

      var capacitySelect = document.querySelector('select[name ="capacity"]');
      for (var i = 0; i < capacitySelect.length; ++i) {
        capacitySelect.options[i].disabled = true;
      }

      var capacity = window.notice.GUESTS_FOR_ROOMS[noticeRooms.value];
      for (var j = 0; j < capacity.length; ++j) {
        for (i = 0; i < capacitySelect.length; ++i) {
          var capacitySelectValue = capacitySelect[i].value;
          var capacityValue = capacity[j];
          if (capacitySelectValue === capacityValue.toString()) {
            capacitySelect.options[i].disabled = false;
          }
        }
      }
    },
    noticeRoomsCheckValidityHandler: function () {
      var notice = document.querySelector('.notice');
      var noticeGuests = notice.querySelector('select[name="capacity"]');
      var isMessageExists = document.querySelector('.' + noticeGuests.id + window.notice.NOTICE_ERROR_CLASS) !== null;
      if (noticeGuests.options[noticeGuests.selectedIndex].disabled === true) {
        if (!isMessageExists) {
          window.notice.showErrorMessage(noticeGuests, noticeGuests.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_GUESTS_MESSAGE);
        }
      } else if (isMessageExists) {
        window.notice.removeErrorMessage(noticeGuests, noticeGuests.id + window.notice.NOTICE_ERROR_CLASS);
      }
    },
    noticePriceCheckValidityHandler: function () {
      var notice = document.querySelector('.notice');
      var noticePrice = notice.querySelector('input[name="price"]');
      var isMessageExists = document.querySelector('.' + noticePrice.id + window.notice.NOTICE_ERROR_CLASS) !== null;
      noticePrice.min = window.notice.MIN_PRICE_FOR_TYPE[notice.querySelector('select[name="type"]').value];
      if (parseInt(noticePrice.value, 10) < parseInt(noticePrice.min, 10)) {
        if (!isMessageExists) {
          window.notice.showErrorMessage(noticePrice, noticePrice.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_PRICE_MESSAGE);
        }
      } else if (isMessageExists) {
        window.notice.removeErrorMessage(noticePrice, noticePrice.id + window.notice.NOTICE_ERROR_CLASS);
      }
    },
    noticeTypeChangeHandler: function (evt) {
      var notice = document.querySelector('.notice');
      var noticePrice = notice.querySelector('input[name="price"]');
      noticePrice.min = window.notice.MIN_PRICE_FOR_TYPE[evt.target.value];
    },
    showErrorMessage: function (element, errorClass, message) {
      element.style.borderColor = NOTICE_ERROR_ELEMENT_BORDERCOLOR;
      var div = document.createElement('div');
      div.style.color = 'white';
      div.className = errorClass;
      div.textContent = message;
      div.style.backgroundColor = NOTICE_ERROR_COLOR;
      div.style.position = 'absolute';
      div.style.padding = '5px';
      div.style.borderRadius = '5px';
      div.style.marginTop = '5px';
      var triangle = document.createElement('div');
      triangle.className = errorClass;
      triangle.style.position = 'absolute';
      triangle.style.marginTop = '-5px';
      triangle.style.marginLeft = '0px';
      triangle.style.border = '5px solid transparent';
      triangle.style.borderBottom = '10px solid ' + NOTICE_ERROR_COLOR;
      var next = element.nextSibling;
      var parent = element.parentNode;
      parent.insertBefore(div, next);
      parent.insertBefore(triangle, next);
    },
    formSubmitHandler: function (evt) {
      var notice = document.querySelector('.notice');
      var noticeTitle = notice.querySelector('input[name="title"]');
      var noticePrice = notice.querySelector('input[name="price"]');
      if (noticePrice.value === '') {
        window.notice.showErrorMessage(noticePrice, noticePrice.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_PRICE_MESSAGE);
      }
      if (noticeTitle.value === '') {
        window.notice.showErrorMessage(noticeTitle, noticeTitle.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_TITLE_MESSAGE);
      }
      var noticeGuests = notice.querySelector('select[name="capacity"]');
      var noticeTitleError = notice.querySelector('.' + noticeTitle.id + window.notice.NOTICE_ERROR_CLASS);
      var noticePriceError = notice.querySelector('.' + noticePrice.id + window.notice.NOTICE_ERROR_CLASS);
      var noticeGuestsError = notice.querySelector('.' + noticeGuests.id + window.notice.NOTICE_ERROR_CLASS);
      if (noticeTitleError !== null || noticePriceError !== null || noticeGuestsError !== null) {
        evt.preventDefault();
      } else {
        evt.preventDefault();

        var form = document.querySelector('.map__filters');
        window.backend.upload(new FormData(form), function () {
          var mainPin = document.querySelector('.map__pin--main');
          window.notice.showErrorMessage(mainPin, mainPin + window.notice.NOTICE_ERROR_CLASS, 'данные успешно загружены');
        }, function (errorMessage) {
          var mainPin = document.querySelector('.map__pin--main');
          window.notice.showErrorMessage(mainPin, mainPin + window.notice.NOTICE_ERROR_CLASS, errorMessage);
        });
        window.states.triggerInactiveState();
        var pins = document.querySelectorAll('.map__pin');
        for (var i = 0; i < pins.length; ++i) {
          if (pins[i].classList[1] !== 'map__pin--main') {
            pins[i].remove();
          } else {
            pins[i].addEventListener('mouseup', window.map.mapPinMainMouseupHandler);
          }
        }
      }
    },
    removeErrorMessage: function (element, errorClass) {
      element.style.borderColor = '';
      var errorMessageArray = document.querySelectorAll('.' + errorClass);
      for (var i = 0; i < errorMessageArray.length; ++i) {
        errorMessageArray[i].remove();
      }
    },
    noticeTitleCheckValidityHandler: function () {
      var notice = document.querySelector('.notice');
      var noticeTitle = notice.querySelector('input[name="title"]');
      var isValidLength = noticeTitle.value.length >= TITLE.MIN &&
      noticeTitle.value.length <= TITLE.MAX;
      var isTitleExists = noticeTitle.value !== '';
      var isMessageExists = document.querySelector('.' + noticeTitle.id + window.notice.NOTICE_ERROR_CLASS) !== null;
      if (!isTitleExists || !isValidLength) {
        if (!isMessageExists) {
          window.notice.showErrorMessage(noticeTitle, noticeTitle.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_TITLE_MESSAGE);
        }
      } else if (isMessageExists) {
        window.notice.removeErrorMessage(noticeTitle, noticeTitle.id + window.notice.NOTICE_ERROR_CLASS);
      }
    },
    noticeGuestsCheckErrorMessage: function () {
      var notice = document.querySelector('.notice');
      var noticeGuests = notice.querySelector('select[name="capacity"]');
      var isMessageExists = document.querySelector('.' + noticeGuests.id + window.notice.NOTICE_ERROR_CLASS) !== null;
      if (isMessageExists) {
        window.notice.removeErrorMessage(noticeGuests, noticeGuests.id + window.notice.NOTICE_ERROR_CLASS);
      }
    }
  };
})();

