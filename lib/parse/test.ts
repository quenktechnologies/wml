export const tests: { [key: string]: any } = {

    'should parse qualified import': {
        input: `{% import * as lib from "path/to/libs" %}`
    },
    'should parse named import': {
        input: `{% import (B) from "path/to/a/b" %}`
    },
    'should detect exact duplicate imports': {
        input: `{% import (A) from "b" %} {% import (A) from "b" %}`
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
    'should parse for from statements': {

        input: `
              <root>
                {% for value=1 to 30 %}
                  <b>{{value}}</b>
                {% endfor %}
              </root>
              `
    },
    'should parse if then expressions': {

        input: '<Html id={{@id}}>{{ if @check() then a else b }}</Html>'

    },

    'should parse function expressions': {

        input: '<button onclick={{e -> call(e)}}/>'

    },

    'should parse function expressions (no args)': {

        input: '<button onclick={{ -> call()}}/>'

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
    '[view] should parse typed views': {

        input: '{% view Main (Context[String]) %} <p>{{@value}}</p>'

    },
    '[view] should parse typed views with type parameters': {

        input: '{% view Main [A,B] (Context[A,B]) %} <p>{{@values}}</p>'

    },
    '[view] should allow the where syntax': `

      {% view HeadView where title: String %}
        <title>{{@title}}</title>
    `,
    'should parse context variables': {

        input: '<Input name={{@level.name}}/>'

    },
    '[view] should allow inline context import': {

        input: '{% view MyView (Context from "./") %} <div>{{@text}}</div>'

    },
    '[view] should allow multiple inline context imports': {

        input: `
                    {% view MyView (Context from "./") %} <div>{{@text}}</div>
                    {% view YourView (Context from "./") %} <div/>
                    `
    },
    'should allow construct expression': {

        input: '<TextView android:thing={value=1}>{{Person(@value)}}</TextView>'

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

    '[context] should parse constructors': '{% context Test where name: String %}',

    '[context] should parse generic constructors':
        '{% context Test where table.name: Text[A] %}',

    '[context] should parse record types': `{% context Test[A] where
         
        table.data.record: { 

          name: String,
          table.name: Text[A],
          table.data.list: A[] 
          } 
        %}`,

    '[context] should parse list types':
        `{% context Test[A] where table.data.list: A[] %}`,

    '[context] should parse 2d list types':
        `{% context Test[A,B] where table.data.list2: A[][] %}`,

    '[context] should parse 3d list types':
        `{% context Test[A, B, C] where table.data.list3: A[][][] %}`,

    '[context] should parse func with no args or parens':
        `{% context Test where value: Test -> Number %}`,

    '[context] should parse func with no args':
        `{% context Test where value: () -> Number %}`,

    '[context] should parse no-parens func with constructor':
        `{% context Test where value: String -> String %}`,

    '[context] should parse no-parens func with generic constructor':
        `{% context Test where value: Text[A] -> Text[A] %}`,

    '[context] should parse no-parens func with record arg':
        `{% context Test where value: {} -> { } %}`,

    '[context] should parse no-parens func with list arg':
        `{% context Test where value: String[] -> String[] %}`,

    '[context] should parse func with cons arg':
        `{% context Test where value: (String) -> String %}`,

    '[context] should parse func with 2 cons args':
        `{% context Test where value: (String, String) -> String %}`,

    '[context] should parse func with 3 cons args':
        `{% context Test where value: (String, String, String) -> String %}`,

    '[context] should parse func with generic cons arg':
        `{% context Test[A] where value: (Text[A]) -> Text[A] %}`,

    '[context] should parse func with 2 generic cons args':
        `{% context Test[A] where value: (Text[A], Text[A]) -> Text[A] %}`,

    '[context] should parse func with 3 generic cons args':
        `{% context Test[A] where value: (Text[A], Text[A], Text[A]) -> Text[A] %}`,

    '[context] should parse func with record arg':
        `{% context Test where value: ({ }) -> { } %}`,

    '[context] should parse func with 2 record args':
        `{% context Test where value: ({ }, { name: String }) -> { } %}`,

    '[context] should parse func with 3 record args':
        `{% context Test where value: ({ }, { name: String }, { value: A[]}) -> { } %}`,

    '[context] should parse func with list arg':
        `{% context Test where value: (String[]) -> String[] %}`,

    '[context] should parse func with 2 list args':
        `{% context Test where value: (String[], String[]) -> String[] %}`,

    '[context] should parse func with 3 list args':
        `{% context Test where value: (String[], String[], String[]) -> String[] %}`,

    '[context] should parse func with func arg':
        `{% context Test where value: (String -> String) -> String %}`,

    '[context] should parse func with 2 func args':
        `{% context Test where value: ((String -> String), (String -> String)) -> String %}`,

    '[context] should parse func with 3 func args':
        `{% context Test where
          value: ((String -> String), (String -> String), (String -> String)) -> String 
         %}`,

    '[context] should parse func that return array of generic type':
        `{% context Test[A] where value: Number -> Text[A][] %}`,

    '[context] should parse funct that return array of array':
        `{% context Test where value: String -> Number[][] %}`,

    '[context] should parse context definitions': {

        input: `{% context Manager[A] where

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

    '[context] should allow optional properties': {

        input: `{% context AContract where 
          
                  id?: Number,

                  name.first: String,

                  name.middle?: String,

                  name.last?: String

        %}`

    },

    '[context] should allow extending': {

        input: `{% context AContract where :BContract %}
              {% context CContract where :AContract, :BContract %}
              {% context DContract[Type] where :CContract, member: Type %}
              {% context EContract[A,B,C,D] where 
                 :BContract, 
                 :CContract, 
                 :DContract[D],
                 member0: A,
                 member1: B,
                 member2: C
             %}
             {% context DContract where :AContract, member: DType %}`
    },

    '[context] should mark nested properties as optional if all are':
        `{% context Paper where object."type"?: String %}`,

    'should parse type statements':
        `{% type Type = String | Number | Boolean | Type[] | Type -> Type %}`,

    'should parse tupe types': `{% type Tuple = [Number, String, Number] %}`,

    'should parse type assertion':
        '<Panel onClick={{ \e -> foo(e) as User }} />',

    'should parse partial application in expression':
        '<Link ww:text={{truncate(50)(@text)}} />',

    'should transform special primitives':
        `<div>
            {% for kind in [
                            String,
                            Boolean,
                            Number,
                            Object,
                            Undefined,
                            Null,
                            Void,
                            Never,
                            Any] %}
              {{ kind | text }}
            {% endfor %}
        </div>`,

    'should allow casting': `
        {% view Test (Object) %}
          <Widget
            val1={{String(@value)}}
            val2={{Number(@value)}}
            val3={{Boolean(@value)}} />
      `,

    'should parse null query operator':
        `<div>{% if value ?? %}<b>True</b>{% else %}<b>False</b>{% endif %}</div>`,

    '[let] should parse let statements':
        `{% let head:HeadCtx = {title = "Foo"} %}
     {% let head2:HeadCtx = {title = "My Title"} %}
    `,

    '[let] should be usable in a view': `
        {% view MyView(Object) %}
      {% let head:HeadViewContext = {title = "My Title"} %}
      <h1>{{<HeadView(head)>}}</h1>
    `,

    '[comment] should parse html comments': `<!-- This is an html comment. -->`,

    '[comment] should parse wml comments': `{# This is a wml comment #}`,

    '[comment] should parse wml comments in statements':
        `{% view Name {# This is a comment! #} (Object) %} <div/> %}`,

    '[fun] should parse multi dimensional array parameters': `
    {% fun test (value:List[][]) %}<p/>{% endfun %}`,

    'should allow index access on context properties':
        `{% view Test (Object) %}
       <div>
        {% if @["type"]?? %}
            <div/>
        {% endif %}
      </div>`,

    'should allow paths to use brackets': `
   {% view Test (Object) %} 
    <div>
     {% if @values.controls["@type"] %} value {% endif %}
     {% if @values.controls["@type"].value %} value {% endif %}
    </div>`,

    'should allow 2nd level bracket access':
        `<div>{% for item in our."items" %} <div/>{% endfor %}</div> `,

    'should allow type to be used in if statement expression':
        `<div>{% if item."type" == 1 %}<p/>{% endif %}</div>`,

    'should support the special wml:attrs attribute':
        `<Panel wml:attrs={{@panelAttrs}}><div wml:attrs={{divAttrs}}/></Panel>`,

    'should parse widgets with type arguments':
        `<div>
      <Panel[Text]>
        <PanelHeader[Text] wml:id="header"/>
        <PanelBody/>
      </Panel>
    </div>`,

    'should parse view construction with type arguments':
        `<div>{{<Panel[Text](@)>}}</div>`,


}
