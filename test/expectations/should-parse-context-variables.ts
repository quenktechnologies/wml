
import * as $wml from '../../src';


export class Main extends $wml.AppView<void> {

    constructor(context: void) {

        super(context);

        let ___view = this;

        this.template = (___ctx:void) =>
          $wml.widget(Input, {html : { name : ___ctx.level.name   } ,wml : {  } }, [], ___view);

       }

     }

