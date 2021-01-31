
Widget Markup Language Specification
====================================

# Introduction

The Widget Markup Language (WML) is an XML like syntax for describing the 
components of a user interface.

WML is meant to be a simple alternative to using the DOM's constructor functions
directly.

It provides support for features such as:
1. Node construction.
2. Widget (Component) construction.
3. Attribute assignment (including simple expressions).
4. Fragments.
5. Static typing.

The first iteration of the  WML compiler compiled to ECMAScript directly. Since
then, the need for stronger typing became more apparent in order to escape the
dreaded "x is not a function" type of errors.

As a result, WML syntax was redesigned to be more compatible with TypeScript 
extensions.

## Definitions

### Target, Target Code

Refers to the output language of a WML compiler. Typically Typescript.

### View

A view is tree-like hierarchy of 1 or more WML elements that can be used to
produced DOM content.

### Fun

Fun (short for function) given zero or more arguments, provides one or more
trees of elements. This is used to avoid repetitive blocks of WML code.

### Element (WML)

A WML element refers to valid syntax occurring between angle brackets "<,>" that
is either a widget (when the first letter is uppercase) or a DOM node.

### Widget

A widget is a custom user defined element backed by an appropriate JavaScript
implementation. They are used to create dynamic and flexible DOM content.

### DOM Node

A DOM Node has the same meaning as the DOM specification.

### Content

Content is the output a widget produces for inclusion into the browser's 
document. It is more or less a DOM node.

### Context

A context is a record like data structure from which a view can source values
from. These values are accessed by prefixing them with an `@` in expressions.

A context can be described in the target language and imported to a WML module 
or can be described via a contract statement.

### Modules 

A WML module is a single file that contains a combination of imports, fun and/or
view statements.

# Writing WML

## Encoding

A WML file must be utf-8 encoded. 

## Imports

Imports allow one or more identifiers to be made available within the context
of a WML module. Imported identifiers represent compiled objects from target 
code and WML objects. 

A WML file cannot be imported into another WML file without first being compiled.

### Syntax

```ebnf

 import 
        : member_import
        | qualified_import
        ;

  member_import
        : '{%' 'import' '(' import_list ')' 'from' module '%}'
        ;

  qualified_import
        : '{%' 'import' '*' 'as' identifier 'from' module '%}'
        ;

  import_list
        : identifier+
        ;

  module
        : STRING_LITERAL
        ;

```

### Notes

1) A `member_import` is compiled to the corresponding ECMAScript
   syntax.

2) A `qualified_import` is complied to the corresponding ECMAScript
   qualified import.

3) Imports do NOT support identifier aliasing.

## Context Statement

The context statement allows a context to be described in wml. Context statements
are compiled to interfaces in the target language.

###  Syntax

```ebnf

context
       : '{%' 'context' identifier ( '[' type_parameter+ ']' ) ? 
              (member_declaration+) ?
         '%}'
       ;
```

The directive begins with the opening '{%' followed by the keyword 'context'.
The name of the context type is next, followed by an optional list of generic
type parameters, member declarations and finally the closing '%}'.

The context statement has no children and is defined completely within the '{%'
and '%}'.

Example Context:

```wml
{% context Panel 
  
   id : String
   
   header.title : String

   body.content : String

   onClick: e:Event => Void

%}

```

When compiled, the compiler MUST represent a context in a format that will 
retain its meaning if it was defined in the target language instead. The
same structure describe in wml, MUST be interchangable with the same structure
described in the target language.

## Funs

A `fun` declaration declares a reusable block of content that can accept
parameters to vary output.

### Syntax

```ebnf

  fun
     : '{%' 'fun' identifier ( '[' type_parameter+ ']' ) ? '(' parameters* ')' '%}'

         children+

      '{%' 'endfun' '%}'
     ;

```

### Notes

1) A fun is compiled to a valid function in the target code.
2) All fun declarations should be visible or "exported" in the target code.
3) The return type of a fun in target code is the content type.
4) `fun`s may be referred to as  functions for clarity.
5) The `fun` `identifier` MUST NOT be qualified.

## Views

### Syntax

```ebnf

  view:
        '{%' 'view' constructor type_parameters? '(' context ')' '%}'
         tag
      ;

```

### Notes

1) A `view` is compiled to a re-usable constructor in the target code.
2) The `context` parameter indicates a target code identifier that describes
   what values are available within the scope of the `view`.
3) The `child` and it's subsequently declared children are within the scope
   of the `view`.
4) Values from the scope may be accessed by prefixing their names with the `@`
   identifier.
5) The `constructor` MUST NOT be qualified.
6) A `view` can only have a single of children.

## Naming Semantics

### Identifiers

```ebnf

  identifier
            : qualified_identifier
            | unqualified_identifier
            ;

  qualified_identifier
            : NAME '.' NAME
            | constructor '.' NAME
            ;

  unqualified_identifier
            : NAME
            ;

  NAME
            : [_a-z$][a-zA-Z0-9$_-]*
            ;

```

#### Notes 

1) An identifier SHOULD be compiled verbatim in the target code.
2) If an identifier is prefixed with '.' it is considered qualified.

### Constructors

```ebnf

  constructor
              : qualified_constructor
              | unqualified_constructor
              ;

  qualified_constructor
                       : CNAME '.' CNAME
                       | NAME '.' CNAME
                       ;

  unqualified_constructor
                         : CNAME
                         ;

  constructor:
               [A-Z][a-zA-Z$0-9]*
             ;

  CNAME
        : [A-Z][a-zA-Z$0-9]*
        ;

```

#### Notes 

1) A constructor SHOULD be compiled verbatim in the target code.
2) If an constructor is prefixed with '.' it is considered qualified.

## Generic Type Parameters

### Syntax

```ebnf

  type_parameter
                : identifier
                | identifier  ':' type
                | constructor 
                | constructor ':' type
                ;

  type
      : constructor ( '[' type_parameters ']' )?
      | constructor '[' ']'
      | constructor type_parameters '[' ']'
      ;

```
#### Notes

1) A type_parameter is complied to the corresponding syntax in the target code.
2) If a type_parameter contains ':' the left side is the name and the right is
   a constraint placed on the type.
3) A type_parameter ending in '[]' is considered an array type.
4) The name of a type_parameter MUST NOT be qualified.

## Elements

An element can either be a widget or a DOM node.

### Syntax

```ebnf

element
        : widget
        | node
        ;

widget
      : '<' constructor attribute? '>' children+ '<' '/' constructor '>'
      | '<' constructor attribute? '/' '>'
      ;

node
    : '<' identifier attribute? '>' children+ '<' '/' identifier '>'
    | '<' identifier attribute? '/' '>'
    ;

attribute
         : identifier ':' identifier '=' attribute_value
         | identifier '=' attribute_value
         | identifier ':' identifier
         | identifier
         ;

attribute_value
         : interpolation
         | literal
         ;

```

#### Notes

1) Widgets are compiled to the corresponding instantiated class object at runtime.
2) Nodes are compiled to the appropriate representation of a DOM node in the
   target code.
3) Before a widget can be used it must be imported into the module's scope.
4) Nodes SHOULD not require importing before use.

## Attributes

### Syntax

```ebnf

attribute
         : attribute_name '=' attribute_value
         | attribute_name
         ;

attribute_name
         : identifier ':' identifier
         | identifier
         ;

attribute_value
         : interpolation
         | literal
         ;

```

#### Notes

1) An `attribute_name` MUST NOT be qualified.
2) An `attribute_name` consisting of two identifiers separated by ':' is 
   considered namespaced.
3) Namespaced attribute names are grouped together into one record in the
   target code environment.

## Controls

### For In

The `for in` expression allows iteration over an array.

```ebnf

for_in    
      : '{%' FOR value? index? source? IN expression '%}'
             children 
        '{%' ENDFOR '%}'

      | '{%' FOR value? index? source? IN expression '%}'
             children 
        '{%' ELSE '%}' 
             children 
        '{%' ENDFOR '%}'
      ;

```

#### Notes

1) When compiled, a `for in` statement MUST be an expression in the target code.

2) The type of the expression MUST be an array of content.

3) If specified, the `else` clause MUST be evaluated an used if the array is
   empty.

### For Of

### Notes

1) The `for of` expression is similar to `for in` except it iterates over
   a record.

## Alias

The alias statement allows a type alias to be introduced to a WML module.
Type aliases allow authors to rename types or give a name to complex type 
combinations.

Example:

```wml

 {% alias JSON = Object | Array | String | Number | Boolean | Null %}

```
In the above example, the identifier `JSON` becomes available throughout the 
rest of the module.

Aliases can reference a single type or a combination of types via the '|' symbol.
If '|' is used, the alias considered an algebraic data type, specifically
a sum type, where any of the types specified is a valid type for that
alias.

Aliases can carry generic type parameters.
Aliases are exported from modules.

### Syntax

```bnf
alias
     = "{%" "alias" name (type-parameters+)? "=" type-list "%}"

type-list:
     = type
     | type-list "," type

```

## Contract

The contract statement allows authors to introduce a structured type into a
WML module. Contracts describe the type of each property of record like 
structures.

Contract are primarily used to specify the "shape" a value must have in order to
be used as a context in a view. When used as a view's context, a contract
specifies all the properties and values available for use in the view via
the "@" operator.

Example:

```bnf

{% contract PanelContext = 
   
    heading.title: String, 

    body.text: String, 

    footer: String 
%}

{% view Panel (PanelContext) %}

<div class="panel">

  <div class="panel-heading">{{@heading.title}}</div>

  <div class="body">{{@body.text}}</div>

  <div class="footer">{{@footer|text}}</div>

</div>

```

The property keys of a contract can be specified as a dotted path in which
case the compiler will expand to nested record types.

Contracts can carry generic type parameters.
Contracts are exported from modules.

### Syntax

```bnf

contract
        = "{%" "contract" name type-parameters "=" member-declaration* "%}"

member_declaration
        = path ":" type

path
        = identifier
        | path "." identifier

```

