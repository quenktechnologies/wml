
import * as $wml from '../../src';


export class Main extends $wml.AppView<void> {

    constructor(context: void) {

        super(context);

        let ___view = this;

        this.template = (___ctx:void) =>
          $wml.widget(Tag, {html : {  } ,wml : {  } }, [$wml.ifthen(value, function then(){ return $wml.node('text', {html : {  } ,wml : {  } }, [$wml.text(`Text`)], ___view)  }, function elseif(){ return $wml.ifthen(value, function then() { return $wml.node('text', {html : {  } ,wml : {  } }, [$wml.text(`else`)], ___view) ; }, function else_clause() { return $wml.text(` 
            no 
          `) } );}) ], ___view);

       }

     }
