'use strict';

(function () {

  var NO_FILTER = 'any';

  var CurrentFilters = {
    type: NO_FILTER,
    price: NO_FILTER,
    rooms: NO_FILTER,
    guests: NO_FILTER,
    features: {
      wifi: false,
      dishwasher: false,
      parking: false,
      washer: false,
      elevator: false,
      conditioner: false
    }
  };

  var PriceTypes = [
    'low',
    'middle',
    'high'
  ];

  var PriceBorders = [
    10000,
    50000,
    100000
  ];

  var isFeaturesValid = function (propertyFeatures) {
    for (var feature in CurrentFilters.features) {
      if (Object.prototype.hasOwnProperty.call(CurrentFilters.features, feature)) {
        if (CurrentFilters[feature] === true) {

          var isFeatureExist = false;

          for (var i = 0; i < propertyFeatures.length; ++i) {
            if (propertyFeatures[i] === feature) {
              isFeatureExist = true;
            }
          }
          if (isFeatureExist === false) {
            return false;
          }
        }
      }
    }
    return true;
  };

  var getPriceType = function (price) {
    if (price <= PriceBorders[0]) {
      return PriceTypes[0];
    } else if (price > PriceBorders[0] && price <= PriceBorders[1]) {
      return PriceTypes[1];
    }
    return PriceTypes[2];
  };

  var isGuestsValid = function (propertyGuests) {
    return propertyGuests.toString() === CurrentFilters.guests || CurrentFilters.guests === NO_FILTER;
  };

  var isRoomsValid = function (propertyRooms) {
    return propertyRooms.toString() === CurrentFilters.rooms || CurrentFilters.rooms === NO_FILTER;
  };

  var isPriceValid = function (propertyPrice) {
    return getPriceType(propertyPrice) === CurrentFilters.price || CurrentFilters.price === NO_FILTER;
  };

  var isTypeValid = function (propertyType) {
    return propertyType === CurrentFilters.type || CurrentFilters.type === NO_FILTER;
  };

  var isPropertyValid = function (property) {
    return isTypeValid(property.offer.type) &&
           isPriceValid(property.offer.price) &&
           isRoomsValid(property.offer.rooms) &&
           isGuestsValid(property.offer.guests) &&
           isFeaturesValid(property.offer.features);
  };

  var getFilteredProperties = function (properties) {
    var filteredProperties = [];
    var j = 0;
    for (var i = 0; i < properties.length; ++i) {
      if (isPropertyValid(properties[i])) {
        filteredProperties[j] = properties[i];
        ++j;
      }
    }
    return filteredProperties;
  };

  var setFilter = function (filter, filterValue) {
    CurrentFilters[filter] = filterValue;
  };

  window.filters = {
    getFilteredProperties: getFilteredProperties,
    setFilter: setFilter
  };
})();
