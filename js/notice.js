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
  var DOWNLOAD_MESSAGE_CLASSNAME = 'downloadMessage';
  var NOTICE_ERROR_COLOR = 'red';

  var DOWNLOAD_MESSAGE_COLOR = 'white';
  var DOWNLOAD_MESSAGE_BACKGROUND_COLOR = 'red';

  var notice = document.querySelector('.notice');
  var noticeTitle = notice.querySelector('input[name="title"]');
  var noticePrice = notice.querySelector('input[name="price"]');
  var noticeGuests = notice.querySelector('select[name="capacity"]');
  var noticeRooms = notice.querySelector('select[name="rooms"]');
  var FormInnerData = {
    TITLE: '',
    PRICE: '',
    DESCRIPTION: '',
    TYPE: 'flat',
    TIMEIN: '12:00',
    TIMEOUT: '12:00',
    ROOMS: 0,
    CAPACITY: 2,
    FEATURES_CHECKED_ARRAY: ['false', 'fasle', 'false', 'false', 'fasle', 'false']
  };


  var noticeTimeinChangeHandler = function (evtTimein) {
    document.querySelector('select[name ="timeout"]').value = evtTimein.target.value;
  };

  var noticeTimeoutChangeHandler = function (evtTimeout) {
    document.querySelector('select[name ="timein"]').value = evtTimeout.target.value;
  };

  var noticeRoomsDisableInvalidOptionsHandler = function () {
    for (var i = 0; i < noticeGuests.length; ++i) {
      noticeGuests.options[i].disabled = true;
    }

    var capacity = window.notice.GUESTS_FOR_ROOMS[noticeRooms.value];
    for (var j = 0; j < capacity.length; ++j) {
      for (i = 0; i < noticeGuests.length; ++i) {
        var noticeGuestsValue = noticeGuests[i].value;
        var capacityValue = capacity[j];
        if (noticeGuestsValue === capacityValue.toString()) {
          noticeGuests.options[i].disabled = false;
        }
      }
    }
  };

  var noticeRoomsCheckValidityHandler = function () {
    var isMessageExists = document.querySelector('.' + noticeGuests.id + window.notice.NOTICE_ERROR_CLASS) !== null;
    if (noticeGuests.options[noticeGuests.selectedIndex].disabled === true) {
      if (!isMessageExists) {
        window.notice.showErrorMessage(noticeGuests, noticeGuests.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_GUESTS_MESSAGE);
      }
    } else if (isMessageExists) {
      window.notice.removeErrorMessage(noticeGuests, noticeGuests.id + window.notice.NOTICE_ERROR_CLASS);
    }
  };

  var noticePriceCheckValidityHandler = function () {
    var isMessageExists = document.querySelector('.' + noticePrice.id + window.notice.NOTICE_ERROR_CLASS) !== null;
    noticePrice.min = window.notice.MIN_PRICE_FOR_TYPE[notice.querySelector('select[name="type"]').value];
    if (parseInt(noticePrice.value, 10) < parseInt(noticePrice.min, 10)) {
      if (!isMessageExists) {
        window.notice.showErrorMessage(noticePrice, noticePrice.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_PRICE_MESSAGE);
      }
    } else if (isMessageExists) {
      window.notice.removeErrorMessage(noticePrice, noticePrice.id + window.notice.NOTICE_ERROR_CLASS);
    }
  };

  var noticeTypeChangeHandler = function (evtType) {
    noticePrice.min = window.notice.MIN_PRICE_FOR_TYPE[evtType.target.value];
  };
  var showDownloadErrorMessage = function (message, element) {
    var div = document.createElement('div');
    div.style.color = DOWNLOAD_MESSAGE_COLOR;
    div.className = DOWNLOAD_MESSAGE_CLASSNAME;
    div.textContent = message;
    div.style.backgroundColor = DOWNLOAD_MESSAGE_BACKGROUND_COLOR;
    div.style.position = 'absolute';
    div.style.padding = '5px';
    div.style.borderRadius = '5px';
    div.style.marginTop = '5px';
    var elementRectangle = element.getBoundingClientRect();
    div.style.left = elementRectangle.left + 'px';
    var next = element.nextSibling;
    var parent = element.parentNode;
    parent.insertBefore(div, next);
  };
  var showErrorMessage = function (element, messageClass, message) {
    element.style.borderColor = NOTICE_ERROR_ELEMENT_BORDERCOLOR;
    var div = document.createElement('div');
    div.style.color = 'white';
    div.className = messageClass;
    div.textContent = message;
    div.style.backgroundColor = NOTICE_ERROR_COLOR;
    div.style.position = 'absolute';
    div.style.padding = '5px';
    div.style.borderRadius = '5px';
    div.style.marginTop = '5px';
    var triangle = document.createElement('div');
    triangle.className = messageClass;
    triangle.style.position = 'absolute';
    triangle.style.marginTop = '-5px';
    triangle.style.marginLeft = '0px';
    triangle.style.border = '5px solid transparent';
    triangle.style.borderBottom = '10px solid ' + NOTICE_ERROR_COLOR;
    var next = element.nextSibling;
    var parent = element.parentNode;
    parent.insertBefore(div, next);
    parent.insertBefore(triangle, next);
  };

  var formSubmitHandler = function (evtSubmit) {
    evtSubmit.preventDefault();
    if (noticePrice.value === '') {
      window.notice.showErrorMessage(noticePrice, noticePrice.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_PRICE_MESSAGE);
    }
    if (noticeTitle.value === '') {
      window.notice.showErrorMessage(noticeTitle, noticeTitle.id + window.notice.NOTICE_ERROR_CLASS, NOTICE_ERROR_TITLE_MESSAGE);
    }
    var noticeTitleError = notice.querySelector('.' + noticeTitle.id + window.notice.NOTICE_ERROR_CLASS);
    var noticePriceError = notice.querySelector('.' + noticePrice.id + window.notice.NOTICE_ERROR_CLASS);
    var noticeGuestsError = notice.querySelector('.' + noticeGuests.id + window.notice.NOTICE_ERROR_CLASS);
    var form = document.querySelector('.notice__form');

    if (noticeTitleError === null && noticePriceError === null && noticeGuestsError === null) {
      window.backend.upload(new FormData(form), function () {
        noticeTitle.value = FormInnerData.TITLE;
        noticePrice.value = FormInnerData.PRICE;
        noticeGuests.selectedIndex = FormInnerData.CAPACITY;
        noticeRooms.selectedIndex = FormInnerData.ROOMS;
        notice.querySelector('textarea[name="description"]').value = FormInnerData.DESCRIPTION;
        notice.querySelector('select[name="type"]').selectedIndex = FormInnerData.TYPE;
        notice.querySelector('select[name="timein"]').selectedIndex = FormInnerData.TIMEIN;
        notice.querySelector('select[name="timeout"]').selectedIndex = FormInnerData.TIMEOUT;
        var features = notice.querySelectorAll('input[type=checkbox]');
        for (var i = 0; i < features.length; ++i) {
          features[i].checked = !FormInnerData.FEATURES_CHECKED_ARRAY[i];
        }
      }, function (errorMessage) {
        if (form.querySelector('.' + DOWNLOAD_MESSAGE_CLASSNAME) === null) {
          var buttonSubmit = document.querySelector('button[class="form__submit"]');
          showDownloadErrorMessage('Ошибка при отправке объявления (' + errorMessage + ')', buttonSubmit);
        }
      });
    }
  };

  var removeErrorMessage = function (element, messageClass) {
    element.style.borderColor = '';
    var errorMessageArray = document.querySelectorAll('.' + messageClass);
    for (var i = 0; i < errorMessageArray.length; ++i) {
      errorMessageArray[i].remove();
    }
  };

  var noticeTitleCheckValidityHandler = function () {
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
  };

  var noticeGuestsCheckErrorMessage = function () {
    var isMessageExists = document.querySelector('.' + noticeGuests.id + window.notice.NOTICE_ERROR_CLASS) !== null;
    if (isMessageExists) {
      window.notice.removeErrorMessage(noticeGuests, noticeGuests.id + window.notice.NOTICE_ERROR_CLASS);
    }
  };

  var formResetClickHandler = function () {
    window.states.triggerInactiveState();
    var pins = document.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; ++i) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pins[i].remove();
      } else {
        pins[i].addEventListener('mouseup', window.map.mapPinMainMouseupHandler);
      }
    }
    removeErrorMessage(noticePrice, noticePrice.id + window.notice.NOTICE_ERROR_CLASS);
    removeErrorMessage(noticeTitle, noticeTitle.id + window.notice.NOTICE_ERROR_CLASS);
    removeErrorMessage(noticeGuests, noticeGuests.id + window.notice.NOTICE_ERROR_CLASS);
    var map = document.querySelector('.map');
    var mainPin = map.querySelector('.map__pin--main');
    var pin = {
      x: map.clientWidth / 2,
      y: (map.clientHeight + map.scrollTop) / 2
    };
    mainPin.style.top = pin.y + 'px';
    mainPin.style.left = pin.x + 'px';
    document.querySelector('input[name="address"]').value = pin.x + ', ' + pin.y;

    var downloadErrorMessages = document.querySelectorAll('.' + DOWNLOAD_MESSAGE_CLASSNAME);
    downloadErrorMessages.forEach(function (message) {
      message.remove();
    });

    var ad = document.querySelector('.map__card.popup');
    if (ad !== null) {
      ad.remove();
    }
  };

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
    noticeTimeinChangeHandler: noticeTimeinChangeHandler,
    noticeTimeoutChangeHandler: noticeTimeoutChangeHandler,
    noticeRoomsDisableInvalidOptionsHandler: noticeRoomsDisableInvalidOptionsHandler,
    noticeRoomsCheckValidityHandler: noticeRoomsCheckValidityHandler,
    noticePriceCheckValidityHandler: noticePriceCheckValidityHandler,
    noticeTypeChangeHandler: noticeTypeChangeHandler,
    showErrorMessage: showErrorMessage,
    formSubmitHandler: formSubmitHandler,
    removeErrorMessage: removeErrorMessage,
    noticeTitleCheckValidityHandler: noticeTitleCheckValidityHandler,
    noticeGuestsCheckErrorMessage: noticeGuestsCheckErrorMessage,
    formResetClickHandler: formResetClickHandler,
    showDownloadErrorMessage: showDownloadErrorMessage
  };
})();

