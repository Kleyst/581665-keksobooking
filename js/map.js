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

var MAIN_PIN_HEIGHT = 70;

var ESC_KEYCODE = 27;

var NOTICE_TITLE_MIN_LENGTH = 30;
var NOTICE_TITLE_MAX_LENGTH = 100;
var NOTICE_TITLE_PATTERN = '.{30,100}';


var NOTICE_PRICE_MAX = 1000000;

var APPARTMENTS_TYPES = {
  bungalo: 'Лачуга',
  flat: 'Квартира',
  house: 'Дом',
  palace: 'Дворец'
};

var NOTICE_PRICE_MIN_FOR_TYPE = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var NOTICE_TITLE_ERROR_MESSAGE = 'Заголовок должн быть не меньше ' + NOTICE_TITLE_MIN_LENGTH
+ ' символов и не больше ' + NOTICE_TITLE_MAX_LENGTH + ' символов';
var NOTICE_PRICE_ERROR_MESSAGE = 'Цена за ночь не указана или ниже минимуна для выбранного типа жилья';
var NOTICE_GUESTS_ERROR_MESSAGE = 'Число гостей не соответствует числу комнат';
var NOTICE_SPAM_ERROR_CLASS = 'error__spam';
var NOTICE_SPAM_ERROR_COLOR = 'red';
var NOTICE_ELEMENT_ERROR_BORDERCOLOR = 'red';

var GUESTS_FOR_ROOMS = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

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

var getLastPartOfString = function (string, separator) {
  var position = string.search(separator) + separator.length;
  return string.substring(position, string.length);
};

var removeAllChildren = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var renderFeatures = function (liTemplate, ad, property) {
  var ul = ad.querySelector('.popup__features');

  removeAllChildren(ul);

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

var buttonCloseClickHandler = function () {
  document.querySelector('.map__card.popup').remove();
};

var adKeydownEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    document.querySelector('.map__card.popup').remove();
  }
  document.removeEventListener('keydown', adKeydownEscHandler);
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
  ad.querySelector('h4').textContent = APPARTMENTS_TYPES[property.offer.type];

  ad.querySelector('p:nth-of-type(3)').textContent = 'Комнат: ' + property.offer.rooms + ' для ' + property.offer.guests + ' гостей';
  ad.querySelector('p:nth-of-type(4)').textContent = 'Заезд: ' + property.offer.checkin + ', выезд: ' + property.offer.checkout;

  var liTemplateFeatures = adTemplate.querySelector('.popup__features').querySelectorAll('li');
  renderFeatures(liTemplateFeatures, ad, property);
  ad.querySelector('p:nth-of-type(5)').textContent = property.offer.description;

  renderPhotos(ad, property);

  var buttonClose = ad.querySelector('.popup__close');
  buttonClose.addEventListener('click', buttonCloseClickHandler);
  document.addEventListener('keydown', adKeydownEscHandler);

  var beforeDiv = document.querySelector('.map__filters-container');
  var parentDiv = document.querySelector('.map');
  parentDiv.insertBefore(ad, beforeDiv);
};

var noticeTimeinChangeHandler = function (evt) {
  document.querySelector('select[name ="timeout"]').value = evt.target.value;
};

var noticeTimeoutChangeHandler = function (evt) {
  document.querySelector('select[name ="timein"]').value = evt.target.value;
};

var noticeRoomsChangeHandler = function () {
  var notice = document.querySelector('.notice');
  var noticeRooms = notice.querySelector('select[name="rooms"]');

  var capacitySelect = document.querySelector('select[name ="capacity"]');
  for (var i = 0; i < capacitySelect.length; ++i) {
    capacitySelect.options[i].disabled = true;
  }

  var capacity = GUESTS_FOR_ROOMS[noticeRooms.value];
  for (var j = 0; j < capacity.length; ++j) {
    for (i = 0; i < capacitySelect.length; ++i) {
      var capacitySelectValue = capacitySelect[i].value;
      var capacityValue = capacity[j];
      if (capacitySelectValue === capacityValue.toString()) {
        capacitySelect.options[i].disabled = false;
      }
    }
  }
};

var formResetClickHandler = function () {
  triggerInactiveState();
  var pins = document.querySelectorAll('.map__pin');
  for (var i = 0; i < pins.length; ++i) {
    if (pins[i].classList[1] !== 'map__pin--main') {
      pins[i].remove();
    } else {
      pins[i].addEventListener('mouseup', mapPinMainMouseupHandler);
    }
  }
  var map = document.querySelector('.map');
  var pinX = map.clientWidth / 2;
  var pinY = (map.clientHeight + map.scrollTop) / 2;
  setAddressValue(pinX, pinY);
};

var noticeTypeChangeHandler = function (evt) {
  var notice = document.querySelector('.notice');
  var noticePrice = notice.querySelector('input[name="price"]');
  noticePrice.min = NOTICE_PRICE_MIN_FOR_TYPE[evt.target.value];
};

var showErrorMessage = function (element, message) {
  element.style.borderColor = NOTICE_ELEMENT_ERROR_BORDERCOLOR;
  var spam = document.createElement('spam');
  spam.style.color = NOTICE_SPAM_ERROR_COLOR;
  spam.className = NOTICE_SPAM_ERROR_CLASS;
  spam.textContent = message;
  var next = element.nextSibling;
  var parent = element.parentNode;
  parent.insertBefore(spam, next);
};

var formSubmitHandler = function (evt) {
  var notice = document.querySelector('.notice');

  var spamArray = notice.querySelectorAll('.' + NOTICE_SPAM_ERROR_CLASS);

  for (var i = 0; i < spamArray.length; ++i) {
    spamArray[i].previousSibling.style.borderColor = '';
    spamArray[i].remove();
  }

  var noticeTitle = notice.querySelector('input[name="title"]');
  if (noticeTitle.value === '' || noticeTitle.value.length < NOTICE_TITLE_MIN_LENGTH ||
   noticeTitle.value.length > NOTICE_TITLE_MAX_LENGTH) {
    evt.preventDefault();
    showErrorMessage(noticeTitle, NOTICE_TITLE_ERROR_MESSAGE);
  }

  var noticeGuests = notice.querySelector('select[name="capacity"]');
  if (noticeGuests.options[noticeGuests.selectedIndex].disabled === true) {
    evt.preventDefault();
    showErrorMessage(noticeGuests, NOTICE_GUESTS_ERROR_MESSAGE);
  }

  var noticePrice = notice.querySelector('input[name="price"]');
  if (noticePrice.value < noticePrice.min) {
    evt.preventDefault();
    showErrorMessage(noticePrice, NOTICE_PRICE_ERROR_MESSAGE);
  }
};

var setActiveForm = function () {
  var notice = document.querySelector('.notice');

  var noticeTitle = notice.querySelector('input[name="title"]');
  noticeTitle.required = true;
  noticeTitle.pattern = NOTICE_TITLE_PATTERN;

  var noticeType = notice.querySelector('select[name="type"]');
  noticeType.addEventListener('change', noticeTypeChangeHandler);

  var noticePrice = notice.querySelector('input[name="price"]');
  noticePrice.required = true;
  noticePrice.min = NOTICE_PRICE_MIN_FOR_TYPE[noticeType.querySelector('option:checked').value];
  noticePrice.max = NOTICE_PRICE_MAX;

  var noticeAddress = notice.querySelector('input[name="address"]');
  noticeAddress.readOnly = true;

  var noticeTimein = notice.querySelector('select[name="timein"]');
  noticeTimein.addEventListener('change', noticeTimeinChangeHandler);

  var noticeTimeout = notice.querySelector('select[name="timeout"]');
  noticeTimeout.addEventListener('change', noticeTimeoutChangeHandler);

  var noticeRooms = notice.querySelector('select[name="rooms"]');
  noticeRooms.addEventListener('change', noticeRoomsChangeHandler);
  noticeRoomsChangeHandler();

  var noticeGuests = notice.querySelector('select[name="capacity"]');
  var guests = GUESTS_FOR_ROOMS[noticeRooms[noticeRooms.selectedIndex].value];
  for (var i = 0; i < noticeGuests.options.length; ++i) {
    if (noticeGuests.options[i].value === guests[0].toString()) {
      noticeGuests.options.selectedIndex = i;
    }
  }

  notice.querySelector('.form__reset').addEventListener('click', formResetClickHandler);

  notice.addEventListener('submit', formSubmitHandler, false);
};

var triggerActiveState = function () {
  document.querySelector('.map').classList.remove('map--faded');
  document.querySelector('.notice__form').classList.remove('notice__form--disabled');

  var fieldsets = document.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; ++i) {
    fieldsets[i].disabled = false;
  }
  setActiveForm();
};

var triggerInactiveState = function () {
  document.querySelector('.map').classList.add('map--faded');
  var form = document.querySelector('.notice__form');
  form.classList.add('notice__form--disabled');
  form.noValidate = true;
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
  setAddressValue(evt.pageX - map.offsetLeft, evt.pageY - map.offsetTop + MAIN_PIN_HEIGHT / 2);

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
    pin.addEventListener('click', pinClickHandler.bind(null, data[i]));
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
