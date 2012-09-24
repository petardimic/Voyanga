// Generated by CoffeeScript 1.3.3

ko.bindingHandlers.autocomplete = {
  init: function(element, valueAccessor) {
    $(element).bind("focus", function() {
      return $(element).change();
    });
    $(element).autocomplete({
      serviceUrl: "http://api.voyanga.com/v1/helper/autocomplete/" + valueAccessor().source,
      minChars: 2,
      delimiter: /(,|;)\s*/,
      maxHeight: 400,
      zIndex: 9999,
      deferRequestBy: 0,
      delay: 0,
      onSelect: function(value, data) {
        valueAccessor().iata(data.code);
        valueAccessor().readable(data.name);
        valueAccessor().readableGen(data.nameGen);
        valueAccessor().readableAcc(data.nameAcc);
        $(element).val(data.name);
        return $(element).siblings('input.input-path').val(value);
      },
      onActivate: function(value, data) {
        valueAccessor().iata(data.code);
        valueAccessor().readable(data.name);
        valueAccessor().readableGen(data.nameGen);
        valueAccessor().readableAcc(data.nameAcc);
        $(element).val(data.name);
        return $(element).siblings('input.input-path').val(value);
      }
    });
    return $(element).on("keyup", function() {
      if ($(element).val() === '') {
        valueAccessor().iata('');
        valueAccessor().readable('');
        valueAccessor().readableGen('');
        return valueAccessor().readableAcc('');
      }
    });
  },
  update: function(element, valueAccessor) {
    console.log($(element).val());
    return console.log(valueAccessor().iata());
  }
};