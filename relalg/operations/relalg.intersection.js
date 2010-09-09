/*
 * Contains a function to calculate the intersection between two relations..
 */

intersection = (function() {
	var rowsEqual = function( row1, row2 ) {
		if( row1.length != row2.length ) return false;
		for( var i=0; i < row1.length; i++ )
			if( row1[i] != row2[i] ) 
				return false;
		return true;
	}

	return function( left, right ) {
		if( left.header.length != right.header.length )
			throw "Intersection failed. Relations don't have identical attributes. Different attribute-counts";
		for( var i=0; i < left.header.length; i++ ) 
			if( left.header[i] != right.header[i] )
				throw "Intersection failed. Relations don't have identical attributes. " + left.header[i] + " is different from " + right.header[i];
		
		var relation = new Relation( left.header, [] );
		for( var i=0; i < right.data.length; i++ )
			if( left.data.some(function( rowLeft) { return rowsEqual( rowLeft, right.data[i] ); } ) )
				relation.push( right.data[i] );
		return relation;
	}
})();