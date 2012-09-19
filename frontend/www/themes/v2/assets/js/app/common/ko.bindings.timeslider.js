
ko.bindingHandlers.timeSlider = {
  init: function(element, valueAccessor) {
    var limits, value;
    value = ko.utils.unwrapObservable(valueAccessor().selection);
    limits = ko.utils.unwrapObservable(valueAccessor().limits);
    limits.from -= 15;
    if (limits.from < 0) {
      limits.from = 0;
    }
    limits.to += 15;
    console.log(limits.to);
    if (limits.to > 1440) {
      limits.to = 1440;
    }
    if (!Utils.inRange(value.from, limits)) {
      value.from = limits.from;
    }
    if (!Utils.inRange(value.to, limits)) {
      value.to = limits.to;
    }
    $(element).val(value.from + ';' + value.to);
    return $(element).slider({
      from: limits.from,
      to: limits.to,
      step: 15,
      dimension: '',
      skin: 'round_voyanga',
      scale: false,
      limits: false,
      minInterval: 60,
      calculate: function(value) {
        var hours, mins;
        hours = Math.floor(value / 60);
        mins = value - hours * 60;
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (mins === 0) {
          mins = "00";
        }
        return hours + ':' + mins;
      },
      callback: function(newValue) {
        return valueAccessor().selection(newValue);
      }
    });
  },
  update: function(element, valueAccessor) {
    var s;
    s = $(element).data("jslider");
    return setTimeout(function() {
      return s.onresize();
    }, 5);
  }
};
