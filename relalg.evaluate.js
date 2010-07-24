/*
 * Evaluates a RelAlg expression treee
 */

load('operations/relalg.project.js');
load('operations/relalg.rename.js');
load('operations/relalg.union.js');

function evaluate( item ) {
	switch( true ) {
		case item instanceof Tree.Relation:
			return Relation.get( item.name );
		case item instanceof Tree.Projection:
			return project( evaluate(item.relation), item.projectionList );
		case item instanceof Tree.Rename:
			return rename( evaluate(item.relation), item.renameList );
		case item instanceof Tree.Union:
			return union( evaluate(item.left), evaluate(item.right) );
	}
}