/*
 Grammar for the Widget Markup Language
*/

%lex

/* Definitions */
DecimalDigits [0-9]+
NonZeroDigit [1-9]
OctalDigit [0-7]
HexDigit [0-9a-fA-F]
ExponentIndicator [eE]
SignedInteger [+-]?[0-9]+
DecimalIntegerLiteral [-]?([0]|({NonZeroDigit}{DecimalDigits}*))
ExponentPart {ExponentIndicator}{SignedInteger}
OctalIntegerLiteral [0]{OctalDigit}+
HexIntegerLiteral [0][xX]{HexDigit}+
DecimalLiteral ([-]?{DecimalIntegerLiteral}\.{DecimalDigits}*{ExponentPart}?)|(\.{DecimalDigits}{ExponentPart}?)|({DecimalIntegerLiteral}{ExponentPart}?)
NumberLiteral {DecimalLiteral}|{HexIntegerLiteral}|{OctalIntegerLiteral}
Identifier [a-z$_][a-zA-Z$_0-9-]*
Constructor [A-Z][a-zA-Z$_0-9-]*
LineContinuation \\(\r\n|\r|\n)
OctalEscapeSequence (?:[1-7][0-7]{0,2}|[0-7]{2,3})
HexEscapeSequence [x]{HexDigit}{2}
UnicodeEscapeSequence [u]{HexDigit}{4}
SingleEscapeCharacter [\'\"\\bfnrtv]
NonEscapeCharacter [^\'\"\\bfnrtv0-9xu]
CharacterEscapeSequence {SingleEscapeCharacter}|{NonEscapeCharacter}
EscapeSequence {CharacterEscapeSequence}|{OctalEscapeSequence}|{HexEscapeSequence}|{UnicodeEscapeSequence}
DoubleStringCharacter ([^\"\\\r]+)|(\\{EscapeSequence})|{LineContinuation}
SingleStringCharacter ([^\'\\\n\r]+)|(\\{EscapeSequence})|{LineContinuation}
TemplateStringCharacter ([^\`\\\n\r]+)|(\\{EscapeSequence})|{LineContinuation}
StringLiteral (\"{DoubleStringCharacter}*\")|(\'{SingleStringCharacter}*\')|(\`{TemplateStringCharacter}*\`)
Text ({DoubleStringCharacter}*)|({SingleStringCharacter}*)

/* Lexer flags */
%options flex
%x CHILDREN
%x HTMLCOMMENT
%x WMLCOMMENT
%x CONTROL
%x INTERPOLATION
%x CONTROL_CHILD
%x ELEMENT
%%

/* Lexer rules */

<*>\s+                                                   return;               

<INITIAL>'{%'                this.begin('CONTROL');      return '{%';
<INITIAL>'<!--'              this.begin('HTMLCOMMENT');  return;
<INITIAL>'{#'                this.begin('WMLCOMMENT');   return;
<INITIAL>'<'                 this.begin('ELEMENT');      return '<';
<INITIAL>'{{'                this.begin('INTERPOLATION');   return '{{';

<ELEMENT>'true'                                              return 'TRUE';
<ELEMENT>'false'                                             return 'FALSE';
<ELEMENT>{Constructor}                                       return 'CONSTRUCTOR';
<ELEMENT>{Identifier}                                        return 'IDENTIFIER';
<ELEMENT>'/>'                    this.popState();            return '/>';
<ELEMENT>'/'                                                 return '/';
<ELEMENT>'>'                     this.begin('CHILDREN');     return '>';
<ELEMENT>'{{'                    this.begin('INTERPOLATION');return '{{';
<ELEMENT>'{'                                                 return '{';
<ELEMENT>'}'                                                 return '}';

<CHILDREN>'{{'               this.begin('INTERPOLATION');    return '{{';
<CHILDREN>'{%'               this.begin('CONTROL');      return '{%';
<CHILDREN>'<!--'             this.begin('HTMLCOMMENT');      return;
<CHILDREN>'</'               this.begin('ELEMENT');      return '</';
<CHILDREN>'<'                this.begin('ELEMENT');      return '<';
<CHILDREN>'{'                                            return '{';
<CHILDREN>'}'                                            return '}';
<CHILDREN>[^/<>{%}]+                                     return 'CHARACTERS';

<CONTROL>'import'                                        return 'IMPORT';
<CONTROL>'from'                                          return 'FROM';
<CONTROL>'as'                                            return 'AS';
<CONTROL>'macro'                                         return 'MACRO';
<CONTROL>'endmacro'                                      return 'ENDMACRO';
<CONTROL>'for'                                           return 'FOR';
<CONTROL>'endfor'                                        return 'ENDFOR';
<CONTROL>'if'                                            return 'IF';
<CONTROL>'endif'                                         return 'ENDIF';
<CONTROL>'else'                                          return 'ELSE';
<CONTROL>'elseif'                                        return 'ELSEIF';
<CONTROL>'in'                                            return 'IN';
<CONTROL>'of'                                            return 'OF';
<CONTROL>'from'                                          return 'FROM';
<CONTROL>'view'                                          return 'VIEW';
<CONTROL>'instanceof'                                    return 'INSTANCEOF';
<CONTROL>'this'                                          return 'THIS';
<CONTROL>'fun'                                           return 'FUN';
<CONTROL>'endfun'                                        return 'ENDFUN';
<CONTROL>'as'                                            return 'AS';
<CONTROL>'context'                                       return 'CONTEXT';
<CONTROL>'type'                                          return 'TYPE';
<CONTROL>'true'                                          return 'TRUE';
<CONTROL>'false'                                         return 'FALSE';
<CONTROL>'where'                                         return 'WHERE';
<CONTROL>'let'                                           return 'LET';
<CONTROL>'to'                                            return 'TO';
<CONTROL>{Constructor}                             return 'CONSTRUCTOR';
<CONTROL>{Identifier}                              return 'IDENTIFIER';
<CONTROL>'@'                                             return '@';
<CONTROL>'='                                             return '=';
<CONTROL>'?'                                             return '?';
<CONTROL>'<'           this.begin('ELEMENT');      return '<';
<CONTROL>'{#'          this.begin('WMLCOMMENT');   return;
<CONTROL>'{{'          this.begin('INTERPOLATION');return '{{';
<CONTROL>'%}'          this.popState();            return '%}';
<CONTROL>'{'                                       return '{';
<CONTROL>'}'                                       return '}';

<INTERPOLATION>'|'                                       return '|';
<INTERPOLATION>'->'                                      return '->';
<INTERPOLATION>'@'                                       return '@';
<INTERPOLATION>'instanceof'                              return 'INSTANCEOF';
<INTERPOLATION>'true'                                    return 'TRUE';
<INTERPOLATION>'false'                                   return 'FALSE';
<INTERPOLATION>'if'                                      return 'IF';
<INTERPOLATION>'then'                                    return 'THEN';
<INTERPOLATION>'else'                                    return 'ELSE';
<INTERPOLATION>'as'                                      return 'AS';
<INTERPOLATION>{Constructor}                             return 'CONSTRUCTOR';
<INTERPOLATION>{Identifier}                              return 'IDENTIFIER';
<INTERPOLATION>'{'                                       return '{';
<INTERPOLATION>'}'                                       return '}';
<INTERPOLATION>'}}'             this.popState();         return '}}';

<HTMLCOMMENT>(.|\r|\n)*?'-->'  this.popState();          return;
<WMLCOMMENT>(.|\r|\n)*?'#}'    this.popState();          return;

<*>{NumberLiteral}                                       return 'NUMBER_LITERAL';
<*>{StringLiteral}                                       return 'STRING_LITERAL';
<*>'>'                                                   return '>';
<*>'<'                                                   return '<';
<*>'('                                                   return '(';
<*>')'                                                   return ')';
<*>'['                                                   return '[';
<*>']'                                                   return ']';
<*>';'                                                   return ';'
<*>':'                                                   return ':';
<*>'='                                                   return '='
<*>'=='                                                  return '==';
<*>'!='                                                  return '!=';
<*>'>='                                                  return '>=';
<*>'<='                                                  return '<=';
<*>'=>'                                                  return '=>';
<*>'->'                                                  return '->';
<*>'?.'                                                  return '?.';
<*>'??'                                                  return '??';
<*>'+'                                                   return '+';
<*>'-'                                                   return '-';
<*>'*'                                                   return '*';
<*>'/'                                                   return '/';
<*>'\\'                                                  return '\\';
<*>'&&'                                                  return '&&';
<*>'||'                                                  return '||';
<*>'^'                                                   return '^';
<*>'!'                                                   return '!';
<*>','                                                   return ',';
<*>'?'                                                   return '?';
<*>'|'                                                   return '|';
<*>'...'                                                 return '...';
<*>'.'                                                   return '.';

<*><<EOF>>                                               return 'EOF';

/lex

%ebnf
%start module
%%

module

          : imports exports EOF
            {$$ = new yy.ast.Module($1, $2, @$); return $$;}

          | imports EOF
            {$$ = new yy.ast.Module($1, [], @$); return $$;} 

          | exports EOF
            {$$ = new yy.ast.Module([], $1, @$); return $$;}

          | EOF
            {$$ = new yy.ast.Module([], [], undefined, @$);}
          ;

imports
          : import_statement          {$$ =  [$1];         }
          | imports import_statement  {$$ = $1.concat($2); }
          ;

import_statement
          : '{%' IMPORT import_member FROM string_literal '%}'
            {$$ = new yy.ast.ImportStatement($3, $5, @$);}
          ;

import_member
          : aggregate_member
          | aliased_member
          | composite_member
          ;

aliased_member
          : member AS member
            {$$ = new yy.ast.AliasedMember($1, $3, @$);}
          ;

aggregate_member
          : '*' AS member
            {$$ = new yy.ast.AggregateMember($3, @$);}
          ;

composite_member
          : '(' member_list  ')'
            {$$ = new yy.ast.CompositeMember($2, @$);}
          ;

member_list
          : (member | aliased_member)
            {$$ = [$1];}

          | member_list ',' (member | aliased_member)
            {$$ = $1.concat($3);}
          ;
member
          : (unqualified_identifier | unqualified_constructor)
            {$$ = $1; }
          ;

exports
          : export
            {$$ = [$1]; }

          | exports export
            {$$ = $1.concat($2);}
          ;

export
          : type_statement

          | context_statement

          | let_statement

          | view_statement           

          | fun_statement 

          | element
            {$$ = $1; }
          ;

type_statement
          : '{%' TYPE unqualified_constructor type_parameters? '='
            type_members '%}'
            { $$ = new yy.ast.AliasStatement($3, $4||[], $6);   }
          ;

type_members
          : type
            { $$ = [$1];                                        }

          | type_members '|' type
            { $$ = $1.concat($3);                               }
          ;

context_statement

          : '{%' CONTEXT unqualified_constructor '%}'
            { $$ = new yy.ast.ContextStatement($3, [], [], @$);            }

          | '{%' CONTEXT unqualified_constructor WHERE context_members '%}'
            { $$ = new yy.ast.ContextStatement($3, [], $5, @$);            }

          | '{%' CONTEXT unqualified_constructor type_parameters WHERE
             context_members '%}'
            { $$ = new yy.ast.ContextStatement($3, $4, $6, @$);            }
          ;

context_members
          : parent_context
            { $$ = [$1]; }

          | member_declaration
            { $$ = [$1]; }

          | context_members ',' parent_context
            { $$ = $1.concat($3); }

          | context_members ',' member_declaration
            { $$ = $1.concat($3); }
          ;

parent_context
          : ':' constructor_type
            {$$ = $2; }
          ;

let_statement
          : '{%' LET unqualified_identifier ':' type '=' expression '%}'
            { $$ = new yy.ast.LetStatement($3, $5, $7, @$); }
          ;

member_declarations

          : member_declaration
            { $$ = [$1];                                   }

          | member_declarations ',' member_declaration
            { $$ = $1.concat($3);                          }
          ;

member_declaration
          
          : member_path '?'? ':' type
            { $$ = new yy.ast.MemberDeclaration($1, $4, $2?true:false, @$); }
          ;

member_path

          : unqualified_identifier
           { $$ = [$1];                             }

          | string_literal
           { $$ = [$1];                             }

          | member_path '.' unqualified_identifier 
            { $$ = $1.concat($3);                   }

          | member_path '.' string_literal 
            { $$ = $1.concat($3);                   }
          ;

view_statement

           : '{%' VIEW unqualified_constructor '(' view_statement_context ')'
             '%}' element
             { $$ = new yy.ast.ViewStatement($3, [], $5, [], $8, @$);          }

           | '{%' VIEW unqualified_constructor '(' view_statement_context ')' '%}'
             view_directives element
            { $$ = new yy.ast.ViewStatement($3, [], $5, $8, $9, @$);           }

           | '{%' VIEW unqualified_constructor type_parameters 
             '(' view_statement_context ')' '%}' 
              element
             { $$ = new yy.ast.ViewStatement($3, $4, $6, [], $9, @$);          }

           | '{%' VIEW unqualified_constructor type_parameters 
             '(' view_statement_context ')' '%}'
             view_directives element
             { $$ = new yy.ast.ViewStatement($3, $4, $6, $9, $10, @$);         }

           | '{%' VIEW unqualified_constructor WHERE context_members '%}' 
             element
             { $$ = new yy.ast.ViewStatement($3, [], $5, [], $7, @$);          }

           | '{%' VIEW unqualified_constructor WHERE context_members '%}' 
             view_directives element
             { $$ = new yy.ast.ViewStatement($3, [], $5, $7, $8, @$);          }

          | '{%' VIEW unqualified_constructor type_parameters WHERE 
             context_members '%}' element
             { $$ = new yy.ast.ViewStatement($3, $4, $6, [], $8, @$);          }

          | '{%' VIEW unqualified_constructor type_parameters WHERE 
            context_members '%}' view_directives element
             { $$ = new yy.ast.ViewStatement($3, $4, $6, $8, $9, @$);          }
          ;

view_statement_context
          : constructor_type 
            { $$ = $1; }

          | context_from_statement
            {$$ = $1; }
          ;

context_from_statement
            : constructor_type FROM string_literal
              {$$ = new yy.ast.ContextFromStatement($1, $3, @$); }
            ;

view_directives
          : let_statement
            { $$ = [$1]; }

          | view_directives let_statement
            { $$ = $1.concat($2); }
          ;

fun_statement

          : '{%' FUN unqualified_identifier type_parameters parameters '%}' 
              children 
            '{%' ENDFUN '%}'
            {$$ = new yy.ast.FunStatement($3, $4, $5, $7, @$); }

          | '{%' FUN unqualified_identifier parameters '%}' 
              children 
            '{%' ENDFUN '%}'
            {$$ = new yy.ast.FunStatement($3, [], $4, $6, @$); }

          | '{%' FUN unqualified_identifier type_parameters parameters '='
              child '%}' 
            {$$ = new yy.ast.FunStatement($3, $4, $5, [$7], @$); }

          | '{%' FUN unqualified_identifier parameters '=' child '%}' 
            {$$ = new yy.ast.FunStatement($3, [], $4, [$6], @$); }
          ;

type_parameters
          : '[' type_parameter_list ']' {$$ = $2; }
          ;

type_parameter_list
          : type_parameter
            {$$ = [$1];                     }

          | type_parameter_list ',' type_parameter
            {$$ = $1.concat($3);            }
          ;

type_parameter
        
          : unqualified_constructor 
           {$$ = new yy.ast.TypeParameter($1, undefined, @$);           }

          | unqualified_constructor ':' type
           {$$ = new yy.ast.TypeParameter($1, $3, @$);                  }
          ;

type
          : non_function_type
            { $$ = $1;                                                  }

          | function_type
            { $$ = $1;                                                  }

          | grouped_type 
            { $$ = $1;                                                  }
          ;

grouped_type
          : '(' non_function_type ')'
            { $$ = $2;                                                  }

          | '(' function_type ')'
            { $$ = $2;                                                  }
          ;

non_function_type
          : constructor_type
            { $$ = $1;                                                  }

          | record_type
            { $$ = $1;                                                  }

          | list_type
            { $$ = $1;                                                  }

          | tuple_type
            { $$ = $1;                                                  }
          ;

constructor_type
          : unqualified_constructor
            { $$ = new yy.ast.ConstructorType($1, [], @$);              }

          | unqualified_constructor type_parameters
            { $$ = new yy.ast.ConstructorType($1, $2, @$);              }

          | qualified_constructor
            { $$ = new yy.ast.ConstructorType($1, [], @$);              }

          | qualified_constructor type_parameters
            { $$ = new yy.ast.ConstructorType($1, $2, @$);              }
          ;

record_type
          : '{' member_declarations '}'
            { $$ = new yy.ast.RecordType($2, @$);                       }

          | '{' '}'
            { $$ = new yy.ast.RecordType([], @$);                       }

          ;

list_type
          : unqualified_constructor '[' ']'
            { $$ = new yy.ast.ListType(
                     new yy.ast.ConstructorType($1, []), @$);           }

          | unqualified_constructor type_parameters '[' ']'
            { $$ = new yy.ast.ListType(
                     new yy.ast.ConstructorType($1, $2), @$);           }

          | record_type '[' ']'
            { $$ = new yy.ast.ListType($1, @$);                         }
         
          // a function list type MUST be grouped!
          | grouped_type '[' ']'
            { $$ = new yy.ast.ListType($1, @$);                         }

          | tuple_type '[' ']'
            { $$ = new yy.ast.ListType($1, @$);                         }

          | list_type '[' ']'
            { $$ = new yy.ast.ListType($1, @$);                         }
          ; 

tuple_type
          : '[' ']'
            { $$ = new yy.ast.TupleType([], @$);                        }

          | '[' tuple_type_members ']'
            { $$ = new yy.ast.TupleType($2, @$);                        }
          ;

tuple_type_members
          : type
            { $$ = [$1];                                                }

          | tuple_type_members ',' type
            { $$ = $1.concat($3);                                       }
          ;

function_type
          : '->' type
            { $$ = new yy.ast.FunctionType([], $2, @$);                 }

          | '('  ')' '->' type
            { $$ = new yy.ast.FunctionType([], $4, @$);                 }

          | non_function_type '->' type                                 
            { $$ = new yy.ast.FunctionType([$1], $3, @$);               }

          // If we don't use grouped_type here jison will trip up on the 
          // ambiguity that implicitly exists between the type sub rules
          | grouped_type '->' type
            { $$ = new yy.ast.FunctionType([$1], $3, @$);               }

          | '(' function_type_parameters ')' '->' type
            { $$ = new yy.ast.FunctionType($2, $5, @$);                 }
          ;

function_type_parameters

          : non_function_type ',' non_function_type
            { $$ = [$1, $3];                                             }

          | '(' function_type ')' ',' '(' function_type ')'
            { $$ = [$2, $6];                                             }

          | function_type_parameters ',' non_function_type
            { $$ = $1.concat($3);                                        }

          | function_type_parameters ',' '(' function_type ')'
            { $$ = $1.concat($4);                                        }
          ;

parameters
          : '(' ')'                
            {$$ = []; }

          | '(' parameter_list ')'  
            {$$ = $2; }
          ;

parameter_list
          : parameter
            {$$ = [$1]; }

          | parameter_list ',' parameter
            {$$ = $1.concat($3); }
          ;

parameter
          : unqualified_identifier ':' type
            { $$ = new yy.ast.TypedParameter($1, $3, @$); }
          ;

untyped_parameter
          : unqualified_identifier
            { $$ = new yy.ast.UntypedParameter($1, @$);   }
          ;

children
          : child           {$$ = [$1];          }
          | children child  {$$ = $1.concat($2); }
          ;

child
          : (element | interpolation | control | characters | identifier)
            { $$ = $1; }
          ;

element
          : node    { $$ = $1; }
          | widget  { $$ = $1; }
          ;

node
          : '<' identifier attributes '>' children? '</' identifier '>'
             {$$ = new yy.ast.Node($2, $3, $5||[], $7, @$);}

          | '<' identifier '>' children? '</' identifier '>'
             {$$ = new yy.ast.Node($2, [], $4||[], $6, @$);}

          | '<' identifier attributes '/>'
            { $$ = new yy.ast.Node($2, $3, [], $2, @$); }

          | '<' identifier '/>'
            { $$ = new yy.ast.Node($2, [], [], $2, @$); }
          ;

widget
          : '<' widget_constructor attributes '>' children? '</' cons '>'
             {$$ = new yy.ast.Widget($2[0], $2[1], $3, $5||[], $7, @$);}

          | '<' widget_constructor '>' children? '</' cons '>'
             {$$ = new yy.ast.Widget($2[0], $2[1], [], $4||[], $6, @$);}

          | '<' widget_constructor attributes '/>'
            { $$ = new yy.ast.Widget($2[0], $2[1], $3, [], $2, @$); }

          | '<' widget_constructor '/>'
            { $$ = new yy.ast.Widget($2[0], $2[1], [], [], $2, @$); }
          ;

widget_constructor
          : cons type_arguments? {$$ = [$1, $2 || []]; }
          ;

attributes
          : attribute            {$$ = [$1];     }
          | attributes attribute {$$ = $1.concat($2);}
          ;

attribute
          : unqualified_identifier ':' unqualified_identifier '=' attribute_value
            {$$ = new yy.ast.Attribute($1, $3, $5, @$);}

          | unqualified_identifier '=' attribute_value
            {$$ =
            new yy.ast.Attribute(new yy.ast.UnqualifiedIdentifier('', @$),
            $1, $3, @$);}

          | unqualified_identifier ':' unqualified_identifier
            {$$ = new yy.ast.Attribute($1, $3,
            new yy.ast.BooleanLiteral(true, @$), @$);  }

          | unqualified_identifier
            {$$ = new yy.ast.Attribute(
            new yy.ast.UnqualifiedIdentifier('', @$),
            $1, new yy.ast.BooleanLiteral(true, @$), @$);  }
          ;

attribute_value
          : (interpolation|literal)
            {$$ = $1;}
          ;

interpolation
          : '{{' expression '}}'
            {$$ = new yy.ast.Interpolation($2, [], @$);}

          | '{{' expression filters '}}'
            {$$ = new yy.ast.Interpolation($2, $3, @$);}
          ;

filters
          : filter              {$$ =  [$1];     }
          | filters filter      {$$ = $1.concat($2); }
          ;

filter
          : '|'  expression
            {$$ = $2}
          ;

control
          : (for_statement|if_statement) 
            {$$ = $1;}
          ;

for_statement
          : for_in
            {$$ = $1;}

          | for_of 
            {$$ = $1;}

          | for_from
            {$$ + $1;}
          ;

for_in
          : '{%' FOR for_parameters IN expression '%}' children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForInStatement($3, $5, $7, [], @$);}

          | '{%' FOR for_parameters IN expression '%}' 
             children 
             '{%' ELSE '%}' children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForInStatement($3, $5, $7, $11, @$);}
          ;

for_of
          : '{%' FOR for_parameters OF expression '%}' children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForOfStatement($3, $5, $7, [], @$);}

          | '{%' FOR for_parameters OF expression '%}' 
             children 
             '{%' ELSE '%}' children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForOfStatement($3, $5, $7, $11, @$);}
          ;

for_from
          : '{%' FOR untyped_parameter '=' expression TO expression '%}' 
              children 
            '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForFromStatement($3, $5, $7, $9, [], @$);}
          ;

for_parameters
          : for_parameter
            {$$ = [$1];                                                 }

          | for_parameters ',' parameter
            {$$ = $1.concat($3);                                        }

          | for_parameters ',' untyped_parameter
            {$$ = $1.concat($3);                                        }
          ;

for_parameter
          : parameter 
            {$$ = $1;          }

          | untyped_parameter
            { $$ = $1;         }
          ;

if_statement
          : '{%' IF expression '%}' children '{%' ENDIF '%}'
           {$$ = new yy.ast.IfStatement($3, $5, undefined, @$); }
    
          | '{%' IF expression '%}' children else_clause
           {$$ = new yy.ast.IfStatement($3, $5, $6, @$); }
          ;

else_clause

         :  '{%' ELSE '%}' children '{%' ENDIF '%}'
            { $$ = new yy.ast.ElseClause($4, @$); }

         |  '{%' ELSE IF expression '%}' children '{%' ENDIF '%}'
            { $$ = new yy.ast.ElseIfClause($4, $6, undefined, @$); }

         |  '{%' ELSE IF expression '%}' children else_clause 
            { $$ = new yy.ast.ElseIfClause($4, $6, $7, @$); }
         ;

characters
          : CHARACTERS
            {$$ = new yy.ast.Characters($1, @$); }
          ;

arguments
          : expression
            {$$ = [$1]; }

          | arguments ',' expression
            {$$ = $1.concat($3); }
          ;

expression
          : if_expression
            { $$ = $1; }
          
          | binary_expression 
            { $$ = $1; }

          | unary_expression
            { $$ = $1; }

          | simple_expression 
            { $$ = $1; }

          | function_expression
            { $$ = $1; }

          | '(' expression ')'
            { $$ = $2; }
          ;

if_expression
          : IF expression THEN expression ELSE expression
            { $$ = new yy.ast.IfThenExpression($2, $4, $6, @$); }
          ;

binary_expression
         : simple_expression binary_operator simple_expression 
           {$$ = new yy.ast.BinaryExpression($1, $2, $3, @$); }

         | simple_expression binary_operator '(' expression ')'
           {$$ = new yy.ast.BinaryExpression($1, $2, $4, @$); }

         | simple_expression AS type
           {$$ = new yy.ast.BinaryExpression($1, $2, $3, @$); }

         | '(' expression ')' binary_operator simple_expression
           {$$ = new yy.ast.BinaryExpression($2, $4, $5, @$); }

         | '(' expression ')' AS type
           {$$ = new yy.ast.BinaryExpression($2, $4, $5, @$); }

         | '(' expression ')' binary_operator '(' expression ')'
           {$$ = new yy.ast.BinaryExpression($2, $4, $6, @$); }
         ;

unary_expression
          : '!' expression 
            {$$ = new yy.ast.UnaryExpression($1, $2, @$); }

          | '...' expression
            {$$ = new yy.ast.UnaryExpression($1, $2, @$); }
          ;

simple_expression
          : (
             construct_expression 
             |call_expression 
             |view_construction
             |member_expression 
             |literal 
             |context_property 
             |unqualified_constructor 
             |unqualified_identifier 
             |context_variable)
            { $$ = $1; }
          ;

view_construction
          : '<' simple_expression '>'
            { $$ = new yy.ast.ViewConstruction($2, @$); }

          | '<' '(' expression ')' '>'
            { $$ = new yy.ast.ViewConstruction($3, @$); }
          ;

type_arguments
          : '[' type_arg_list ']'
            { $$ = $2; }
          ;

type_arg_list
          :  type 
            { $$ = [$1]; }
          
          |  type_arg_list ',' type
            { $$ = $1.concat($3); }
          ;

construct_expression
          : unqualified_constructor type_arguments '(' arguments ')'
            { $$ = new yy.ast.ConstructExpression($1, $2, $4, @$); }

          | unqualified_constructor '(' arguments ')'
            { $$ = new yy.ast.ConstructExpression($1, [], $3, @$); }

          | unqualified_constructor type_arguments '(' ')'
            { $$ = new yy.ast.ConstructExpression($1, $2, [], @$); }

          | unqualified_constructor '(' ')'
            { $$ = new yy.ast.ConstructExpression($1, [], [], @$); }
          ;

call_expression
          : unqualified_identifier type_arguments '(' arguments ')'
            {$$ = new yy.ast.CallExpression($1, $2, $4, @$);    }

          | unqualified_identifier type_arguments '(' ')'
            {$$ = new yy.ast.CallExpression($1, $2, [], @$);    }

          | unqualified_identifier '(' arguments ')'
            {$$ = new yy.ast.CallExpression($1, [], $3, @$);    }

          | unqualified_identifier '(' ')'
            {$$ = new yy.ast.CallExpression($1, [], [], @$);    }

          | context_property type_arguments '(' arguments ')'
            {$$ = new yy.ast.CallExpression($1, $2, $4, @$);    }

          | context_property type_arguments '(' ')'
            {$$ = new yy.ast.CallExpression($1, $2, [], @$);    }

          | context_property '(' arguments ')'
            {$$ = new yy.ast.CallExpression($1, [], $3, @$);    }

          | context_property '(' ')'
            {$$ = new yy.ast.CallExpression($1, [], [], @$);    }

          | member_expression type_arguments '(' arguments ')'
            {$$ = new yy.ast.CallExpression($1, $2, $4, @$);    }

          | member_expression type_arguments '(' ')'
            {$$ = new yy.ast.CallExpression($1, $2, [], @$);    }

          | member_expression '(' arguments ')'
            {$$ = new yy.ast.CallExpression($1, [], $3, @$);    }

          | member_expression '(' ')'
            {$$ = new yy.ast.CallExpression($1, [], [], @$);    }

          | '(' expression ')' type_arguments '(' arguments ')'
            {$$ = new yy.ast.CallExpression($2, $4, $6, @$);    }

          | '(' expression ')' type_arguments '(' ')'
            {$$ = new yy.ast.CallExpression($2, $4, [], @$);    }

          | '(' expression ')' '(' arguments ')'
            {$$ = new yy.ast.CallExpression($2, [], $5, @$);    }

          | '(' expression ')' '(' ')'
            {$$ = new yy.ast.CallExpression($2, [], [], @$);    }

          | call_expression '(' arguments ')'
            {$$ = new yy.ast.CallExpression($1, [], $3, @$);    }

          | call_expression '(' ')'
            {$$ = new yy.ast.CallExpression($1, [], [], @$);    }
          ;

member_expression
          : member_expression_head '.' member_expression_tail
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | member_expression '.' member_expression_tail
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | member_expression '[' string_literal ']'
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }
          ;

member_expression_head:
           ( unqualified_identifier 
           | unqualified_constructor
           | context_variable 
           | context_property 
           | list 
           | record 
           | string_literal 
           | call_expression 
           |'(' expression ')' 
           )
           ;

member_expression_tail
          : (unqualified_identifier| unqualified_constructor|string_literal)
          ;

function_expression
          : parameters '->'  expression
            {$$ = new yy.ast.FunctionExpression($1, $3, @$); }

          | untyped_parameter '->' expression
            {$$ = new yy.ast.FunctionExpression([$1], $3, @$); }

          | '->' expression
            {$$ = new yy.ast.FunctionExpression([], $2, @$); }
          ;

literal 
        : (record|list|string_literal|number_literal|boolean_literal)
        ;

record
          : '{' '}'
            {$$ = new yy.ast.Record([], @$); }

          | '{' properties '}'
            {$$ = new yy.ast.Record($2, @$); }
          ;

properties
          : property
           {$$ = [$1]; }

          | properties ',' property
           {$$ = $1.concat($3); }
          ;

property
          : (unqualified_identifier|string_literal) '=' expression
            { $$ = new yy.ast.Property($1, $3, @$); }
          ;

list
          : '[' ']'
            {$$ = new yy.ast.List([], @$); }

          | '[' arguments ']'
            {$$ = new yy.ast.List($2, @$); }
          ;

string_literal
          : STRING_LITERAL 
            {$$ = new yy.ast.StringLiteral($1.slice(1, $1.length - 1, @$)); }
          ;

number_literal
          : NUMBER_LITERAL
          {$$ = new yy.ast.NumberLiteral($1, @$); }
          ;

boolean_literal
          : TRUE
            {$$ = new yy.ast.BooleanLiteral(true, @$);}

          | FALSE
            {$$ = new yy.ast.BooleanLiteral(false, @$);}
          ;

context_property
          : '@' unqualified_identifier
            { $$ = new yy.ast.ContextProperty($2, @$) }

          | '@' '[' string_literal ']'
            { $$ = new yy.ast.ContextProperty($3, @$) }
          ;

context_variable
          : '@' {$$ = new yy.ast.ContextVariable(@$);}
          ;

cons
         : qualified_constructor   { $$ = $1; }
         | unqualified_constructor { $$ = $1; }
         ;

qualified_constructor
        : IDENTIFIER '.' CONSTRUCTOR
          { $$ = new yy.ast.QualifiedConstructor($1, $3, @$); }

        | CONSTRUCTOR '.' CONSTRUCTOR
          { $$ = new yy.ast.QualifiedConstructor($1, $3, @$); }
        ;

unqualified_constructor
        : CONSTRUCTOR 
          { $$ = new yy.ast.UnqualifiedConstructor($1, @$); }
        ;

identifier
        : qualified_identifier 
          { $$ = $1; }

        | unqualified_identifier
          { $$ = $1; }
        ;

qualified_identifier
         : IDENTIFIER '.' IDENTIFIER
           {$$ = new yy.ast.QualifiedIdentifier($1, $3, @$); }

         | CONSTRUCTOR '.' IDENTIFIER
          {$$ = new yy.ast.QualifiedIdentifier($1, $3, @$); }
         ;

unqualified_identifier
         : IDENTIFIER
           {$$ = new yy.ast.UnqualifiedIdentifier($1, @$);   }
         ;

binary_operator
          : ('>'|'>='|'<'|'<='|'=='|'!='|'+'|'/'|'-'|'='|'&&'|'||'|'^'|
            '??' |'?.'|INSTANCEOF)
            { $$ = $1; }
          ;

