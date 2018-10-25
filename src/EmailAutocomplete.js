'use strict'

function EmailAutocomplete (elem, options) {
  this.$field = $(elem)
  this.options = options

  // this will be calculated upon keyup
  this.fieldLeftOffset = null

  // wrap our field
  var $wrap = $('<div class="eac-input-wrap" />').css({
    position: this.$field.css('position') === 'static' ? 'relative' : this.$field.css('position'),
    fontSize: this.$field.css('fontSize')
  })
  this.$field.wrap($wrap)

  // create container to test width of current val
  this.$cval = $('<span class="eac-cval" />').css({
    visibility: 'hidden',
    position: 'absolute',
    display: 'inline-block',
    fontFamily: this.$field.css('fontFamily'),
    fontWeight: this.$field.css('fontWeight'),
    letterSpacing: this.$field.css('letterSpacing')
  }).insertAfter(this.$field)

  // create the suggestion overlay
  /* touchstart jquery 1.7+ */
  var heightPad = (this.$field.outerHeight(true) - this.$field.height()) / 2 // padding+border
  this.$suggOverlay = $('<span class="' + this.options.suggClass + '" />').css({
    display: 'block',
    'box-sizing': 'content-box', // standardize
    lineHeight: this.$field.css('lineHeight'),
    paddingTop: heightPad + 'px',
    paddingBottom: heightPad + 'px',
    fontFamily: this.$field.css('fontFamily'),
    fontWeight: this.$field.css('fontWeight'),
    letterSpacing: this.$field.css('letterSpacing'),
    position: 'absolute',
    top: 0,
    left: 0
  }).insertAfter(this.$field)

  // bind events and handlers
  this.$field.on('keyup.eac', $.proxy(this.displaySuggestion, this))

  this.$field.on('blur.eac', $.proxy(this.autocomplete, this))

  this.$field.on('keydown.eac', $.proxy(function (e) {
    if (e.which === 39 || e.which === 9) {
      this.autocomplete()
    }
  }, this))

  this.$suggOverlay.on('mousedown.eac touchstart.eac', $.proxy(this.autocomplete, this))
}

EmailAutocomplete.prototype = {
  suggest: function (str) {
    var strArr = str.split('@')
    if (strArr.length > 1) {
      str = strArr.pop()
      if (!str.length) {
        return ''
      }
    } else {
      return ''
    }

    var match = this.options.domains.filter(function (domain) {
      return domain.indexOf(str) === 0
    }).shift() || ''

    return match.replace(str, '')
  },

  autocomplete: function () {
    if (typeof this.suggestion === 'undefined' || this.suggestion.length < 1) {
      return false
    }
    this.$field.val(this.val + this.suggestion)
    this.$field.trigger('change')
    this.$suggOverlay.text('')
    this.$cval.text('')
  },

  /**
   * Displays the suggestion, handler for field keyup event
   */
  displaySuggestion: function (e) {
    this.val = this.$field.val()
    this.suggestion = this.suggest(this.val)

    if (!this.suggestion.length) {
      this.$suggOverlay.text('')
    } else {
      e.preventDefault()
    }

    // update with new suggestion
    this.$suggOverlay.text(this.suggestion)
    this.$cval.text(this.val)

    //  get input padding, border and margin to offset text
    if (this.fieldLeftOffset === null) {
      this.fieldLeftOffset = (this.$field.outerWidth(true) - this.$field.width()) / 2
    }

    // find width of current input val so we can offset the suggestion text
    var cvalWidth = this.$cval.width()

    if (this.$field.outerWidth() > cvalWidth) {
      // offset our suggestion container
      this.$suggOverlay.css('left', this.fieldLeftOffset + cvalWidth + 'px')
    }
  }
}

export default EmailAutocomplete
