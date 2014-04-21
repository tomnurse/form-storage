# formStorage
**Temporarily store user input with the Web Storage API**

formStorage is a small set of functions aimed at making simple data capture and retrieval possible for simple HTML prototypes across multiple pages – especially those that are cached offline – through use of the WebStorage API.


## Usage
This script is designed to be dropped into an HTML file and configured with the minimum of fuss.

### Installation
Simply add a script tag to the pages where you wish to use formStorage. It will search for forms in the page and store data using the default settings when the form is submitted.

```html
<script src="/path/to/formStorage.js"></script>
```

There are also a series of [advanced configuration options](#advanced-configuration-options) for more granular control over how the data is handled.


### Using stored data
To retrieve data, add a ```data-name``` attribute containing the value of the input name from your form to the element that you wish to hold the data.

This method uses element.innerHTML to replace the element's content with the retrieved data, so the recommended usage is:

```html
<p>
	Some sort of descriptive text about the data, with the <span data-name="field-name">value replacing this text</span>.
</p>
```

## Advanced configuration options
All configurable options can be set as data attributes in your markup.

### WebStorage type
#### Saving data – Data storage type
Can be defined globally on the body tag, on a per-form basis on the form tag, or if you're feeling particularly detailed, on an individual input, select or text area tag. (default: sessionStorage)

**Attribute:** ```data-setStorage```

**Accepts:** 'local', 'localStorage', 'session', 'sessionStorage'.

```html
<form data-setStorage="localStorage">
	<input type="text" data-setStorage="session"> 
</form>
```


#### Retrieving data – Data storage type
Can be defined globally on the body tag, or on an element-by-element-basis. (default: sessionStorage)

If you have specified an alternative storage type for saving data, this needs to match.

**Attribute:** ```data-getStorage```

**Accepts:** 'local', 'localStorage', 'session', 'sessionStorage'.

```html
<p>
	<span data-name="field-name" data-setStorage="localStorage">Data appears here</span>
</p>
```


### Ignore individual field

Set on an individual form field

**Attribute:** ```data-ignoreField```

**Accepts:** 'true', 'yes'.

```html
<input type="text" data-ignoreField="true"> 
```

### Ignore a form's action

Set on a form-by-form basis (default: false)

**Attribute:** ```data-ignoreAction```

**Accepts:** 'true', 'yes', 'false', 'no'.

```html
<form action="action.html" data-ignoreAction="true">
</form>
```

### Replace password input data with asterisks

Any data entered into password inputs will be replaced by * characters by default. Mainly for debugging purposes/possible future extension with validation or similar, this option overrides this feature.

Set on a form-by-form basis (default: true)

**Attribute:** ```data-hidePasswords```

**Accepts:** 'true', 'yes', 'false', 'no'.

```html
<form action="action.html" data-hidePasswords="true">
</form>
```