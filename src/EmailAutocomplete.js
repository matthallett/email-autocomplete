'use strict'

export default class EmailAutocomplete {
  constructor (elem, options) {
    this.$field = elem
    this.options = options

    // this will be calculated upon keyup
    this.fieldLeftOffset = null

    // wrap our field
    const $wrap = document.createElement('div')
    $wrap.className = 'eac-input-wrap'

    const fieldStyle = getComputedStyle(this.$field)
    $wrap.style.position = fieldStyle.position === 'static' ? 'relative' : fieldStyle.position
    $wrap.style.fontSize = fieldStyle.fontSize

    this.$field.parentNode.insertBefore($wrap, this.$field)
    $wrap.appendChild(this.$field)

    // create container to test width of current val
    this.$cval = document.createElement('span')
    this.$cval.className = 'eac-cval'

    const cvalStyles = `
      visibility: hidden;
      position: absolute;
      display: inline-block;
      font-family: ${fieldStyle.fontFamily};
      font-weight: ${fieldStyle.fontWeight};
      letter-spacing: ${fieldStyle.letterSpacing};
    `

    this.$cval.style = cvalStyles

    $wrap.appendChild(this.$cval)

    // create the suggestion overlay
    /* touchstart jquery 1.7+ */
    const heightPad = parseInt(getComputedStyle(this.$field).borderWidth) + parseInt(getComputedStyle(this.$field).padding)

    this.$suggOverlay = document.createElement('span')
    this.$suggOverlay.className = this.options.suggClass

    const suggOverlayStyles = `
      display: block;
      box-sizing: content-box;
      line-height: ${fieldStyle.lineHeight};
      padding-top: ${heightPad}px;
      padding-bottom: ${heightPad}px;
      padding-left: ${heightPad}px;
      font-family: ${fieldStyle.fontFamily};
      font-weight: ${fieldStyle.fontWeight};
      letter-spacing: ${fieldStyle.letterSpacing};
      position: absolute;
      top: 0;
      left: 0;
    `
    this.$suggOverlay.style = suggOverlayStyles
    $wrap.appendChild(this.$suggOverlay)

    // bind events and handlers
    this.$field.addEventListener('keyup', this.displaySuggestion)

    this.$field.addEventListener('blur', this.autocomplete)

    const checkKey = function (e) {
      if (e.key === 39 || e.key === 9) {
        this.autocomplete()
      }
    }
    this.$field.addEventListener('keydown.eac', checkKey)

    // trouver une solution pour touchstart
    this.$suggOverlay.addEventListener('mousedown.eac touchstart.eac', this.autocomplete)
  }

  suggest = (str) => {
    const strArr = str.split('@')
    if (strArr.length > 1) {
      str = strArr.pop()
      if (!str.length) {
        return ''
      }
    } else {
      return ''
    }

    const match = this.options.domains.filter(function (domain) {
      return domain.indexOf(str) === 0
    }).shift() || ''

    return match.replace(str, '')
  }

  autocomplete = () => {
    if (typeof this.suggestion === 'undefined' || this.suggestion.length < 1) {
      return false
    }

    this.$field.value = (this.$field.value + this.suggestion)
    this.$field.dispatchEvent(new Event('change'))
    this.$suggOverlay.innerHTML = ''
    this.$cval.innerHTML = ''
  }

  /**
   * Displays the suggestion, handler for field keyup event
   */
  displaySuggestion = e => {
    console.log('display suggestion')
    this.val = this.$field.value
    this.suggestion = this.suggest(this.val)

    if (!this.suggestion.length) {
      this.$suggOverlay.innerHTML = ''
    } else {
      e.preventDefault()
    }

    // update with new suggestion
    this.$suggOverlay.innerHTML = this.suggestion
    this.$cval.innerHTML = this.val

    //  get input padding, border and margin to offset text
    function outerWidth (el) {
      var width = el.offsetWidth
      var style = getComputedStyle(el)

      width += parseInt(style.marginLeft) + parseInt(style.marginRight);
      return width
    }

    if (this.fieldLeftOffset === null) {
      this.fieldLeftOffset = (outerWidth(this.$field) - this.$field.offsetWidth) / 2
    }

    // find width of current input val so we can offset the suggestion text
    const cvalWidth = this.$cval.offsetWidth

    if (this.$field.offsetWidth > cvalWidth) {
      // offset our suggestion container
      this.$suggOverlay.style.left = `${this.fieldLeftOffset + cvalWidth}px`
    }
  }
}
