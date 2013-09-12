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
Relation.add('Bar', new Relation(['a', 'bravo', 'c', 'd'], [[1, 2, 3, 4], [5, 6, 7, 8]]))

function binaryOperationMixin(terminal) {
  it("Fails if the LHS has a type-checking error", function() {
    var expr = Parser.parse('Project[foo]([[\'bar\']->[1]]) ' + terminal + ' [[\'bar\']->[1]]')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal("Missing attributes: foo", check[0][0].error)
  })
  it("Fails if the RHS has a type-checking error", function() {
    var expr = Parser.parse('[[\'bar\']->[1]] ' + terminal + ' Project[baz]([[\'bar\']->[1]])')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal("Missing attributes: baz", check[0][0].error)
  })
  it("Fails if both the LHS and the RHS has type-checking errors", function() {
    var expr = Parser.parse('Project[foo]([[\'bar\']->[1]]) ' + terminal + ' Project[baz]([[\'bar\']->[1]])')
      , check = TypeCheck(expr)
    assert.equal(2, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal("Missing attributes: foo", check[0][0].error)
    assert.equal("Missing attributes: baz", check[0][1].error)
  })
}
function schemaMustMatchMixin(terminal) {
  it("Works when both the LHS and RHS agrees on the schema", function() {
    var expr = Parser.parse('Foo ' + terminal + ' Foo')
      , check = TypeCheck(expr)
    assert.deepEqual([], check[0])
    assert.deepEqual(['alpha', 'b', 'c'], check[1])
  })
  it("Fails when there is a disagreement on one of the attributes in the schema", function() {
    var expr = Parser.parse('[[\'foo\']->[1]] ' + terminal + ' [[\'bar\']->[1]]')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal('Disagreement on attribute 1: foo≠bar', check[0][0].error)
  })
  it("Fails when there is a disagreement on multiple of the attributes in the schema", function() {
    var expr = Parser.parse('[[\'foo\', \'bar\']->[1, 2]] ' + terminal + ' [[\'bar\', \'foo\']->[1, 2]]')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal('Disagreement on attribute 1: foo≠bar, 2: bar≠foo', check[0][0].error)
  })
  it("Fails when there are more attributes in the schema of the LHS than the RHS", function() {
    var expr = Parser.parse('[[\'foo\', \'bar\']->[1, 2]] ' + terminal + ' [[\'foo\']->[1]]')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal('Disagreement on attribute 2: bar≠ε', check[0][0].error)
  })
  it("Fails when there are more attributes in the schema of the RHS than the LHS", function() {
    var expr = Parser.parse('[[\'foo\']->[1]] ' + terminal + ' [[\'foo\', \'bar\']->[1, 2]]')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal('Disagreement on attribute 2: ε≠bar', check[0][0].error)
  })
  it("Fails when there is a disagreement some of the attributes in the schema", function() {
    var expr = Parser.parse('Foo ' + terminal + ' Bar')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal('Disagreement on attribute 1: alpha≠a, 2: b≠bravo, 4: ε≠d', check[0][0].error)
  })
  it("Works when the disagreement is rectified with Select and Project prior to Union", function() {
    var expr = Parser.parse('Rename[alpha/a](Foo) ' + terminal + ' Project[a, b, c](Rename[bravo/b](Bar))')
      , check = TypeCheck(expr)
    assert.deepEqual([], check[0])
    assert.deepEqual(['a', 'b', 'c'], check[1])
  })
}

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
    it("Fails when the relation have duplicate attributes")
    it("Fails when the data does not have as many columns as the schema")
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
  describe("Projections", function() {
    var expr = Parser.parse("Project[alpha, b](Foo)")
      , check = TypeCheck(expr)
    it("Has no errors when the projection is over known attributes", function() {
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the projection is over known attributes", function() {
      assert.deepEqual(['alpha', 'b'], check[1])
    })
    it("Has an error when a attribute is missing", function() {
      var expr = Parser.parse("Project[a](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a", check[0][0].error)
    })
    it("Has an error when multiple attributes are missing", function() {
      var expr = Parser.parse("Project[a, d](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a, d", check[0][0].error)
    })
    it("Has an error when some of the attributes are missing", function() {
      var expr = Parser.parse("Project[a, c, d, b](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a, d", check[0][0].error)
    })
  })
  describe("Renames", function() {
    var expr = Parser.parse("Rename[alpha/a](Foo)")
      , check = TypeCheck(expr)
    it("Has no errors when the rename involves known attributes", function() {
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the rename involves known attributes", function() {
      assert.deepEqual(['a', 'b', 'c'], check[1])
    })
    it("Has an error when a attribute is missing", function() {
      var expr = Parser.parse("Rename[a/alpha](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attribute: a", check[0][0].error)
    })
    it("Has an error when renaming a attribute to the name of a existing attribute", function() {
      var expr = Parser.parse("Rename[alpha/b](Foo)")
        , check = TypeCheck(expr)
      // assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Can not rename attribute alpha to b, b already exists", check[0][0].error)
    })
  })
  describe("Selections", function() {
    it("Works well with attribute-less criterias", function() {
      var expr = Parser.parse("Select[1==2](Foo)")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
    it("Works well with a criteria involving a single attribute", function() {
      var expr = Parser.parse("Select[alpha==2](Foo)")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
    it("Works well with both sides of a criteria involves attributes", function() {
      var expr = Parser.parse("Select[alpha==b](Foo)")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
    it("Works well with a criteria involving multiple attributes", function() {
      var expr = Parser.parse("Select[alpha==2 && b==2](Foo)")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
      assert.deepEqual(['alpha', 'b', 'c'], check[1])
    })
    it("Has an error when a attribute is missing", function() {
      var expr = Parser.parse("Select[a==1](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a", check[0][0].error)
    })
    it("Has an error when multiple attributes are missing", function() {
      var expr = Parser.parse("Select[a==1 && d==2](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a, d", check[0][0].error)
    })
    it("Has an error when both sides of the criteria are missing attributes", function() {
      var expr = Parser.parse("Select[a==d](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a, d", check[0][0].error)
    })
    it("Has an error when some of the attributes are missing", function() {
      var expr = Parser.parse("Select[a==1 && b==2](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal("Missing attributes: a", check[0][0].error)
    })
  })
  describe("Unions", function() {
    binaryOperationMixin.call(this, 'Union')
    schemaMustMatchMixin.call(this, 'Union')
  })
  describe("Set-Differences", function() {
    binaryOperationMixin.call(this, '-')
    schemaMustMatchMixin.call(this, '-')
  })
  describe("Intersections", function() {
    binaryOperationMixin.call(this, 'Intersect')
    schemaMustMatchMixin.call(this, 'Intersect')
  })
  describe.skip("Cartesian Joins", function() {
    binaryOperationMixin.call(this, 'X')
  })
  describe.skip("Joins", function() {
    binaryOperationMixin.call(this, 'Join[1==2]')
  })
  describe.skip("Natural Joins", function() {
    binaryOperationMixin.call(this, 'Join')
  })
  describe.skip("Divisions", function() {
    binaryOperationMixin.call(this, '/')
  })
})