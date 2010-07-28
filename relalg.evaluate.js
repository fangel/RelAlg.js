/*
 * Evaluates a RelAlg expression treee
 */

load('operations/relalg.project.js');
load('operations/relalg.rename.js');
load('operations/relalg.selection.js');
load('operations/relalg.union.js');
load('operations/relalg.intersection.js');
load('operations/relalg.difference.js');
load('operations/relalg.cartesian.js');
load('operations/relalg.join.js');
load('operations/relalg.naturaljoin.js');
load('operations/relalg.division.js');

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
		case item instanceof Tree.Cartesian:
			return cartesian( evaluate(item.left), evaluate(item.right) );
		case item instanceof Tree.Join:
			return join( evaluate(item.left), item.criteria, evaluate(item.right) );
		case item instanceof Tree.NaturalJoin:
			return naturaljoin( evaluate(item.left), evaluate(item.right) );
		case item instanceof Tree.Division:
			return division( evaluate(item.left), evaluate(item.right) );
		default:
			throw "Unsupported operation!";
	}
}