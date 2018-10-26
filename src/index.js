
import EmailAutocomplete from './EmailAutocomplete'

const defaults = {
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

export default function emailautocomplete (elem, options) {
  return new EmailAutocomplete(elem, {
    domains: [...options.domains, ...defaults.domains],
    suggClass: options.suggClass ? options.suggClass : defaults.suggClass
  })
}
