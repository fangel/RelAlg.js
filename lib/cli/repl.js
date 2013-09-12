var util = require('util')

define(['parse', 'type_check', 'evaluate'], function(Parse, TypeCheck, evaluate) {
  function evalLine(cmd, context, filename, callback) {
    // The Node.js REPL adds a parenthesis around the command, so we strip that
    cmd = cmd.substring(1, cmd.length-2)

    if (cmd === '') {
      callback(null, null)
    } else {
      try {
        var expr = Parse(cmd)
          , typeCheck = TypeCheck(expr)
        if (typeCheck[0].length != 0)
          throw new TypeCheck.Errors(typeCheck[0])
        callback(null, evaluate(expr))
      } catch (e) {
        if (e.constructor == Parse.Error ||
            e.constructor == TypeCheck.Error ||
            e.constructor == TypeCheck.Errors) {
          callback("  " + e.showPosition().split(/\n/).join("\n  ") + "\n\n" + e.toString(), null)
        } else {
          callback('Unknown Error: ' + e, null)
        }
      }
    }
  }

  function writer(res) {
    if (res === null) return ''
    else return "" + res
  }

  return {
    eval: evalLine,
    writer: writer
  }
})
