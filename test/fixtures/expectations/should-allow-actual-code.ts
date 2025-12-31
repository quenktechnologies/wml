// @ts-ignore 6192
import * as __wml from '../../../src';
// @ts-ignore 6192
import * as __document from '../../../src/lib/dom';
// @ts-ignore 6192
import * as __utils from '../../../src/lib/util';
import {Table} from '@quenk/wml-widgets/lib/data/table'; ;
import {TextField} from '@quenk/wml-widgets/lib/control/text-field'; ;
import {Panel} from '@quenk/wml-widgets/lib/layout/panel'; ;
import {PanelHeader} from '@quenk/wml-widgets/lib/layout/panel'; ;
import {Tab} from '@quenk/wml-widgets/lib/control/tab-bar'; ;
import {TabBar} from '@quenk/wml-widgets/lib/control/tab-bar'; ;
import {TabSpec} from '..'; ;
import {TabbedPanel} from '..'; 


// @ts-ignore 6192
const text = __document.text;
// @ts-ignore 6192
const unsafe = __document.unsafe
// @ts-ignore 6192
const isSet = __utils.isSet
export class Main  extends __wml.BaseView {

   constructor(__context: TabbedPanel ) {

       super(__context, (__this:__wml.Frame) => {

         

         __this.root(__this.widget(new Panel({ww : { 'class' : __context.values.root.class  }}, [

        ...((((__context.values.header.tabs.length > 0) || __context.values.header.additionalTabs)) ?
(()=>([

        __this.widget(new PanelHeader({}, [

        __this.widget(new TabBar({}, [

        ...__utils.forIn (__context.values.header.tabs, (tab , _$$i, _$$all)=> 
([

        __this.widget(new Tab({ww : { 'name' : tab.name ,'onClick' : tab.onClick  }}, [

        
     ]),<__wml.Attrs>{ww : { 'name' : tab.name ,'onClick' : tab.onClick  }})
     ]), 
()=> ([])),
...((__context.values.header.additionalTabs) ?
(()=>([

        __this.view(__context.values.header.additionalTabs(__context))
     ]))() :
(()=>([

        ""
     ]))())
     ]),<__wml.Attrs>{})
     ]),<__wml.Attrs>{})
     ]))() :
(()=>([

        ""
     ]))()),
__context.children
     ]),<__wml.Attrs>{ww : { 'class' : __context.values.root.class  }}));


       });

 }

}