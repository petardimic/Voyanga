// Generated by CoffeeScript 1.4.0
var SearchPanel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SearchPanel = (function() {

  function SearchPanel(hideCalendar, fromTourPanel) {
    var _this = this;
    if (hideCalendar == null) {
      hideCalendar = true;
    }
    if (fromTourPanel == null) {
      fromTourPanel = false;
    }
    this.afterRender = __bind(this.afterRender, this);

    this.handlePanelSubmit = __bind(this.handlePanelSubmit, this);

    this.showCalendar = __bind(this.showCalendar, this);

    this.minimizeCalendar = __bind(this.minimizeCalendar, this);

    this.minimize = __bind(this.minimize, this);

    this.toggleCalendar = __bind(this.toggleCalendar, this);

    this.togglePanel = __bind(this.togglePanel, this);

    this.minimized = ko.observable(!hideCalendar);
    this.minimizedCalendar = ko.observable(hideCalendar);
    this.calendarHidden = ko.observable(this.minimizedCalendar);
    this.calendarShadow = ko.observable(this.minimizedCalendar);
    this.prevSearchPanel = ko.observable(null);
    this.nextSearchPanel = ko.observable(null);
    this.aPanelId = Math.floor(Math.random() * 10000);
    this.oldCalendarState = this.minimizedCalendar();
    this.togglePanel(this.minimized(), fromTourPanel);
    this.toggleCalendar(this.minimizedCalendar(), true);
    this.toggleSubscribers = this.minimized.subscribe(function(minimized) {
      return _this.togglePanel(minimized);
    });
    this.minimizedCalendar.subscribe(function(minimizedCalendar) {
      return _this.toggleCalendar(minimizedCalendar);
    });
  }

  SearchPanel.prototype.togglePanel = function(minimized, fromTourPanel) {
    var heightSubHead, speed;
    if (fromTourPanel == null) {
      fromTourPanel = false;
    }
    if (!fromTourPanel) {
      speed = 300;
      heightSubHead = $('.sub-head').height();
      if (!minimized) {
        return $('.sub-head').animate({
          'margin-top': '0px'
        }, speed);
      } else {
        return $('.sub-head').animate({
          'margin-top': '-' + (heightSubHead - 4) + 'px'
        }, speed);
      }
    }
  };

  SearchPanel.prototype.toggleCalendar = function(minimizedCalendar, initialize) {
    var heightCalendar1, heightCalendar2, heightSubHead, speed,
      _this = this;
    if (initialize == null) {
      initialize = false;
    }
    speed = 500;
    heightSubHead = $('.sub-head').height();
    heightCalendar1 = $('.calenderWindow').height();
    heightCalendar2 = heightSubHead;
    if (!minimizedCalendar) {
      this.calendarHidden(false);
      if (!initialize) {
        ResizeAvia();
        $('.calenderWindow .calendarSlide').animate({
          'top': '0px'
        });
        return $('.calenderWindow').animate({
          'height': '341px'
        }, speed);
      }
    } else {
      this.calendarShadow(true);
      if (!initialize) {
        ResizeAvia();
        this.calendarShadow(true);
        $('.calenderWindow .calendarSlide').animate({
          'top': '-341px'
        });
        return $('.calenderWindow').animate({
          'height': '0px'
        }, speed, function() {
          _this.calendarHidden(true);
          return _this.calendarShadow(false);
        });
      } else {
        $('.calenderWindow .calendarSlide').css({
          'top': '-341px'
        });
        $('.calenderWindow').css({
          'height': '0px'
        });
        this.calendarHidden(true);
        return this.calendarShadow(false);
      }
    }
  };

  SearchPanel.prototype.minimize = function() {
    if (this.minimized()) {
      this.minimized(false);
      return this.minimizedCalendar(this.oldCalendarState);
    } else {
      this.minimized(true);
      this.oldCalendarState = this.minimizedCalendar();
      if (!this.minimizedCalendar()) {
        return this.minimizedCalendar(true);
      }
    }
  };

  SearchPanel.prototype.minimizeCalendar = function() {
    if (this.minimizedCalendar()) {
      return this.minimizedCalendar(false);
    } else {
      return this.minimizedCalendar(true);
    }
  };

  SearchPanel.prototype.showCalendar = function() {
    $('.calenderWindow').show();
    console.log('show calendar');
    VoyangaCalendarStandart.panel.notifySubscribers(VoyangaCalendarStandart.panel());
    VoyangaCalendarStandart.scrollToDate(VoyangaCalendarStandart.scrollDate, true);
    if (this.minimizedCalendar()) {
      return this.minimizedCalendar(false);
    }
  };

  SearchPanel.prototype.handlePanelSubmit = function() {
    app.navigate(this.sp.getHash(), {
      trigger: true
    });
    return this.minimizedCalendar(true);
  };

  SearchPanel.prototype.afterRender = function() {
    throw "Implement me";
  };

  return SearchPanel;

})();
