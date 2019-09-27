
Widget Markup Language Specification
====================================

# Introduction

The Widget Markup Language (WML) is an XML like syntax for listing the 
components of a user interface.

WML is meant to be a simple alternative to using the DOM's  
`document.createElement()` API. It provides support for features such as:
1. Node construction.
2. Component construction.
3. Attribute assignment (including simple expressions).
4. Fragments.
5. Static typing.

The first iteration of the  WML compiler compiled to ECMAScript directly. Since
then, the need for stronger typing became more apparent in order to escape the
dreaded "x is not a function" class of errors.

As a result, the WML syntax was redesigned to be compatible with the 
TypeScript extension.

## Definitionso

### Target, Target Code

Refers to the output language of a WML compiler. Typically Typescript.

### View

A view is hierarchy of elements that is used to a single tree of content in a 
web browser.

### Fun

Fun (short for function) given zero or more arguments, provides one or more
trees of elements and can be used to avoid repeating syntax.

### Element

An element is either a Widget or an item of Content. 

### Widget

A widget is a user defined element that the compiler knows how to turn into
the appropriate content.

### Content

Refers to code browsers can interpret to show content to users. These are 
usually represented by implementers of the DOM's Node interface at runtime.

# Modules 

A WML module is a single file that contains a combination of imports, fun
definitions or view definitions.

## Imports

Imports allow one or more identifiers to be made available within the context
of a WML module.

Imported identifiers represent target code that is compatible with its usage
within a WML module.

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

## Type Parameters

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
