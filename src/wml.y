/*
 Grammer for the Widget Markup Language
*/

/*
 This is the Lexer portion, the syntax here corresponds to
 [flex](http://flex.sourceforge.net/manual)
*/

%lex

/* Definitions */
DecimalDigit [0-9]
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
Identifier [a-zA-Z$_][a-zA-Z$_0-9-]*
DotIdentifier [a-zA-Z$_][a-zA-Z$_0-9.-]*
LineContinuation \\(\r\n|\r|\n)
OctalEscapeSequence (?:[1-7][0-7]{0,2}|[0-7]{2,3})
HexEscapeSequence [x]{HexDigit}{2}
UnicodeEscapeSequence [u]{HexDigit}{4}
SingleEscapeCharacter [\'\"\\bfnrtv]
NonEscapeCharacter [^\'\"\\bfnrtv0-9xu]
CharacterEscapeSequence {SingleEscapeCharacter}|{NonEscapeCharacter}
EscapeSequence {CharacterEscapeSequence}|{OctalEscapeSequence}|{HexEscapeSequence}|{UnicodeEscapeSequence}
DoubleStringCharacter ([^\"\\\n\r]+)|(\\{EscapeSequence})|{LineContinuation}
SingleStringCharacter ([^\'\\\n\r]+)|(\\{EscapeSequence})|{LineContinuation}
TemplateStringCharacter ([^\`\\\n\r]+)|(\\{EscapeSequence})|{LineContinuation}
StringLiteral (\"{DoubleStringCharacter}*\")|(\'{SingleStringCharacter}*\')|(\`{TemplateStringCharacter}*\`)
Text ({DoubleStringCharacter}*)|({SingleStringCharacter}*)

/* Lexer flags */
%options flex
%x CHILDREN
%x COMMENT
%x CONTROL
%x EXPRESSION
%%

/* Lexer rules */

<*>\s+                                                   return;               

<INITIAL>'import'                                        return 'IMPORT';
<INITIAL>'from'                                          return 'FROM';
<INITIAL>'</'                                            return '</';
<INITIAL>'{%'                this.begin('CONTROL');      return '{%';
<INITIAL>'<!--'              this.begin('COMMENT');      return;
<INITIAL>'>'                 this.begin('CHILDREN');     return '>';
<INITIAL>'/>'                this.begin('CHILDREN');     return '/>';
<INITIAL>'{{'                this.begin('EXPRESSION');   return '{{';
<INITIAL>'using'                                         return 'USING';
<INITIAL>'as'                                            return 'AS';
<INITIAL>'true'                                          return 'TRUE';
<INITIAL>'false'                                         return 'FALSE';
<INITIAL>'@'{Identifier}                                 return 'CONTEXT_PROP';
<INITIAL>{Identifier}                                    return 'IDENTIFIER';

<CONTROL>'macro'                                         return 'MACRO';
<CONTROL>'endmacro'                                      return 'ENDMACRO';
<CONTROL>'frag'                                          return 'FRAG';
<CONTROL>'endfrag'                                       return 'ENDFRAG';
<CONTROL>'for'                                           return 'FOR';
<CONTROL>'endfor'                                        return 'ENDFOR';
<CONTROL>'if'                                            return 'IF';
<CONTROL>'endif'                                         return 'ENDIF';
<CONTROL>'else'                                          return 'ELSE';
<CONTROL>'elseif'                                        return 'ELSEIF';
<CONTROL>'in'                                            return 'IN';
<CONTROL>'switch'                                        return 'SWITCH';
<CONTROL>'endswitch'                                     return 'ENDSWITCH';
<CONTROL>'default'                                       return 'DEFAULT';
<CONTROL>'case'                                          return 'CASE';
<CONTROL>'endcase'                                       return 'ENDCASE';
<CONTROL>'call'                                          return 'CALL';
<CONTROL>'export'                                        return 'EXPORT';
<CONTROL>'from'                                          return 'FROM';
<CONTROL>'endexport'                                     return 'ENDEXPORT';
<CONTROL>'view'                                          return 'VIEW';
<CONTROL>'using'                                         return 'USING';
<CONTROL>'endview'                                       return 'ENDVIEW';
<CONTROL>'match'                                         return 'MATCH';
<CONTROL>'endmatch'                                      return 'ENDMATCH';
<CONTROL>'otherwise'                                     return 'OTHERWISE';
<CONTROL>'endotherwise'                                  return 'ENDOTHERWISE';
<CONTROL>'instanceof'                                    return 'INSTANCEOF';
<CONTROL>'typeof'                                        return 'TYPEOF';
<CONTROL>'@'{Identifier}                                 return 'CONTEXT_PROP';
<CONTROL>{Identifier}                                    return 'IDENTIFIER';
<CONTROL>'%}'                this.popState();            return '%}';

<EXPRESSION>'new'                                        return 'NEW';
<EXPRESSION>'|'                                          return '|';
<EXPRESSION>'=>'                                         return '=>';
<EXPRESSION>'::'                                         return '::';
<EXPRESSION>'->'                                         return '->';
<EXPRESSION>'instanceof'                                 return 'INSTANCEOF';
<EXPRESSION>'true'                                       return 'TRUE';
<EXPRESSION>'false'                                      return 'FALSE';
<EXPRESSION>'@'{Identifier}                              return 'CONTEXT_PROP';
<EXPRESSION>{Identifier}                                 return 'IDENTIFIER';
<EXPRESSION>'@@'                                         return '@@';
<EXPRESSION>'}}'             this.popState();            return '}}';

<CHILDREN>'{{'               this.begin('EXPRESSION');   return '{{';
<CHILDREN>'{%'               this.begin('CONTROL');      return '{%';
<CHILDREN>'<!--'             this.begin('COMMENT');      return;
<CHILDREN>'</'               this.popState();            return '</';
<CHILDREN>'<'                this.popState();            return '<';
<CHILDREN>[^/<>{%}]+         this.popState();            return 'CHARACTERS';

<COMMENT>(.|\r|\n)*?'-->'    this.popState();            return;

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
<*>':::'                                                 return ':::';
<*>'='                                                   return '='
<*>'=='                                                  return '==';
<*>'!='                                                  return '!=';
<*>'>='                                                  return '>=';
<*>'<='                                                  return '<=';
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
<*>'.'                                                   return '.';
<*>'{'                                                   return '{';
<*>'}'                                                   return '}';
<*>'@'                                                   return '@';

<*><<EOF>>                                               return 'EOF';

/lex
%right '?' ':' '=>'
%right '!'
%right ','

%ebnf
%start module
%%

module

          : imports exports USING type_classes type tag EOF
            {$$ =
            new yy.ast.Module($1, $2, $4, $5, $6, @$); 
            return $$;
            }

          | imports exports USING type tag EOF
            {$$ =
            new yy.ast.Module($1, $2, [], $4, $5, @$); 
            return $$;
            }

          | imports exports tag EOF
            {$$ =
            new yy.ast.Module($1,$2,[], null, $3, @$); 
            return $$;
            }

          | imports exports EOF
            {$$ =
            new yy.ast.Module($1, $2, [], null, null, @$); 
            return $$;
            }

          | imports tag EOF
            {$$ =
            new yy.ast.Module($1,[],[], null, $2, @$); 
            return $$;
            }

          | imports EOF
            {$$ =
            new yy.ast.Module($1,[],[], null, null, @$); 
            return $$;
            }

          | exports USING type_classes type tag EOF
            {$$ =
            new yy.ast.Module([], $1, $3, $4, $5, @$); 
            return $$;
            }

          | exports USING type tag EOF
            {$$ =
            new yy.ast.Module([], $1, [], $3, $4, @$); 
            return $$;
            }

          | exports tag EOF
            {$$ =
            new yy.ast.Module([], $1, [], null, $2, @$); 
            return $$;
            }

          | exports EOF
            {$$ =
            new yy.ast.Module([], $1, [], null, null, @$); 
            return $$;
            }

          | USING type_classes type tag EOF
            {$$ =
            new yy.ast.Module([],[],$2, $3, $4, @$); 
            return $$;
            }

          | USING type tag EOF
            {$$ =
            new yy.ast.Module([],[],[], $2, $3, @$); 
            return $$;
            }

          | tag EOF
            {$$ =
            new yy.ast.Module([],[],[], null, $1, @$);          ;
            return $$;
            }  
          ;

imports
          : import_statement          {$$ =  [$1];         }
          | imports import_statement  {$$ = $1.concat($2); }
          ;

import_statement
          : IMPORT import_member FROM string_literal ';'?
            {$$ = new yy.ast.ImportStatement($2, $4, @$);}

          ;

import_member
          : default_member
          | alias_member
          | aggregate_member
          | composite_member
          ;

default_member
          : IDENTIFIER
            {$$ = new yy.ast.DefaultMember($1, @$);}
          ;

alias_member
          : IDENTIFIER AS IDENTIFIER
            {$$ = new yy.ast.AliasMember($1, $3, @$);}
          ;

aggregate_member
          : '*' AS IDENTIFIER
            {$$ = new yy.ast.AggregateMember($3, @$);}
          ;

composite_member
          : '{' member_list '}'
            {$$ = new yy.ast.CompositeMember($2, @$);}
          ;

member_list
          : (default_member | alias_member)
            {$$ = [$1];}

          | member_list ',' (default_member | alias_member)
            {$$ = $1.concat($3);}
          ;

exports
          : export
            {$$ = [$1]; }

          | exports export
            {$$ = $1.concat($2);}

          ;

export
          : (view_statement | frag_statement | export_from_statement)
            {$$ = $1;                                           }
          ;

view_statement

          : '{%' VIEW identifier USING type '%}'
            tag
            '{%' ENDVIEW '%}'
            {$$ = new yy.ast.ViewStatement($3, [],$5, $7, @$);     }

          | '{%' VIEW identifier type_classes USING type '%}'
            tag
            '{%' ENDVIEW '%}'
            {$$ = new yy.ast.ViewStatement($3, $4, $6, $8, @$);     }
          ;

frag_statement

          : '{%' FRAG identifier USING type '%}' children '{%' ENDFRAG '%}'
            {$$ = new yy.ast.FragmentStatement($3, [], [], $5, $7, @$);   }

          | '{%' FRAG identifier type_classes USING type '%}' children '{%' ENDFRAG '%}'
            {$$ = new yy.ast.FragmentStatement($3, $4, [], $6, $8, @$);   }

          | '{%' FRAG identifier parameters USING type '%}' children '{%' ENDFRAG '%}'
            {$$ = new yy.ast.FragmentStatement($3, [], $4, $6, $8, @$);   }

          | '{%' FRAG identifier type_classes parameters USING type '%}' children '{%' ENDFRAG '%}'
            {$$ = new yy.ast.FragmentStatement($3, $4, $5, $7, $9, @$);   }
          ;

type_classes
          : '[' type_class_list ']' {$$ = $2; }
          ;

type_class_list
          : type_class
            {$$ = [$1];                     }

          | type_class_list ',' type_class
            {$$ = $1.concat($3);            }
          ;

type_class
         : identifier
           {$$ = new yy.ast.TypeClass($1, null, @$);}

         | identifier ':' type
           {$$ = new yy.ast.TypeClass($1, $3, @$);}
         ;

type 
         : identifier
           {$$ = new yy.ast.Type($1, [], @$);                             }

         | identifier type_classes
           {$$ = new yy.ast.Type($1, $2, @$);                             }
         ;

export_from_statement

          : '{%' EXPORT IDENTIFIER FROM string_literal '%}'
            {$$ = new yy.ast.ExportFromStatement($3, $5, @$);  }
          ;

tag
          : '<' tagname attributes '>' children? '</' tagname '>'
             {$$ = new yy.ast.Tag($2, $3, $5?$5:[], @$);}

          | '<' tagname attributes '/>'
            { $$ = new yy.ast.Tag($2, $3, [], @$); }
          ;
tagname
          : identifier
            {$$ = $1;                                           }

          | identifier ':' identifier
            {$$ = new yy.ast.MemberExpression($1, $3, @$);      }
          ;

attributes
          : attributes attribute {$$ = $1.concat($2);}
          | {$$ = [];}
          ;

attribute
          : attribute_name '=' attribute_value
            {$$ = new yy.ast.Attribute($1.name, $1.namespace, $3, @$);}

          | attribute_name
            {$$ = new yy.ast.Attribute($1.name, $1.namespace,
            new yy.ast.BooleanLiteral(true, @$),@$);}
          ;

attribute_name
          : IDENTIFIER                  {$$ = {namespace:null, name:$1};}
          | IDENTIFIER ':' IDENTIFIER   {$$ = {namespace:$1, name:$3};}
          ;

attribute_value
          : (interpolation|string_literal|number_literal|boolean_literal) 
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
          : '|'  tagname
            {$$ = new yy.ast.Filter($2, [], @$);}

          | '|'  tagname arguments 
            {$$ = new yy.ast.Filter($2, $3, @$);}
          ;

children
          : child           {$$ = [$1];          }
          | children child  {$$ = $1.concat($2); }
          ;

child
          : (tag | control | text_interpolation | characters)
            {$$ = $1;}
          ;

text_interpolation
          : interpolation
            {$$ = new yy.ast.TextInterpolation($1, @$);}
          ;

control
          : (for_statement|if_statement|match_statement|call_statement) 
            {$$ = $1;}
          ;

for_statement
          : '{%' FOR typable_identifier IN expression '%}' children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForStatement($3, null, null, $5, $7, [], @$);}

          | '{%' FOR typable_identifier ',' typable_identifier IN expression '%}' 
            children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForStatement($3, $5, null, $7, $9, [], @$);}

          | '{%' FOR typable_identifier ',' typable_identifier ',' typable_identifier IN expression '%}'
            children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForStatement($3, $5, $7, $9, $11, [], @$);}

          | '{%' FOR typable_identifier IN expression '%}' 
             children '{%' ELSE '%}' children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForStatement($3, null, null, $5, $7, $11, @$);}

          | '{%' FOR typable_identifier ',' typable_identifier IN expression '%}' 
            children '{%' ELSE '%}' children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForStatement($3, $5, null, $7, $9, $13, @$);}

          | '{%' FOR typable_identifier ',' typable_identifier ',' typable_identifier IN expression '%}'
            children '{%' ELSE '%}' children '{%' ENDFOR '%}'
            {$$ = new yy.ast.ForStatement($3, $5, null, $7, $9, $15, @$);}
          ;

if_statement

         : '{%' IF expression '%}' children '{%' ENDIF '%}'
           {$$ = new yy.ast.IfStatement($3, $5, null, @$); }

         | '{%' IF expression '%}' children else_clause
           {$$ = new yy.ast.IfStatement($3, $5, $6, @$); }

         ;

else_clause

         :  '{%' ELSE '%}' children '{%' ENDIF '%}'
            {$$ = new yy.ast.ElseClause($4, @$);                              }

         |  '{%' ELSE IF expression '%}' children '{%' ENDIF '%}'
            {$$ = new yy.ast.ElseIfClause($4, $6, null,  @$);                 }

         |  '{%' ELSE IF expression '%}' children else_clause                 }
            {$$ = new yy.ast.ElseIfClause($4, $6, $7, @$);                    }

         ;

match_statement
         : '{%' MATCH identifier '%}' 
           case_statements 
           '{%' ELSE '%}'  
           children
           '{%' ENDMATCH '%}'
            {$$ = new yy.ast.MatchStatement($3, $5, $9, @$);}

         | '{%' MATCH identifier '%}' 
            case_statements
           '{%' ENDMATCH '%}'
            {$$ = new yy.ast.MatchStatement($3, $5, [], @$);}
         ;

case_statements
         : case_statement 
           {$$ = [$1];         }

         | case_statements case_statement 
           {$$ = $1.concat($2);}
         ;

case_statement
         : '{%' CASE TYPEOF string_literal '%}' children '{%' ENDCASE '%}'
           {$$ = new yy.ast.TypeOfCaseStatement($4, $6, @$);}

         | '{%' CASE INSTANCEOF identifier '%}' children '{%' ENDCASE '%}'
           {$$ = new yy.ast.InstanceOfCaseStatement($4, $6, @$);}
         ;

call_statement
         :'{%' CALL identifier arguments  '%}'
          {$$ = new yy.ast.CallStatement($3, $4, @$);}

         |'{%' CALL identifier '%}'
          {$$ = new yy.ast.CallStatement($3, [], @$);}

         |'{%' CALL member_expression '%}'
          {$$ = new yy.ast.CallStatement($3, [], @$);}

         |'{%' CALL member_expression arguments '%}'
          {$$ = new yy.ast.CallStatement($3, $4, @$);}
          
         |'{%' CALL '(' expression ')' arguments  '%}'
          {$$ = new yy.ast.CallStatement($4, $6, @$);}

         |'{%' CALL '(' expression ')' '%}'
          {$$ = new yy.ast.CallStatement($4, [], @$);}
         ;

characters
          : (CHARACTERS)
            {$$ = new yy.ast.Characters($1, @$); }
          ;

arguments
          : '(' ')'
            {$$ = [];                                      }

          | '(' argument_list ')'
            {$$ = $2;                                      }

          ;

argument_list
          : expression
            {$$ = [$1];                                    }

          | argument_list ',' expression
            {$$ = $1.concat($3);                           }
          ;

expression
          : '(' expression ')'
            { $$ = $2;                                         }

          | expression  '?' expression ':' expression
            {$$ = new yy.ast.TernaryExpression($1, $3, $5, @$);}

          | '(' expression binary_operator expression ')'
            {$$ = new yy.ast.BinaryExpression($2, $3, $4, @$); }

          | '!' expression
            {$$ = new yy.ast.UnaryExpression($1, $2, @$);      }

          | '@@' '[' expression ']'
            {$$ = new yy.ast.ReadExpression($3,null, @$);      } 

          | '@@' '[' expression '?' expression ']'
            {$$ = new yy.ast.ReadExpression($3, $5, @$);       }

          | (new_expression | 
             call_expression | 
             member_expression | 
             function_expression | 
             bind_expression | 
             object_literal |
             array_literal | 
             string_literal | 
             boolean_literal | 
             number_literal |
             type_assertion|
             variable)
            {$$ = $1;                                          } 
         ;

binary_operator
          : ('>'|'>='|'<'|'<='|'=='|'!='|'+'|'/'|'-'|'='|'&&'|'||'|'^'|INSTANCEOF)
            { $$ = yy.help.convertOperator($1);}
          ;

call_expression
          : identifier arguments
            {$$ = new yy.ast.CallExpression($1, [], $2, @$);    }

          | identifier type_classes arguments
            {$$ = new yy.ast.CallExpression($1, $2, $3, @$);    }

          | member_expression  arguments
            {$$ = new yy.ast.CallExpression($1, [], $2, @$);    }

          | member_expression type_classes arguments
            {$$ = new yy.ast.CallExpression($1, $2, $3, @$);    }

          | '(' expression ')' arguments
            {$$ = new yy.ast.CallExpression($2, [], $4, @$);    }
          ;

bind_expression
          : identifier '::' 'identifier'
            {$$ = new yy.ast.BindExpression($1, $3, [] , @$);}

          | identifier '::' 'identifier' arguments 
            {$$ = new yy.ast.BindExpression($1, $3, $4 , @$);}

          | member_expression '::' identifier
            {$$ = new yy.ast.BindExpression($1, $3, [], @$);}

          | member_expression '::' identifier arguments
            {$$ = new yy.ast.BindExpression($1, $3, $4, @$);}
          ;

new_expression
          : NEW identifier
            {$$ = new yy.ast.NewExpression($2, [], @$);}

          | NEW identifier arguments
            {$$ = new yy.ast.NewExpression($2, $3, @$);}
          ;

function_expression

          : '\\' parameter_list '=>'  expression
            {$$ = new yy.ast.FunctionExpression($2, $4, @$);   }

          | '=>' expression
            {$$ = new yy.ast.FunctionExpression([], $2, @$);   }
          ;

parameters
          : '(' ')'                  {$$ = [];}
          | '(' parameter_list ')'   {$$ = $2;}
          ;

parameter_list

          : typable_identifier
            {$$ = [$1];                                     }

          | parameter_list ',' typable_identifier
            {$$ = $1.concat($3);                            }
          ;

member_expression
          : identifier '.' identifier   
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | context_property '.' identifier 
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | context_variable '.' identifier
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | array_literal '.' identifier   
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | object_literal '.' identifier   
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | string_literal '.' identifier
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | call_expression '.' identifier
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | bind_expression '.' identifier
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          |'(' expression ')' '.' identifier
            {$$ = new yy.ast.MemberExpression($2, $5, @$); }

          | type_assertion '.' identifier
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }

          | member_expression '.' identifier
            {$$ = new yy.ast.MemberExpression($1, $3, @$); }
          ;

object_literal
          : '{' '}'
            {$$ = new yy.ast.ObjectLiteral([], @$); }

          | '{' key_value_pairs '}'
            {$$ = new yy.ast.ObjectLiteral($2, @$); }
          ;

key_value_pairs
          : key_value_pair
           {$$ = [$1]; }

          | key_value_pairs ',' key_value_pair
           {$$ = $1.concat($3); }
          ;

key_value_pair
          : (IDENTIFIER|STRING_LITERAL) ':' expression
            {$$ = {key:$1, value:$3}; }
          ;

array_literal
          : '[' ']'
            {$$ = new yy.ast.ArrayLiteral([], @$); }

          | '[' argument_list ']'
            {$$ = new yy.ast.ArrayLiteral($2, @$); }
          ;

string_literal
          : STRING_LITERAL {$$ = new yy.ast.StringLiteral($1, @$); }
          ;

number_literal
          : NUMBER_LITERAL
          {$$ = new yy.ast.NumberLiteral(yy.help.parseNumber($1), @$); }
          ;

boolean_literal
          : (TRUE|FALSE)
          {$$ = new yy.ast.BooleanLiteral(yy.help.parseBoolean($1), @$);}
          ;

typable_identifier
         : identifier
           {$$ = $1;                                                      }

         | identifier ':' identifier
           {$$ = new yy.ast.TypableIdentifier($1, $3, [], false, @$);     }

         | identifier ':' identifier '[' ']'
           {$$ = new yy.ast.TypableIdentifier($1, $3, [], true, @$);      }

         | identifier ':' identifier type_classes
           {$$ = new yy.ast.TypableIdentifier($1, $3, $4, false, @$);     }

         | identifier ':' identifier type_classes '[' ']'
           {$$ = new yy.ast.TypableIdentifier($1, $3, $4, true, @$);      }
         ;

type_assertion
         : '(' expression AS identifier ')'
            {$$ = new yy.ast.TypeAssertion($2, $4, @$);          }
         ;

variable
         : (identifier|context_property|context_variable)
          {$$ = $1; }
         ;

identifier
          : IDENTIFIER
            {$$ = new yy.ast.Identifier($1, '', @$);             }
          ;

context_property
          : CONTEXT_PROP
            {$$ = new yy.ast.ContextProperty($1.slice(1), @$)    }
          ;

context_variable
          : ('@'|THIS) {$$ = new yy.ast.ContextVariable(@$);}
          ;
            
