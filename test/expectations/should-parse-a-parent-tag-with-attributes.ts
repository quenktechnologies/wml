
import * as $wml from '../../src';


export class Main extends $wml.AppView<void> {

    constructor(context: void) {

        super(context);

        let ___view = this;

        this.template = (___ctx:void) =>
          $wml.node('panel', {html : { type : `default` ,size : `40` ,align : `left`  } ,wml : {  } }, [], ___view) ;

       }

     }

