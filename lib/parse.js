define(['parser', 'tree', 'relation'], function(Parser, Tree, Relation) {
  Parser.yy.Tree = Tree

  Parser.yy.Relation = Relation

  function ParseError(scanned, full, text, token, line, position, expected) {
    this.scanned = scanned
    this.full = full
    this.text = text
    this.token = token
    this.line = line
    this.position = position
    this.expected = expected
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
  ParseError.prototype.toString = function() {
    var token = ParseError.tokenMap[this.token] ? ParseError.tokenMap[this.token] : this.token
      , expected = this.expected.map(function(token) {
        token = token.substr(1, token.length-2)
        return '\'' + (ParseError.tokenMap[token] ? ParseError.tokenMap[token] : token) + '\''
      })
    return 'Unexpected \'' + this.text + '\':' + token + ', expected on of ' + expected.join(', ')
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