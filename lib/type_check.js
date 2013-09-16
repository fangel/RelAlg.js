define(['tree', 'relation', 'util/set_helpers'], function(Tree, Relation, SetHelper) {
  function identifyAttributes(criteria) {
    switch (true) {
      case criteria instanceof Tree.Criteria:
        var attrs = []
        if (criteria.left instanceof Tree.Attribute) attrs.push(criteria.left.name)
        if (criteria.right instanceof Tree.Attribute) attrs.push(criteria.right.name)
        return attrs
      case criteria instanceof Tree.CriteriaComposition:
        return identifyAttributes(criteria.left).concat(identifyAttributes(criteria.right))
    }
  }

  function schemaMismatches(left, right) {
    var mismatches = []
    for (var i = 0; i < Math.max(left.length, right.length); i++) {
      if (left[i] !== right[i]) {
        if (left[i] === undefined) left[i] = 'ε'
        if (right[i] === undefined) right[i] = 'ε'
        mismatches.push((i+1) + ': ' + left[i] + '≠' + right[i])
      }
    }
    return mismatches
  }

  var TCError = function TypeCheckingError(AST, error) {
    this.AST = AST
    this.error = error
  }
  TCError.prototype.showPosition = function() {
    var pre = (this.AST.position.first_column == 0) ? '' : new Array(this.AST.position.first_column + 1 ).join(" ")
      , dur = new Array(this.AST.position.last_column - this.AST.position.first_column - 1).join("-")
    return pre + '^' + dur + '^'
  }
  TCError.prototype.toString = function() {
    return this.error
  }

  var TCErrors = function TypeCheckingErrors(errors) {
    this.errors = errors
  }
  TCErrors.prototype.showPosition = function() {
    if (this.errors.length == 1) {
      return this.errors[0].showPosition()
    } else {
      var pre, dur, AST, pos = 0, line = '', labels = '', label
      for (var i=0; i < this.errors.length; i++) {
        AST = this.errors[i].AST
        var pre = (AST.position.first_column - pos == 0) ? '' : new Array(AST.position.first_column - pos + 1 ).join(" ")
          , dur = new Array(AST.position.last_column - AST.position.first_column - 1).join("-")
        line += pre + '^' + dur + '^'
        labels += pre + '#' + (i+1) + dur.replace(/\-/g, ' ')
        pos = line.length
      }
      return line + "\n" + labels
    }
  }
  TCErrors.prototype.toString = function() {
    if (this.errors.length == 1) {
      return 'Type Error: ' + this.errors[0].toString()
    } else {
      var msg = 'Type Errors!'
      for (var i=0; i < this.errors.length; i++)
        msg += "\n#" + (i+1) + ': ' + this.errors[i].toString()
      return msg
    }
  }

  var TypeCheck = function TypeCheck(item) {
    var tt, missing, schema, left, right
    switch( true ) {
      case item instanceof Tree.Assignment:
        return TypeCheck(item.relation)

      case item instanceof Tree.Relation:
        schema = item.relation.header.slice()
        var duplicates = SetHelper.Duplicates(schema)
        if (duplicates.length !== 0) return [[new TCError(item, 'Duplicate attributes: ' + duplicates.join(', '))], []]
        var wrong_rows = item.relation.data.filter(function(row) {
          return row.length !== schema.length
        }).map(function(row) { return '[' + row.join(', ') + ']'})
        if (wrong_rows.length !== 0) return [[new TCError(item, 'Some rows does not conform to the schema: ' + wrong_rows.join(', '))], []]
        return [[], schema]

      case item instanceof Tree.RelationReference:
        try {
          var relation = Relation.get(item.name)
          return [[], relation.header.slice()]
        } catch (e) {
          return [[new TCError(item, e.toString())], []]
        }
        break

      case item instanceof Tree.Projection:
        tt = TypeCheck(item.relation)
        if (tt[1].length === 0) return tt
        missing = SetHelper.Difference(item.projectionList.list, tt[1])
        if (missing.length !== 0) return [[new TCError(item, 'Missing attributes: ' + missing.join(', '))], []]
        return [[], item.projectionList.list.slice()]

      case item instanceof Tree.Rename:
        tt = TypeCheck(item.relation)
        if (tt[1].length === 0) return tt
        schema = tt[1].slice()
        var from = schema.indexOf(item.from)
          , to   = schema.indexOf(item.to)
        if (from === -1) return [[new TCError(item, 'Missing attribute: ' + item.from)], []]  
        if (to !== -1) return [[new TCError(item, 'Can not rename attribute ' + item.from + ' to ' + item.to + ', ' + item.to + ' already exists')], []]
        schema[from] = item.to
        return [[], schema]

      case item instanceof Tree.Selection:
        tt = TypeCheck(item.relation)
        if (tt[1].length === 0) return tt
        missing = SetHelper.Difference(identifyAttributes(item.criteria), tt[1])
        if (missing.length !== 0) return [[new TCError(item, 'Missing attributes: ' + missing.join(', '))], []]
        return [[], tt[1].slice()]

      case item instanceof Tree.Union:
      case item instanceof Tree.Difference:
      case item instanceof Tree.Intersection:
        left = TypeCheck(item.left)
        right = TypeCheck(item.right)
        if (left[0].length + right[0].length !== 0) return [left[0].concat(right[0]), []]
        var mismatches = schemaMismatches(left[1], right[1])
        if (mismatches.length !== 0) return [[new TCError(item, 'Disagreement on attribute ' + mismatches.join(', '))], []] 
        return [[], left[1].slice()]

      case item instanceof Tree.Cartesian:
      case item instanceof Tree.Join:
        left = TypeCheck(item.left)
        right = TypeCheck(item.right)
        if (left[0].length + right[0].length !== 0) return [left[0].concat(right[0]), []]
        var overlap = SetHelper.Intersection(left[1], right[1])
        if (overlap.length !== 0) return [[new TCError(item, 'Overlapping attributes: ' + overlap.join(', '))], []]
        schema = SetHelper.Union(left[1], right[1])
        if (item instanceof Tree.Join) {
          missing = SetHelper.Difference(identifyAttributes(item.criteria), schema)
          if (missing.length !== 0) return [[new TCError(item, 'Missing attributes: ' + missing.join(', '))], []]
        }
        return [[], schema]

      case item instanceof Tree.NaturalJoin:
        left = TypeCheck(item.left)
        right = TypeCheck(item.right)
        if (left[0].length + right[0].length !== 0) return [left[0].concat(right[0]), []]
        return [[], SetHelper.Union(left[1], right[1])]

      case item instanceof Tree.Division:
        left = TypeCheck(item.left)
        right = TypeCheck(item.right)
        if (left[0].length + right[0].length !== 0) return [left[0].concat(right[0]), []]
        schema = SetHelper.Difference(left[1], right[1])
        var unique_to_right = SetHelper.Difference(right[1], left[1])
        if (unique_to_right.length !== 0)
          return [[new TCError(item, 'Right hand side has unique attributes: ' + unique_to_right.join(', '))], []]
        if (schema.length === 0) 
          return [[new TCError(item, 'No unique attributes on the left hand side')], []]
        return [[], schema]

      default:
        return [[], []]
    }
  }

  TypeCheck.Error = TCError
  TypeCheck.Errors = TCErrors

  return TypeCheck
})