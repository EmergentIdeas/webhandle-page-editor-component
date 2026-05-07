# @webhandle/page-editor

Edit portions of a page

## Install

```bash
npm install @webhandle/page-editor
```

## Initialization
```js
import pageEditorSetup from "@webhandle/page-editor/initialize-webhandle-component.mjs"
let pageEditorManager = await pageEditorSetup(webhandle)
```


## Configuration

You can add the following structure to your configuration file:

```json
{
	"@webhandle/page-editor": {
		"publicFilesPrefix": "/@webhandle/page-editor/files"
		, "authorization": createRequireGroupMembership("administrators")
		, "alwaysProvideResources": false
	}
}
```

However, authorization works a little bit differently. By default, only users from the
"administrators" group are allowed to access the interface. This can be change like:

```js
	pageEditorManager.config.authorization = (req, res, next) => {
		next()
	}
```

The above code would allow anybody to access the screens.

## Usage

Turn on page editing for a page by doing: 

```html
__::@webhandle/page-editor/addExternalResources__
```
