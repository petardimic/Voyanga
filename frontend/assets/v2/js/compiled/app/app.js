// Generated by CoffeeScript 1.4.0
var Application,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Application = (function(_super) {

  __extends(Application, _super);

  function Application() {
    this.isEvent = __bind(this.isEvent, this);

    this.isNotEvent = __bind(this.isNotEvent, this);

    this.mapRendered = __bind(this.mapRendered, this);

    this.contentRendered = __bind(this.contentRendered, this);

    this.handle404 = __bind(this.handle404, this);

    this.bindItemsToEvent = __bind(this.bindItemsToEvent, this);

    this.bindItemsToBuy = __bind(this.bindItemsToBuy, this);

    this.bindEvents = __bind(this.bindEvents, this);

    this.runWithModule = __bind(this.runWithModule, this);

    this.render = __bind(this.render, this);

    this.reRenderCalendarEvent = __bind(this.reRenderCalendarEvent, this);

    this.reRenderCalendarStatic = __bind(this.reRenderCalendarStatic, this);

    this.reRenderCalendar = __bind(this.reRenderCalendar, this);

    this.minimizeCalendar = __bind(this.minimizeCalendar, this);

    this.initCalendar = __bind(this.initCalendar, this);

    var result, _oldOnerrorHandler,
      _this = this;
    _oldOnerrorHandler = window.onerror;
    window.onerror = function() {
      var rest;
      rest = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (rest.length === 3 && rest[2] === 0) {
        return;
      }
      new ErrorPopup('e500');
      if (_oldOnerrorHandler) {
        return _oldOnerrorHandler.apply(_this, rest);
      }
    };
    this.activeModule = ko.observable(null);
    this.activeModuleInstance = ko.observable(null);
    this.activeSearchPanel = ko.observable(null);
    result = {
      template: '',
      data: {},
      rt: function() {
        return true;
      },
      departureDate: function() {
        return '12.11.2013';
      },
      arrivalDate: function() {
        return '12.12.2013';
      },
      calendarText: 'DOH',
      minimizeCalendar: function() {
        return true;
      },
      calendarHidden: function() {
        return true;
      },
      calendarShadow: function() {
        return true;
      },
      afterRender: function() {}
    };
    this.fakoPanel = ko.observable(result);
    this.panel = ko.computed(function() {
      var am;
      am = _this.activeModuleInstance();
      if (am) {
        result = ko.utils.unwrapObservable(am.panel);
        result = ko.utils.unwrapObservable(result);
        if (result !== null) {
          _this.fakoPanel(result);
          _this.activeSearchPanel(_this.fakoPanel());
          return $('div.innerCalendar').find('h1').removeClass('highlight');
        }
      }
    });
    this._view = ko.observable(false);
    this.activeView = ko.computed(function() {
      if (!_this._view()) {
        return 'stub';
      }
      return _this.activeModule() + '-' + _this._view();
    });
    this.in1 = ko.observable(0);
    this.indexMode = ko.computed(function() {
      return _this.in1(_this._view() === 'index');
    });
    this.calendarInitialized = false;
    this.showEventsPicture = ko.computed(function() {
      return _this.activeView() === 'tours-index';
    });
    this.viewData = ko.observable({});
    this.slider = new Slider();
    this.slider.init();
    this.activeModule.subscribe(this.slider.handler);
    this.debugMode = ko.observable(false);
    this.breakdown = ko.observable(false);
  }

  Application.prototype.initCalendar = function() {
    throw "Deprecated";
  };

  Application.prototype.minimizeCalendar = function() {
    console.log('activeSearchPanel', this.activeSearchPanel());
    if (this.activeSearchPanel()) {
      return this.activeSearchPanel().minimizedCalendar(true);
    }
  };

  Application.prototype.reRenderCalendar = function(elements) {
    var _this = this;
    VoyangaCalendarStandart.panel = false;
    VoyangaCalendarStandart.init(this.fakoPanel, elements[1]);
    this.fakoPanel.subscribe(function(newPanel) {
      if (newPanel.panels) {
        return _this.activeSearchPanel(_.last(newPanel.panels()));
      }
    });
    if (this.fakoPanel().panels) {
      return this.activeSearchPanel(_.last(this.fakoPanel().panels()));
    }
  };

  Application.prototype.reRenderCalendarStatic = function(elements) {
    var _this = this;
    $('.calenderWindow').css('position', 'static').find('.calendarSlide').css('position', 'static');
    VoyangaCalendarStandart.init(this.fakoPanel, elements[1]);
    this.fakoPanel.subscribe(function(newPanel) {
      console.log('change panel', newPanel, newPanel.panels);
      if (newPanel.panels) {
        return _this.activeSearchPanel(_.last(newPanel.panels()));
      } else {
        return _this.activeSearchPanel(newPanel);
      }
    });
    console.log('set panel', this.fakoPanel(), this.fakoPanel().panels);
    if (this.fakoPanel().panels) {
      return this.activeSearchPanel(_.last(this.fakoPanel().panels()));
    } else {
      return this.activeSearchPanel(this.fakoPanel());
    }
  };

  Application.prototype.reRenderCalendarEvent = function(elements) {
    console.log('rerender calendar');
    $('.calenderWindow').css('position', 'static').find('.calendarSlide').css('position', 'static');
    VoyangaCalendarStandart.init(this.itemsToBuy.activePanel, elements[1]);
    return this.activeSearchPanel(_.last(this.itemsToBuy.activePanel().panels()));
  };

  Application.prototype.render = function(data, view) {
    this.viewData(data);
    this._view(view);
    return $(window).resize();
  };

  Application.prototype.register = function(prefix, module, isDefault) {
    var action, controller, route, _ref,
      _this = this;
    if (isDefault == null) {
      isDefault = false;
    }
    controller = module.controller;
    controller.on("viewChanged", function(view, data) {
      return _this.render(data, view);
    });
    _ref = controller.routes;
    for (route in _ref) {
      action = _ref[route];
      window.voyanga_debug("APP: registreing route", prefix, route, action);
      this.route(prefix + route, prefix, action);
      if (isDefault && route === '') {
        this.route(route, prefix, action);
      }
    }
    return this.on("beforeroute:" + prefix, function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      window.voyanga_debug("APP: routing", args);
      if (this.panel() === void 0 || (prefix !== this.activeModule())) {
        this.minimizeCalendar();
        window.voyanga_debug("APP: switching active module to", prefix);
        this.activeModule(prefix);
        window.voyanga_debug("APP: activating panel", ko.utils.unwrapObservable(module.panel));
        this.activeModuleInstance(module);
        $(window).unbind('resize');
        $(window).resize(module.resize);
        return this.toggleGMaps(false);
      }
    });
  };

  Application.prototype.toggleGMaps = function(force) {
    if ((this.activeModule() === 'avia') || (this.activeModule() === 'hotels')) {
      if (force || (this.events && this.events.isRendered)) {
        return this.events.closeEventsPhoto();
      }
    } else {
      if (force || (this.events && this.events.isRendered)) {
        return this.events.closeEventsMaps();
      }
    }
  };

  Application.prototype.run = function() {
    Backbone.history.start();
    this.bindEvents();
    return this.slider.handler(this.activeModule());
  };

  Application.prototype.runWithModule = function(module) {
    Backbone.history.start({
      silent: true
    });
    window.app.navigate('#' + module, {
      replace: true
    });
    this.activeModule(module);
    $(window).unbind('resize');
    $(window).resize(ResizeAvia);
    return $(window).resize();
  };

  Application.prototype.bindEvents = function() {
    var ev;
    ev = [];
    $.each(window.eventsRaw, function(i, el) {
      return ev.push(new Event(el));
    });
    return this.events = new EventSet(ev);
  };

  Application.prototype.bindItemsToBuy = function() {
    var tourTrip;
    tourTrip = new TourTripResultSet(window.tripRaw);
    return this.itemsToBuy = tourTrip;
  };

  Application.prototype.bindItemsToEvent = function() {
    var tourTrip;
    tourTrip = new EventTourResultSet(window.tripRaw, window.eventId);
    return this.itemsToBuy = tourTrip;
  };

  Application.prototype.handle404 = function() {
    return new ErrorPopup('avia500');
  };

  Application.prototype.route = function(route, name, callback) {
    return Backbone.Router.prototype.route.call(this, route, name, function() {
      this.trigger.apply(this, ['beforeroute:' + name].concat(_.toArray(arguments)));
      return callback.apply(this, arguments);
    });
  };

  Application.prototype.contentRendered = function() {
    window.voyanga_debug("APP: Content rendered");
    this.trigger(this.activeModule() + ':contentRendered');
    ResizeFun();
    return WidthMine();
  };

  Application.prototype.mapRendered = function(elem) {
    return $('.slideTours').find('.active').find('.triangle').animate({
      'top': '-16px'
    }, 200);
  };

  Application.prototype.isNotEvent = function() {
    return !this.isEvent();
  };

  Application.prototype.isEvent = function() {
    return this.activeView() === 'tours-index';
  };

  return Application;

})(Backbone.Router);

window.voyanga_debug = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log.apply(console, args);
};
