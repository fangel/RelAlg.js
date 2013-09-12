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
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal("Missing attributes: foo", check[0][0].error)
  })
  it("Fails if the RHS has a type-checking error", function() {
    var expr = Parser.parse('[[\'bar\']->[1]] ' + terminal + ' Project[baz]([[\'bar\']->[1]])')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal("Missing attributes: baz", check[0][0].error)
  })
  it("Fails if both the LHS and the RHS has type-checking errors", function() {
    var expr = Parser.parse('Project[foo]([[\'bar\']->[1]]) ' + terminal + ' Project[baz]([[\'bar\']->[1]])')
      , check = TypeCheck(expr)
    assert.equal(2, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal(TypeCheck.Error, check[0][1].constructor)
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
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 1: foo≠bar', check[0][0].error)
  })
  it("Fails when there is a disagreement on multiple of the attributes in the schema", function() {
    var expr = Parser.parse('[[\'foo\', \'bar\']->[1, 2]] ' + terminal + ' [[\'bar\', \'foo\']->[1, 2]]')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 1: foo≠bar, 2: bar≠foo', check[0][0].error)
  })
  it("Fails when there are more attributes in the schema of the LHS than the RHS", function() {
    var expr = Parser.parse('[[\'foo\', \'bar\']->[1, 2]] ' + terminal + ' [[\'foo\']->[1]]')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 2: bar≠ε', check[0][0].error)
  })
  it("Fails when there are more attributes in the schema of the RHS than the LHS", function() {
    var expr = Parser.parse('[[\'foo\']->[1]] ' + terminal + ' [[\'foo\', \'bar\']->[1, 2]]')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
    assert.equal('Disagreement on attribute 2: ε≠bar', check[0][0].error)
  })
  it("Fails when there is a disagreement some of the attributes in the schema", function() {
    var expr = Parser.parse('Foo ' + terminal + ' Bar')
      , check = TypeCheck(expr)
    assert.equal(1, check[0].length)
    assert.deepEqual([], check[1])
    assert.equal(TypeCheck.Error, check[0][0].constructor)
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
    it("Has no error", function() {
      var expr = Parser.parse("Foo := [['foo', 'bar', 'baz'] -> [1,2,3], [3,4,5]]")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema", function() {
      var expr = Parser.parse("Foo := [['foo', 'bar', 'baz'] -> [1,2,3], [3,4,5]]")
        , check = TypeCheck(expr)
      assert.deepEqual(['foo', 'bar', 'baz'], check[1])
    })
    it("Fails when the relation have duplicate attributes", function() {
      var expr = Parser.parse("Foo := [['foo', 'bar', 'foo'] -> [1,2,3], [3,4,5]]")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Duplicate attributes: foo", check[0][0].error)
    })
    it("Fails when the data does not have as many columns as the schema", function() {
      var expr = Parser.parse("Foo := [['foo', 'bar', 'baz'] -> [1,2,3], [3,4]]")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Some rows does not conform to the schema: [3, 4]", check[0][0].error)
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
    it("Has no errors when the rename involves known attributes", function() {
      var expr = Parser.parse("Rename[alpha/a](Foo)")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the rename involves known attributes", function() {
      var expr = Parser.parse("Rename[alpha/a](Foo)")
        , check = TypeCheck(expr)
      assert.deepEqual(['a', 'b', 'c'], check[1])
    })
    it("Has an error when a attribute is missing", function() {
      var expr = Parser.parse("Rename[a/alpha](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attribute: a", check[0][0].error)
    })
    it("Has an error when renaming a attribute to the name of a existing attribute", function() {
      var expr = Parser.parse("Rename[alpha/b](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
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
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: a", check[0][0].error)
    })
    it("Has an error when multiple attributes are missing", function() {
      var expr = Parser.parse("Select[a==1 && d==2](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: a, d", check[0][0].error)
    })
    it("Has an error when both sides of the criteria are missing attributes", function() {
      var expr = Parser.parse("Select[a==d](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: a, d", check[0][0].error)
    })
    it("Has an error when some of the attributes are missing", function() {
      var expr = Parser.parse("Select[a==1 && b==2](Foo)")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
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
  describe("Cartesian Product", function() {
    binaryOperationMixin.call(this, 'X')
    it("Has no errors when the cartesian product involves relations of different schemas", function() {
      var expr = Parser.parse("[['foo']->[1]] X [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the cartesian product involves relations of different schemas", function() {
      var expr = Parser.parse("[['foo']->[1]] X [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.deepEqual(['foo', 'bar'], check[1])
    })
    it("Fails when the cartesian product involves relations has one overlapping attribute", function() {
      var expr = Parser.parse("Foo X Bar")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Overlapping attributes: c", check[0][0].error)
    })
    it("Fails when the cartesian product involves relations has multiple overlapping attribute", function() {
      var expr = Parser.parse("Foo X Foo")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Overlapping attributes: alpha, b, c", check[0][0].error)
    })
  })
  describe("Joins", function() {
    binaryOperationMixin.call(this, 'Join[1==2]')
    it("Has no errors when the join involves relations of different schemas", function() {
      var expr = Parser.parse("[['foo']->[1]] Join[foo==bar] [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the join involves relations of different schemas", function() {
      var expr = Parser.parse("[['foo']->[1]] Join[foo==bar] [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.deepEqual(['foo', 'bar'], check[1])
    })
    it("Fails when the join involves relations has one overlapping attribute", function() {
      var expr = Parser.parse("Foo Join[alpha==a] Bar")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Overlapping attributes: c", check[0][0].error)
    })
    it("Fails when the join involves relations has multiple overlapping attribute", function() {
      var expr = Parser.parse("Foo Join[alpha==alpha] Foo")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Overlapping attributes: alpha, b, c", check[0][0].error)
    })
    it("Fails when the criteria involves attributes not in one of the two involved relations", function() {
      var expr = Parser.parse("[['foo']->[1]] Join[foz==baz] [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Missing attributes: foz, baz", check[0][0].error)
    })
  })
  describe("Natural Joins", function() {
    binaryOperationMixin.call(this, 'Join')
    it("Never has an error as long as the two expressions are sound", function() {
      var expr = Parser.parse("[['foo']->[1]] Join [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the two expressions are sound", function() {
      var expr = Parser.parse("[['foo']->[1]] Join [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.deepEqual(['foo', 'bar'], check[1])

      expr = Parser.parse("Foo Join Bar")
      check = TypeCheck(expr)
      assert.deepEqual(['alpha', 'b', 'c', 'a', 'bravo', 'd'], check[1])
    })
  })
  describe("Divisions", function() {
    binaryOperationMixin.call(this, '/')
    it("Has no errors when the LHS is a superset of the RHS", function () {
      var expr = Parser.parse("[['foo', 'bar']->[1, 2]] / [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.deepEqual([], check[0])
    })
    it("Has the correct schema when the LHS is a superset of the RHS", function () {
      var expr = Parser.parse("[['foo', 'bar']->[1, 2]] / [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.deepEqual(['foo'], check[1])
    })
    it("Fails when the LHS equals RHS", function () {
      var expr = Parser.parse("[['bar']->[1]] / [['bar']->[2]]")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("No unique attributes on the left hand side", check[0][0].error)
    })
    it("Fails when the RHS has attributes that the RHS does not", function () {
      var expr = Parser.parse("[['bar']->[1]] / [['foo', 'bar']->[1, 2]]")
        , check = TypeCheck(expr)
      assert.equal(1, check[0].length)
      assert.deepEqual([], check[1])
      assert.equal(TypeCheck.Error, check[0][0].constructor)
      assert.equal("Right hand side has unique attributes: foo", check[0][0].error)
    })
  })
})