// Generated by CoffeeScript 1.4.0
var GRAMMAR, PEG, export_;

GRAMMAR = "start = tour\n\ntour = dests:DESTINATIONS 'rooms/' rooms:ROOMS kv:KEYVALUES {\n  return {\n    start: dests.start,\n    destinations: dests.destinations,\n    rooms: rooms,\n    extra: kv\n  }\n}\n\nDESTINATIONS = start:START_FROM destinations:DESTINATION+ {\n  return {start: start, destinations: destinations};\n}\n\nSTART_FROM = from:IATA '/' rt:RT '/'\n{  return {\n      from: from,\n      return: rt,\n  }\n}\n\nDESTINATION =  to:IATA '/' fromDate:DATE '/' toDate:DATE '/'\n{\n  return {\n      to: to,\n      dateFrom: fromDate,\n      dateTo: toDate,\n  }\n}\n  \nIATA\n = code:[A-Z0-9]+ { return code.join(\"\") }\n\nRT\n = [01]\n\nDATE\n = d:DAY '.' m:MONTH '.' y:YEAR {return new Date(y, m - 1,d)}\n\nDAY\n = digits:[0-9]+ {return parseInt(digits.join(\"\")) }\n\nMONTH\n = digits:[0-9]+ {return parseInt(digits.join(\"\")) }\n\nYEAR\n = digits:[0-9]+ {return parseInt(digits.join(\"\")) }\n\nROOMS \n = ROOM+\n\nROOM\n = adults:[1-9] ':' children:[0-9] ':' infants:[0-9] ages:AGES '/'  {\n  return {\n    adults: parseInt(adults),\n    children: parseInt(children),\n    infants: parseInt(infants),\n    ages:ages\n  }\n}\n\nAGES = (':' age:[0-9]+ {return parseInt(age.join(\"\"))})*\n\nKEYVALUES = (KEYVALUE)*\n\n// FIXME '/' should not be optional\nKEYVALUE = key:[^/]+ '/' val:[^/]+ '/'? { return {key: key.join(\"\"), value: val.join(\"\")} }\n";

if (typeof module !== "undefined" && module !== null) {
  PEG = require('pegjs');
  export_ = module.exports;
} else {
  export_ = window;
}

export_.GRAMMAR = GRAMMAR;

export_.PEGHashParser = PEG.buildParser(GRAMMAR);
