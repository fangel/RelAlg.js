/*
 * This function will rename the attributes in a relation
 * given a Relation and a Tree.RenameList
 */

function rename( relation, renameList ) {
	var headerPrime = relation.header.slice(); // Slice to create a copy..
	for( var i=0; i < renameList.list.length; i++ ) {
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
	return new Relation( headerPrime, relation.data.slice() );
}