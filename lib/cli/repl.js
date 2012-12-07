var util = require('util')

define(['parser', 'evaluate'], function(Parser, evaluate) {
  function eval(cmd, context, filename, callback) {
    // The Node.js REPL adds a parenthesis around the command, so we strip that
    cmd = cmd.substring(1, cmd.length-2)
    
    if (cmd == '') {
      callback(null, null)
    } else {
      try {
        var res = Parser.parse(cmd)
        callback(null, evaluate(res))
      } catch (e) {
        callback(e, null)
      }
    }
  }
  
  function writer(res) {
    if (res === null) return ''
    else return "" + res
  }
  
  return {
    eval: eval,
    writer: writer
  }
})
