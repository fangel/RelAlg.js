var assert = require("assert")
  , requirejs = require("requirejs")

requirejs.config({
  baseUrl: __dirname + "/../lib",
});

var Parser = requirejs("parser")
  , Tree = requirejs("tree")
  , Relation = requirejs("relation")
  , TypeCheck = requirejs("type_check")

Relation.add('Foo', new Relation(['alpha', 'b', 'c'], [[1, 2, 3], [4, 5, 6]]))
Relation.add('Bar', new Relation(['a', 'bravo', 'c'], [[1, 2, 3], [4, 5, 6]]))

describe("Type Checking", function() {
  describe("Relations", function() {
    var expr = Parser.parse("Foo := [['foo', 'bar', 'baz'] -> [1,2,3], [3,4,5]]")
      , check = TypeCheck(expr)
    it("Has no error", function() {
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema", function() {
      assert.deepEqual(['foo', 'bar', 'baz'], check[1])
    })
  })
  describe("Relation References", function() {
    it("Fails when the relation reference isn\'t known", function() {
      var expr = Parser.parse("Baz")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.equal(0, check[1].length)
      assert.equal("Unknown relation: Baz", check[0][0].error)
    })
    var expr = Parser.parse('Foo')
      , check = TypeCheck(expr)
    it("Has no errors when the relation reference is known", function() {
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the relation reference is known", function() {
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
  })
})