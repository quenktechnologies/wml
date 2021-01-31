Widget Markup Language
=====================

# Introduction

The Widget Markup Language (WML) is a DSL for describing user interfaces in 
web applications.

It is the main templating language used by [Quenk Technologies](https://quenk.com).
WML is meant to be a straightforward alternative to using the DOM constructor 
functions directly. It also adds syntax for loops, conditionals and user defined 
elements (not custom elements) referred to as "widgets".

Widgets are created from JavaScript objects referred to as components. The
language provides syntax for their construction in views. A view is the main
output of a WML file and is a grouping of one or more DOM nodes or widgets
in a tree like fashion, that serves as a template for creating content.

A WML file is intended to be compiled to a [TypeScript](https://www.typescriptlang.org).

## Installation

Installing the wml module gives the library files as well as an executable for
converting wml files into typescript.

```sh
npm install --save-dev @quenk/wml
```

This will make the `wmlc` executable available.

## Usage

The `wmlc` executable, given a path, will convert all `*.wml` files underneath
it into typescript.

### Writing WML

The example below demonstrates a view called "Main" which when converted to
typescript will produce a class called "Main" that takes a "MainContext" as its
sole constructor argument.

```wml
{% import (Panel) from "@quenk/wml-widgets/lib/layout/panel" %}
{% import (PanelHeader) from "@quenk/wml-widgets/lib/layout/panel" %}
{% import (PanelBody) from "@quenk/wml-widgets/lib/layout/panel" %}

{% view Main (MainContext) %}
<Panel>

    <PanelHeader><span>{{@title}}</span></PanelHeader>

    <PanelBody>

      This is the panel body.

    </PanelBody>

</Panel>

```

In this view, the root wml element is a widget called `Panel` which forms the 
root of our tree. In wml, capitalization is to indicate a widget constructor
and lowercase is used to indicate a DOM node constructor.

For more details on syntax, consult the [spec.md](spec.md) file.

## License

Apache-2.0 (c) Quenk Technologies Limited 2021
