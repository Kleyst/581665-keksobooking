'use strict';

(function () {

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

  var getLastPartOfString = function (string, separator) {
    var position = string.search(separator) + separator.length;
    return string.substring(position, string.length);
  };

  var removeAllChildren = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  window.utils = {
    randomInteger: randomInteger,
    shuffleArray: shuffleArray,
    getLastPartOfString: getLastPartOfString,
    removeAllChildren: removeAllChildren
  };
})();
