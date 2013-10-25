(function(factory) {
  if (typeof define !== 'undefined' && define.amd) {
    // We are running the tests in Karma, which uses RequireJS for everything,
    // so we wrap everything in a define, with our test-case as the module.
    // Chai is loaded from Bower.
    define(['chai', 'relalg/parse', 'relalg/tree', 'relalg/relation', 'relalg/type_check'], factory)
  } else {
    // We are using the Mocha runner in Node.js, so we load Chai and RequireJS
    // from NPM, then use RequireJS to load relalg.
    var chai = require("chai")
      , requirejs = require("requirejs")
      , _ = require('./mocha-setup')
    var Parse = requirejs("relalg/parse")
      , Tree = requirejs("relalg/tree")
      , Relation = requirejs("relalg/relation")
      , TypeCheck = requirejs("relalg/type_check")
    factory(chai, Parse, Tree, Relation, TypeCheck)
  }
})(function(chai, Parse, Tree, Relation, TypeCheck) {
var assert = chai.assert

function binaryOperationMixin(terminal, ENV) {
  it("Fails if the LHS has a type-checking error", function() {
    var expr = Parse("Project[foo]([['bar']->[1]]) " + terminal + " [['bar']->[1]]")
      , pos =        "^--------------------------^"
      , check = TypeCheck(expr, ENV)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal("Missing attributes: foo", check[0][0].toString())
    assert.equal(pos, check[0][0].showPosition())
    assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 28}, check[0][0].getPosition())
  })
  it("Fails if the RHS has a type-checking error", function() {
    var expr = Parse("[['bar']->[1]] " + terminal + " Project[baz]([['bar']->[1]])")
      , spaces = new Array(terminal.length+1).join(' ')
      , pos =        "               " + spaces   + " ^--------------------------^"
      , check = TypeCheck(expr, ENV)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal("Missing attributes: baz", check[0][0].toString())
    assert.equal(pos, check[0][0].showPosition())
    assert.deepEqual({startRow: 1, startColumn: 15+terminal.length+1, endRow: 1, endColumn: 15+terminal.length+29}, check[0][0].getPosition())
  })
  it("Fails if both the LHS and the RHS has type-checking errors", function() {
    var expr = Parse("Project[foo]([['bar']->[1]]) " + terminal + " Project[baz]([['bar']->[1]])")
      , spaces = new Array(terminal.length+1).join(' ')
      , posL =       "^--------------------------^"
      , posR =       "                             " + spaces +   " ^--------------------------^"
      , posC =       "^--------------------------^ " + spaces +   " ^--------------------------^" + "\n" +
                     "#1                           " + spaces +   " #2                          "
      , check = TypeCheck(expr, ENV)
    assert.equal(2, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal(TypeCheck.Error, check[0][1].constructor)
    assert.equal("Missing attributes: foo", check[0][0].toString())
    assert.equal("Missing attributes: baz", check[0][1].toString())
    assert.equal(posL, check[0][0].showPosition())
    assert.equal(posR, check[0][1].showPosition())
    var combinedError = new TypeCheck.Errors(check[0])
    assert.equal(posC, combinedError.showPosition())
    assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 28}, check[0][0].getPosition())
    assert.deepEqual({startRow: 1, startColumn: 29+terminal.length+1, endRow: 1, endColumn: 29+terminal.length+29}, check[0][1].getPosition())
  })
}
function schemaMustMatchMixin(terminal, ENV) {
  it("Works when both the LHS and RHS agrees on the schema", function() {
    var expr = Parse('Foo ' + terminal + ' Foo')
      , check = TypeCheck(expr, ENV)
    assert.deepEqual([], check[0])
    assert.deepEqual(['alpha', 'b', 'c'], check[1])
  })
  it("Fails when there is a disagreement on one of the attributes in the schema", function() {
    var expr = Parse("[['foo']->[1]] " + terminal + " [['bar']->[1]]")
      , dashes = new Array(terminal.length+1).join('-')
      , pos =        "^--------------" + dashes   + "--------------^"
      , check = TypeCheck(expr, ENV)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 1: foo≠bar', check[0][0].toString())
    assert.equal(pos, check[0][0].showPosition())
    assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 15+terminal.length+15}, check[0][0].getPosition())
  })
  it("Fails when there is a disagreement on multiple of the attributes in the schema", function() {
    var expr = Parse("[['foo', 'bar']->[1, 2]] " + terminal + " [['bar', 'foo']->[1, 2]]")
      , dashes = new Array(terminal.length+1).join('-')
      , pos =        "^------------------------" + dashes   + "------------------------^"    
      , check = TypeCheck(expr, ENV)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 1: foo≠bar, 2: bar≠foo', check[0][0].toString())
    assert.equal(pos, check[0][0].showPosition())
    assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 25+terminal.length+25}, check[0][0].getPosition())
  })
  it("Fails when there are more attributes in the schema of the LHS than the RHS", function() {
    var expr = Parse("[['foo', 'bar']->[1, 2]] " + terminal + " [['foo']->[1]]")
      , dashes = new Array(terminal.length+1).join('-')
      , pos =        "^------------------------" + dashes   + "--------------^"
      , check = TypeCheck(expr, ENV)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 2: bar≠ε', check[0][0].toString())
    assert.equal(pos, check[0][0].showPosition())
    assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 25+terminal.length+15}, check[0][0].getPosition())
  })
  it("Fails when there are more attributes in the schema of the RHS than the LHS", function() {
    var expr = Parse("[['foo']->[1]] " + terminal + " [['foo', 'bar']->[1, 2]]")
      , dashes = new Array(terminal.length+1).join('-')
      , pos =        "^--------------" + dashes   + "------------------------^"
      , check = TypeCheck(expr, ENV)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 2: ε≠bar', check[0][0].toString())
    assert.equal(pos, check[0][0].showPosition())
    assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 15+terminal.length+25}, check[0][0].getPosition())
  })
  it("Fails when there is a disagreement on some of the attributes in the schema", function() {
    var expr = Parse('Foo ' + terminal + ' Bar')
      , dashes = new Array(terminal.length+1).join('-')
      , pos =        "^---" + dashes   + "---^"
      , check = TypeCheck(expr, ENV)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 1: alpha≠a, 2: b≠bravo, 4: ε≠d', check[0][0].toString())
    assert.equal(pos, check[0][0].showPosition())
    assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 4+terminal.length+4}, check[0][0].getPosition())
  })
  it("Works when the disagreement is rectified with Select and Project prior to Union", function() {
    var expr = Parse('Rename[alpha/a](Foo) ' + terminal + ' Project[a, b, c](Rename[bravo/b](Bar))')
      , check = TypeCheck(expr, ENV)
    assert.deepEqual([], check[0])
    assert.deepEqual(['a', 'b', 'c'], check[1])
  })
}

describe("Type Checking", function() {
  var ENV = {
    'Foo': new Relation(['alpha', 'b', 'c'], [[1, 2, 3], [4, 5, 6]]),
    'Bar': new Relation(['a', 'bravo', 'c', 'd'], [[1, 2, 3, 4], [5, 6, 7, 8]])
  }

  describe("Relations", function() {
    it("Has no error", function() {
      var expr = Parse("Foo := [['foo', 'bar', 'baz'] -> [1,2,3], [3,4,5]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema", function() {
      var expr = Parse("Foo := [['foo', 'bar', 'baz'] -> [1,2,3], [3,4,5]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual(['foo', 'bar', 'baz'], check[1])
    })
    it("Fails when the relation have duplicate attributes", function() {
      var expr = Parse("Foo := [['foo', 'bar', 'foo'] -> [1,2,3], [3,4,5]]")
        , pos =        "       ^-----------------------------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Duplicate attributes: foo", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 7, endRow: 1, endColumn: 50}, check[0][0].getPosition())
    })
    it("Fails when the data does not have as many columns as the schema", function() {
      var expr = Parse("Foo := [['foo', 'bar', 'baz'] -> [1,2,3], [3,4]]")
        , pos =        "       ^---------------------------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Some rows does not conform to the schema: [3, 4]", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 7, endRow: 1, endColumn: 48}, check[0][0].getPosition())
    })
  })
  describe("Relation References", function() {
    it("Fails when the relation reference isn\'t known", function() {
      var expr = Parse("Baz")
        , pos  =       "^-^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.equal(0, check[1].length)
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Unknown relation: Baz", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 3}, check[0][0].getPosition())
    })
    it("Has no errors when the relation reference is known", function() {
      var expr = Parse('Foo')
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the relation reference is known", function() {
      var expr = Parse('Foo')
        , check = TypeCheck(expr, ENV)
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
  })
  describe("Projections", function() {
    it("Has no errors when the projection is over known attributes", function() {
      var expr = Parse("Project[alpha, b](Foo)")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the projection is over known attributes", function() {
      var expr = Parse("Project[alpha, b](Foo)")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual(['alpha', 'b'], check[1])
    })
    it("Has an error when a attribute is missing", function() {
      var expr = Parse("Project[a](Foo)")
        , pos =        "^-------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 15}, check[0][0].getPosition())
    })
    it("Has an error when multiple attributes are missing", function() {
      var expr = Parse("Project[a, d](Foo)")
        , pos =        "^----------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a, d", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 18}, check[0][0].getPosition())
    })
    it("Has an error when some of the attributes are missing", function() {
      var expr = Parse("Project[a, c, d, b](Foo)")
        , pos =        "^----------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a, d", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 24}, check[0][0].getPosition())
    })
  })
  describe("Renames", function() {
    it("Has no errors when the rename involves known attributes", function() {
      var expr = Parse("Rename[alpha/a](Foo)")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the rename involves known attributes", function() {
      var expr = Parse("Rename[alpha/a](Foo)")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual(['a', 'b', 'c'], check[1])
    })
    it("Has an error when a attribute is missing", function() {
      var expr = Parse("Rename[a/alpha](Foo)")
        , pos =        "^------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attribute: a", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 20}, check[0][0].getPosition())
    })
    it("Has an error when renaming a attribute to the name of a existing attribute", function() {
      var expr = Parse("Rename[alpha/b](Foo)")
        , pos =        "^------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Can not rename attribute alpha to b, b already exists", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 20}, check[0][0].getPosition())
    })
  })
  describe("Selections", function() {
    it("Works well with attribute-less criterias", function() {
      var expr = Parse("Select[1==2](Foo)")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
    it("Works well with a criteria involving a single attribute", function() {
      var expr = Parse("Select[alpha==2](Foo)")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
    it("Works well with both sides of a criteria involves attributes", function() {
      var expr = Parse("Select[alpha==b](Foo)")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
    it("Works well with a criteria involving multiple attributes", function() {
      var expr = Parse("Select[alpha==2 && b==2](Foo)")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
    it("Has an error when a attribute is missing", function() {
      var expr = Parse("Select[a==1](Foo)")
        , pos =        "^---------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: a", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 17}, check[0][0].getPosition())
    })
    it("Has an error when multiple attributes are missing", function() {
      var expr = Parse("Select[a==1 && d==2](Foo)")
        , pos =        "^-----------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: a, d", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 25}, check[0][0].getPosition())
    })
    it("Has an error when both sides of the criteria are missing attributes", function() {
      var expr = Parse("Select[a==d](Foo)")
        , pos =        "^---------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: a, d", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 17}, check[0][0].getPosition())
    })
    it("Has an error when some of the attributes are missing", function() {
      var expr = Parse("Select[a==1 && b==2](Foo)")
        , pos =        "^-----------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: a", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 25}, check[0][0].getPosition())
    })
  })
  describe("Unions", function() {
    binaryOperationMixin.call(this, 'Union', ENV)
    schemaMustMatchMixin.call(this, 'Union', ENV)
  })
  describe("Set-Differences", function() {
    binaryOperationMixin.call(this, '-', ENV)
    schemaMustMatchMixin.call(this, '-', ENV)
  })
  describe("Intersections", function() {
    binaryOperationMixin.call(this, 'Intersect', ENV)
    schemaMustMatchMixin.call(this, 'Intersect', ENV)
  })
  describe("Cartesian Product", function() {
    binaryOperationMixin.call(this, 'X', ENV)
    it("Has no errors when the cartesian product involves relations of different schemas", function() {
      var expr = Parse("[['foo']->[1]] X [['bar']->[2]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the cartesian product involves relations of different schemas", function() {
      var expr = Parse("[['foo']->[1]] X [['bar']->[2]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual(['foo', 'bar'], check[1])
    })
    it("Fails when the cartesian product involves relations has one overlapping attribute", function() {
      var expr = Parse("Foo X Bar")
        , pos =        "^-------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Overlapping attributes: c", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 9}, check[0][0].getPosition())
    })
    it("Fails when the cartesian product involves relations has multiple overlapping attribute", function() {
      var expr = Parse("Foo X Foo")
        , pos =        "^-------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Overlapping attributes: alpha, b, c", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 9}, check[0][0].getPosition())
    })
  })
  describe("Joins", function() {
    binaryOperationMixin.call(this, 'Join[1==2]', ENV)
    it("Has no errors when the join involves relations of different schemas", function() {
      var expr = Parse("[['foo']->[1]] Join[foo==bar] [['bar']->[2]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the join involves relations of different schemas", function() {
      var expr = Parse("[['foo']->[1]] Join[foo==bar] [['bar']->[2]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual(['foo', 'bar'], check[1])
    })
    it("Fails when the join involves relations has one overlapping attribute", function() {
      var expr = Parse("Foo Join[alpha==a] Bar")
        , pos =        "^--------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Overlapping attributes: c", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 22}, check[0][0].getPosition())
    })
    it("Fails when the join involves relations has multiple overlapping attribute", function() {
      var expr = Parse("Foo Join[alpha==alpha] Foo")
        , pos =        "^------------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Overlapping attributes: alpha, b, c", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 26}, check[0][0].getPosition())
    })
    it("Fails when the criteria involves attributes not in one of the two involved relations", function() {
      var expr = Parse("[['foo']->[1]] Join[foz==baz] [['bar']->[2]]")
        , pos =        "^------------------------------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: foz, baz", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 44}, check[0][0].getPosition())
    })
  })
  describe("Natural Joins", function() {
    binaryOperationMixin.call(this, 'Join', ENV)
    it("Never has an error as long as the two expressions are sound", function() {
      var expr = Parse("[['foo']->[1]] Join [['bar']->[2]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the two expressions are sound", function() {
      var expr = Parse("[['foo']->[1]] Join [['bar']->[2]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual(['foo', 'bar'], check[1])

      expr = Parse("Foo Join Bar")
      check = TypeCheck(expr, ENV)
      assert.deepEqual(['alpha', 'b', 'c', 'a', 'bravo', 'd'], check[1])
    })
  })
  describe("Divisions", function() {
    binaryOperationMixin.call(this, '/', ENV)
    it("Has no errors when the LHS is a superset of the RHS", function () {
      var expr = Parse("[['foo', 'bar']->[1, 2]] / [['bar']->[2]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the LHS is a superset of the RHS", function () {
      var expr = Parse("[['foo', 'bar']->[1, 2]] / [['bar']->[2]]")
        , check = TypeCheck(expr, ENV)
      assert.deepEqual(['foo'], check[1])
    })
    it("Fails when the LHS equals RHS", function () {
      var expr = Parse("[['bar']->[1]] / [['bar']->[2]]")
        , pos =        "^-----------------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("No unique attributes on the left hand side", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 31}, check[0][0].getPosition())
    })
    it("Fails when the RHS has attributes that the RHS does not", function () {
      var expr = Parse("[['bar']->[1]] / [['foo', 'bar']->[1, 2]]")
        , pos =        "^---------------------------------------^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Right hand side has unique attributes: foo", check[0][0].toString())
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 41}, check[0][0].getPosition())
    })
  })
  describe("Error Messages", function() {
    it("Can highlight the position of an errors within a statement", function() {
      var expr = Parse("Rename[foo/bar](Baz)")
        , pos =        "                ^-^"
        , check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 16, endRow: 1, endColumn: 19}, check[0][0].getPosition())

      expr = Parse("Foo  X   Baz")
      pos =        "         ^-^"
      check = TypeCheck(expr, ENV)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(pos, check[0][0].showPosition())
      assert.deepEqual({startRow: 1, startColumn: 9, endRow: 1, endColumn: 12}, check[0][0].getPosition())
    })
    it("Can highlight the position of two errors within statements", function() {
      var expr = Parse("Rename[foo/bar](Baz) X Project[foo,baz](Qux)")
        , pos =        "                ^-^                     ^-^\n" + 
                       "                #1                      #2 "
        , err = "Type Errors!\n" + 
                "#1: Unknown relation: Baz\n" +
                "#2: Unknown relation: Qux"
        , check = TypeCheck(expr, ENV)
        , combinedError = new TypeCheck.Errors(check[0])
      assert.equal(2, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(err, combinedError.toString())
      assert.equal(pos, combinedError.showPosition())
      assert.deepEqual({startRow: 1, startColumn: 16, endRow: 1, endColumn: 19}, check[0][0].getPosition())
      assert.deepEqual({startRow: 1, startColumn: 40, endRow: 1, endColumn: 43}, check[0][1].getPosition())
    })
    it("Can highlight the position of three errors", function() {
      var expr = Parse("Baz X Qux X Quid")
        , pos =        "^-^   ^-^   ^--^\n" + 
                       "#1    #2    #3  "
        , err = "Type Errors!\n" + 
                "#1: Unknown relation: Baz\n" +
                "#2: Unknown relation: Qux\n" +
                "#3: Unknown relation: Quid"
        , check = TypeCheck(expr, ENV)
        , combinedError = new TypeCheck.Errors(check[0])
      assert.equal(3, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(err, combinedError.toString())
      assert.equal(pos, combinedError.showPosition())
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 3}, check[0][0].getPosition())
      assert.deepEqual({startRow: 1, startColumn: 6, endRow: 1, endColumn: 9}, check[0][1].getPosition())
      assert.deepEqual({startRow: 1, startColumn: 12, endRow: 1, endColumn: 16}, check[0][2].getPosition())
    })
    it("Can highlight the position of three errors within statements", function() {
      var expr = Parse("Rename[foo/bar](Baz) X Project[baz](Qux) X Select[qux==2](Quid)")
        , pos =        "                ^-^                 ^-^                   ^--^\n" + 
                       "                #1                  #2                    #3  "
        , err = "Type Errors!\n" + 
                "#1: Unknown relation: Baz\n" +
                "#2: Unknown relation: Qux\n" +
                "#3: Unknown relation: Quid"
        , check = TypeCheck(expr, ENV)
        , combinedError = new TypeCheck.Errors(check[0])
      assert.equal(3, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(err, combinedError.toString())
      assert.equal(pos, combinedError.showPosition())
      assert.deepEqual({startRow: 1, startColumn: 16, endRow: 1, endColumn: 19}, check[0][0].getPosition())
      assert.deepEqual({startRow: 1, startColumn: 36, endRow: 1, endColumn: 39}, check[0][1].getPosition())
      assert.deepEqual({startRow: 1, startColumn: 58, endRow: 1, endColumn: 62}, check[0][2].getPosition())
    })
    it("Can return the position of type-errors on multiple lines", function () {
      var expr = Parse("Baz\nX\nQux")
        , check = TypeCheck(expr, ENV)
      assert.equal(2, check[0].length)
      assert.deepEqual([], check[1])
      assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 3}, check[0][0].getPosition())
      assert.deepEqual({startRow: 3, startColumn: 0, endRow: 3, endColumn: 3}, check[0][1].getPosition())

      expr = Parse("Rename[foo/bar](Baz)\nX\nProject[baz](Qux)")
      check = TypeCheck(expr, ENV)
      assert.equal(2, check[0].length)
      assert.deepEqual([], check[1])
      assert.deepEqual({startRow: 1, startColumn: 16, endRow: 1, endColumn: 19}, check[0][0].getPosition())
      assert.deepEqual({startRow: 3, startColumn: 13, endRow: 3, endColumn: 16}, check[0][1].getPosition())
    })
  })
})

})