
import * as $wml from '../../src';


export class Main extends $wml.AppView<void> {

    constructor(context: void) {

        super(context);

        let ___view = this;

        this.template = (___ctx:void) =>
          $wml.widget(Html, {html : { id : ___ctx.id  } ,wml : {  } }, [$wml.domify((___ctx.check  ()) ? a : b ) ], ___view);

       }

     }
