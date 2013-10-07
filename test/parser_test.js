(function(factory) {
  if (typeof define !== 'undefined' && define.amd) {
    // We are running the tests in Karma, which uses RequireJS for everything,
    // so we wrap everything in a define, with our test-case as the module.
    // Chai is loaded from Bower.
    define(['chai', 'relalg/parse', 'relalg/tree', 'relalg/relation'], factory)
  } else {
    // We are using the Mocha runner in Node.js, so we load Chai and RequireJS
    // from NPM, then use RequireJS to load relalg.
    var chai = require("chai")
      , requirejs = require("requirejs")
      , _ = require('./mocha-setup')
    var Parse = requirejs("relalg/parse")
      , Tree = requirejs("relalg/tree")
      , Relation = requirejs("relalg/relation")
    factory(chai, Parse, Tree, Relation)
  }
})(function(chai, Parse, Tree, Relation) {
var assert = chai.assert

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
function binaryStmtMixin(terminal, ASTLeaf, additionalCheck) {
  var msg = additionalCheck === undefined ? 'Contains both the LHS and the RHS' : 'Contains the LHS, the RHS and the operation meta-data'
  it(msg, function() {
    var expr = Parse("LHS " + terminal + " RHS")
      , stmt = getStmt(expr)
    assert.equal(ASTLeaf, stmt.constructor)
    assert.equal(Tree.RelationReference, stmt.left.constructor)
    assert.equal('LHS', stmt.left.name)
    assert.equal(Tree.RelationReference, stmt.right.constructor)
    assert.equal('RHS', stmt.right.name)
    if (additionalCheck)
      additionalCheck.call(this, stmt)
  })
}
function rightAssocMixin(terminal, ASTLeaf, additionalCheck) {
  // This mixin is currently not used, as relational algebra doesn't have any
  // binary right-associative rules, but it's left in here for completeness
  it('Should be right-associative', function() {
    var expr = Parse("FST " + terminal + " SND " + terminal + " THD")
      , stmt = getStmt(expr)
    assert.equal(ASTLeaf, stmt.constructor)
    assert.equal(Tree.RelationReference, stmt.left.constructor)
    assert.equal('FST', stmt.left.name)
    assert.equal(ASTLeaf, stmt.right.constructor)
    assert.equal(Tree.RelationReference, stmt.right.left.constructor)
    assert.equal('SND', stmt.right.left.name)
    assert.equal(Tree.RelationReference, stmt.right.right.constructor)
    assert.equal('THD', stmt.right.right.name)
    if (additionalCheck)
      additionalCheck.call(this, stmt)
  })
  it('.. and should respect parenthethis', function() {
    var expr = Parse("(FST " + terminal + " SND) " + terminal + " THD")
      , stmt = getStmt(expr)
    assert.equal(ASTLeaf, stmt.constructor)
    assert.equal(ASTLeaf, stmt.left.constructor)
    assert.equal(Tree.RelationReference, stmt.left.left.constructor)
    assert.equal('FST', stmt.left.left.name)
    assert.equal(Tree.RelationReference, stmt.left.right.constructor)
    assert.equal('SND', stmt.left.right.name)
    assert.equal(Tree.RelationReference, stmt.right.constructor)
    assert.equal('THD', stmt.right.name)
    if (additionalCheck)
      additionalCheck.call(this, stmt)
  })
}
function leftAssocMixin(terminal, ASTLeaf, additionalCheck) {
  it('Should be left-associative', function() {
    var expr = Parse("FST " + terminal + " SND " + terminal + " THD")
      , stmt = getStmt(expr)
    assert.equal(ASTLeaf, stmt.constructor)
    assert.equal(ASTLeaf, stmt.left.constructor)
    assert.equal(Tree.RelationReference, stmt.left.left.constructor)
    assert.equal('FST', stmt.left.left.name)
    assert.equal(Tree.RelationReference, stmt.left.right.constructor)
    assert.equal('SND', stmt.left.right.name)
    assert.equal(Tree.RelationReference, stmt.right.constructor)
    assert.equal('THD', stmt.right.name)
    if (additionalCheck)
      additionalCheck.call(this, stmt)
  })
  it('.. and should respect parenthethis', function() {
    var expr = Parse("FST " + terminal + " (SND " + terminal + " THD)")
      , stmt = getStmt(expr)
    assert.equal(ASTLeaf, stmt.constructor)
    assert.equal(Tree.RelationReference, stmt.left.constructor)
    assert.equal('FST', stmt.left.name)
    assert.equal(ASTLeaf, stmt.right.constructor)
    assert.equal(Tree.RelationReference, stmt.right.left.constructor)
    assert.equal('SND', stmt.right.left.name)
    assert.equal(Tree.RelationReference, stmt.right.right.constructor)
    assert.equal('THD', stmt.right.right.name)
    if (additionalCheck)
      additionalCheck.call(this, stmt)
  })
}
function checkCriteriaMixin(criteria, left, op, right) {
  assert.equal(Tree.Criteria, criteria.constructor)
  assert.equal(op, criteria.op)
  if (left.constructor == Tree.Attribute) {
    assert.equal(Tree.Attribute, criteria.left.constructor)
    assert.equal(left.name, criteria.left.name)
  } else {
    assert.equal(Tree.Value, criteria.left.constructor)
    assert.equal(left, criteria.left.value)
  }
  if (right.constructor == Tree.Attribute) {
    assert.equal(Tree.Attribute, criteria.right.constructor)
    assert.equal(right.name, criteria.right.name)
  } else {
    assert.equal(Tree.Value, criteria.right.constructor)
    assert.equal(right, criteria.right.value)
  }
}

describe('Parsing', function(){
  describe('Expressions', function(){
    describe('With a explicit assignment', function(){
      it("Is a Assignment to the LFS", function() {
        var expr = Parse("LHS := RHS")
        assert.equal(Tree.Assignment, expr.constructor)
        assert.equal('LHS', expr.name)
        assert.equal(Tree.RelationReference, expr.relation.constructor)
        assert.equal('RHS', expr.relation.name)
        assert.equal(Object, expr.position.constructor)
      })
    })
    describe("Without a explicit assignment", function() {
      it("Is a Assignment to the 'it' relation", function() {
        var expr = Parse("RHS")
        assert.equal(Tree.Assignment, expr.constructor)
        assert.equal('it', expr.name)
        assert.equal(Tree.RelationReference, expr.relation.constructor)
        assert.equal('RHS', expr.relation.name)
        assert.equal(Object, expr.position.constructor)
      })
    })
  })
  describe('Statements', function() {
    describe('that is the name of a relation', function() {
      var expr = Parse('relationName')
      it('Contains the relation-name', function() {
        var stmt = getStmt(expr)
        assert.equal(Tree.RelationReference, stmt.constructor)
        assert.equal('relationName', stmt.name)
        assert.equal(Object, stmt.position.constructor)
      })
    })
    describe('that is a inline relation', function() {
      var expr = Parse("[['foo', 'bar'] -> [1, 2], [3, 4]]")
      it('Contains the relation', function() {
        var stmt = getStmt(expr)
          , relation = new Relation(["foo", "bar"], [[1, 2], [3, 4]])
        assert.deepEqual(Tree.Relation, stmt.constructor)
        assert.deepEqual(relation, stmt.relation)
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
      var additionalCheck = function(stmt) {
        checkCriteriaMixin.call(this, stmt.criteria, 1, '==', 2)
      }
      binaryStmtMixin.call(this, 'Join[1==2]', Tree.Join, additionalCheck)
      leftAssocMixin.call(this, 'Join[1==2]', Tree.Join, additionalCheck)
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
        assert.equal(Tree.RelationReference, stmt.constructor)
        assert.equal('REL', stmt.name)
      })
    })
    describe('that is a projection statement', function() {
      it('Contains the projection list and the relation', function() {
        var expr = Parse('Project[fst, snd](REL)')
          , stmt = getStmt(expr)
        assert.equal(Tree.Projection, stmt.constructor)
        assert.equal(Tree.ProjectionList, stmt.projectionList.constructor)
        assert.deepEqual(['fst', 'snd'], stmt.projectionList.list)
        assert.equal(Tree.RelationReference, stmt.relation.constructor)
        assert.equal('REL', stmt.relation.name)
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
        assert.equal(Tree.Selection, stmt.constructor)
        checkCriteriaMixin.call(this, stmt.criteria, 1, '==', 2)
        assert.equal(Tree.RelationReference, stmt.relation.constructor)
        assert.equal('REL', stmt.relation.name)
      })
    })
  })
  describe('Criterias', function() {
    describe('that involves binary comparison', function() {
      var ops = ['==', '!=', '<=', '>=', '<', '>']
      for (var op in ops) {
        // Loop through all the different comparison operators we have
        it('Works with ' + ops[op], function() {
          // Check both places that could contain a criteria, in this case Select-operations
          var expr = Parse('Select[1 ' + ops[op] + ' 2](Foo)')
            , criteria = getCriteria(expr)
          checkCriteriaMixin.call(this, criteria, 1, ops[op], 2)

          // And Join-operations
          expr = Parse('LHS Join[1 ' + ops[op] + ' 2] RHS')
          criteria = getCriteria(expr)
          checkCriteriaMixin.call(this, criteria, 1, ops[op], 2)
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
            var lhs = fst == 'attribute' ? new Tree.Attribute(types[fst]) : types[fst]
              , rhs = snd == 'attribute' ? new Tree.Attribute(types[snd]) : types[snd]

            // Check both places that could contain a criteria, in this case Select-operations
            var expr = Parse('Select[' + types[fst] + ' == ' + types[snd] + '](Foo)')
              , criteria = getCriteria(expr)
            checkCriteriaMixin.call(this, criteria, lhs, '==', rhs)

            // And Join-operations
            expr = Parse('LHS Join[' + types[fst] + ' == ' + types[snd] + '] RHS')
            criteria = getCriteria(expr)
            checkCriteriaMixin.call(this, criteria, lhs, '==', rhs)
          })
        }
      }
    })
    describe('that is contained in parenthethis', function() {
      it('Should behave as if there is no parenthethis', function() {
        // Check both places that could contain a criteria, in this case Select-operations
        var expr = Parse('Select[(1==2)](Foo)')
          , criteria = getCriteria(expr)
        checkCriteriaMixin.call(this, criteria, 1, '==', 2)

        // And Join-operations
        expr = Parse('LHS Join[(1==2)] RHS')
        criteria = getCriteria(expr)
        checkCriteriaMixin.call(this, criteria, 1, '==', 2)
      })
    })
    var comps = {
      'conjunction': {terminal: '&&', op: 'AND'},
      'disjunction': {terminal: '||', op: 'OR'}
    }
    for (var comp in comps) {
      describe('that is a ' + comp, function() {
        it('Contains both the LHS and the RHS', function() {
          // Check both places that could contain a criteria, in this case Select-operations
          var expr = Parse('Select[(1==2 ' + comps[comp].terminal + ' 3==4)](Foo)')
            , criteria = getCriteria(expr)
          assert.equal(Tree.CriteriaComposition, criteria.constructor)
          assert.equal(comps[comp].op, criteria.comp)
          checkCriteriaMixin.call(this, criteria.left, 1, '==', 2)
          checkCriteriaMixin.call(this, criteria.right, 3, '==', 4)

          // And Join-operations
          expr = Parse('LHS Join[(1==2 ' + comps[comp].terminal + ' 3==4)] RHS')
          criteria = getCriteria(expr)
          assert.equal(Tree.CriteriaComposition, criteria.constructor)
          assert.equal(comps[comp].op, criteria.comp)
          checkCriteriaMixin.call(this, criteria.left, 1, '==', 2)
          checkCriteriaMixin.call(this, criteria.right, 3, '==', 4)
        })
        it('Should be left-associative', function() {
          // Check both places that could contain a criteria, in this case Select-operations
          var expr = Parse('Select[(1==2 ' + comps[comp].terminal + ' 3==4 ' + comps[comp].terminal + ' 5==6)](Foo)')
            , criteria = getCriteria(expr)
          assert.equal(Tree.CriteriaComposition, criteria.constructor)
          assert.equal(comps[comp].op, criteria.comp)
          assert.equal(Tree.CriteriaComposition, criteria.left.constructor)
          assert.equal(comps[comp].op, criteria.left.comp)
          checkCriteriaMixin.call(this, criteria.left.left, 1, '==', 2)
          checkCriteriaMixin.call(this, criteria.left.right, 3, '==', 4)
          checkCriteriaMixin.call(this, criteria.right, 5, '==', 6)

          // And Join-operations
          expr = Parse('LHS Join[(1==2 ' + comps[comp].terminal + ' 3==4 ' + comps[comp].terminal + ' 5==6)] RHS')
          criteria = getCriteria(expr)
          assert.equal(Tree.CriteriaComposition, criteria.constructor)
          assert.equal(comps[comp].op, criteria.comp)
          assert.equal(Tree.CriteriaComposition, criteria.left.constructor)
          assert.equal(comps[comp].op, criteria.left.comp)
          checkCriteriaMixin.call(this, criteria.left.left, 1, '==', 2)
          checkCriteriaMixin.call(this, criteria.left.right, 3, '==', 4)
          checkCriteriaMixin.call(this, criteria.right, 5, '==', 6)
        })
        it('.. and should respect parenthethis', function() {
          // Check both places that could contain a criteria, in this case Select-operations
          var expr = Parse('Select[(1==2 ' + comps[comp].terminal + ' (3==4 ' + comps[comp].terminal + ' 5==6))](Foo)')
            , criteria = getCriteria(expr)
          assert.equal(Tree.CriteriaComposition, criteria.constructor)
          assert.equal(comps[comp].op, criteria.comp)
          checkCriteriaMixin.call(this, criteria.left, 1, '==', 2)
          assert.equal(Tree.CriteriaComposition, criteria.right.constructor)
          assert.equal(comps[comp].op, criteria.right.comp)
          checkCriteriaMixin.call(this, criteria.right.left, 3, '==', 4)
          checkCriteriaMixin.call(this, criteria.right.right, 5, '==', 6)

          // And Join-operations
          expr = Parse('LHS Join[(1==2 ' + comps[comp].terminal + ' (3==4 ' + comps[comp].terminal + ' 5==6))] RHS')
          criteria = getCriteria(expr)
          assert.equal(Tree.CriteriaComposition, criteria.constructor)
          assert.equal(comps[comp].op, criteria.comp)
          checkCriteriaMixin.call(this, criteria.left, 1, '==', 2)
          assert.equal(Tree.CriteriaComposition, criteria.right.constructor)
          assert.equal(comps[comp].op, criteria.right.comp)
          checkCriteriaMixin.call(this, criteria.right.left, 3, '==', 4)
          checkCriteriaMixin.call(this, criteria.right.right, 5, '==', 6)
        })
      })
    }
  })
  describe('Invalid expressions', function() {
    it('Throws an error', function() {
      try {
        Parse('FOO BAR')
        assert.fail('worked', 'failed')
      } catch (err) {
        assert.instanceOf(err, Parse.Error)
      }
      
      try {
        Parse('')
        assert.fail('worked', 'failed')
      } catch (err) {
        assert.instanceOf(err, Parse.Error)
      }
    })
    it('Has a useful error message', function() {
      try {
        Parse('FOO BAR')
        assert.fail('worked', 'failed')
      } catch (e) {
        assert.equal("Parse Error: Unexpected 'BAR':<<id>>, expected on of ':=', '<<EOF>>', 'Union', 'Intersect', '-', 'X', 'Join', '/'",""+e)
      }
    })
    it('Is able to return where it failed', function() {
      try {
        Parse('')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 1, startColumn: 0, endRow: 1, endColumn: 0}, pos)
      }

      try {
        Parse('FOO BAR')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 1, startColumn: 4, endRow: 1, endColumn: 7}, pos)
      }

      try {
        Parse('FOO   BAR')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 1, startColumn: 6, endRow: 1, endColumn: 9}, pos)
      }

      try {
        Parse('Rename[a/b](c')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 1, startColumn: 13, endRow: 1, endColumn: 13}, pos)
      }

      try {
        Parse('Rename[a/b](c)' + "\n" + 'Join Join')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 2, startColumn: 5, endRow: 2, endColumn: 9}, pos)
      }

      try {
        Parse('Rename[a/b](' + "\n" + 'c')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 2, startColumn: 1, endRow: 2, endColumn: 1}, pos)
      }
    })
    it('Is able to graphicaly describe where it failed', function() {
      try {
        Parse('')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.showPosition()
          , expected = '^'
        assert.equal(expected, pos)
      }

      try {
        Parse('FOO BAR')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.showPosition()
                     // FOO BAR
          , expected = '    ^-^'
        assert.equal(expected, pos)
      }

      try {
        Parse('FOO   BAR')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.showPosition()
                     // FOO   BAR
          , expected = '      ^-^'
        assert.equal(expected, pos)
      }

      try {
        Parse('Rename[a/b](c')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.showPosition()
                     // Rename[a/b](c
          , expected = '             ^'
        assert.equal(expected, pos)
      }
    })
  })
  describe('Invalid characters', function() {
    it('Throws an error', function() {
      try {
        Parse('foo.bar')
        assert.fail('worked', 'failed')
      } catch (err) {
        assert.instanceOf(err, Parse.Error)
      }
    })
    it('Has a useful error message', function() {
      try {
        Parse('foo.bar')
        assert.fail('worked', 'failed')
      } catch (e) {
        assert.equal("Tokenization Error: Unrecognized text: .bar",""+e)
      }
    })
    it('Is able to return where it failed', function() {
      try {
        Parse('foo.bar')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 1, startColumn: 3, endRow: 1, endColumn: 7}, pos)
      }

      try {
        Parse('Select[alpha==4](' + "\n" + 'foo.bar)')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 2, startColumn: 3, endRow: 2, endColumn: 8}, pos)
      }

      try {
        Parse('Select' + "\n" + '[alpha==4](' + "\n" + 'foo.bar)')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.getPosition()
        assert.deepEqual({startRow: 3, startColumn: 3, endRow: 3, endColumn: 8}, pos)
      }
    })
    it('Is able to graphicaly describe where it failed', function() {
      try {
        Parse('foo.bar')
        assert.fail('worked', 'failed')
      } catch (e) {
        var pos = e.showPosition()
                    //  foo.bar
          , expected = '   ^--^'
        assert.equal(expected, pos)
      }
    })
  })
})

})