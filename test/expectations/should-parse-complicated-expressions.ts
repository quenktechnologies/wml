
import * as $wml from '../../src';




export class Main extends $wml.AppView<void> {

    constructor(context: void) {

        super(context);

        this.template = ($context:void, $view:$wml.AppView<void>) =>
          $wml.node('div', {html : { class : ((Styles.A + ` `)  + Style.B)   } ,wml : {  } }, [], $view) ;

       }

     }

