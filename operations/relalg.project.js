/*
 * This function can take a Relation and a Tree.ProjectionList and 
 * returns a new Relation that has been projected according to the
 * ProjectionList
 * Neatly bundled up in an annonymous function to hide the helper
 * function
 */

project = (function() {
	// Helper function. Takes a Relation and a ProjectionList and
	// creates a function that can be used with Array.map to 
	// transform each row according to the projection..
	function createMapping( relation, projectionList ) {
		var ordering = [];
		for( var i = 0; i < projectionList.list.length; i++ ) {
			var index = relation.header.indexOf( projectionList.list[i]);
			if( index == -1 )
				throw "Cant project because of missing attribute: " + projectionList.list[i];
			ordering.push(index);
		}

		return function( row ) {
			var rowPrime = [];
			for( var i = 0; i < ordering.length; i++ ) {
				rowPrime.push( row[ordering[i]]);
			}
			return rowPrime;
		}
	}
	
	// The actual projection function. 
	return function( relation, projectionList ) {
		if( ! (relation instanceof Relation && projectionList instanceof Tree.ProjectionList ) )
			throw "Incorrect call to project. Please supply a Relation and a Tree.ProjectionList";
		
		var mapping = createMapping( relation, projectionList );
		
		var headerPrime = projectionList.list.slice(); // Slice to create a copy..
		var dataPrime = relation.data.map( mapping );
		
		return new Relation( headerPrime, dataPrime );
	}
})();
