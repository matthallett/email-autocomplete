# js-email-autocomplete

> NPM package that suggests and autocompletes the domain whenever your users type in an email address field.

## What does it do?

When your user types in "user@gm", the plugin will suggest for e.g. "user@gmail.com", based on the first result from a list of predefined email domains.

![diagram](https://raw.github.com/10w042/email-autocomplete/master/doc_assets/example.png)

Press the tab-key, or simply click on the suggestion to automatically fill in the rest of the domain. (or tap on the suggestion for mobile users.)

You can also use the right arrow key.

## Installation

**Download**

```
npm install js-email-autocomplete
```

## Usage

`emailautocomplete({domains<String[]>, suggClass<String>})`

`domains` : Array de string specifying specific domain that will be added on top of the default list. (default)
`suggClass` : classname used to style the domain suggestion (default: `eac-sugg`)

```html
<input id="targetField" type="email" placeholder="Enter email">
```

```js
const elem = document.getElementById('targetField')
emailautocomplete(elem, {
  domains: ["example.com"], //add your own specific domains to top of default list
  suggClass: 'eac-suggestion' //add your own class
});
```

## Domains

These are the plugin default domains.

* gmail.com
* googlemail.com
* yahoo.com
* yahoo.co.uk
* hotmail.com
* hotmail.co.uk
* live.com
* msn.com
* comcast.net
* sbcglobal.net
* verizon.net
* facebook.com
* outlook.com
* att.net
* gmx.com
* icloud.com
* me.com
* mac.com
* aol.com

## Author

- Martin Petit


## Known Issues

* On Android stock browser, if "Settings > Accessibility > Scale text up and down" value is not at 100%, the text width will be calculated incorrectly.
