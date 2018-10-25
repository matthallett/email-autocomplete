
import $ from 'jquery'
import EmailAutocomplete from './EmailAutocomplete'

var pluginName = 'emailautocomplete'
var defaults = {
  suggClass: 'eac-sugg',
  domains: [
    'yahoo.com',
    'hotmail.com',
    'gmail.com',
    'me.com',
    'aol.com',
    'mac.com',
    'live.com',
    'comcast.net',
    'googlemail.com',
    'msn.com',
    'hotmail.co.uk',
    'yahoo.co.uk',
    'facebook.com',
    'verizon.net',
    'sbcglobal.net',
    'att.net',
    'gmx.com',
    'outlook.com',
    'icloud.com'
  ]
}

$.fn[pluginName] = function (options) {
  return this.each(function () {
    if (!$.data(this, pluginName)) {
      $.data(this, pluginName, new EmailAutocomplete(this, {
        ...options,
        ...defaults
      }))
    }
  })
}

export default $
