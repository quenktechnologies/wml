Widget Markup Language
=====================

# Introduction

The Widget Markup Language (WML) is an XML like syntax for listing the 
components of a user interface.

WML is meant to be a simple alternative to using the DOM's  
`document.createElement()` API manually. It provides support for features such
as:
1. Node construction.
2. Component construction.
3. Attribute assignment (including simple expressions).
4. Fragments.
5. Static typing.

WML has a concept of elements. An element is either an instance of the DOM's
[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) interface or an
instance of user defined component.

## Installation

```sh
npm install --save @quenk/wml
```

This will install the `wmlc` executable at `./node_modules/.bin/wmlc`.

## Usage

The `wmlc` executable, given a path will convert all `*.wml` files into
their typescript equivalent.

### Writing WML

```wml

{% import (Panel) from "@quenk/wml-widgets/lib/layout/panel" %}
{% import (PanelHeader) from "@quenk/wml-widgets/lib/layout/panel" %}
{% import (PanelBody) from "@quenk/wml-widgets/lib/layout/panel" %}

{% view Main (Object) %}
<Panel>

    <PanelHeader>{{@title}}</PanelHeader>

    <PanelBody>

      This is the panel body.

    </PanelBody>

</Panel>

```

Documentation is a work in progress. Consult the `spec.md` file or take
a look at [WML Widgets](https://developer.mozilla.org/en-US/docs/Web/API/Node)
for examples.

## License

Quenk Technologies (c) Apache-2.0
