// Generated by CoffeeScript 1.3.3
var HOTEL_SERVICE_VERBOSE, HotelResult, HotelsResultSet, Room, RoomSet, STARS_VERBOSE,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

STARS_VERBOSE = ['one', 'two', 'three', 'four', 'five'];

HOTEL_SERVICE_VERBOSE = {
  'Сервис': 'service',
  'Спорт и отдых': 'sport',
  'Туристам': 'turist',
  'Интернет': 'internet',
  'Развлечения и досуг': 'dosug',
  'Парковка': 'parkovka',
  'Дополнительно': 'dop',
  'В отеле': 'in-hotel'
};

Room = (function() {

  function Room(data) {
    this.key = __bind(this.key, this);
    this.name = data.showName;
    this.nameNemo = data.roomNemoName;
    if (!this.nameNemo || data.roomName) {
      this.nameNemo = data.roomName;
    }
    if (this.nameNemo !== '' && typeof this.nameNemo !== 'undefined') {
      this.haveNemoName = true;
    } else {
      this.haveNemoName = false;
      this.nameNemo = '';
    }
    this.meal = data.meal;
    if (data.mealName) {
      this.meal = data.mealName;
    }
    this.last = ko.observable(false);
    if (typeof this.meal === "undefined" || this.meal === '') {
      this.meal = 'Не известно';
    }
    this.mealIcon = "ico-breakfast";
    switch (this.meal) {
      case "Завтрак + обед":
        this.meal = "Завтрак и обед";
        this.mealIcon = "ico-breakfast-lunch";
        break;
      case "Завтрак + ужин":
        this.meal = "Завтрак и ужин";
        this.mealIcon = "ico-breakfast-dinner";
        break;
      case "Завтрак + обед + ужин":
        this.meal = "Завтрак и обед и ужин";
        this.mealIcon = "ico-breakfast-lunch-dinner";
    }
    this.hasMeal = this.meal !== 'Без питания' && this.meal !== 'Не известно';
  }

  Room.prototype.key = function() {
    return this.nameNemo + this.name + this.meal;
  };

  return Room;

})();

RoomSet = (function() {

  function RoomSet(data, parent, duration) {
    var room, _i, _len, _ref,
      _this = this;
    this.parent = parent;
    if (duration == null) {
      duration = 1;
    }
    this.hideCancelationRules = __bind(this.hideCancelationRules, this);

    this.showCancelationRules = __bind(this.showCancelationRules, this);

    this.addCancelationRules = __bind(this.addCancelationRules, this);

    this.key = __bind(this.key, this);

    this.minusCount = __bind(this.minusCount, this);

    this.plusCount = __bind(this.plusCount, this);

    this.checkCount = __bind(this.checkCount, this);

    this.price = Math.ceil(data.rubPrice);
    this.savings = 0;
    this.pricePerNight = Math.ceil(this.price / duration);
    this.visible = ko.observable(true);
    this.cancelRules = ko.observable(false);
    this.cancelText = ko.computed(function() {
      var cancelObject, nowDate, result, _i, _len, _ref;
      if (_this.cancelRules()) {
        result = [];
        _ref = _this.cancelRules();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cancelObject = _ref[_i];
          if (cancelObject.charge) {
            nowDate = dateUtils.formatDayMonth(moment()._d);
            if (nowDate === dateUtils.formatDayMonth(cancelObject.cancelDate._d)) {
              result.push('Штраф взымается в размере ' + Math.ceil(cancelObject.price) + ' руб');
            } else {
              result.push('Штраф взымается в размере ' + Math.ceil(cancelObject.price) + ' руб с ' + dateUtils.formatDayMonth(cancelObject.cancelDate._d));
            }
          } else {
            result.push('Штраф за отмену не взымается ');
          }
        }
        return result.join('<br>');
      } else {
        return 'Условия бронирования пока не известны';
      }
    });
    this.rooms = [];
    _ref = data.rooms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      room = _ref[_i];
      this.rooms.push(new Room(room));
    }
    this.rooms[this.rooms.length - 1].last(true);
    this.selectedCount = ko.observable(0);
    this.selectedCount.subscribe(function(newValue) {
      return _this.checkCount(newValue);
    });
    this.selectText = ko.computed(function() {
      if (!_this.parent.tours()) {
        return "Забронировать";
      }
      if (_this.parent.activeResultId()) {
        return 'Выбран';
      } else {
        return 'Выбрать';
      }
    });
  }

  RoomSet.prototype.checkCount = function(newValue) {
    var count;
    count = parseInt(newValue);
    if (count < 0 || isNaN(count)) {
      return this.selectedCount(0);
    } else {
      return this.selectedCount(count);
    }
  };

  RoomSet.prototype.plusCount = function() {
    return this.selectedCount(this.selectedCount() + 1);
  };

  RoomSet.prototype.minusCount = function() {
    if (this.selectedCount() > 0) {
      return this.selectedCount(this.selectedCount() - 1);
    }
  };

  RoomSet.prototype.key = function() {
    var result, room, _i, _len, _ref;
    result = this.price;
    _ref = this.rooms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      room = _ref[_i];
      result += room.key();
    }
    return result;
  };

  RoomSet.prototype.addCancelationRules = function(roomSetData) {
    var cancelObject, _i, _len, _ref;
    roomSetData.cancelCharges.sort(function(left, right) {
      if (left.fromTimestamp < right.fromTimestamp) {
        return 1;
      } else if (left.fromTimestamp > right.fromTimestamp) {
        return -1;
      }
      return 0;
    });
    console.log('adding cancel rules', roomSetData.cancelCharges);
    _ref = roomSetData.cancelCharges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cancelObject = _ref[_i];
      cancelObject.cancelDate = moment.unix(cancelObject.fromTimestamp);
      console.log('date convert', cancelObject, cancelObject.fromTimestamp, cancelObject.cancelDate);
    }
    return this.cancelRules(roomSetData.cancelCharges);
  };

  RoomSet.prototype.showCancelationRules = function(el, e) {
    var miniPopUp, widthThisElement;
    miniPopUp = '<div class="miniPopUp"></div>';
    console.log(e);
    widthThisElement = $(e.currentTarget).width();
    $('body').append(miniPopUp);
    return $('.miniPopUp').html($(e.currentTarget).attr('rel')).css('left', (e.pageX - (widthThisElement / 2)) + 'px').css('top', (e.pageY + 10) + 'px');
  };

  RoomSet.prototype.hideCancelationRules = function(el, ev) {
    return $('.miniPopUp').remove();
  };

  return RoomSet;

})();

HotelResult = (function() {

  function HotelResult(data, parent, duration) {
    var elements, groupName, _ref, _ref1, _ref2, _ref3, _ref4,
      _this = this;
    if (duration == null) {
      duration = 1;
    }
    this.smallMapUrl = __bind(this.smallMapUrl, this);

    this.select = __bind(this.select, this);

    this.back = __bind(this.back, this);

    this.combinationClick = __bind(this.combinationClick, this);

    this.getFullInfo = __bind(this.getFullInfo, this);

    this.initFullInfo = __bind(this.initFullInfo, this);

    this.showMap = __bind(this.showMap, this);

    this.showMapInfo = __bind(this.showMapInfo, this);

    this.showMapDetails = __bind(this.showMapDetails, this);

    this.showDetails = __bind(this.showDetails, this);

    this.showPhoto = __bind(this.showPhoto, this);

    _.extend(this, Backbone.Events);
    this.tours = parent.tours;
    this.hotelId = data.hotelId;
    this.activeResultId = ko.observable(0);
    this.hotelName = data.hotelName;
    this.address = data.address;
    this.description = data.description;
    this.photos = data.images;
    this.numPhotos = 0;
    this.parent = parent;
    this.checkInTime = data.earliestCheckInTime;
    if (this.checkInTime) {
      this.checkInTime = this.checkInTime.substr(0, this.checkInTime.length - 3);
    }
    this.frontPhoto = {
      smallUrl: 'http://upload.wikimedia.org/wikipedia/en/thumb/7/78/Trollface.svg/200px-Trollface.svg.png',
      largeUrl: 'http://ya.ru'
    };
    if (this.photos && this.photos.length) {
      this.frontPhoto = this.photos[0];
      this.numPhotos = this.photos.length;
    }
    this.activePhoto = this.frontPhoto['largeUrl'];
    this.stars = STARS_VERBOSE[data.categoryId - 1];
    this.rating = data.rating;
    if (this.rating === '-') {
      this.rating = 0;
    }
    this.ratingName = '';
    if ((0 < (_ref = this.rating) && _ref <= 2.5)) {
      this.ratingName = "средний<br>отель";
    } else if ((2.5 < (_ref1 = this.rating) && _ref1 <= 4)) {
      this.ratingName = "хороший<br>отель";
    } else if ((4 < (_ref2 = this.rating) && _ref2 < 4.8)) {
      this.ratingName = "очень хороший<br>отель";
    } else if ((4.8 <= (_ref3 = this.rating) && _ref3 <= 5)) {
      this.ratingName = "великолепный<br>отель";
    }
    this.lat = data.latitude / 1;
    this.lng = data.longitude / 1;
    this.distanceToCenter = Math.ceil(data.centerDistance / 1000);
    if (this.distanceToCenter > 30) {
      this.distanceToCenter = 30;
    }
    this.duration = duration;
    console.log('duration:' + duration);
    this.haveFullInfo = ko.observable(false);
    this.selectText = ko.computed(function() {
      if (!_this.tours()) {
        return "Забронировать";
      }
      if (_this.activeResultId()) {
        return 'Выбран';
      } else {
        return 'Выбрать';
      }
    });
    this.hasHotelServices = data.hotelServices ? true : false;
    this.hotelServices = data.hotelServices;
    this.hasHotelGroupServices = data.hotelGroupServices ? true : false;
    this.hotelGroupServices = [];
    if (data.hotelGroupServices) {
      _ref4 = data.hotelGroupServices;
      for (groupName in _ref4) {
        elements = _ref4[groupName];
        this.hotelGroupServices.push({
          groupName: groupName,
          elements: elements,
          groupIcon: HOTEL_SERVICE_VERBOSE[groupName]
        });
      }
    }
    this.hasRoomAmenities = data.roomAmenities ? true : false;
    this.roomAmenities = data.roomAmenities;
    this.roomSets = ko.observableArray([]);
    console.log(this.roomSets());
    this.visible = ko.observable(true);
    this.visibleRoomSets = ko.computed(function() {
      var result, roomSet, _i, _len, _ref5;
      result = [];
      _ref5 = _this.roomSets();
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        roomSet = _ref5[_i];
        if (roomSet.visible()) {
          result.push(roomSet);
        }
      }
      if (result.length > 0) {
        window.voyanga_debug('all results for hotel'.result);
      } else {
        window.voyanga_debug('all results for hotel zero');
      }
      return result;
    });
    this.isShowAll = ko.observable(false);
    this.showAllText = ko.computed(function() {
      if (_this.isShowAll()) {
        return 'Свернуть все результаты';
      } else {
        return 'Посмотреть все результаты';
      }
    });
    this.push(data);
  }

  HotelResult.prototype.push = function(data) {
    var set,
      _this = this;
    set = new RoomSet(data, this, this.duration);
    set.resultId = data.resultId;
    if (this.roomSets.length === 0) {
      this.cheapest = set.price;
      this.cheapestSet = set;
      this.minPrice = set.pricePerNight;
      this.maxPrice = set.pricePerNight;
    } else {
      this.cheapest = set.price < this.cheapest ? set.price : this.cheapest;
      this.cheapestSet = set.price < this.cheapest ? set : this.cheapestSet;
      this.minPrice = set.pricePerNight < this.minPrice ? set.pricePerNight : this.minPrice;
      this.maxPrice = set.pricePerNight > this.maxPrice ? set.pricePerNight : this.maxPrice;
    }
    this.roomSets.push(set);
    return this.roomSets.sort(function(left, right) {
      if (left.price > right.price) {
        return 1;
      } else if (left.price < right.price) {
        return -1;
      }
      return 0;
    });
  };

  HotelResult.prototype.showPhoto = function(fp, ev) {
    var ind;
    ind = $(ev.currentTarget).data('photo-index');
    if (!ind) {
      ind = 0;
    }
    return new PhotoBox(this.photos, this.hotelName, this.stars, ind);
  };

  HotelResult.prototype.showAllResults = function(data, event) {
    if (this.isShowAll()) {
      $(event.currentTarget).parent().parent().find('.hidden-roomSets').hide('fast');
      return this.isShowAll(false);
    } else {
      $(event.currentTarget).parent().parent().find('.hidden-roomSets').show('fast');
      return this.isShowAll(true);
    }
  };

  HotelResult.prototype.showDetails = function(data, event) {
    this.readMoreExpanded = false;
    new GenericPopup('#hotels-body-popup', this);
    SizeBox('hotels-body-popup');
    ResizeBox('hotels-body-popup');
    $(".description .text").dotdotdot({
      watch: 'window'
    });
    return this.mapInitialized = false;
  };

  HotelResult.prototype.showMapDetails = function(data, event) {
    this.showDetails(data, event);
    return this.showMap();
  };

  HotelResult.prototype.showMapInfo = function(context, event) {
    var coords, el, map, mapOptions, marker;
    event.preventDefault();
    el = $('#hotel-info-tumblr-map');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('#descr').hide();
    $('#map').show();
    if (!this.mapInitialized) {
      coords = new google.maps.LatLng(this.lat, this.lng);
      mapOptions = {
        center: coords,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map($('#hotel-info-gmap')[0], mapOptions);
      marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: this.hotelName
      });
      return this.mapInitialized = true;
    }
  };

  HotelResult.prototype.showDescriptionInfo = function(context, event) {
    var el;
    el = $('#hotel-info-tumblr-description');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('#map').hide();
    $('#descr').show();
    $(".description .text").dotdotdot({
      watch: 'window'
    });
    return $('#boxContent').css('height', 'auto');
  };

  HotelResult.prototype.showMap = function(context, event) {
    var coords, el, map, mapOptions, marker;
    el = $('#hotels-popup-tumblr-map');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('.tab').hide();
    $('#hotels-popup-map').show();
    $('#boxContent').css('height', $('#hotels-popup-map').height() + $('#hotels-popup-header1').height() + $('#hotels-popup-header2').height() + 'px');
    if (!this.mapInitialized) {
      coords = new google.maps.LatLng(this.lat, this.lng);
      mapOptions = {
        center: coords,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map($('#hotels-popup-gmap')[0], mapOptions);
      marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: this.hotelName
      });
      this.mapInitialized = true;
    }
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.showDescription = function(context, event) {
    var el;
    el = $('#hotels-popup-tumblr-description');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('.tab').hide();
    $('#hotels-popup-description').show();
    $(".description .text").dotdotdot({
      watch: 'window'
    });
    $('#boxContent').css('height', 'auto');
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.initFullInfo = function() {
    var _this = this;
    this.roomCombinations = ko.observableArray([]);
    this.combinedPrice = ko.computed(function() {
      var res, roomSet, _i, _len, _ref;
      res = 0;
      _ref = _this.roomCombinations();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        roomSet = _ref[_i];
        if (roomSet.selectedCount()) {
          res += roomSet.selectedCount() * roomSet.price;
        }
      }
      return res;
    });
    return this.combinedButtonLabel = ko.computed(function() {
      if (_this.combinedPrice() > 0) {
        return _this.selectText();
      } else {
        return 'Не выбраны номера';
      }
    });
  };

  HotelResult.prototype.getFullInfo = function() {
    var api, url,
      _this = this;
    if (!this.haveFullInfo()) {
      api = new HotelsAPI;
      url = 'hotel/search/info/?hotelId=' + this.hotelId;
      url += '&cacheId=' + this.parent.cacheId;
      console.log(this.parent.cacheId);
      return api.search(url, function(data) {
        var cancelObjs, ind, key, roomSet, set, _i, _len, _ref, _ref1, _ref2;
        window.voyanga_debug('searchInfo', data);
        _this.initFullInfo();
        _ref = data.hotel.details;
        for (ind in _ref) {
          roomSet = _ref[ind];
          set = new RoomSet(roomSet, _this, _this.duration);
          set.resultId = roomSet.resultId;
          _this.roomCombinations.push(set);
        }
        cancelObjs = {};
        _ref1 = data.hotel.oldHotels;
        for (ind in _ref1) {
          roomSet = _ref1[ind];
          key = roomSet.resultId;
          cancelObjs[key] = roomSet;
        }
        console.log(cancelObjs);
        _ref2 = _this.roomSets();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          roomSet = _ref2[_i];
          key = roomSet.resultId;
          if (cancelObjs[key]) {
            roomSet.addCancelationRules(cancelObjs[key]);
          } else {
            console.log('not found result with key', key);
          }
        }
        _this.roomMixed = ko.computed(function() {
          var result, resultsObj, _j, _k, _len1, _len2, _ref3, _ref4;
          resultsObj = {};
          _ref3 = _this.roomSets();
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            roomSet = _ref3[_j];
            key = roomSet.key();
            if (typeof resultsObj[key] === 'undefined') {
              resultsObj[key] = roomSet;
            }
          }
          _ref4 = _this.roomCombinations();
          for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
            roomSet = _ref4[_k];
            key = roomSet.key();
            if (typeof resultsObj[key] === 'undefined') {
              resultsObj[key] = roomSet;
            }
          }
          result = [];
          for (key in resultsObj) {
            roomSet = resultsObj[key];
            result.push(roomSet);
          }
          return result;
        });
        _this.haveFullInfo(true);
        return console.log(_this.roomCombinations());
      });
    }
  };

  HotelResult.prototype.combinationClick = function() {
    return console.log('combinati data = _.filter @data(), (el) -> el.visible()on click');
  };

  HotelResult.prototype.readMore = function(context, event) {
    var el, rel, text_el, var_heightCSS;
    el = $(event.currentTarget);
    text_el = el.parent().find('.text');
    if (!el.hasClass('active')) {
      var_heightCSS = el.parent().find('.text').css('height');
      var_heightCSS = Math.abs(parseInt(var_heightCSS.slice(0, -2)));
      text_el.attr('rel', var_heightCSS).css('height', 'auto');
      text_el.dotdotdot({
        watch: 'window'
      });
      text_el.css('overflow', 'visible');
      el.text('Свернуть');
      el.addClass('active');
    } else {
      rel = el.parent().find('.text').attr('rel');
      text_el.css('height', rel + 'px');
      el.text('Подробнее');
      el.removeClass('active');
      text_el.dotdotdot({
        watch: 'window'
      });
      text_el.css('overflow', 'hidden');
    }
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.back = function() {
    return this.trigger('back');
  };

  HotelResult.prototype.select = function(room) {
    if (room.roomSets) {
      room = room.roomSets()[0];
    }
    if (this.tours()) {
      this.activeResultId(room.resultId);
    }
    this.trigger('select', {
      roomSet: room,
      hotel: this
    });
    return Utils.scrollTo('.info-trip');
  };

  HotelResult.prototype.smallMapUrl = function() {
    var base;
    base = "http://maps.googleapis.com/maps/api/staticmap?zoom=13&size=310x259&maptype=roadmap&markers=color:red%7Ccolor:red%7C";
    base += "%7C";
    base += this.lat + "," + this.lng;
    base += "&sensor=false";
    return base;
  };

  return HotelResult;

})();

HotelsResultSet = (function() {

  function HotelsResultSet(rawHotels, searchParams) {
    var checkIn, checkOut, duration, hotel, key, result, _i, _j, _len, _len1, _ref,
      _this = this;
    this.searchParams = searchParams;
    this.postFilters = __bind(this.postFilters, this);

    this.postInit = __bind(this.postInit, this);

    this.selectHotel = __bind(this.selectHotel, this);

    this.sortByRating = __bind(this.sortByRating, this);

    this.sortByPrice = __bind(this.sortByPrice, this);

    this.getDateInterval = __bind(this.getDateInterval, this);

    this.select = __bind(this.select, this);

    this._results = {};
    this.tours = ko.observable(false);
    this.checkIn = moment(this.searchParams.checkIn);
    this.checkOut = moment(this.checkIn).add('days', this.searchParams.duration);
    window.voyanga_debug('checkOut', this.checkOut);
    this.city = 0;
    if (this.searchParams.duration) {
      duration = this.searchParams.duration;
    }
    if (duration === 0 || typeof duration === 'undefined') {
      for (_i = 0, _len = rawHotels.length; _i < _len; _i++) {
        hotel = rawHotels[_i];
        if (typeof hotel.duration === 'undefined') {
          checkIn = dateUtils.fromIso(hotel.checkIn);
          console.log(checkIn);
          checkOut = dateUtils.fromIso(hotel.checkOut);
          console.log(hotel.checkOut);
          console.log(checkOut);
          duration = checkOut.valueOf() - checkIn.valueOf();
          duration = Math.floor(duration / (3600 * 24 * 1000));
        } else {
          duration = hotel.duration;
          console.log('yes set');
        }
        break;
      }
    }
    console.log('MainDuration:' + duration);
    this.minPrice = false;
    this.maxPrice = false;
    for (_j = 0, _len1 = rawHotels.length; _j < _len1; _j++) {
      hotel = rawHotels[_j];
      key = hotel.hotelId;
      if (!this.city) {
        this.city = hotel.city;
      }
      if (this._results[key]) {
        this._results[key].push(hotel);
        this.minPrice = this._results[key].minPrice < this.minPrice ? this._results[key].minPrice : this.minPrice;
        this.maxPrice = this._results[key].maxPrice > this.maxPrice ? this._results[key].maxPrice : this.maxPrice;
      } else {
        result = new HotelResult(hotel, this, duration);
        this._results[key] = result;
        if (this.minPrice === false) {
          this.minPrice = this._results[key].minPrice;
          this.maxPrice = this._results[key].maxPrice;
        } else {
          this.minPrice = this._results[key].minPrice < this.minPrice ? this._results[key].minPrice : this.minPrice;
          this.maxPrice = this._results[key].maxPrice > this.maxPrice ? this._results[key].maxPrice : this.maxPrice;
        }
      }
    }
    this.data = ko.observableArray();
    this.numResults = ko.observable(0);
    _ref = this._results;
    for (key in _ref) {
      result = _ref[key];
      this.data.push(result);
    }
    this.sortBy = ko.observable('minPrice');
    this.sortByPriceClass = ko.computed(function() {
      var ret;
      ret = 'hotel-sort-by-item';
      if (_this.sortBy() === 'minPrice') {
        ret += ' active';
      }
      return ret;
    });
    this.sortByRatingClass = ko.computed(function() {
      var ret;
      ret = 'hotel-sort-by-item';
      if (_this.sortBy() === 'rating') {
        ret += ' active';
      }
      return ret;
    });
    this.data.sort(function(left, right) {
      if (left.minPrice < right.minPrice) {
        return -1;
      }
      if (left.minPrice > right.minPrice) {
        return 1;
      }
      return 0;
    });
  }

  HotelsResultSet.prototype.select = function(hotel, event) {
    var _this = this;
    window.voyanga_debug(' i wonna get hotel for you', hotel);
    hotel.off('back');
    hotel.on('back', function() {
      return window.app.render({
        results: ko.observable(_this)
      }, 'results');
    });
    hotel.getFullInfo();
    window.app.render(hotel, 'info-template');
    return Utils.scrollTo('#content');
  };

  HotelsResultSet.prototype.getDateInterval = function() {
    return dateUtils.formatDayMonthInterval(this.checkIn._d, this.checkOut._d);
  };

  HotelsResultSet.prototype.sortByPrice = function() {
    if (this.sortBy() !== 'minPrice') {
      this.sortBy('minPrice');
      return this.data.sort(function(left, right) {
        if (left.minPrice < right.minPrice) {
          return -1;
        }
        if (left.minPrice > right.minPrice) {
          return 1;
        }
        return 0;
      });
    }
  };

  HotelsResultSet.prototype.sortByRating = function() {
    if (this.sortBy() !== 'rating') {
      this.sortBy('rating');
      return this.data.sort(function(left, right) {
        if (left.rating > right.rating) {
          return -1;
        }
        if (left.rating < right.rating) {
          return 1;
        }
        return 0;
      });
    }
  };

  HotelsResultSet.prototype.selectHotel = function(hotel, event) {
    return this.select(hotel, event);
  };

  HotelsResultSet.prototype.postInit = function() {
    return this.filters = new HotelFiltersT(this);
  };

  HotelsResultSet.prototype.postFilters = function() {
    var data,
      _this = this;
    console.log('post filters');
    data = _.filter(this.data(), function(el) {
      return el.visible();
    });
    this.numResults(data.length);
    console.log(this.data);
    return window.setTimeout(function() {
      ifHeightMinAllBody();
      return scrolShowFilter();
    }, 50);
  };

  return HotelsResultSet;

})();
