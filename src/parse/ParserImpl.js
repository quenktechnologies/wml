/* parser generated by jison 0.4.16 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var ParserImpl = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,6],$V1=[1,5],$V2=[8,13],$V3=[1,14],$V4=[16,19,85],$V5=[1,18],$V6=[1,28],$V7=[1,37],$V8=[1,42],$V9=[1,38],$Va=[6,13,18,28,69,84],$Vb=[16,19,23,85],$Vc=[13,16,19,25,30,33,34,36,37,42,55,56,58,74,85,86,87,88,89,90,91,92],$Vd=[13,18,28,69,84],$Ve=[1,60],$Vf=[1,59],$Vg=[1,66],$Vh=[1,68],$Vi=[1,69],$Vj=[1,70],$Vk=[1,71],$Vl=[1,72],$Vm=[1,84],$Vn=[1,82],$Vo=[13,16,25,30,33,36,37,42,56,74,86,87,88,89,90,91,92],$Vp=[2,34],$Vq=[1,85],$Vr=[1,86],$Vs=[1,87],$Vt=[1,94],$Vu=[1,91],$Vv=[1,98],$Vw=[13,16,18,19,28,69,84,85],$Vx=[30,33],$Vy=[37,58],$Vz=[1,128],$VA=[1,129],$VB=[1,133],$VC=[36,37,56],$VD=[73,85],$VE=[55,74],$VF=[13,16,25,30,33,36,37,42,55,56,74,86,87,88,89,90,91,92],$VG=[34,55,59,60,61,85],$VH=[13,16,25,30,33,36,37,56,74,86,87,88,89,90,91,92];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"template":3,"imports":4,"tag":5,"EOF":6,"import":7,"IMPORT":8,"variable":9,"FROM":10,"string_literal":11,";":12,"<":13,"tagname":14,"attributes":15,">":16,"tag_option0":17,"</":18,"/>":19,"tagname_group0":20,"attribute":21,"attribute_name":22,"=":23,"attribute_value":24,":":25,"interpolation":26,"attribute_value_group0":27,"{{":28,"expression":29,"}}":30,"filters":31,"filter":32,"|":33,"(":34,"arguments":35,")":36,",":37,"value_expression":38,"unary_expression":39,"ternary_expression":40,"binary_expression":41,"?":42,"binary_operator":43,"binary_operator_group0":44,"!":45,"literal":46,"property_expression":47,"function_expression":48,"method_expression":49,"bind_expression":50,"array_literal":51,"function_literal":52,"number_literal":53,"boolean_literal":54,"[":55,"]":56,"parameters":57,"=>":58,"STRING_LITERAL":59,"NUMBER_LITERAL":60,"BOOLEAN":61,".":62,"children":63,"child":64,"control":65,"characters":66,"control_group0":67,"for":68,"{%":69,"FOR":70,"for_option0":71,"for_option1":72,"IN":73,"%}":74,"ENDFOR":75,"if":76,"IF":77,"ENDIF":78,"ELSE":79,"include":80,"INCLUDE":81,"include_group0":82,"include_option0":83,"CHARACTERS":84,"ID":85,">=":86,"<=":87,"==":88,"!=":89,"+":90,"/":91,"-":92,"$accept":0,"$end":1},
terminals_: {2:"error",6:"EOF",8:"IMPORT",10:"FROM",12:";",13:"<",16:">",18:"</",19:"/>",23:"=",25:":",28:"{{",30:"}}",33:"|",34:"(",36:")",37:",",42:"?",45:"!",55:"[",56:"]",58:"=>",59:"STRING_LITERAL",60:"NUMBER_LITERAL",61:"BOOLEAN",62:".",69:"{%",70:"FOR",73:"IN",74:"%}",75:"ENDFOR",77:"IF",78:"ENDIF",79:"ELSE",81:"INCLUDE",84:"CHARACTERS",85:"ID",86:">=",87:"<=",88:"==",89:"!=",90:"+",91:"/",92:"-"},
productions_: [0,[3,3],[3,2],[4,1],[4,2],[7,5],[5,8],[5,4],[14,1],[15,2],[15,0],[21,3],[21,1],[22,1],[22,3],[24,1],[24,1],[26,3],[26,4],[31,1],[31,2],[32,2],[32,5],[35,1],[35,3],[29,1],[29,1],[29,1],[29,1],[40,5],[41,5],[43,1],[39,2],[38,1],[38,1],[38,1],[38,1],[38,1],[38,1],[46,1],[46,1],[46,1],[46,1],[46,1],[51,2],[51,3],[52,3],[57,2],[57,3],[57,5],[11,1],[53,1],[54,1],[48,4],[48,3],[47,3],[47,3],[49,4],[49,3],[50,3],[50,6],[50,3],[50,6],[63,1],[63,2],[64,1],[64,1],[64,1],[64,1],[65,1],[68,12],[76,8],[76,12],[80,5],[66,1],[9,1],[17,0],[17,1],[20,1],[20,1],[27,1],[27,1],[44,1],[44,1],[44,1],[44,1],[44,1],[44,1],[44,1],[44,1],[44,1],[67,1],[67,1],[67,1],[71,0],[71,1],[72,0],[72,1],[82,1],[82,1],[82,1],[82,1],[83,0],[83,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
this.$ = new yy.ast.Template($$[$0-2], $$[$0-1], yy.help.location(this._$, _$[$0-2], _$[$0-1])); return this.$;
break;
case 2:
this.$ = new yy.ast.Template([], $$[$0-1], yy.help.location(this._$, _$[$0-1], _$[$0-1])); return this.$;
break;
case 3:
this.$ =  [$$[$0]];         
break;
case 4: case 20: case 64:
this.$ = $$[$0-1].concat($$[$0]); 
break;
case 5:
this.$ = new yy.ast.Import($$[$0-3], $$[$0-1], yy.help.location(this._$, _$[$0-4], _$[$0]));
break;
case 6:

             yy.help.ensureTagsMatch($$[$0-6], $$[$0]);
             this.$ = new yy.ast.Tag($$[$0-6], $$[$0-5], $$[$0-3]?$$[$0-3]:[], yy.help.location(this._$, _$[$0-7], _$[$0]));
             
break;
case 7:
 this.$ = new yy.ast.Tag($$[$0-2], $$[$0-1], [], yy.help.location(this._$, _$[$0-3], _$[$0])); 
break;
case 8: case 15: case 16: case 69: case 75:
this.$ = $$[$0];
break;
case 9:
this.$ = $$[$0-1].concat($$[$0]);
break;
case 10:
this.$ = [];
break;
case 11:
this.$ = new yy.ast.Attribute($$[$0-2].name, $$[$0-2].namespace, $$[$0], yy.help.location(this._$, _$[$0-2], _$[$0]));
break;
case 12:
this.$ = new yy.ast.Attribute($$[$0].name, $$[$0].namespace, 
            new yy.ast.BooleanLiteral(true, yy.help.location(this._$, _$[$0], _$[$0])),
            yy.help.location(this._$, _$[$0], _$[$0]));
break;
case 13:
this.$ = {namespace:null, name:$$[$0]};
break;
case 14:
this.$ = {namespace:$$[$0-2], name:$$[$0]};
break;
case 17:
this.$ = new yy.ast.Interpolation($$[$0-1], [], yy.help.location(this._$, _$[$0-2], _$[$0]));
break;
case 18:
this.$ = new yy.ast.Interpolation($$[$0-2], $$[$0-1], yy.help.location(this._$, _$[$0-3], _$[$0]));
break;
case 19:
this.$ =  [$$[$0]];     
break;
case 21:
this.$ = new yy.ast.Filter($$[$0], [], yy.help.location(this._$, _$[$0-1], _$[$0]));
break;
case 22:
this.$ = new yy.ast.Filter($$[$0-3], $$[$0-1], yy.help.location(this._$, _$[$0-4], _$[$0]));
break;
case 23: case 63:
this.$ = [$$[$0]];          
break;
case 24:
this.$ = $$[$0-2].concat($$[$0]); 
break;
case 29:
this.$ = new yy.ast.TernaryExpression($$[$0-4], $$[$0-2], $$[$0], yy.help.location(this._$, _$[$0-4], _$[$0]));
break;
case 30:
this.$ = new yy.ast.BinaryExpression($$[$0-3], $$[$0-2], $$[$0-1],  yy.help.location(this._$, _$[$0-4], _$[$0]));
break;
case 31:
 this.$ = yy.help.convertOperator($$[$0]);
break;
case 32:
this.$ = new yy.ast.UnaryExpression($$[$0-1], $$[$0], yy.help.location(this._$, _$[$0-1], _$[$0]));
break;
case 44:
this.$ = new yy.ast.ArrayLiteral([], yy.help.location(this._$, _$[$0-1], _$[$0])); 
break;
case 45:
this.$ = new yy.ast.ArrayLiteral($$[$0-1], yy.help.location(this._$, _$[$0-2], _$[$0])); 
break;
case 46:
this.$ = new yy.ast.FunctionLiteral($$[$0-2], $$[$0], yy.help.location(this._$, _$[$0-2], _$[$0])); 
break;
case 47:
this.$ = [];                      
break;
case 48:
this.$ = [$$[$0-1]];                    
break;
case 49:
this.$ = $$[$0-3].concat($$[$0-1]);           
break;
case 50:
this.$ = new yy.ast.StringLiteral($$[$0], yy.help.location(this._$, _$[$0], _$[$0])); 
break;
case 51:
this.$ = new yy.ast.NumberLiteral(yy.help.parseNumber($$[$0]), yy.help.location(this._$, _$[$0], _$[$0])); 
break;
case 52:
this.$ = new yy.ast.BooleanLiteral(yy.help.parseBoolean($$[$0]), yy.help.location(this._$, _$[$0], _$[$0]));
break;
case 53:
this.$ = new yy.ast.FunctionExpression($$[$0-3], $$[$0-1], yy.help.location(this._$, _$[$0-3], _$[$0]));
break;
case 54:
this.$ = new yy.ast.FunctionExpression($$[$0-2], [], yy.help.location(this._$, _$[$0-2], _$[$0]));
break;
case 55: case 56:
this.$ = $$[$0-2]+'.'+$$[$0];
break;
case 57:
this.$ = new yy.ast.MethodExpression($$[$0-3], $$[$0-1], yy.help.location(this._$, _$[$0-3], _$[$0]));
break;
case 58:
this.$ = new yy.ast.MethodExpression($$[$0-2], [], yy.help.location(this._$, _$[$0-2], _$[$0]));
break;
case 59:
this.$ = new yy.ast.BindExpression($$[$0-2], $$[$0], [] , yy.help.location(this._$, _$[$0-2], _$[$0]));
break;
case 60:
this.$ = new yy.ast.BindExpression($$[$0-5], $$[$0-3], $$[$0-1] , yy.help.location(this._$, _$[$0-5], _$[$0]));
break;
case 61:
this.$ = new yy.ast.BindExpression($$[$0-2], $$[$0], [], yy.help.location(this._$, _$[$0-2], _$[$03]));
break;
case 62:
this.$ = new yy.ast.BindExpression($$[$0-5], $$[$0-3], $$[$0-1], yy.help.location(this._$, _$[$0-5], _$[$0]));
break;
case 70:

            
            this.$ = new yy.ast.ForLoop($$[$0-9], 
            ($$[$0-7])? $$[$0-7] : 'index',
            $$[$0-5],
            $$[$0-3],
            yy.help.location(this._$, _$[$0-11], _$[$0])); 
            
            
break;
case 71:
this.$ = new yy.ast.IfCondition($$[$0-5], $$[$0-3], [], yy.help.location(this._$, _$[$0-7], _$[$0])); 
break;
case 72:
this.$ = new yy.ast.IfCondition($$[$0-9], $$[$0-7], $$[$0-3], yy.help.location(this._$, _$[$0-11], _$[$01]));
break;
case 73:
this.$ = new yy.ast.Include($$[$0-2], ($$[$0-1]? $$[$0-1] : []),  yy.help.location(this._$, _$[$0-4], _$[$0]));
break;
case 74:
this.$ = new yy.ast.Characters($$[$0], yy.help.location(this._$, _$[$0], _$[$0])); 
break;
}
},
table: [{3:1,4:2,5:3,7:4,8:$V0,13:$V1},{1:[3]},{5:7,7:8,8:$V0,13:$V1},{6:[1,9]},o($V2,[2,3]),{9:12,14:10,20:11,47:13,85:$V3},{9:15,85:$V3},{6:[1,16]},o($V2,[2,4]),{1:[2,2]},o($V4,[2,10],{15:17}),o($V4,[2,8]),o($V4,[2,78],{62:$V5}),o($V4,[2,79]),o([10,13,16,19,23,25,30,33,34,36,37,42,55,56,58,62,73,74,85,86,87,88,89,90,91,92],[2,75]),{10:[1,19]},{1:[2,1]},{9:24,16:[1,20],19:[1,21],21:22,22:23,85:$V3},{9:25,47:26,85:$V3},{11:27,59:$V6},{5:32,13:$V1,17:29,18:[2,76],26:34,28:$V7,63:30,64:31,65:33,66:35,67:36,68:39,69:$V8,76:40,80:41,84:$V9},o($Va,[2,7]),o($V4,[2,9]),o($V4,[2,12],{23:[1,43]}),o($Vb,[2,13],{25:[1,44]}),o($Vc,[2,55],{62:$V5}),o($Vc,[2,56]),{12:[1,45]},o([12,13,16,19,25,30,33,36,37,42,56,74,85,86,87,88,89,90,91,92],[2,50]),{18:[1,46]},{5:32,13:$V1,18:[2,77],26:34,28:$V7,64:47,65:33,66:35,67:36,68:39,69:$V8,76:40,80:41,84:$V9},o($Vd,[2,63]),o($Vd,[2,65]),o($Vd,[2,66]),o($Vd,[2,67]),o($Vd,[2,68]),o($Vd,[2,69]),{9:54,11:63,29:48,34:$Ve,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},o($Vd,[2,74]),o($Vd,[2,91]),o($Vd,[2,92]),o($Vd,[2,93]),{70:$Vj,77:$Vk,81:$Vl},{11:76,24:73,26:74,27:75,28:$V7,53:77,59:$V6,60:$Vh},{9:78,85:$V3},o($V2,[2,5]),{9:12,14:79,20:11,47:13,85:$V3},o($Vd,[2,64]),{30:[1,80],31:81,32:83,33:$Vm,42:$Vn},o($Vo,[2,25]),o($Vo,[2,26]),o($Vo,[2,27]),o($Vo,[2,28]),o($Vo,[2,33]),o($Vo,$Vp,{34:$Vq,58:$Vr,62:$V5}),o($Vo,[2,35],{34:$Vs,58:[1,88]}),o($Vo,[2,36]),o($Vo,[2,37]),o($Vo,[2,38]),{9:54,11:63,29:89,34:$Ve,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},{9:92,11:63,34:$Vt,36:$Vu,38:90,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:93,59:$V6,60:$Vh,61:$Vi,85:$V3},o($Vo,[2,39]),o($Vo,[2,40]),o($Vo,[2,41]),o($Vo,[2,42]),o($Vo,[2,43]),{9:54,11:63,29:97,34:$Ve,35:96,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,56:[1,95],57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},{58:$Vv},o([13,16,19,25,30,33,36,37,42,56,74,85,86,87,88,89,90,91,92],[2,51]),o($Vo,[2,52]),{9:99,85:$V3},{9:54,11:63,29:100,34:$Ve,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},{9:102,47:103,48:104,49:105,82:101,85:$V3},o($V4,[2,11]),o($V4,[2,15]),o($V4,[2,16]),o($V4,[2,80]),o($V4,[2,81]),o($Vb,[2,14]),{16:[1,106]},o($Vw,[2,17]),{30:[1,107],32:108,33:$Vm},{9:54,11:63,29:109,34:$Ve,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},o($Vx,[2,19]),{9:110,85:$V3},{9:54,11:63,29:97,34:$Ve,35:111,36:[1,112],38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},{9:113,85:$V3},{9:54,11:63,29:97,34:$Ve,35:114,36:[1,115],38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},{9:116,85:$V3},o($Vo,[2,32]),{13:[1,121],16:[1,119],43:117,44:118,86:[1,120],87:[1,122],88:[1,123],89:[1,124],90:[1,125],91:[1,126],92:[1,127]},o($Vy,[2,47]),o([13,16,86,87,88,89,90,91,92],$Vp,{34:$Vq,36:$Vz,58:$Vr,62:$V5}),{37:$VA,58:$Vv},{9:130,34:$Vt,36:$Vu,57:131,85:$V3},o($Vo,[2,44]),{37:$VB,56:[1,132]},o($VC,[2,23],{42:$Vn}),{9:54,11:63,29:134,34:$Ve,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},o($VD,[2,94],{71:135,37:[1,136]}),{42:$Vn,74:[1,137]},{51:139,55:$Vg,74:[2,102],83:138},o($VE,[2,98],{34:$Vq,62:$V5}),o($VE,[2,99],{34:$Vs}),o($VE,[2,100]),o($VE,[2,101]),o($Va,[2,6]),o($Vw,[2,18]),o($Vx,[2,20]),{25:[1,140],42:$Vn},o($Vx,[2,21],{34:[1,141]}),{36:[1,142],37:$VB},o($VF,[2,54]),o($Vo,[2,59],{34:[1,143]}),{36:[1,144],37:$VB},o($VF,[2,58]),o($Vo,[2,61],{34:[1,145]}),{9:54,11:63,34:$Vt,38:146,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},o($VG,[2,31]),o($VG,[2,82]),o($VG,[2,83]),o($VG,[2,84]),o($VG,[2,85]),o($VG,[2,86]),o($VG,[2,87]),o($VG,[2,88]),o($VG,[2,89]),o($VG,[2,90]),o($Vy,[2,48]),{9:147,85:$V3},{36:$Vz},{37:$VA},o($Vo,[2,45]),{9:54,11:63,29:148,34:$Ve,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},o($VH,[2,46],{42:$Vn}),{9:150,72:149,73:[2,96],85:$V3},o($VD,[2,95]),{5:32,13:$V1,26:34,28:$V7,63:151,64:31,65:33,66:35,67:36,68:39,69:$V8,76:40,80:41,84:$V9},{74:[1,152]},{74:[2,103]},{9:54,11:63,29:153,34:$Ve,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},{9:54,11:63,29:97,34:$Ve,35:154,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},o($VF,[2,53]),{9:54,11:63,29:97,34:$Ve,35:155,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},o($VF,[2,57]),{9:54,11:63,29:97,34:$Ve,35:156,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},{36:[1,157]},{36:[1,158]},o($VC,[2,24],{42:$Vn}),{73:[1,159]},{73:[2,97]},{5:32,13:$V1,26:34,28:$V7,64:47,65:33,66:35,67:36,68:39,69:[1,160],76:40,80:41,84:$V9},o($Vd,[2,73]),o($VH,[2,29],{42:$Vn}),{36:[1,161],37:$VB},{36:[1,162],37:$VB},{36:[1,163],37:$VB},o($Vo,[2,30]),o($Vy,[2,49]),{9:54,11:63,29:164,34:$Ve,38:49,39:50,40:51,41:52,45:$Vf,46:53,47:55,48:56,49:57,50:58,51:61,52:62,53:64,54:65,55:$Vg,57:67,59:$V6,60:$Vh,61:$Vi,85:$V3},{70:$Vj,77:$Vk,78:[1,165],79:[1,166],81:$Vl},o($Vx,[2,22]),o($Vo,[2,60]),o($Vo,[2,62]),{42:$Vn,74:[1,167]},{74:[1,168]},{74:[1,169]},{5:32,13:$V1,26:34,28:$V7,63:170,64:31,65:33,66:35,67:36,68:39,69:$V8,76:40,80:41,84:$V9},o($Vd,[2,71]),{5:32,13:$V1,26:34,28:$V7,63:171,64:31,65:33,66:35,67:36,68:39,69:$V8,76:40,80:41,84:$V9},{5:32,13:$V1,26:34,28:$V7,64:47,65:33,66:35,67:36,68:39,69:[1,172],76:40,80:41,84:$V9},{5:32,13:$V1,26:34,28:$V7,64:47,65:33,66:35,67:36,68:39,69:[1,173],76:40,80:41,84:$V9},{70:$Vj,75:[1,174],77:$Vk,81:$Vl},{70:$Vj,77:$Vk,78:[1,175],81:$Vl},{74:[1,176]},{74:[1,177]},o($Vd,[2,70]),o($Vd,[2,72])],
defaultActions: {9:[2,2],16:[2,1],139:[2,103],150:[2,97]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = new Error();

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"flex":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return;
break;
case 1:return 8;
break;
case 2:return 10;
break;
case 3:return 70;
break;
case 4:return 75;
break;
case 5:return 77;
break;
case 6:return 78;
break;
case 7:return 79;
break;
case 8:return 'ELSEIF';
break;
case 9:return 73;
break;
case 10:return 81;
break;
case 11:return 61;
break;
case 12:return 60;
break;
case 13:return 59;
break;
case 14:return 28;
break;
case 15:return 30;
break;
case 16:return 33;
break;
case 17:return 58;
break;
case 18:return '->';
break;
case 19:this.begin('CONTROL');      return 69;
break;
case 20:this.begin('CHILDREN');     return 74;
break;
case 21:return 18;
break;
case 22:this.begin('CHILDREN');     return 19;
break;
case 23:this.begin('CHILDREN');     return 16;
break;
case 24:return 13;
break;
case 25:return 34;
break;
case 26:return 36;
break;
case 27:return 55;
break;
case 28:return 56;
break;
case 29:return 12
break;
case 30:return 25;
break;
case 31:return 23
break;
case 32:return 88;
break;
case 33:return 89;
break;
case 34:return 86;
break;
case 35:return 87;
break;
case 36:return 90;
break;
case 37:return 92;
break;
case 38:return '*';
break;
case 39:return 91;
break;
case 40:return 45;
break;
case 41:return 37;
break;
case 42:return 42;
break;
case 43:return '{';
break;
case 44:return '}';
break;
case 45:return 85;
break;
case 46:this.popState();           return 28;
break;
case 47:this.begin('CONTROL');     return 69;
break;
case 48:this.popState();           return 18;
break;
case 49:this.popState();           return 13;
break;
case 50:this.popState();           return 84;
break;
case 51:return 6;
break;
case 52:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:\s+)/,/^(?:import)/,/^(?:from)/,/^(?:for)/,/^(?:endfor)/,/^(?:if)/,/^(?:endif)/,/^(?:else)/,/^(?:elseif)/,/^(?:in)/,/^(?:include)/,/^(?:true|false)/,/^(?:((([-]?([-]?([0]|(([1-9])([0-9]+)*)))\.([0-9]+)*(([eE])([+-]?[0-9]+))?)|(\.([0-9]+)(([eE])([+-]?[0-9]+))?)|(([-]?([0]|(([1-9])([0-9]+)*)))(([eE])([+-]?[0-9]+))?))|([0][xX]([0-9a-fA-F])+)|([0]([0-7])+)))/,/^(?:(("(([^\"\\\n\r]+)|(\\((([\'\"\\bfnrtv])|([^\'\"\\bfnrtv0-9xu]))|((?:[1-7][0-7]{0,2}|[0-7]{2,3}))|([x]([0-9a-fA-F]){2})|([u]([0-9a-fA-F]){4})))|(\\(\r\n|\r|\n)))*")|('(([^\'\\\n\r]+)|(\\((([\'\"\\bfnrtv])|([^\'\"\\bfnrtv0-9xu]))|((?:[1-7][0-7]{0,2}|[0-7]{2,3}))|([x]([0-9a-fA-F]){2})|([u]([0-9a-fA-F]){4})))|(\\(\r\n|\r|\n)))*')))/,/^(?:\{\{)/,/^(?:\}\})/,/^(?:\|)/,/^(?:=>)/,/^(?:->)/,/^(?:\{%)/,/^(?:%\})/,/^(?:<\/)/,/^(?:\/>)/,/^(?:>)/,/^(?:<)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:;)/,/^(?::)/,/^(?:=)/,/^(?:==)/,/^(?:!=)/,/^(?:>=)/,/^(?:<=)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:!)/,/^(?:,)/,/^(?:\?)/,/^(?:\{)/,/^(?:\})/,/^(?:([a-zA-Z$0-9_][a-zA-Z$_0-9.-]*))/,/^(?:\{\{)/,/^(?:\{%)/,/^(?:<\/)/,/^(?:<)/,/^(?:[^\/<>{%}]+)/,/^(?:$)/,/^(?:.)/],
conditions: {"CONTROL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,51,52],"inclusive":true},"CHILDREN":{"rules":[0,46,47,48,49,50,51],"inclusive":false},"INITIAL":{"rules":[0,1,2,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,51,52],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = ParserImpl;
exports.Parser = ParserImpl.Parser;
exports.parse = function () { return ParserImpl.parse.apply(ParserImpl, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}