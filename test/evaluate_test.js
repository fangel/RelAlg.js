(function(factory) {
  if (typeof define !== 'undefined' && define.amd) {
    // We are running the tests in Karma, which uses RequireJS for everything,
    // so we wrap everything in a define, with our test-case as the module.
    // Chai is loaded from Bower.
    define(['chai', 'relalg/parse', 'relalg/tree', 'relalg/relation', 'relalg/evaluate'], factory)
  } else {
    // We are using the Mocha runner in Node.js, so we load Chai and RequireJS
    // from NPM, then use RequireJS to load relalg.
    var chai = require("chai")
      , requirejs = require("requirejs")
      , _ = require('./mocha-setup')
    var Parse = requirejs("relalg/parse")
      , Tree = requirejs("relalg/tree")
      , Relation = requirejs("relalg/relation")
      , Evaluate = requirejs("relalg/evaluate")
    factory(chai, Parse, Tree, Relation, Evaluate)
  }
})(function(chai, Parse, Tree, Relation, Evaluate) {
var assert = chai.assert

// Please ensure that expressions used actually type-check. 
// To ease development of these test-cases, type-checking has
// been omitted, but evaluation for expressions that aren't
// well-typed is undefined

describe("Evaluating", function() {
  var Foo = new Relation(['alpha', 'b', 'c'], [[1, 2, 3], [4, 5, 6]])
    , Bar = new Relation(['a', 'bravo', 'c', 'd'], [[1, 2, 3, 4], [5, 6, 7, 8]])
    , Baz = new Relation(['alpha', 'b', 'c'], [[4, 5, 6], [7, 8, 9]])
    , Qux = new Relation(['a', 'b', 'c'], [[1,2,3], [1,2,4]])
    , Quux = new Relation(['d', 'e'], [[6,7], [8,9]])
  var ENV = {
    Foo: Foo,
    Bar: Bar,
    Baz: Baz,
    Qux: Qux,
    Quux: Quux
  }

  describe("Relation References", function() {
    it("Results in the relation being returned", function() {
      var expr = Parse("Foo")
        , res = Evaluate(expr, ENV)
      assert.deepEqual(Foo, res)
      
      expr = Parse("Bar")
      res = Evaluate(expr, ENV)
      assert.deepEqual(Bar, res)
    })
  })
  describe("Inline Relations", function() {
    it("Results in the relation being returned", function() {
      var expr = Parse("[['foo', 'bar'] -> [1,2], [3,4]]")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['foo', 'bar'], [[1,2], [3,4]])
      assert.deepEqual(expected, res)
    })
  })
  describe("Unions", function() {
    it("Foo ∪ Baz results in a union between the two relations", function() {
      var expr = Parse("Foo Union Baz")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['alpha', 'b', 'c'], [[1,2,3], [4,5,6], [7,8,9]])
      assert.deepEqual(expected, res)
    })
  })
  describe("Intersections", function() {
    it("Foo ∩ Baz results in a intersection between the two relations", function() {
      var expr = Parse("Foo Intersect Baz")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['alpha', 'b', 'c'], [[4,5,6]])
      assert.deepEqual(expected, res)
    })
  })
  describe("Differences", function() {
    it("Foo - Baz results in the difference between the two relations", function() {
      var expr = Parse("Foo - Baz")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['alpha', 'b', 'c'], [[1,2,3]])
      assert.deepEqual(expected, res)
    })
    it("Baz - Foo results in the difference between the two relations", function() {    
      var expr = Parse("Baz - Foo")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['alpha', 'b', 'c'], [[7,8,9]])
      assert.deepEqual(expected, res)
    })
  })
  describe("Renames", function() {
    it("Renaming alpha→a in Foo gives the right result", function() {
      var expr = Parse("Rename[alpha/a](Foo)")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['a', 'b', 'c'], Foo.data)
      assert.deepEqual(expected, res)
    })
    it("Renaming bravo→b in Bar gives the right result", function() {
      var expr = Parse("Rename[bravo/b](Bar)")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['a', 'b', 'c', 'd'], Bar.data)
      assert.deepEqual(expected, res)
    })
  })
  describe("Projections", function() {
    it("Projecting a,b from Qux gives the right result", function() {
      var expr = Parse("Project[a,b](Qux)")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['a', 'b'], [[1,2]])
      assert.deepEqual(expected, res)
    })
    it("Projecting b,c from Qux gives the right result", function() {
      var expr = Parse("Project[b,c](Qux)")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['b', 'c'], [[2,3], [2,4]])
      assert.deepEqual(expected, res)
    })
  })
  describe("Cartesian Products", function() {
    it("Qux × Quux gives the right result", function() {
      var expr = Parse("Qux X Quux")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['a', 'b', 'c', 'd', 'e'], [[1,2,3,6,7], [1,2,3,8,9], [1,2,4,6,7], [1,2,4,8,9]])
      assert.deepEqual(expected, res)
    })
    it("Quux × Qux gives the right result", function() {
      var expr = Parse("Quux X Qux")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['d', 'e', 'a', 'b', 'c'], [[6,7,1,2,3], [6,7,1,2,4], [8,9,1,2,3], [8,9,1,2,4]])
      assert.deepEqual(expected, res)
    })
  })
  describe("Selection", function() {
    it("Select alpha=1 from Foo gives the first row", function() {
      var expr = Parse("Select[alpha==1](Foo)")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(Foo.header, [[1,2,3]])
      assert.deepEqual(expected, res)
    })
    it("Select alpha≠1 from Foo gives the second row", function() {
      var expr = Parse("Select[alpha!=1](Foo)")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(Foo.header, [[4,5,6]])
      assert.deepEqual(expected, res)
    })
    it("Select alpha=1 ∨ b=5 from Foo gives both rows", function() {
      var expr = Parse("Select[alpha==1 || b==5](Foo)")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(Foo.header, [[1,2,3], [4,5,6]])
      assert.deepEqual(expected, res)
    })
    it("Select alpha=1 ∧ b=5 from Foo gives no rows", function() {
      var expr = Parse("Select[alpha==1 && b==5](Foo)")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(Foo.header, [])
      assert.deepEqual(expected, res)
    })
  })
  describe("Natural Joins", function() {
    it("Bar ⋈ Quux gives the right result", function() {
      var expr = Parse("Bar Join Quux")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['a', 'bravo', 'c', 'd', 'e'], [[5,6,7,8,9]])
      assert.deepEqual(expected, res)
    })
    it("Quux ⋈ Bar gives the right result", function() {
      var expr = Parse("Quux Join Bar")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['d', 'e', 'a', 'bravo', 'c'], [[8,9,5,6,7]])
      assert.deepEqual(expected, res)
    })
  })
  describe("Joins", function() {
    it("Foo ⋈[c=d] Quux gives the one shared row", function() {
      var expr = Parse("Foo Join[c==d] Quux")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['alpha', 'b', 'c', 'd', 'e'], [[4,5,6,6,7]])
      assert.deepEqual(expected, res)
    })
    it("Quux ⋈[c=d] Foo gives the one shared row", function() {
      var expr = Parse("Quux Join[c==d] Foo")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['d', 'e', 'alpha', 'b', 'c'], [[6,7,4,5,6]])
      assert.deepEqual(expected, res)
    })
    it("Quux ⋈[c≠d] Foo gives the three rows where c≠d", function() {
      var expr = Parse("Quux Join[c!=d] Foo")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['d', 'e', 'alpha', 'b', 'c'], [[6,7,1,2,3], [8,9,1,2,3], [8,9,4,5,6]])
      assert.deepEqual(expected, res)
    })
    it("Quux ⋈[c≠d ∧ alpha=1] Foo gives the two rows where c≠d ∧ alpha=1", function() {
      var expr = Parse("Quux Join[c!=d && alpha==1] Foo")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['d', 'e', 'alpha', 'b', 'c'], [[6,7,1,2,3], [8,9,1,2,3]])
      assert.deepEqual(expected, res)
    })
    it("Quux ⋈[c=d ∨ alpha=1] Foo gives the three rows where c≠d ∨ alpha=1", function() {
      var expr = Parse("Quux Join[c==d || alpha==1] Foo")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['d', 'e', 'alpha', 'b', 'c'], [[6,7,1,2,3], [6,7,4,5,6], [8,9,1,2,3]])
      assert.deepEqual(expected, res)
    })
  })
  describe("Divisions", function() {
    before(function() {
      ENV.A = new Relation(['sno', 'pno'],
        [['s1', 'p1'], ['s1', 'p2'], ['s1', 'p3'],
         ['s1', 'p4'], ['s2', 'p1'], ['s2', 'p2'],
         ['s3', 'p2'], ['s4', 'p2'], ['s4', 'p4']]
      )
      ENV.B1 = new Relation(['pno'], [['p2']])
      ENV.B2 = new Relation(['pno'], [['p2'], ['p4']])
      ENV.B3 = new Relation(['pno'], [['p1'], ['p2'], ['p4']])
    })
    after(function() {
      delete ENV.A
      delete ENV.B1
      delete ENV.B2
      delete ENV.B3
    })
    it("A / B1 gives the right result", function() {
      var expr = Parse("A / B1")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['sno'], [['s1'], ['s2'], ['s3'], ['s4']])
      assert.deepEqual(expected, res)
    })
    it("A / B2 gives the right result", function() {
      var expr = Parse("A / B2")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['sno'], [['s1'], ['s4']])
      assert.deepEqual(expected, res)
    })
    it("A / B3 gives the right result", function() {
      var expr = Parse("A / B3")
        , res = Evaluate(expr, ENV)
        , expected = new Relation(['sno'], [['s1']])
      assert.deepEqual(expected, res)
    })
  })
})

})