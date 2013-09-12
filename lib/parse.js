define(['parser', 'tree', 'relation'], function(Parser, Tree, Relation) {
  Parser.yy.Tree = Tree

  Parser.yy.Relation = Relation

  Parser.yy.AST = function(cstr) {
    if (typeof(cstr) === 'string') cstr = Tree[cstr]
    var obj = new cstr()
    cstr.apply(obj, Array.prototype.slice.call(arguments, 1))
    obj.position = this._$
    return obj
  }

  var Parse = function Parse(text) {
    return Parser.parse(text)
  }

  return Parse
})