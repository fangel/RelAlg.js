/*
 * This function calculates the cartesian product (also referred to as the cross-product)
 * of two relations
 */
define(['relation'], function(Relation) {
  return function cartesian(left, right) {
  	var duplicates = left.header.filter( function( leftName ) { 
  		return right.header.some(function( rightName ) { return rightName == leftName; })
  	});

  	if( duplicates.length )
  		throw "Cartesian fail. Both relations have the attribute(s): '" + duplicates.join("', '") + "' " +
  		      "in common. Because of this naming conflict the cartesian product can't be " +
  		      "calculated. You must rename the attributes in, or project the attributes out " +
  		      "from at least one of the relations."

  	var headerPrime = left.header.concat(right.header);

  	var relation = new Relation( headerPrime, [] );
  	for( var i in left.data )
  		for( var j in right.data ) 
  			relation.push( left.data[i].concat(right.data[j]));

  	return relation;
  }
});