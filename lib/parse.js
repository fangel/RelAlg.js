define(['parser', 'tree', 'relation'], function(Parser, Tree, Relation) {
  Parser.yy.Tree = Tree

  Parser.yy.Relation = Relation

  function ParseError(scanned, full, text, token, line, position, expected) {
    this.scanned = scanned
    this.full = full
    this.text = text || full.substr(scanned.length)
    this.token = token
    this.line = line
    this.position = position || {first_column: scanned.length, last_column: full.length}
    this.expected = expected || []
  }
  ParseError.tokenMap = {
    'ID':         '<<id>>',
    'STRING':     '<<string>',
    'INT':        '<<int>',
    'FLOAT':      '<<float>',
    'ASSIGN':     ':=',
    'EOF':        '<<EOF>>',
    'UNION':      'Union',
    'JOIN':       'Join',
    'INTERSECT':  'Intersect',
    'MINUS':      '-',
    'CROSS':      'X',
    'DIV':        '/',
    'SELECT':     'Select',
    'RENAME':     'Rename',
    'Project':    'Project',
    'AND':        '&&',
    'OR':         '||',
    'COMPARISON': '<<comparison>>'
  }
  ParseError.prototype.showPosition = function() {
    if (this.token === null) {
      // Tokenization fail
      var pre = (this.position.first_column == 0) ? '' : new Array(this.position.first_column + 1 ).join(" ")
        , dur = ''
      if (this.position.last_column - this.position.first_column > 0) 
        dur = new Array(this.position.last_column - this.position.first_column - 1).join("-")
      return pre + '^' + dur + '^'
    } else {
      if (this.token === 'EOF') {
        return (this.position.last_column == 0) ? '' : new Array(this.position.last_column + 1 ).join(" ") + '^'
      } else {
        var pre = (this.position.last_column == 0) ? '' : new Array(this.position.last_column + 2 ).join(" ")
          , dur = ''
          , end = this.text.length > 1 ? '^' : ''
        if (this.text.length > 1)
          dur = new Array(this.text.length-1).join("-")
        return pre + '^' + dur + end
      }
    }
  }
  ParseError.prototype.toString = function() {
    if (this.token === null) {
      // Tokenization Fail
      return 'Tokenization Error: Unrecognized text: ' + this.text
    } else {
      // Parse Error
      var token = ParseError.tokenMap[this.token] ? ParseError.tokenMap[this.token] : this.token
        , expected = this.expected.map(function(token) {
          token = token.substr(1, token.length-2)
          return '\'' + (ParseError.tokenMap[token] ? ParseError.tokenMap[token] : token) + '\''
        })
        , tokenDesc = (this.token === 'EOF') ? token : '\'' + this.text + '\':' + token
      return 'Parse Error: Unexpected ' + tokenDesc + ', expected on of ' + expected.join(', ')
    }
  }
  Parser.yy.parseError = function(str, hash) {
    throw new ParseError(
      this.lexer.pastInput(), this.yy.fullInput, hash.text, 
      hash.token, hash.line, hash.loc, hash.expected
    )
  }

  Parser.yy.AST = function(cstr) {
    if (typeof(cstr) === 'string') cstr = Tree[cstr]
    var obj = new cstr()
    cstr.apply(obj, Array.prototype.slice.call(arguments, 1))
    obj.position = this._$
    return obj
  }

  var Parse = function Parse(text) {
    Parser.yy.fullInput = text
    return Parser.parse(text)
  }

  Parse.Error = ParseError

  return Parse
})