/*
 * This function calculates the cartesian product (also referred to as the cross-product)
 * of two relations
 */

function cartesian(left, right) {
	var duplicates = left.header.filter( function( leftName ) { 
		return right.header.some(function( rightName ) { return rightName == leftName; })
	});

	var headerPrime = left.header.concat(right.header);
	for( var i in headerPrime )
		if( duplicates.some( function( duplicate )  { return headerPrime[i] == duplicate }))
			headerPrime[i] = '(' + headerPrime[i] + ')';

	var relation = new Relation( headerPrime, [] );
	for( var i in left.data )
		for( var j in right.data ) 
			relation.push( left.data[i].concat(right.data[j]));

	return relation;
}
