// Generated by CoffeeScript 1.3.3
var TourPanel, TourPanelSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TourPanelSet = (function() {

  function TourPanelSet() {
    this.addPanel = __bind(this.addPanel, this);

    this.isLast = __bind(this.isLast, this);

    this.isFirst = __bind(this.isFirst, this);
    window.voyanga_debug('Init of TourPanelSet');
    this.sp = new TourSearchParams();
    this.startCity = this.sp.startCity;
    this.startCityReadable = ko.observable('');
    this.startCityReadableGen = ko.observable('');
    this.startCityReadableAcc = ko.observable('');
    this.panels = ko.observableArray([new TourPanel(this.sp, 0)]);
    this.i = 0;
  }

  TourPanelSet.prototype.isFirst = function() {
    return this.i++ === 0;
  };

  TourPanelSet.prototype.isLast = function() {
    return (this.i + 1) === this.panels.length;
  };

  TourPanelSet.prototype.addPanel = function() {
    return this.panels.push(new TourPanel(this.sp, this.i));
  };

  return TourPanelSet;

})();

TourPanel = (function(_super) {

  __extends(TourPanel, _super);

  function TourPanel(sp, ind) {
    this.setDate = __bind(this.setDate, this);

    var _this = this;
    this.template = 'tour-panel-template';
    window.voyanga_debug("TourPanel created");
    TourPanel.__super__.constructor.call(this);
    this.rooms = sp.rooms;
    this.roomsView = ko.computed(function() {
      var current, item, result, _i, _len, _ref;
      result = [];
      current = [];
      _ref = _this.rooms();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (current.length === 2) {
          result.push(current);
        }
        current = [];
        current.push(item);
        result.push(current);
      }
      return result;
    });
    this.calendarHidden = true;
    this.afterRender = function() {
      return $(function() {
        return _this.rooms()[0].afterRender();
      });
    };
    this.addRoom = function() {
      if (_this.rooms().length === 4) {
        return;
      }
      return _this.rooms.push(new Roomers());
    };
    this.city = sp.destinations()[0].city;
    this.cityReadable = ko.observable('');
    this.cityReadableGen = ko.observable('');
    this.cityReadableAcc = ko.observable('');
    this.oldCalendarState = this.minimizedCalendar();
    this.calendarValue = ko.computed(function() {
      return {
        twoSelect: false,
        from: false
      };
    });
    this.formFilled = ko.computed(function() {
      var result;
      result = _this.startCity;
      return result;
    });
    this.maximizedCalendar = ko.computed(function() {
      return _this.city().length > 0;
    });
    this.calendarText = ko.computed(function() {
      var result;
      result = "Выберите дату поездки ";
      return result;
    });
  }

  TourPanel.prototype.setDate = function(values) {
    if (values.length) {
      return this.departureDate(values[0]);
    }
  };

  TourPanel.prototype.navigateToNewSearch = function() {
    this.handlePanelSubmit();
    return this.minimizedCalendar(true);
  };

  TourPanel.prototype.close = function() {
    $(document.body).unbind('mousedown');
    $('.how-many-man .btn').removeClass('active');
    $('.how-many-man .content').removeClass('active');
    return $('.how-many-man').find('.popup').removeClass('active');
  };

  TourPanel.prototype.showFromCityInput = function(panel, event) {
    var el, elem;
    elem = $('.cityStart .second-path');
    elem.data('old', elem.val());
    el = elem.closest('.tdCity');
    el.find(".from").addClass("overflow").animate({
      width: "125px"
    }, 300);
    el.find(".startInputTo").show();
    return el.find('.cityStart').animate({
      width: "261px"
    }, 300, function() {
      return el.find(".startInputTo").find("input").focus().select();
    });
  };

  TourPanel.prototype.hideFromCityInput = function(panel, event) {
    var elem;
    elem = $('.from.active .second-path');
    if (elem.parent().hasClass("overflow")) {
      elem.parent().animate({
        width: "271px"
      }, 300, function() {
        return $(this).removeClass("overflow");
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
