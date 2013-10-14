var util = require('util')

define(['../parse', '../type_check', '../evaluate', '../util/inspect'], function(Parse, TypeCheck, evaluate, inspect) {
  var ENV = {}

  function evalLine(cmd, context, filename, callback) {
    // The Node.js REPL adds a parenthesis around the command, so we strip that
    cmd = cmd.substring(1, cmd.length-2)

    if (cmd === '') {
      callback(null, null)
    } else {
      try {
        var expr = Parse(cmd)
          , typeCheck = TypeCheck(expr, ENV)
        if (typeCheck[0].length !== 0)
          throw new TypeCheck.Errors(typeCheck[0])
        callback(null, evaluate(expr, ENV))
      } catch (e) {
        if (e.constructor == Parse.Error ||
            e.constructor == TypeCheck.Error ||
            e.constructor == TypeCheck.Errors) {
          callback("  " + e.showPosition().split(/\n/).join("\n  ") + "\n\n" + e.toString() + "\n", null)
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
    options: {
      eval: evalLine,
      writer: writer
    }, commands: {
      graph: {
        help: 'Return a SVG-graph of an expression',
        action: function(expr) {
          this.outputStream.write('Graph the expression ' + expr + '\n')
          this.displayPrompt()
        }
      },
      show: {
        help: 'Show the AST of a expression',
        action: function(cmd) {
          try {
            var expr = Parse(cmd)
            this.outputStream.write(inspect(expr) + '\n')
          } catch (e) {
            if (e.constructor == Parse.Error ||
                e.constructor == TypeCheck.Error ||
                e.constructor == TypeCheck.Errors) {
              this.outputStream.write("        " + e.showPosition().split(/\n/).join("\n        ") + "\n\n" + e.toString() + "\n")
            } else {
              this.outputStream.write('Unknown Error: ' + e + "\n")
            }
          }
          this.displayPrompt()
        }
      }
    }
  }
})
