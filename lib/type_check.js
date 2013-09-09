define(['tree', 'relation'], function(Tree, Relation) {
  return function TypeCheck(item) {
    switch( true ) {
      case item instanceof Tree.Assignment:
        return TypeCheck(item.relation)

      case item instanceof Tree.Relation:
        return [[], item.relation.header]

      case item instanceof Tree.RelationReference:
        try {
          var relation = Relation.get(item.name)
          return [[], relation.header]
        } catch (e) {
          return [[{AST: item, error: e}], []]
        }
    }
  }
})