'use strict'

export default class EmailAutocomplete {
  constructor (elem, options) {
    this.$field = elem
    this.options = options

    // wrapper
    const $wrap = document.createElement('div')
    $wrap.className = 'eac-input-wrap'

    const fieldStyle = getComputedStyle(this.$field)
    $wrap.style.position = fieldStyle.position === 'static' ? 'relative' : fieldStyle.position
    $wrap.style.fontSize = fieldStyle.fontSize

    this.$field.parentNode.insertBefore($wrap, this.$field)
    $wrap.appendChild(this.$field)

    // Current value container: used to calculate width of content and shift suggestion
    this.$currentVal = document.createElement('span')
    this.$currentVal.className = 'eac-currentVal'

    const currentValStyles = `
      visibility: hidden;
      position: absolute;
      display: inline-block;
      font-family: ${fieldStyle.fontFamily};
      font-weight: ${fieldStyle.fontWeight};
      letter-spacing: ${fieldStyle.letterSpacing};
    `

    this.$currentVal.style = currentValStyles

    $wrap.appendChild(this.$currentVal)

    // Suggestion container
    const heightPad = parseInt(getComputedStyle(this.$field).borderWidth) + parseInt(getComputedStyle(this.$field).padding)

    this.$suggestionOverlay = document.createElement('span')
    this.$suggestionOverlay.className = this.options.suggClass

    const suggestionOverlayStyles = `
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
    this.$suggestionOverlay.style = suggestionOverlayStyles
    $wrap.appendChild(this.$suggestionOverlay)

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
    this.$suggestionOverlay.addEventListener('mousedown.eac touchstart.eac', this.autocomplete)
  }

  suggest = (str) => {
    const strArr = str.split('@')
    const domainHint = strArr.length > 1 && strArr[1] !== '' ? strArr[1] : undefined

    const match = this.options.domains.filter(function (domain) {
      return domain.indexOf(domainHint) === 0
    }).shift() || ''

    return match.replace(domainHint, '')
  }

  autocomplete = () => {
    if (typeof this.suggestion === 'undefined' || this.suggestion.length < 1) {
      return false
    }

    this.$field.value = (this.$field.value + this.suggestion)
    this.$field.dispatchEvent(new Event('change'))
    this.$suggestionOverlay.innerHTML = ''
    this.$currentVal.innerHTML = ''
  }

  /**
   * Displays the suggestion, handler for field keyup event
   */
  displaySuggestion = e => {
    this.val = this.$field.value
    this.suggestion = this.suggest(this.val)

    if (!this.suggestion.length) {
      this.$suggestionOverlay.innerHTML = ''
    } else {
      e.preventDefault()
    }

    // update with new suggestion
    this.$suggestionOverlay.innerHTML = this.suggestion
    this.$currentVal.innerHTML = this.val

    //  get input padding, border and margin to offset text
    function outerWidth (el) {
      var width = el.offsetWidth
      var style = getComputedStyle(el)

      width += parseInt(style.marginLeft) + parseInt(style.marginRight);
      return width
    }

    const fieldLeftOffset = (outerWidth(this.$field) - this.$field.offsetWidth) / 2

    // find width of current input val so we can offset the suggestion text
    const currentValWidth = this.$currentVal.offsetWidth

    if (this.$field.offsetWidth > currentValWidth) {
      // offset our suggestion container
      this.$suggestionOverlay.style.left = `${fieldLeftOffset + currentValWidth}px`
    }
  }
}
