var exec = require('child_process').exec
  , read = require('fs').readFileSync

define([], function() {
  return function graph(cmd, callback) {
    var phantomjs, d3
    try {
      phantomjs = require('phantomjs')
      d3 = require('d3')

      var opts = []
      opts.push(require.toUrl('relalg/cli/graph.phantomjs') + '.js')
      opts.push(cmd)

      var command = phantomjs.path + ' "' + opts.join('" "') + '"'

      exec(command, function (error, stdout, stderr) {
        if (error) throw new Error(stderr)

        var file = '<?xml version="1.0" encoding="UTF-8"?>' + "\n" +
                   '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + "\n"
        var defs = '<defs><style type="text/css"><![CDATA[' + "\n" +
                    (String(read(require.toUrl('../css/svg.css')))).trim() + "\n" +
                    ']]></style></defs>'
        file = file + stdout.replace(/<svg(.*?)>/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"$1>' + "\n" + defs + "\n")

        callback(file)
      })
    } catch (e) {
      throw new Error('In order to graph expressions you need PhantomJS and D3 installed.')
    }
  }
})