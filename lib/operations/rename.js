/*
 * This function will rename the attributes in a relation
 * given a Relation and a Tree.RenameList
 */
define(['relation'], function(Relation) {
  return function rename( relation, renameList ) {
  	var headerPrime = relation.header.slice();
  	for( var i=0; i < renameList.list.length; i++ ) {
  		if( typeof(renameList.list[i][0]) == 'number' ) {
  			// Rename by positon
  			if( headerPrime[ renameList.list[i][0] - 1 ] == undefined )
  				throw "Failed to rename. Missing attribute number " + renameList.list[i][0];
  			headerPrime[ renameList.list[i][0] - 1 ] = renameList.list[i][1];
  		} else {
  			// Rename by old name
  			var found = false;
  			for( var j=0; j < headerPrime.length; j++ ) {
  				if( headerPrime[j] == renameList.list[i][0] ) {
  					headerPrime[j] = renameList.list[i][1];
  					found = true;
  				}
  			}
  			if( ! found )
  				throw "Failed to rename. Missing attribute: " + renameList.list[i][0];
  		}
  	}
  	return new Relation( headerPrime, relation.data );
  }
});
