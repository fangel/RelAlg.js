/*
 * The classes to respresent a relation
 */

function Relation( header, data ) {
	this.header = header;
	this.data   = data;
}
Relation.prototype.header = null;
Relation.prototype.data   = null;

/*
 * Static functions to serve as a storage-mechanism
 * for relations
 */
Relation.storage = {};
Relation.add = function( name, relation ) {
	Relation.storage[name] = relation;
}
Relation.get = function( name ) {
	if( Relation.storage[name] == undefined )
		throw "Unknown relation: " + name;
	return Relation.storage[name];
}

/*
 * A pretty-print function for Relations..
 * Will return the relation in a nice preformatted
 * table. Useful for printing out relations to the
 * console..
 */
Relation.prototype.toString = function() {
	// Helper function to calculate the number of characters needed to display a variable
	var length = function( input ) {
		if( typeof(input) == 'string' ) return input.length;
		else if( typeof(input) == 'number' ) return (""+input).length;
	}
	
	// Calculate the lengths of the longest string in each column..
	var lengths = new Array(this.header.length);
	for( var i=0; i < this.header.length; i++)
		lengths[i] = length(this.header[i]);
	for( var i=0; i < this.data.length; i++ )
		for( var j = 0; j < this.data[i].length; j++ )
			lengths[j] = Math.max(lengths[j], length(this.data[i][j]));
		
	// Helper function to format one row in the table
	var formatRow = function( row, lengths ) {
		var rtn = '|';
		for( var i=0; i < row.length; i++ )
			rtn += ' ' + (new Array( lengths[i] - length(row[i]) + 1).join(' ')) + row[i] + ' |';
		return rtn;
	}
	
	// Calculate the delimiter between header/data as well as the top and bottom of the table
	var delim = '+';
	for( var i = 0; i < lengths.length; i++ )
		delim += (new Array( lengths[i] + 3).join('-')) + '+'; 
	
	// Formats the data into the final table..
	var rtn  = delim + "\n";
	    rtn += formatRow( this.header, lengths ) + "\n";
	    rtn += delim + "\n";
	for( var i = 0; i < this.data.length; i++ )
		rtn += formatRow( this.data[i], lengths) + "\n";
	    rtn += delim;
		
	return rtn;
}
