'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;

  var StatusMessage = {
    404: 'Страница не найдена',
    500: 'Внутренняя ошибка сервера',
    default: 'Неизвестный статус'
  };

  var setup = function (loadHandler, errorHandler) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          loadHandler(xhr.response);
          break;
        case 404:
          errorHandler(StatusMessage['404']);
          break;
        case 500:
          errorHandler(StatusMessage['500']);
          break;
        default:
          errorHandler(StatusMessage['default'] + ': ' + xhr.status + ' ' + xhr.statusText);
      }
    });


    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };

  window.backend = {
    upload: function (data, loadHandler, errorHandler) {
      var xhr = setup(loadHandler, errorHandler);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    load: function (loadHandler, errorHandler) {
      var xhr = setup(loadHandler, errorHandler);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    }
  };
})();
