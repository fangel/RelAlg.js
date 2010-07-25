/*
 * Evaluates a RelAlg expression treee
 */

load('operations/relalg.project.js');
load('operations/relalg.rename.js');
load('operations/relalg.selection.js');
load('operations/relalg.union.js');
load('operations/relalg.intersection.js');
load('operations/relalg.difference.js');

function evaluate( item ) {
	switch( true ) {
		case item instanceof Tree.Relation:
			return Relation.get( item.name );
		case item instanceof Tree.Projection:
			return project( evaluate(item.relation), item.projectionList );
		case item instanceof Tree.Rename:
			return rename( evaluate(item.relation), item.renameList );
		case item instanceof Tree.Selection:
			return selection( item.criteria, evaluate(item.relation) );
		case item instanceof Tree.Union:
			return union( evaluate(item.left), evaluate(item.right) );
		case item instanceof Tree.Intersection:
			return intersection( evaluate(item.left), evaluate(item.right) );
		case item instanceof Tree.Difference:
			return difference( evaluate(item.left), evaluate(item.right) );
	}
}