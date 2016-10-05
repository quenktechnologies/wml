var Compiler = require('./parser/Compiler');
var through = require('through');
var babel = require('babel-core');

var compiler = new Compiler();

function transform(file) {

  var data = '';

  function write(buf) {
    data += buf;
  }

  function end() {

    var js;

    try {
      js = compiler.compile(data);
    } catch (e) {
      console.error('An error occurred while parsing ' + file + '!');
      console.error(e.stack ? e.stack : e);
      throw e;
    }

    this.queue(babel.transform(js, {
      sourceMaps: true,
      presets: ['es2015'],
      plugins: ['add-module-exports'],
      highlightCode: false
    }).code);

    this.queue(null);

  }

  if (!(/\.wml$/).test(file)) return through();
  return through(write, end);

}

module.exports = transform;

