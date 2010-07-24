/*
 * The Union operator
 */

function union( left, right ) {
	if( left.header.length != right.header.length )
		throw "Union failed. Relations don't have identical attributes. Different attribute-counts";
	for( var i=0; i < left.header.length; i++ ) 
		if( left.header[i] != right.header[i] )
			throw "Union failed. Relations don't have identical attributes. " + left.header[i] + " is different from " + right.header[i];

	// Yes, I know this ain't pretty. Starts out with all the data
	// from the left relation, then copies over all tuples from the
	// right relation thats not already in the combined result..
	// It could potentially be done by some clever use of filter
	dataPrime = left.data.slice(); // slice to create a replice
	for( var i=0; i < right.data.length; i++ ) {
		var found = false;
		for( var j=0; j < left.data.length; j++ ) {
			var identical = true;
			for( var n=0; n < right.data[i].length; n++ ) {
				if( right.data[i][n] != left.data[j][n] ) {
					identical = false;
					break;
				}
			}
			if( identical ) {
				found = true;
				break;
			}
		}
		if( ! found ) {
			dataPrime.push( right.data[i].slice() );
		}
	}
			
	return new Relation( right.header.slice(), dataPrime );
}