(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.emailautocomplete = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var EmailAutocomplete = function EmailAutocomplete(elem, options) {
    var _this = this;

    _classCallCheck(this, EmailAutocomplete);

    _defineProperty(this, "suggest", function (str) {
      var _str$split = str.split('@'),
          _str$split2 = _slicedToArray(_str$split, 2),
          domainHint = _str$split2[1];

      var match = _this.options.domains.filter(function (domain) {
        return domain.indexOf(domainHint) === 0;
      }).shift() || '';
      return match.replace(domainHint, '');
    });

    _defineProperty(this, "autocomplete", function () {
      if (typeof _this.suggestion === 'undefined' || _this.suggestion.length < 1) {
        return false;
      }

      _this.$field.value = _this.$field.value + _this.suggestion;

      _this.$field.dispatchEvent(new Event('change'));

      _this.$suggestionOverlay.innerHTML = '';
      _this.$currentVal.innerHTML = '';
      _this.suggestion = '';
    });

    _defineProperty(this, "displaySuggestion", function (e) {
      e.preventDefault();
      var val = _this.$field.value;
      _this.suggestion = _this.suggest(val);
      _this.$suggestionOverlay.innerHTML = ''; // update with new suggestion

      _this.$suggestionOverlay.innerHTML = _this.suggestion;
      _this.$currentVal.innerHTML = val; // add padding, border, margin to have the offset of the text in the input field

      var fieldLeftOffset = parseInt(_this.fieldStyle.borderLeftWidth) + parseInt(_this.fieldStyle.paddingLeft) + parseInt(_this.fieldStyle.marginLeft); // find width of current input val so we can offset the suggestion text

      var currentValWidth = _this.$currentVal.offsetWidth;

      if (_this.$field.offsetWidth > currentValWidth) {
        // offset our suggestion container
        _this.$suggestionOverlay.style.left = "".concat(fieldLeftOffset + currentValWidth, "px");
      }
    });

    this.$field = elem;
    this.options = options;
    this.suggestion = '';
    this.fieldStyle = getComputedStyle(this.$field); // wrapper

    var $wrap = document.createElement('div');
    $wrap.className = 'eac-input-wrap';
    $wrap.style.position = this.fieldStyle.position === 'static' ? 'relative' : this.fieldStyle.position;
    $wrap.style.fontSize = this.fieldStyle.fontSize;
    this.$field.parentNode.insertBefore($wrap, this.$field);
    $wrap.appendChild(this.$field); // Current value container: used to calculate width of content and shift suggestion

    this.$currentVal = document.createElement('span');
    this.$currentVal.className = 'eac-currentVal';
    var currentValStyles = "visibility:hidden;" + "position:absolute;" + "display:inline-block;" + "font-family:" + this.fieldStyle.fontFamily + ";" + "font-weight:" + this.fieldStyle.fontWeight + ";" + "letter-spacing:" + this.fieldStyle.letterSpacing + ";";
    this.$currentVal.style = currentValStyles;
    $wrap.appendChild(this.$currentVal); // Suggestion container

    var heightPad = parseInt(this.fieldStyle.borderTopWidth) + parseInt(this.fieldStyle.paddingTop);
    this.$suggestionOverlay = document.createElement('span');
    this.$suggestionOverlay.className = this.options.suggClass;
    var suggestionOverlayStyles = "display:block;" + "box-sizing:content-box;" + "line-height:" + this.fieldStyle.lineHeight + ";" + "padding-top:" + heightPad + "px;" + "padding-bottom:" + heightPad + "px;" + "font-family:" + this.fieldStyle.fontFamily + ";" + "font-weight:" + this.fieldStyle.fontWeight + ";" + "letter-spacing:" + this.fieldStyle.letterSpacing + ";" + "position:absolute;" + "top:0;" + "left:0;";
    this.$suggestionOverlay.style = suggestionOverlayStyles;
    $wrap.appendChild(this.$suggestionOverlay); // bind events and handlers

    this.$field.addEventListener('keyup', this.displaySuggestion);
    this.$field.addEventListener('blur', this.autocomplete);
    this.$field.addEventListener('keydown.eac', function (e) {
      if (e.key === 39 || e.key === 9) {
        _this.autocomplete();
      }
    }); // trouver une solution pour touchstart

    this.$suggestionOverlay.addEventListener('mousedown.eac touchstart.eac', this.autocomplete);
  };

  var defaults = {
    suggClass: 'eac-sugg',
    domains: ['yahoo.com', 'hotmail.com', 'gmail.com', 'me.com', 'aol.com', 'mac.com', 'live.com', 'comcast.net', 'googlemail.com', 'msn.com', 'hotmail.co.uk', 'yahoo.co.uk', 'facebook.com', 'verizon.net', 'sbcglobal.net', 'att.net', 'gmx.com', 'outlook.com', 'icloud.com']
  };
  function emailautocomplete(elem, options) {
    return new EmailAutocomplete(elem, {
      domains: [].concat(_toConsumableArray(options.domains), _toConsumableArray(defaults.domains)),
      suggClass: options.suggClass ? options.suggClass : defaults.suggClass
    });
  }

  return emailautocomplete;

})));
