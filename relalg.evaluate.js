/*
 * Evaluates a RelAlg expression treee
 */

load('relalg.project.js');
load('relalg.rename.js');

function evaluate( item ) {
	switch( true ) {
		case item instanceof Tree.Relation:
			return Relation.get( item.name );
		case item instanceof Tree.Projection:
			return project( evaluate(item.relation), item.projectionList );
		case item instanceof Tree.Rename:
			return rename( evaluate(item.relation), item.renameList );
	}
}