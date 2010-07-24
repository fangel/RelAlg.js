/*
 * The Union operator
 */

function union( left, right ) {
	if( left.header.length != right.header.length )
		throw "Union failed. Relations don't have identical attributes. Different attribute-counts";
	for( var i=0; i < left.header.length; i++ ) 
		if( left.header[i] != right.header[i] )
			throw "Union failed. Relations don't have identical attributes. " + left.header[i] + " is different from " + right.header[i];

	var relation = new Relation(left.header, left.data);
	for( var i=0; i < right.data.length; i++ ) {
		relation.push( right.data[i] );
	}
			
	return relation;
}