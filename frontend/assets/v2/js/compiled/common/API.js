// Generated by CoffeeScript 1.4.0
var API, AviaAPI, HotelsAPI, ToursAPI, VisualLoader,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

API = (function() {

  function API() {
    this.call = __bind(this.call, this);

    this.init = __bind(this.init, this);
    this.endpoint = window.apiEndPoint;
    this.loader = window.VisualLoaderInstance;
    this.init();
  }

  API.prototype.init = function() {
    return this.loaderDescription = "Идет поиск лучших авиабилетов и отелей<br>Это может занять от 5 до 30 секунд";
  };

  API.prototype.call = function(url, cb) {
    var _this = this;
    return $.ajax({
      url: "" + this.endpoint + url,
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      timeout: 200000,
      success: function(data) {
        _this.loader.renew(100);
        return window.setTimeout(function() {
          return cb(data);
        }, 10);
      },
      error: function() {
        var jqXHR, rest;
        jqXHR = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        _this.loader.hide();
        if (jqXHR.status > 0) {
          throw new Error(("Api call failed: Url: " + url) + " | Status: " + jqXHR.status + " | Status text '" + jqXHR.statusText + "' | " + jqXHR.getAllResponseHeaders().replace("\n", ";") + " | " + rest.join(" | "));
        }
      }
    });
  };

  return API;

})();

ToursAPI = (function(_super) {

  __extends(ToursAPI, _super);

  function ToursAPI() {
    this.search = __bind(this.search, this);

    this.init = __bind(this.init, this);
    return ToursAPI.__super__.constructor.apply(this, arguments);
  }

  ToursAPI.prototype.init = function() {
    return this.loaderDescription = 'Идет поиск лучших авиабилетов и отелей<br>Это может занять от 5 до 30 секунд';
  };

  ToursAPI.prototype.search = function(url, cb) {
    return this.call(url, cb);
  };

  return ToursAPI;

})(API);

AviaAPI = (function(_super) {

  __extends(AviaAPI, _super);

  function AviaAPI() {
    this.search = __bind(this.search, this);

    this.init = __bind(this.init, this);
    return AviaAPI.__super__.constructor.apply(this, arguments);
  }

  AviaAPI.prototype.init = function() {
    return this.loaderDescription = 'Идет поиск лучших авиабилетов<br>Это может занять от 5 до 30 секунд';
  };

  AviaAPI.prototype.search = function(url, cb) {
    return this.call(url, cb);
  };

  return AviaAPI;

})(API);

HotelsAPI = (function(_super) {

  __extends(HotelsAPI, _super);

  function HotelsAPI() {
    this.search = __bind(this.search, this);

    this.init = __bind(this.init, this);
    return HotelsAPI.__super__.constructor.apply(this, arguments);
  }

  HotelsAPI.prototype.init = function() {
    return this.loaderDescription = 'Идет поиск лучших отелей<br>Это может занять от 5 до 30 секунд';
  };

  HotelsAPI.prototype.search = function(url, cb) {
    return this.call(url, cb);
  };

  return HotelsAPI;

})(API);

VisualLoader = (function() {

  function VisualLoader() {
    this.start = __bind(this.start, this);

    this.renew = __bind(this.renew, this);

    this.tooltipStep = __bind(this.tooltipStep, this);

    this.glowStep = __bind(this.glowStep, this);

    this.setPerc = __bind(this.setPerc, this);

    this.hide = __bind(this.hide, this);

    this.show = __bind(this.show, this);

    var _this = this;
    this.percents = ko.observable(0);
    this.separator = 90;
    this.separatedTime = ko.observable(30);
    this.timeoutHandler = null;
    this.glowState = false;
    this.glowHandler = null;
    this.tooltips = [];
    this.tooltips.push('Мы всегда показываем только финальную цену без скрытых платежей и комиссий');
    this.tooltips.push('При бронировании комплексных поездок (авиабилет плюс гостиница) мы даём скидку до 10%');
    this.tooltips.push('Наш сайт полностью отвечает международным требованиям безопасности платежных систем');
    this.tooltips.push('Воянга любит тебя сильнее чем твоя бабушка');
    this.tooltipInd = null;
    this.tooltipHandler = null;
    this.description = ko.observable('');
    this.description.subscribe(function(newVal) {
      return $('#loadWrapBg').find('#loadContentWin .text').html(newVal);
    });
    this.timeFromStart = 0;
  }

  VisualLoader.prototype.show = function() {
    return $('#loadWrapBg').show();
  };

  VisualLoader.prototype.hide = function() {
    $('#loadWrapBg').hide();
    if (this.glowHandler) {
      window.clearInterval(this.glowHandler);
      this.glowHandler = null;
    }
    if (this.tooltipHandler) {
      window.clearInterval(this.tooltipHandler);
      return this.tooltipHandler = null;
    }
  };

  VisualLoader.prototype.setPerc = function(perc) {
    var h;
    h = Math.ceil(156 - (perc / 100) * 156);
    $('#loadWrapBg').find('.procent .digit').html(perc);
    return $('#loadWrapBg').find('.layer03').height(h);
  };

  VisualLoader.prototype.glowStep = function() {
    if (this.glowState) {
      $('#loadWrapBg').find('.procent .symbol').addClass('glowMore');
    } else {
      $('#loadWrapBg').find('.procent .symbol').removeClass('glowMore');
    }
    return this.glowState = !this.glowState;
  };

  VisualLoader.prototype.tooltipStep = function() {
    var count, randInd, randVal;
    count = this.tooltips.length;
    randVal = Math.ceil(Math.random() * count);
    randInd = randVal % count;
    if (randInd === this.tooltipInd) {
      randInd = (randVal + 1) % count;
    }
    this.tooltipInd = randInd;
    return $('#loadWrapBg').find('.tips .text').html(this.tooltips[this.tooltipInd]);
  };

  VisualLoader.prototype.renew = function(percent) {
    var newPerc, rand, rtime,
      _this = this;
    this.percents(percent);
    this.setPerc(percent);
    if ((98 > percent && percent >= 0)) {
      rand = Math.random();
      if (percent < this.separator) {
        rtime = Math.ceil(rand * (this.separatedTime() / 15));
        if ((rand * (this.separatedTime() / 15)) < 1) {
          rand = 1 / (this.separatedTime() / 15);
        }
        newPerc = Math.ceil(rand * (this.separator / 15));
        if ((percent + newPerc) > this.separator) {
          newPerc = this.separator - percent;
        }
        if (newPerc > 3) {
          newPerc = newPerc + Math.ceil((newPerc / 20) * (Math.random() - 0.5));
        }
      } else {
        rtime = Math.ceil(rand * (this.separatedTime() / 3));
        newPerc = Math.ceil(Math.random() * 2);
      }
      this.timeFromStart += rtime;
      return this.timeoutHandler = window.setTimeout(function() {
        if ((percent + newPerc) > 100) {
          newPerc = 98 - percent;
        }
        return _this.renew(percent + newPerc);
      }, 1000 * rtime);
    } else if ((100 > percent && percent >= 98)) {
      return console.log('loadrer more 98');
    } else {
      if (this.timeoutHandler) {
        window.clearTimeout(this.timeoutHandler);
      }
      if (this.glowHandler) {
        window.clearInterval(this.glowHandler);
        this.glowHandler = null;
      }
      return this.timeoutHandler = null;
    }
  };

  VisualLoader.prototype.start = function(description, loadTime) {
    var _this = this;
    if (loadTime == null) {
      loadTime = 30;
    }
    this.separatedTime(loadTime);
    this.description(description);
    this.timeFromStart = 0;
    if (!this.glowHandler) {
      this.glowHandler = window.setInterval(function() {
        return _this.glowStep();
      }, 500);
    }
    if (!this.tooltipHandler) {
      this.tooltipHandler = window.setInterval(function() {
        return _this.tooltipStep();
      }, 10000);
    }
    this.show();
    this.renew(3);
    return this.tooltipStep();
  };

  return VisualLoader;

})();

window.VisualLoaderInstance = new VisualLoader;
