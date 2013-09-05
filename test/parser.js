var assert = require("assert")
  , requirejs = require("requirejs")

requirejs.config({
  baseUrl: __dirname + "/../lib",
});

var Parser = requirejs("parser")
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
function binaryStmtMixin(terminal, ASTLeaf, glue) {
  var msg = glue === undefined ? 'Contains both the LHS and the RHS' : 'Contains the LHS, the RHS and the operation meta-data'
  it(msg, function() {
    var expr = Parser.parse("LHS " + terminal + " RHS")
      , stmt = getStmt(expr)
    if (glue === undefined)
      var expected = new ASTLeaf(new Tree.RelationReference('LHS'), new Tree.RelationReference('RHS'))
    else  
      var expected = new ASTLeaf(new Tree.RelationReference('LHS'), glue, new Tree.RelationReference('RHS'))
    assert.deepEqual(stmt, expected)
  })
}
function rightAssocMixin(terminal, ASTLeaf, glue) {
  it('Should be right-associative', function() {
    var expr = Parser.parse("FST " + terminal + " SND " + terminal + " THD")
      , stmt = getStmt(expr)
    if (glue === undefined)
      var expected = new ASTLeaf(new Tree.RelationReference('FST'), new ASTLeaf(new Tree.RelationReference('SND'), new Tree.RelationReference('THD')))
    else
      var expected = new ASTLeaf(new Tree.RelationReference('FST'), glue, new ASTLeaf(new Tree.RelationReference('SND'), glue, new Tree.RelationReference('THD')))
    assert.deepEqual(stmt, expected)
  })
  it('.. and should respect parenthethis', function() {
    var expr = Parser.parse("(FST " + terminal + " SND) " + terminal + " THD")
      , stmt = getStmt(expr)
    if (glue === undefined)
      var expected = new ASTLeaf(new ASTLeaf(new Tree.RelationReference('FST'), new Tree.RelationReference('SND')), new Tree.RelationReference('THD'))
    else
      var expected = new ASTLeaf(new ASTLeaf(new Tree.RelationReference('FST'), glue, new Tree.RelationReference('SND')), glue, new Tree.RelationReference('THD'))
    assert.deepEqual(stmt, expected)        
  })
}
function leftAssocMixin(terminal, ASTLeaf, glue) {
  it('Should be left-associative', function() {
    var expr = Parser.parse("FST " + terminal + " SND " + terminal + " THD")
      , stmt = getStmt(expr)
    if (glue === undefined)
      var expected = new ASTLeaf(new ASTLeaf(new Tree.RelationReference('FST'), new Tree.RelationReference('SND')), new Tree.RelationReference('THD'))
    else
      var expected = new ASTLeaf(new ASTLeaf(new Tree.RelationReference('FST'), glue, new Tree.RelationReference('SND')), glue, new Tree.RelationReference('THD'))
    assert.deepEqual(stmt, expected)
  })
  it('.. and should respect parenthethis', function() {
    var expr = Parser.parse("FST " + terminal + " (SND " + terminal + " THD)")
      , stmt = getStmt(expr)
    if (glue === undefined)
      var expected = new ASTLeaf(new Tree.RelationReference('FST'), new ASTLeaf(new Tree.RelationReference('SND'), new Tree.RelationReference('THD')))
    else
      var expected = new ASTLeaf(new Tree.RelationReference('FST'), glue, new ASTLeaf(new Tree.RelationReference('SND'), glue, new Tree.RelationReference('THD')))
    assert.deepEqual(stmt, expected)        
  })
}

describe('Parsing', function(){
  describe('Expressions', function(){
    describe('With a explicit assignment', function(){
      it("Is a Assignment to the LFS", function() {
        var expr = Parser.parse("LHS := RHS")
          , expected = new Tree.Assignment('LHS', new Tree.RelationReference('RHS'))
        assert.deepEqual(expr, expected)
      })
    })
    describe("Without a explicit assignment", function() {
      it("Is a Assignment to the 'it' relation", function() {
        var expr = Parser.parse("RHS")
          , expected = new Tree.Assignment('it', new Tree.RelationReference('RHS'))
        assert.deepEqual(expr, expected)
      })
    })
  })
  describe('Statements', function() {
    describe('that is the name of a relation', function() {
      var expr = Parser.parse('relationName')
      it('Contains the relation-name', function() {
        var stmt = getStmt(expr)
          , expected = new Tree.RelationReference('relationName')
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a inline relation', function() {
      var expr = Parser.parse("[['foo', 'bar'] -> [1, 2], [3, 4]]")
      it('Contains the relation', function() {
        var stmt = getStmt(expr)
          , expected = new Tree.Relation(new Relation(["foo", "bar"], [[1, 2], [3, 4]]))
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a union statement', function() {
      binaryStmtMixin.call(this, 'Union', Tree.Union)
      rightAssocMixin.call(this, 'Union', Tree.Union)
    })
    describe('that is a intersect statement', function() {
      binaryStmtMixin.call(this, 'Intersect', Tree.Intersection)
      rightAssocMixin.call(this, 'Intersect', Tree.Intersection)
    })
    describe('that is a set-difference statement', function() {
      binaryStmtMixin.call(this, '-', Tree.Difference)
      rightAssocMixin.call(this, '-', Tree.Difference)
    })
    describe('that is a cartesian-join statement', function() {
      binaryStmtMixin.call(this, 'X', Tree.Cartesian)
      leftAssocMixin.call(this, 'X', Tree.Cartesian)
    })
    describe('that is a join statement', function() {
      var criteria = new Tree.Criteria(new Tree.Value(1), '==', new Tree.Value(2))
      binaryStmtMixin.call(this, 'Join[1==2]', Tree.Join, criteria)
      rightAssocMixin.call(this, 'Join[1==2]', Tree.Join, criteria)
    })
    describe('that is a natural-join statement', function() {
      binaryStmtMixin.call(this, 'Join', Tree.NaturalJoin)
      rightAssocMixin.call(this, 'Join', Tree.NaturalJoin)
    })
    describe('that is a division statement', function() {
      binaryStmtMixin.call(this, '/', Tree.Division)
      rightAssocMixin.call(this, '/', Tree.Division)
      // TODO: Is this correct? Should it be left- or right-associative? The parser 
      //       as-is is ambivalent, as it's currently under both left and right, but
      //       right-assoc wins.
    })
    describe('that is contained in parenthethis', function() {
      it('Should behave exactly as if the parenthethis weren\'t there', function() {
        var expr = Parser.parse('(REL)')
          , stmt = getStmt(expr)
          , expected = new Tree.RelationReference('REL')
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a projection statement', function() {
      it('Contains the projection list and the relation', function() {
        var expr = Parser.parse('Project[fst, snd](REL)')
          , stmt = getStmt(expr)
          , projList = new Tree.ProjectionList(['fst', 'snd'])
          , expected = new Tree.Projection(projList, new Tree.RelationReference('REL'))
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a rename statement', function() {
      it('Contains the rename list and the relation', function() {
        var expr = Parser.parse('Rename[fst->FST, snd->SND](REL)')
          , stmt = getStmt(expr)
          , renameList = new Tree.RenameList([['fst', 'FST'], ['snd', 'SND']])
          , expected = new Tree.Rename(renameList, new Tree.RelationReference('REL'))
        assert.deepEqual(stmt, expected)
      })
    })
    describe('that is a selection statement', function() {
      it('Contains the selection criteria and the relation', function() {
        var expr = Parser.parse('Select[1==2](REL)')
          , stmt = getStmt(expr)
          , criteria = new Tree.Criteria(new Tree.Value(1), '==', new Tree.Value(2))
          , expected = new Tree.Selection(criteria, new Tree.RelationReference('REL'))
        assert.deepEqual(stmt, expected)
      })
    })
  })
})