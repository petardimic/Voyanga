// Generated by CoffeeScript 1.4.0
var HotelsPanel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HotelsPanel = (function(_super) {

  __extends(HotelsPanel, _super);

  function HotelsPanel() {
    this.afterRender = __bind(this.afterRender, this);

    this.setDate = __bind(this.setDate, this);

    this.haveDates = __bind(this.haveDates, this);

    this.checkOutHtml = __bind(this.checkOutHtml, this);

    this.checkInHtml = __bind(this.checkInHtml, this);

    this.handlePanelSubmit = __bind(this.handlePanelSubmit, this);

    var _this = this;
    this.template = 'hotels-panel-template';
    HotelsPanel.__super__.constructor.call(this);
    this.prevPanel = 'avia';
    this.nextPanel = 'tours';
    this.icon = 'hotel-ico';
    this.mainLabel = 'Поиск отелей';
    this.indexMode = ko.observable(true);
    this.sp = new HotelsSearchParams();
    this.calendarHidden = ko.observable(true);
    this.city = this.sp.city;
    this.checkIn = this.sp.checkIn;
    this.checkOut = this.sp.checkOut;
    this.peopleSelectorVM = new HotelPeopleSelector(this.sp);
    this.cityReadable = ko.observable();
    this.cityReadableAcc = ko.observable();
    this.cityReadableGen = ko.observable();
    this.cityReadablePre = ko.observable();
    this.calendarActive = ko.observable(true);
    this.calendarText = ko.computed(function() {
      var ret;
      ret = "Выберите дату проживания";
      if (_this.cityReadable()) {
        return ret += " в городе " + _this.cityReadable();
      }
    });
    this.prefixText = "Выберите город<br>200 000+ отелей";
    this.formFilled = ko.computed(function() {
      var cin, cout, result;
      if (_this.checkIn().getDay) {
        cin = true;
      } else {
        cin = _this.checkIn().length > 0;
      }
      if (_this.checkOut().getDay) {
        cout = true;
      } else {
        cout = _this.checkOut().length > 0;
      }
      result = _this.city() && cin && cout;
      return result;
    });
    this.formNotFilled = ko.computed(function() {
      return !_this.formFilled();
    });
    this.maximizedCalendar = ko.computed(function() {
      return (_this.city().length > 0) && (!_.isObject(_this.checkIn()));
    });
    this.maximizedCalendar.subscribe(function(newValue) {
      if (_this.calendarActive()) {
        if (!newValue) {
          return;
        }
        return _this.showCalendar();
      }
    });
    this.calendarValue = ko.computed(function() {
      return {
        twoSelect: true,
        hotels: true,
        from: _this.checkIn(),
        to: _this.checkOut(),
        activeSearchPanel: _this,
        valuesDescriptions: ['Заезд в отель<br>в ' + _this.cityReadablePre(), 'Выезд из отеля<br>в ' + _this.cityReadablePre()],
        intervalDescription: '0'
      };
    });
  }

  HotelsPanel.prototype.handlePanelSubmit = function() {
    if (window.location.pathname.replace('/', '') !== '') {
      $('#loadWrapBgMin').show();
      window.location.href = '/#' + this.sp.getHash();
      return;
    }
    app.navigate(this.sp.getHash(), {
      trigger: true
    });
    return this.minimizedCalendar(true);
  };

  HotelsPanel.prototype.checkInHtml = function() {
    if (this.checkIn()) {
      return dateUtils.formatHtmlDayShortMonth(this.checkIn());
    }
    return '';
  };

  HotelsPanel.prototype.checkOutHtml = function() {
    if (this.checkOut()) {
      return dateUtils.formatHtmlDayShortMonth(this.checkOut());
    }
    return '';
  };

  HotelsPanel.prototype.haveDates = function() {
    return this.checkOut() && this.checkIn();
  };

  HotelsPanel.prototype.navigateToNewSearch = function() {
    if (this.formNotFilled()) {
      return;
    }
    this.handlePanelSubmit();
    return this.minimizedCalendar(true);
  };

  HotelsPanel.prototype.setDate = function(values) {
    if (values.length) {
      if (!this.checkIn() || (moment(this.checkIn()).format('YYYY-MM-DD') !== moment(values[0]).format('YYYY-MM-DD'))) {
        this.checkIn(values[0]);
      }
      if (values.length > 1) {
        if (values[1] > this.checkIn()) {
          if (!this.checkOut() || (moment(this.checkOut()).format('YYYY-MM-DD') !== moment(values[1]).format('YYYY-MM-DD'))) {
            return this.checkOut(values[1]);
          }
        } else {
          return this.checkOut('');
        }
      }
    }
  };

  HotelsPanel.prototype.afterRender = function() {
    return resizePanel();
  };

  return HotelsPanel;

})(SearchPanel);
