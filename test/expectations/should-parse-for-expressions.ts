
import * as $wml from '../../src';


export class Main extends $wml.AppView<void> {

    constructor(context: void) {

        super(context);

        let ___view = this;

        this.template = (___ctx:void) =>
          $wml.node('root', {html : {  } ,wml : {  } }, [$wml.map(list, function _map(item ) { return $wml.node('stem', {html : {  } ,wml : {  } }, [$wml.text(`A Stem`)], ___view)  }, function otherwise() { return document.createDocumentFragment(); }) ], ___view) ;

       }

     }
