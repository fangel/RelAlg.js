/*
 * Calculates the division between two relations
 */

function division( left, right ) {
	var uniqueToLeft = left.header.filter( function( lefty ) { 
		return !right.header.some( function( righty ) { return lefty == righty; })
	});
	
	var projlist = new Tree.ProjectionList(uniqueToLeft);
	
	return difference(
		project( left, projlist ),
		project( 
			difference(
				cartesian(
					project( left, projlist ),
					right
				),
				left
			),
			projlist
		)
	);
}
