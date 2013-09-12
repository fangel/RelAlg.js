var assert = require("assert")
  , requirejs = require("requirejs")

requirejs.config({
  baseUrl: __dirname + "/../lib",
});

var Parse = requirejs("parse")
  , Tree = requirejs("tree")
  , Relation = requirejs("relation")

function getStmt(expr) {
  if (expr instanceof Tree.Assignment) 
    if (expr.name == 'it') 
      return expr.relation
    else
      assert.fail(expr.name, 'it', 'The expression is not on the form it := EXPR')
  else assert.fail(expr.constructor, 'Tree.Assignment', 'The expression is not on the form it := EXPR')
}
function getCriteria(expr) {
  var stmt = getStmt(expr)
  if (stmt.criteria instanceof Tree.Criteria || stmt.criteria instanceof Tree.CriteriaComposition)
    return stmt.criteria
  else if (stmt.criteria !== undefined) assert.fail(stmt.criteria.constructor, 'Tree.Criteria(Composition)?', 'The criteria is not a real criteria')
  else assert.fail(stmt.criteria, 'object', 'The expression doesn\'t have a criteria')
}
function binaryStmtMixin(terminal, ASTLeaf, glue) {
  var msg = glue === undefined ? 'Contains both the LHS and the RHS' : 'Contains the LHS, the RHS and the operation meta-data'
  it(msg, function() {
    var expr = Parse("LHS " + terminal + " RHS")
      , stmt = getStmt(expr)
      , expected
    if (glue === undefined)
      expected = new ASTLeaf(new Tree.RelationReference('LHS'), new Tree.RelationReference('RHS'))
    else  
      expected = new ASTLeaf(new Tree.RelationReference('LHS'), glue, new Tree.RelationReference('RHS'))
    assert.deepEqual(stmt, expected)
  })
}
function rightAssocMixin(terminal, ASTLeaf, glue) {
  // This mixin is currently not used, as relational algebra doesn't have any
  // binary right-associative rules, but it's left in here for completeness
  it('Should be right-associative', function() {
    var expr = Parse("FST " + terminal + " SND " + terminal + " THD")
      , stmt = getStmt(expr)
      , expected
    if (glue === undefined)
      expected = new ASTLeaf(new Tree.RelationReference('FST'), new ASTLeaf(new Tree.RelationReference('SND'), new Tree.RelationReference('THD')))
    else
      expected = new ASTLeaf(new Tree.RelationReference('FST'), glue, new ASTLeaf(new Tree.RelationReference('SND'), glue, new Tree.RelationReference('THD')))
    assert.deepEqual(stmt, expected)
  })
  it('.. and should respect parenthethis', function() {
    var expr = Parse("(FST " + terminal + " SND) " + terminal + " THD")
      , stmt = getStmt(expr)
      , expected
    if (glue === undefined)
      expected = new ASTLeaf(new ASTLeaf(new Tree.RelationReference('FST'), new Tree.RelationReference('SND')), new Tree.RelationReference('THD'))
    else
      expected = new ASTLeaf(new ASTLeaf(new Tree.RelationReference('FST'), glue, new Tree.RelationReference('SND')), glue, new Tree.RelationReference('THD'))
    assert.deepEqual(stmt, expected)        
  })
}
function leftAssocMixin(terminal, ASTLeaf, glue) {
  it('Should be left-associative', function() {
    var expr = Parse("FST " + terminal + " SND " + terminal + " THD")
      , stmt = getStmt(expr),
      expected
    if (glue === undefined)
      expected = new ASTLeaf(new ASTLeaf(new Tree.RelationReference('FST'), new Tree.RelationReference('SND')), new Tree.RelationReference('THD'))
    else
      expected = new ASTLeaf(new ASTLeaf(new Tree.RelationReference('FST'), glue, new Tree.RelationReference('SND')), glue, new Tree.RelationReference('THD'))
    assert.deepEqual(stmt, expected)
  })
  it('.. and should respect parenthethis', function() {
    var expr = Parse("FST " + terminal + " (SND " + terminal + " THD)")
      , stmt = getStmt(expr)
      , expected
    if (glue === undefined)
      expected = new ASTLeaf(new Tree.RelationReference('FST'), new ASTLeaf(new Tree.RelationReference('SND'), new Tree.RelationReference('THD')))
    else
      expected = new ASTLeaf(new Tree.RelationReference('FST'), glue, new ASTLeaf(new Tree.RelationReference('SND'), glue, new Tree.RelationReference('THD')))
    assert.deepEqual(stmt, expected)        
  })
}

describe('Parsing', function(){
  describe('Expressions', function(){
    describe('With a explicit assignment', function(){
      it("Is a Assignment to the LFS", function() {
        var expr = Parse("LHS := RHS")
          , expected = new Tree.Assignment('LHS', new Tree.RelationReference('RHS'))
        assert.deepEqual(expr, expected)
      })
    })
    describe("Without a explicit assignment", function() {
      it("Is a Assignment to the 'it' relation", function() {
        var expr = Parse("RHS")
          , expected = new Tree.Assignment('it', new Tree.RelationReference('RHS'))
        assert.deepEqual(expr, expected)
      })
    })
  })
  describe('Statements', function() {
    describe('that is the name of a relation', function() {
      var expr = Parse('relationName')
      it('Contains the relation-name', function() {
        var stmt = getStmt(expr)
          , expected = new Tree.RelationReference('relationName')
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a inline relation', function() {
      var expr = Parse("[['foo', 'bar'] -> [1, 2], [3, 4]]")
      it('Contains the relation', function() {
        var stmt = getStmt(expr)
          , expected = new Tree.Relation(new Relation(["foo", "bar"], [[1, 2], [3, 4]]))
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a union statement', function() {
      binaryStmtMixin.call(this, 'Union', Tree.Union)
      leftAssocMixin.call(this, 'Union', Tree.Union)
    })
    describe('that is a intersect statement', function() {
      binaryStmtMixin.call(this, 'Intersect', Tree.Intersection)
      leftAssocMixin.call(this, 'Intersect', Tree.Intersection)
    })
    describe('that is a set-difference statement', function() {
      binaryStmtMixin.call(this, '-', Tree.Difference)
      leftAssocMixin.call(this, '-', Tree.Difference)
    })
    describe('that is a cartesian-join statement', function() {
      binaryStmtMixin.call(this, 'X', Tree.Cartesian)
      leftAssocMixin.call(this, 'X', Tree.Cartesian)
    })
    describe('that is a join statement', function() {
      var criteria = new Tree.Criteria(new Tree.Value(1), '==', new Tree.Value(2))
      binaryStmtMixin.call(this, 'Join[1==2]', Tree.Join, criteria)
      leftAssocMixin.call(this, 'Join[1==2]', Tree.Join, criteria)
    })
    describe('that is a natural-join statement', function() {
      binaryStmtMixin.call(this, 'Join', Tree.NaturalJoin)
      leftAssocMixin.call(this, 'Join', Tree.NaturalJoin)
    })
    describe('that is a division statement', function() {
      binaryStmtMixin.call(this, '/', Tree.Division)
      leftAssocMixin.call(this, '/', Tree.Division)
    })
    describe('that is contained in parenthethis', function() {
      it('Should behave exactly as if the parenthethis weren\'t there', function() {
        var expr = Parse('(REL)')
          , stmt = getStmt(expr)
          , expected = new Tree.RelationReference('REL')
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a projection statement', function() {
      it('Contains the projection list and the relation', function() {
        var expr = Parse('Project[fst, snd](REL)')
          , stmt = getStmt(expr)
          , projList = new Tree.ProjectionList(['fst', 'snd'])
          , expected = new Tree.Projection(projList, new Tree.RelationReference('REL'))
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a rename statement', function() {
      it('Contains the rename list and the relation', function() {
        var expr = Parse('Rename[from/to](REL)')
          , stmt = getStmt(expr)
        assert.equal(Tree.Rename, stmt.constructor, 'Statement is not a rename expression')
        assert.equal('from', stmt.from, 'From name wrong')
        assert.equal('to', stmt.to, 'To name wrong')
        assert.equal(Tree.RelationReference, stmt.relation.constructor, 'The expression to rename is not a relation reference')
        assert.equal('REL', stmt.relation.name, 'Name of the relation referenced in the rename reference is wrong')
      })
    })
    describe('that is a selection statement', function() {
      it('Contains the selection criteria and the relation', function() {
        var expr = Parse('Select[1==2](REL)')
          , stmt = getStmt(expr)
          , criteria = new Tree.Criteria(new Tree.Value(1), '==', new Tree.Value(2))
          , expected = new Tree.Selection(criteria, new Tree.RelationReference('REL'))
        assert.deepEqual(stmt, expected)
      })
    })
  })
  describe('Criterias', function() {
    describe('that involves binary comparison', function() {
      var ops = ['==', '!=', '<=', '>=', '<', '>']
      for (var op in ops) {
        // Loop through all the different comparison operators we have
        it('Works with ' + ops[op], function() {
          var expected = new Tree.Criteria(new Tree.Value(1), ops[op], new Tree.Value(2))

          // Check both places that could contain a criteria, in this case Select-operations
          var expr = Parse('Select[1 ' + ops[op] + ' 2](Foo)')
            , criteria = getCriteria(expr)
          assert.deepEqual(criteria, expected)

          // And Join-operations
          expr = Parse('LHS Join[1 ' + ops[op] + ' 2] RHS')
          criteria = getCriteria(expr)
          assert.deepEqual(criteria, expected)
        })
      }
    })
    describe('supports types for the criteria fragments', function() {
      var types = {
        'integer': 1, // A integer, they are simple on the form [digits]
        'string': '\'str\'', // Strings are '-escaped
        'float': '1.0', // Floats are on the form [digits].[digits]
        'attribute': 'attr' // A non-escaped string is used to refer to attributes on the relations
      }
      for (var fst in types) {
        for (var snd in types) {
          // And check that comparison between all 4 types work.
          it('Has ' + fst + ' vs ' + snd + ' support', function() {
            var lhs = fst == 'attribute' ? new Tree.Attribute(types[fst]) : new Tree.Value(types[fst])
              , rhs = snd == 'attribute' ? new Tree.Attribute(types[snd]) : new Tree.Value(types[snd])
              , expected = new Tree.Criteria(lhs, '==', rhs)

            // Check both places that could contain a criteria, in this case Select-operations
            var expr = Parse('Select[' + types[fst] + ' == ' + types[snd] + '](Foo)')
              , criteria = getCriteria(expr)
            assert.deepEqual(criteria, expected)

            // And Join-operations
            expr = Parse('LHS Join[' + types[fst] + ' == ' + types[snd] + '] RHS')
            criteria = getCriteria(expr)
            assert.deepEqual(criteria, expected)
          })
        }
      }
    })
    describe('that is contained in parenthethis', function() {
      it('Should behave as if there is no parenthethis', function() {
        var expected = new Tree.Criteria(new Tree.Value(1), '==', new Tree.Value(2))

        // Check both places that could contain a criteria, in this case Select-operations
        var expr = Parse('Select[(1==2)](Foo)')
          , criteria = getCriteria(expr)
        assert.deepEqual(criteria, expected)

        // And Join-operations
        expr = Parse('LHS Join[(1==2)] RHS')
        criteria = getCriteria(expr)
        assert.deepEqual(criteria, expected)
      })
    })
    var comps = {
      'conjunction': {terminal: '&&', op: 'AND'},
      'disjunction': {terminal: '||', op: 'OR'}
    }
    for (var comp in comps) {
      describe('that is a ' + comp, function() {
        it('Contains both the LHS and the RHS', function() {
          var expected = new Tree.CriteriaComposition(
            new Tree.Criteria(new Tree.Value(1), '==', new Tree.Value(2)),
            comps[comp].op,
            new Tree.Criteria(new Tree.Value(3), '==', new Tree.Value(4))
          )

          // Check both places that could contain a criteria, in this case Select-operations
          var expr = Parse('Select[(1==2 ' + comps[comp].terminal + ' 3==4)](Foo)')
            , criteria = getCriteria(expr)
          assert.deepEqual(criteria, expected)

          // And Join-operations
          expr = Parse('LHS Join[(1==2 ' + comps[comp].terminal + ' 3==4)] RHS')
          criteria = getCriteria(expr)
          assert.deepEqual(criteria, expected)
        })
        it('Should be left-associative', function() {
          var expected = new Tree.CriteriaComposition(
            new Tree.CriteriaComposition(
              new Tree.Criteria(new Tree.Value(1), '==', new Tree.Value(2)),
              comps[comp].op,
              new Tree.Criteria(new Tree.Value(3), '==', new Tree.Value(4))
            ),
            comps[comp].op,
            new Tree.Criteria(new Tree.Value(5), '==', new Tree.Value(6))
          )

          // Check both places that could contain a criteria, in this case Select-operations
          var expr = Parse('Select[(1==2 ' + comps[comp].terminal + ' 3==4 ' + comps[comp].terminal + ' 5==6)](Foo)')
            , criteria = getCriteria(expr)
          assert.deepEqual(criteria, expected)

          // And Join-operations
          expr = Parse('LHS Join[(1==2 ' + comps[comp].terminal + ' 3==4 ' + comps[comp].terminal + ' 5==6)] RHS')
          criteria = getCriteria(expr)
          assert.deepEqual(criteria, expected)
        })
        it('.. and should respect parenthethis', function() {
          var expected = new Tree.CriteriaComposition(
            new Tree.Criteria(new Tree.Value(1), '==', new Tree.Value(2)),
            comps[comp].op,
            new Tree.CriteriaComposition(
              new Tree.Criteria(new Tree.Value(3), '==', new Tree.Value(4)),
              comps[comp].op,
              new Tree.Criteria(new Tree.Value(5), '==', new Tree.Value(6))
            )
          )

          // Check both places that could contain a criteria, in this case Select-operations
          var expr = Parse('Select[(1==2 ' + comps[comp].terminal + ' (3==4 ' + comps[comp].terminal + ' 5==6))](Foo)')
            , criteria = getCriteria(expr)
          assert.deepEqual(criteria, expected)

          // And Join-operations
          expr = Parse('LHS Join[(1==2 ' + comps[comp].terminal + ' (3==4 ' + comps[comp].terminal + ' 5==6))] RHS')
          criteria = getCriteria(expr)
          assert.deepEqual(criteria, expected)
        })
      })
    }
  })
  describe('Invalid expressions', function() {
    it('Throws an error', function() {
      assert.throws(function() {
        Parse('FOO BAR')
      },
      Error)
    })
  })
})
