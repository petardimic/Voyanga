// Generated by CoffeeScript 1.4.0
var TourPanel, TourPanelSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TourPanelSet = (function() {

  function TourPanelSet() {
    this.afterRender = __bind(this.afterRender, this);

    this.calendarHidden = __bind(this.calendarHidden, this);

    this.setDate = __bind(this.setDate, this);

    this.showPanelCalendar = __bind(this.showPanelCalendar, this);

    this.addPanel = __bind(this.addPanel, this);

    this.isFirst = __bind(this.isFirst, this);

    this.deletePanel = __bind(this.deletePanel, this);

    this.saveStartParams = __bind(this.saveStartParams, this);

    this.navigateToNewSearchMainPage = __bind(this.navigateToNewSearchMainPage, this);

    this.navigateToNewSearch = __bind(this.navigateToNewSearch, this);

    var _this = this;
    _.extend(this, Backbone.Events);
    window.voyanga_debug('Init of TourPanelSet');
    this.template = 'tour-panel-template';
    this.sp = new TourSearchParams();
    this.prevPanel = 'hotels';
    this.nextPanel = 'avia';
    this.icon = 'constructor-ico';
    this.mainLabel = 'Спланируй свое путешествие <img src="/themes/v2/images/saleTitle.png">';
    this.indexMode = true;
    this.startCity = this.sp.startCity;
    this.startCityReadable = ko.observable('');
    this.startCityReadableGen = ko.observable('');
    this.startCityReadableAcc = ko.observable('');
    this.panels = ko.observableArray([]);
    this.activeCity = ko.observable('');
    this.sp.calendarActivated = ko.observable(true);
    this.calendarText = ko.computed(function() {
      var result;
      result = 'Выберите даты пребывания в городе';
      if (_this.activeCity()) {
        result += ' ' + _this.activeCity();
      }
      return result;
    });
    this.lastPanel = null;
    this.i = 0;
    this.addPanel();
    this.activeCalendarPanel = ko.observable(this.panels()[0]);
    this.height = ko.computed(function() {
      return 64 * _this.panels().length + 'px';
    });
    this.heightPanelSet = ko.computed(function() {
      return 64 * _this.panels().length;
    });
    this.isMaxReached = ko.computed(function() {
      return _this.panels().length > 4;
    });
    this.calendarValue = ko.computed(function() {
      return {
        twoSelect: true,
        hotels: true,
        from: _this.activeCalendarPanel().checkIn(),
        to: _this.activeCalendarPanel().checkOut(),
        activeSearchPanel: _this.activeCalendarPanel()
      };
    });
    this.formFilled = ko.computed(function() {
      var isFilled;
      isFilled = _this.startCity();
      _.each(_this.panels(), function(panel) {
        return isFilled = isFilled && panel.formFilled();
      });
      return isFilled;
    });
    this.formNotFilled = ko.computed(function() {
      return !_this.formFilled();
    });
  }

  TourPanelSet.prototype.navigateToNewSearch = function() {
    if (this.formNotFilled()) {
      return;
    }
    _.last(this.panels()).handlePanelSubmit();
    return _.last(this.panels()).minimizedCalendar(true);
  };

  TourPanelSet.prototype.navigateToNewSearchMainPage = function() {
    if (this.formNotFilled()) {
      return;
    }
    if (this.selectedParams) {
      _.last(this.panels()).selectedParams = this.selectedParams;
    }
    return _.last(this.panels()).handlePanelSubmit(false);
  };

  TourPanelSet.prototype.saveStartParams = function() {
    return _.last(this.panels()).saveStartParams();
  };

  TourPanelSet.prototype.deletePanel = function(elem) {
    this.sp.destinations.remove(elem.city);
    this.panels.remove(elem);
    return _.last(this.panels()).isLast(true);
  };

  TourPanelSet.prototype.isFirst = function() {
    return this.i === 1;
  };

  TourPanelSet.prototype.addPanel = function() {
    var newPanel, prevPanel,
      _this = this;
    this.sp.destinations.push(new DestinationSearchParams());
    if (_.last(this.panels())) {
      _.last(this.panels()).isLast(false);
      prevPanel = _.last(this.panels());
    }
    newPanel = new TourPanel(this.sp, this.i, this.i === 0);
    newPanel.on("tourPanel:showCalendar", function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _this.activeCity(newPanel.cityReadable());
      return _this.showPanelCalendar(args);
    });
    newPanel.on("tourPanel:hasFocus", function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _this.activeCity(newPanel.cityReadable());
      return _this.showPanelCalendar(args);
    });
    if (prevPanel) {
      newPanel.prevSearchPanel(prevPanel);
      prevPanel.nextSearchPanel(newPanel);
    }
    this.panels.push(newPanel);
    this.lastPanel = newPanel;
    this.i = this.panels().length;
    return VoyangaCalendarStandart.clear();
  };

  TourPanelSet.prototype.showPanelCalendar = function(args) {
    this.activeCalendarPanel(args[0]);
    return console.log('showPanelCalendar', args);
  };

  TourPanelSet.prototype.setDate = function(values) {
    var maxDate;
    console.log('Calendar selected:', values);
    if (values && values.length) {
      this.activeCalendarPanel().checkIn(values[0]);
      maxDate = this.activeCalendarPanel().checkIn();
      if (values.length > 1) {
        this.activeCalendarPanel().checkOut(values[1]);
        if (maxDate < this.activeCalendarPanel().checkOut()) {
          maxDate = this.activeCalendarPanel().checkOut();
        }
      }
      if (this.activeCalendarPanel().nextSearchPanel() && maxDate > this.activeCalendarPanel().nextSearchPanel().checkIn()) {
        this.activeCalendarPanel().nextSearchPanel().checkIn(null);
        return this.activeCalendarPanel().nextSearchPanel().checkOut(null);
      }
    }
  };

  TourPanelSet.prototype.calendarHidden = function() {
    return this.activeCalendarPanel().calendarHidden();
  };

  TourPanelSet.prototype.afterRender = function() {
    console.error("AFTER RENDER");
    return resizePanel(true);
  };

  return TourPanelSet;

})();

TourPanel = (function(_super) {

  __extends(TourPanel, _super);

  function TourPanel(sp, ind, isFirst) {
    this.checkOutHtml = __bind(this.checkOutHtml, this);

    this.checkInHtml = __bind(this.checkInHtml, this);

    this.showCalendar = __bind(this.showCalendar, this);

    this.saveStartParams = __bind(this.saveStartParams, this);

    this.handlePanelSubmit = __bind(this.handlePanelSubmit, this);

    this.handlePanelSubmitToMain = __bind(this.handlePanelSubmitToMain, this);

    var _this = this;
    window.voyanga_debug("TourPanel created");
    TourPanel.__super__.constructor.call(this, isFirst, true);
    this.toggleSubscribers.dispose();
    console.log('try dispose subscribe');
    _.extend(this, Backbone.Events);
    this.hasfocus = ko.observable(false);
    this.sp = sp;
    this.isLast = ko.observable(true);
    this.peopleSelectorVM = new HotelPeopleSelector(sp);
    this.destinationSp = _.last(sp.destinations());
    this.city = this.destinationSp.city;
    this.checkIn = this.destinationSp.dateFrom;
    this.checkOut = this.destinationSp.dateTo;
    this.cityReadable = ko.observable('');
    this.cityReadableGen = ko.observable('');
    this.cityReadableAcc = ko.observable('');
    this.oldCalendarState = this.minimizedCalendar();
    this.formFilled = ko.computed(function() {
      return _this.city() && _this.checkIn() && _this.checkOut();
    });
    this.formNotFilled = ko.computed(function() {
      return !_this.formFilled();
    });
    this.maximizedCalendar = ko.computed(function() {
      return _this.city().length > 0;
    });
    this.calendarText = ko.computed(function() {
      var result;
      result = "Выберите дату поездки ";
      return result;
    });
    this.hasfocus.subscribe(function(newValue) {
      return _this.trigger("tourPanel:hasFocus", _this);
    });
    this.city.subscribe(function(newValue) {
      console.log('city changed!!!!!!!!');
      if (_this.sp.calendarActivated()) {
        return _this.showCalendar();
      }
    });
  }

  TourPanel.prototype.handlePanelSubmitToMain = function() {
    return handlePanelSubmit(false);
  };

  TourPanel.prototype.handlePanelSubmit = function(onlyHash) {
    var url;
    if (onlyHash == null) {
      onlyHash = true;
    }
    console.log('onlyHash', onlyHash);
    if (onlyHash) {
      return app.navigate(this.sp.getHash(), {
        trigger: true
      });
    } else {
      url = '/#' + this.sp.getHash();
      if (this.startParams === url) {
        url += 'eventId/' + this.selectedParams.eventId;
      }
      console.log('go url', url, 'length', url.length);
      return window.location.href = url;
    }
  };

  TourPanel.prototype.saveStartParams = function() {
    var url;
    url = '/#' + this.sp.getHash();
    return this.startParams = url;
  };

  TourPanel.prototype.close = function() {
    $(document.body).unbind('mousedown');
    $('.how-many-man .btn').removeClass('active');
    $('.how-many-man .content').removeClass('active');
    return $('.how-many-man').find('.popup').removeClass('active');
  };

  TourPanel.prototype.showFromCityInput = function(panel, event) {
    var el, elem;
    event.stopPropagation();
    elem = $('.cityStart').find('.second-path');
    elem.data('old', elem.val());
    el = elem.closest('.cityStart');
    el.closest('.tdCityStart').animate({
      width: '+=130',
      300: 300
    });
    el.closest('.tdCityStart').find('.bgInput').animate({
      width: '+=150',
      300: 300
    });
    el.closest('.tdCityStart').next().find('.data').animate({
      width: '-=130',
      300: 300
    });
    el.find(".startInputTo").show();
    return el.find('.cityStart').animate({
      width: "261px"
    }, 300, function() {
      return el.find(".startInputTo").find("input").focus().select();
    });
  };

  TourPanel.prototype.hideFromCityInput = function(panel, event) {
    return hideFromCityInput(panel, event);
  };

  TourPanel.prototype.showCalendar = function() {
    console.log('calendar show trigger');
    $('.calenderWindow').show();
    this.trigger("tourPanel:showCalendar", this);
    if (this.minimizedCalendar()) {
      ResizeAvia();
      return this.minimizedCalendar(false);
    }
  };

  TourPanel.prototype.checkInHtml = function() {
    if (this.checkIn()) {
      return dateUtils.formatHtmlDayShortMonth(this.checkIn());
    }
    return '';
  };

  TourPanel.prototype.checkOutHtml = function() {
    if (this.checkOut()) {
      return dateUtils.formatHtmlDayShortMonth(this.checkOut());
    }
    return '';
  };

  return TourPanel;

})(SearchPanel);

$(document).on("keyup change", "input.second-path", function(e) {
  var firstValue, secondEl;
  firstValue = $(this).val();
  secondEl = $(this).siblings('input.input-path');
  if ((e.keyCode === 8) || (firstValue.length < 3)) {
    return secondEl.val('');
  }
});

$(document).on("keyup change", '.cityStart input.second-path', function(e) {
  var elem;
  elem = $('.from.active .second-path');
  if (e.keyCode === 13) {
    if (elem.parent().hasClass("overflow")) {
      elem.parent().animate({
        width: "271px"
      }, 300, function() {
        $(this).removeClass("overflow");
        return $('.from.active .second-path').focus();
      });
      $(".cityStart").animate({
        width: "115px"
      }, 300);
      return $(".cityStart").find(".startInputTo").animate({
        opacity: "1"
      }, 300, function() {
        return $(this).hide();
      });
    }
  }
});
