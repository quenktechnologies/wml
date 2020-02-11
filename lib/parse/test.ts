export const tests: { [key: string]: any } = {

    'should parse qualified import': {
        input: `{% import * as lib from "path/to/libs" %}`
    },
    'should parse named import': {
        input: `{% import (B) from "path/to/a/b" %}`
    },
    'should parse a self closing tag': {
        input: '<simple/>'
    },
    'should parse a self closing tag with attributes 0': {
        input: '<user name="xyaa aaz" position={{4|x(20)}} wml:val="test"/>',
    },
    'should parse a self closing tag with attributes 1': {
        input: '<user app:enabled id=24 />',
    },
    'should parse a self closing tag with attributes 2': {
        input: '<user name="xyaa aaz" id="24" align="left"/>',
    },
    'should parse a parent tag': {
        input: '<panel>  \n\n\n\n\n\n\n\n\n  </panel>'
    },
    'should parse a parent tag with attributes': {
        input: '<panel type="default" size="40" align="left"> </panel>'
    },
    'should parse parent tags with mixed children': {
        input: '<panel> This is my offsprings.<a>Link</a>Hey now! <Input/></panel>'
    },
    'should parse parent tags with tag children (L1)': {
        input: '<panel><a></a></panel>'
    },
    'should parse parent tags with tag children (L2)': {
        input: '<panel><a href="link" onclick={{@someting.invoke()}}>' +
            'Click Here</a><table/></panel>'
    },
    'should parse parent tags with tag children (L3)': {
        input: '<panel><a href="link">Click Here</a><table/>' +
            '<panel c="22"></panel></panel>'
    },
    'should do it all together now': {

        input: '<modal name="mymodal" x="1" y="2">' +
            '<modal-header>My Modal</modal-header>' +
            '<modal-body>' +
            'Creativxity is inhibxited by greed and corruption.' +
            '<vote-button/>' +
            '<vote-count source={{@}}/> Votes' +
            '<textarea wml:id="ta" disabled size=32 onchange={{@setText}}>' +
            ' Various text' +
            '</textarea>' +
            '</modal-body>' +
            '</modal>'

    },
    'should parse for in statements': {

        input: '<root>' +
            '{% for value,key in [] %}' +
            '<stem>{{value}}</stem>' +
            '{% endfor %}' +
            '</root>'

    },
    'should parse for of statements': {

        input: '<root>' +
            '{% for value,key of {} %}' +
            '<stem>{{key}} ~ {{value}}</stem>' +
            '{% endfor %}' +
            '</root>'

    },
    'should parse if then expressions': {

        input: '<Html id={{@id}}>{{ if @check() then a else b }}</Html>'

    },
    'should parse function expressions': {

        input: '<button onclick={{e -> call(e)}}/>'

    },

    'should parse calls': {

        input: '<tr>{% for x,i in y %} {{ f(x, i) }} {% endfor %} </tr>'

    },
    'should parse negative numbers': {

        input: '<tag n={{ ( -0.5 + 3) }} m={{(4 + -2)}} g={{ (10 --5) }}/>'

    },

    'should allow filter chaining': {

        input: '<p>{{ @value | f1 | f2(2) | f3(@value) }}</p>'

    },
    'should parse if else statements': {

        input: '<Tag>{% if value %}<text>Text</text>{% else %}<text>else</text>{% endif %}</Tag>'

    },

    'should parse if else if statements': {

        input: `
        <Tag>
          {% if value %}
            <text>Text</text>
          {% else if value %}
            <text>else</text>
          {% else %}
            no
          {% endif %}
        </Tag>`

    },

    'should parse short fun statements': {

        input: '{% fun vue () = <View/> %}'

    },

    'should parse short fun statements with arguments': {

        input: '{% fun vue (a:String, b:String, c:String) = ' +
            '<View a={{a}} b={{b}} c={{c}}/> %}'

    },

    'should parse short fun statements with type parameters': {

        input: '{% fun vue [A,B:C,C] (a:A, b:B) = ' +
            '{{ (a + b) + c }} %}'

    },

    'should parse extended fun statements': {

        input: '{% fun vue () %} <View/> {% endfun %}'

    },

    'should parse extended fun statements with arguments': {

        input: '{% fun vue (a:String, b:String, c:String) %}' +
            '<View a={{a}} b={{b}} c={{c}}/> {% endfun %}'

    },

    'should parse extended fun statements with type parameters': {

        input: '{% fun vue [A,B:C,C] (a:A, b:B) %} {{ ((a + b) + c) }} {% endfun %}'

    },

    'should parse binary expressions': {

        input: '<p>{{(Styles.A  + Styles.B)}}</p>'

    },

    'should parse complicated expressions': {

        input: '<div class={{((Styles.A + " ") + Style.B)}}/>'
    },

    'should allow for statement as child of fun': {

        input: '{% fun sven () %} {% for a in b %} {{b}} {% endfor %} {% endfun %}'

    },
    'should allow if statement as child of  fun': {

        input: '{% fun ate (o:Object) %} {% if a %} {{a}} {% else %} {{a}} ' +
            '{% endif %} {% endfun %}'

    },
    'should allow for booleans in interpolations': {

        input: '<bool active={{true}}>{{if fun() then false else true}}</bool>'

    },

    'should allow calls on expressions': {

        input: '<div>{{(content() || bar)(foo)}}</div>'

    },
    'should allow boolean attribute values': {

        input: '<tag on=true off=false/>'

    },
    'should parse typed views': {

        input: '{% view Main (Context[String]) %} <p>{{@value}}</p>'

    },
    'should parse typed views with type parameters': {

        input: '{% view Main [A,B] (Context[A,B]) %} <p>{{@values}}</p>'

    },
    'should parse context variables': {

        input: '<Input name={{@level.name}}/>'

    },
    'should allow construct expression': {

        input: '<TextView android:thing={value:1}>{{Person(@value)}}</TextView>'

    },
    'should allow view construction': {

        input: '<p>{{ <Panel(@)> }}</p>'

    },
    'should allow fun application': {

        input: '<p>{{ <panel(1, 2, 3)> }}</p>'

    },
    'should allow fun application with context': {

        input: '<div>{{ <panel(@,12)> }}</div>'

    },
    'should parse list types': {

        input: '{% fun action [A] (s: String[], a:A[]) = {{  \'${s}${a}\' }} %}'
    },
    'should allow context properties as fun application': {

        input: '<div>{{ <@action()> }}</div>'

    },
    'should allow view statements after short fun': {

        input: `

{% fun template [A] (d: Date[A], o:A, _:String, __:A[]) = {{String(o)}}  %}

{% view Results [A](Date[A]) %}

  <ul>

    {% for option,index in [1,3,4] %}

      <li>{{option}}and{{index}}</li>

    {% else %}

      <p>De nada!</p>

    {% endfor %}

  </ul>`

    },
    'should allow actual code': {

        input: `
        {% import (Table) from "@quenk/wml-widgets/lib/data/table" %}
        {% import (TextField) from "@quenk/wml-widgets/lib/control/text-field" %}
        {% import (Panel) from "@quenk/wml-widgets/lib/layout/panel" %}
        {% import (PanelHeader) from "@quenk/wml-widgets/lib/layout/panel" %}
        {% import (Tab) from "@quenk/wml-widgets/lib/control/tab-bar" %}
        {% import (TabBar) from "@quenk/wml-widgets/lib/control/tab-bar" %}
        {% import (TabSpec) from ".." %}
        {% import (TabbedPanel) from ".." %}

        {% view Main (TabbedPanel) %}

          <Panel ww:class={{@values.root.class}}>

           {% if (@values.header.tabs.length > 0) || (@values.header.additionalTabs) %}

             <PanelHeader>

               <TabBar>

                {% for tab in @values.header.tabs %}

                  <Tab
                   ww:name={{tab.name}}
                   ww:onClick={{tab.onClick}} />

                {% endfor %}

                {% if @values.header.additionalTabs %}

                  {{<(@values.header.additionalTabs)(@)>}}

               {% else %}

                {{''}}

               {% endif %}

             </TabBar>

           </PanelHeader>

         {% else %}

          {{''}}

        {% endif %}

        {{@children}}

</Panel>`

    },

    'should recognize type parameters': {

        input: '{% fun test[A:String] (a:A) %} {{a}} {% endfun %}'

    },

    'should allow ifs without elses': {

        input: '{% view Test (Object) %}' +
            '<div> {% if (value == true) %} <span/> {% endif %} </div>'

    },

    'should allow else if as final branch': {

        input: '{% view Test(Object) %} <div> ' +
            '{% if ( show == "span" ) %} <span/> {% else if (show == "div" ) %}' +
            '<div/> {% endif %} </div>'

    },

    '[contract] should parse constructors': '{% contract Test = name: String %}',

    '[contract] should parse generic constructors':
        '{% contract Test = table.name: Text[A] %}',

    '[contract] should parse record types': `{% contract Test[A] =
         
        table.data.record: { 

          name: String,
          table.name: Text[A],
          table.data.list: A[] 
          } 
        %}`,

    '[contract] should parse list types':
        `{% contract Test[A] = table.data.list: A[] %}`,

    '[contract] should parse 2d list types':
        `{% contract Test[A,B] = table.data.list2: A[][] %}`,

    '[contract] should parse 3d list types':
        `{% contract Test[A, B, C] = table.data.list3: A[][][] %}`,

    '[contract] should parse func with no args or parens':
        `{% contract Test = value: Test -> Number %}`,

    '[contract] should parse func with no args':
        `{% contract Test = value: () -> Number %}`,

    '[contract] should parse no-parens func with constructor':
        `{% contract Test = value: String -> String %}`,

    '[contract] should parse no-parens func with generic constructor':
        `{% contract Test = value: Text[A] -> Text[A] %}`,

    '[contract] should parse no-parens func with record arg':
        `{% contract Test = value: {} -> { } %}`,

    '[contract] should parse no-parens func with list arg':
        `{% contract Test = value: String[] -> String[] %}`,

    '[contract] should parse func with cons arg':
        `{% contract Test = value: (String) -> String %}`,

    '[contract] should parse func with 2 cons args':
        `{% contract Test = value: (String, String) -> String %}`,

    '[contract] should parse func with 3 cons args':
        `{% contract Test = value: (String, String, String) -> String %}`,

    '[contract] should parse func with generic cons arg':
        `{% contract Test[A] = value: (Text[A]) -> Text[A] %}`,

    '[contract] should parse func with 2 generic cons args':
        `{% contract Test[A] = value: (Text[A], Text[A]) -> Text[A] %}`,

    '[contract] should parse func with 3 generic cons args':
        `{% contract Test[A] = value: (Text[A], Text[A], Text[A]) -> Text[A] %}`,

    '[contract] should parse func with record arg':
        `{% contract Test = value: ({ }) -> { } %}`,

    '[contract] should parse func with 2 record args':
        `{% contract Test = value: ({ }, { name: String }) -> { } %}`,

    '[contract] should parse func with 3 record args':
        `{% contract Test = value: ({ }, { name: String }, { value: A[]}) -> { } %}`,

    '[contract] should parse func with list arg':
        `{% contract Test = value: (String[]) -> String[] %}`,

    '[contract] should parse func with 2 list args':
        `{% contract Test = value: (String[], String[]) -> String[] %}`,

    '[contract] should parse func with 3 list args':
        `{% contract Test = value: (String[], String[], String[]) -> String[] %}`,

    '[contract] should parse func with func arg':
        `{% contract Test = value: (String -> String) -> String %}`,

    '[contract] should parse func with 2 func args':
        `{% contract Test = value: ((String -> String), (String -> String)) -> String %}`,

    '[contract] should parse func with 3 func args':
        `{% contract Test =
          value: ((String -> String), (String -> String), (String -> String)) -> String 
         %}`,

    '[contract] should parse func that return array of generic type':
        `{% contract Test[A] = value: Number -> Text[A][] %}`,

    '[contract] should parse funct that return array of array':
        `{% contract Test = value: String -> Number[][] %}`,

    '[contract] should parse contract definitions': {

        input: `{% contract Manager[A] =

    name: String,

    table.name: Text[A],

    table.data.record: { name: String, table.name: Text[A], table.data.list: A[] },

    table.data.list: A[],

    table.data.list2: A[][],

    table.data.list3: A[][][],

    noArgsFunc1: -> Number,

    noArgsFunc0: () -> Number,

    noParensConsArgFunc: String -> String,

    noParensConsGenericArgFunc: Text[A] -> Text[A],

    noParensRecordArgFunc: { } -> { },

    noParensListArgFunc: String[] -> String[],

    parensConsArgFunc: (String) -> String,

    parensConsArg2Func: (String, String) -> String,

    parensConsArg3Func: (String, String, String) -> String,

    parensConsGenericArgFunc: (Text[A]) -> Text[A],

    parensConsGenericArg2Func: (Text[A], Text[A]) -> Text[A],

    parensConsGenericArg3Func: (Text[A], Text[A], Text[A]) -> Text[A],

    parensRecordArgFunc: ({ }) -> { },

    parensRecordArg2Func: ({ }, { name: String }) -> { },

    parensRecordArgFunc: ({ }, { name: String }, { value: A[]}) -> { },

    parensListArgFunc: (String[]) -> String[],

    parensListArg2Func: (String[], String[]) -> String[],

    parensListArg3Func: (String[], String[], String[]) -> String[],

    funcArgFunc1: (String -> String) -> String,

    funcArgFunc2: (String -> String -> String) -> String,

    funcArg2Func: ((String -> String), (String -> String)) -> String,

    funcArg3Func: ((String -> String), (String -> String), (String -> String)) -> String,

    funcRetGenArray: Number -> Text[A][],

    funcRetMultiArray: String -> Number[][]


        %} `

    },

    'should parse alias statements':
        `{% alias Type = String | Number | Boolean | Type[] | Type -> Type %}`,

    'should parse tupe types': `{% alias Tuple = [Number, String, Number] %}`,

    'should parse primitives used as type':
        '{% alias Prims = 1|2|"three"|true|false|"1,2,three,true,false" %}'




}
