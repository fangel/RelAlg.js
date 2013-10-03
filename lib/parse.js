define(['./parser', './tree', './relation'], function(Parser, Tree, Relation) {
  Parser.yy.Tree = Tree

  Parser.yy.Relation = Relation

  function ParseError(scanned, full, text, token, line, position, expected) {
    this.scanned = scanned
    this.full = full
    this.text = text || full.substr(scanned.length)
    this.token = token
    this.line = line
    this.position = position
    this.expected = expected || []
    if (!this.position) {
      // Tokenization error, doesn't give us positions, extrapolate position,
      // by looking at scanned and text
      this.position = {
        first_column: this.scanned.length,
        first_line: 1
      }
      var lines = this.scanned.split(/\n/)
      for (var i = 0; i < lines.length - 1; i++) {
        this.position.first_line++
        this.position.first_column -= lines[i].length + 1 // the +1 is the line-break
      }
      this.position.last_column = this.position.first_column + this.text.length
      this.position.last_line = this.position.first_line + (this.text.split(/\n/).length - 1)
    }
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
    'PROJECT':    'Project',
    'AND':        '&&',
    'OR':         '||',
    'COMPARISON': '<<comparison>>'
  }
  ParseError.prototype.getPosition = function() {
    var startRow = this.position.first_line
      , endRow   = this.position.last_line
      , startCol = this.position.first_column
      , endCol   = this.position.last_column

    if(this.token !== null) {
      var lines = this.scanned.split(/\n/)
      startCol = lines[lines.length-1].length
                   // this.position.first_column seems to be off whenever there is
                   // multiple spaces before the parse-error, e.g. "FOO  BAR", only
                   // has first_column = 4, not 5 as you would expect
      endCol   = startCol + this.text.length
    }
    return {
      startRow: startRow,
      startColumn: startCol,
      endRow: endRow,
      endColumn: endCol
    }
  }
  ParseError.prototype.showPosition = function() {
    var pre, dur, end, pos = this.getPosition()
    if (this.token === null) {
      // Tokenization fail
      pre = (pos.startColumn === 0) ? '' : new Array(pos.startColumn + 1 ).join(" ")
      dur = ''
      if (pos.endColumn - pos.startColumn > 0) // The lexing-error has a extend
        dur = new Array(pos.endColumn - pos.startColumn - 1).join("-")
      return pre + '^' + dur + '^'
    } else {
      pre = (pos.startColumn === 0) ? '' : new Array(pos.startColumn + 1 ).join(" ")
      dur = ''
      end = pos.endColumn - pos.startColumn > 1 ? '^' : ''
      if (pos.endColumn - pos.startColumn > 1) // the parse-error has a extend
        dur = new Array(pos.endColumn - pos.startColumn - 1).join("-")
      return pre + '^' + dur + end
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
      this.lexer.matched.substr(0, this.lexer.matched.length - this.lexer.match.length),
      this.yy.fullInput, hash.text, hash.token, hash.line, hash.loc, hash.expected
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