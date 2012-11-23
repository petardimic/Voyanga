// Generated by CoffeeScript 1.3.3
var ErrorPopup,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ErrorPopup = (function(_super) {

  __extends(ErrorPopup, _super);

  function ErrorPopup(code, message) {
    var id;
    if (message == null) {
      message = false;
    }
    this.close = __bind(this.close, this);

    id = 'errorpopup-' + code;
    ErrorPopup.__super__.constructor.call(this, '#' + id, message, true);
    ko.processAllDeferredBindingUpdates();
    SizeBox(id);
    ResizeBox(id);
  }

  ErrorPopup.prototype.close = function() {
    ErrorPopup.__super__.close.apply(this, arguments);
    return window.app.navigate(window.app.activeModule(), {
      trigger: true
    });
  };

  return ErrorPopup;

})(GenericPopup);
