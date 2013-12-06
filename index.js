var Validator, moment, validator;

moment = require('moment');

validator = require('validator');

Validator = (function() {
  function Validator(fields) {
    this.setFields(fields);
    this.errors = [];
  }

  Validator.prototype.toSnakeCase = function(field) {
    return field.replace(/([A-Z])/g, function($1) {
      return "_" + ($1.toLowerCase());
    });
  };

  Validator.prototype.setFields = function(fields) {
    var field, value, _results;
    this.fields = [];
    _results = [];
    for (field in fields) {
      value = fields[field];
      field = this.toSnakeCase(field);
      _results.push(this.fields[field] = value);
    }
    return _results;
  };

  Validator.prototype.setValues = function(values) {
    this.values = values;
  };

  Validator.prototype.getErrors = function() {
    return this.errors;
  };

  Validator.prototype.checkRequired = function(field) {
    var value;
    value = this.values[field];
    if (value == null) {
      return this.errors.push("Field '" + field + "' is required.");
    }
  };

  Validator.prototype.checkIsoDate = function(field) {
    var value;
    value = this.values[field];
    if ((value != null) && !moment(value).isValid()) {
      return this.errors.push("Field '" + field + "' is not a valid ISO date.");
    }
  };

  Validator.prototype.checkUrl = function(field) {
    var e, value;
    value = this.values[field];
    try {
      return validator.check(value).isUrl();
    } catch (_error) {
      e = _error;
      return "Field '" + field + "' is not a valid URL.";
    }
  };

  Validator.prototype.validate = function() {
    var field, fieldRules, rule, _ref, _results;
    _ref = this.fields;
    _results = [];
    for (field in _ref) {
      fieldRules = _ref[field];
      if (fieldRules === null) {
        continue;
      }
      if (!Array.isArray(fieldRules)) {
        fieldRules = [fieldRules];
      }
      _results.push((function() {
        var _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = fieldRules.length; _i < _len; _i++) {
          rule = fieldRules[_i];
          switch (rule) {
            case 'required':
              _results1.push(this.checkRequired(field));
              break;
            case 'isoDate':
              _results1.push(this.checkIsoDate(field));
              break;
            case 'url':
              _results1.push(this.checkUrl(field));
              break;
            default:
              _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Validator.prototype.isValid = function() {
    this.validate();
    return this.errors.length === 0;
  };

  Validator.prototype.getFilteredValues = function() {
    var field, params, values, _i, _len;
    params = Object.keys(this.values);
    values = {};
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      field = params[_i];
      if (this.values[field] != null) {
        values[field] = this.values[field];
      }
    }
    return values;
  };

  return Validator;

})();

module.exports = Validator;
