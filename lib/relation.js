/*
 * The classes to respresent a relation
 */
define([], function() {
  function Relation( header, data ) {
  	this.header = header.slice(); // We use slice to copy-by-value instead of by-reference
  	this.data = [];
  	for( var i=0; i < data.length; i++ ) this.push( data[i] );
  }
  Relation.prototype.header = null;
  Relation.prototype.data   = null;
  /*
   * Adds a new row to the relation. Does duplicate-checking to maintain the set-properties
   */
  Relation.prototype.push = function( newRow ) {
  	var rowsEqual = function( row1, row2 ) {
  		if( row1.length != row2.length ) return false;
  		for( var i=0; i < row1.length; i++ )
  			if( row1[i] != row2[i] ) 
  				return false;
  		return true;
  	}
	
  	if( this.data.some(function(existingRow) { return rowsEqual( newRow, existingRow ); } ) )
  		return false;
	
  	this.data.push( newRow.slice() ); // Same. We want by-value..
  	return true;
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

  /*
   * Static functions to serve as a storage-mechanism
   * for relations
   */
  Relation.storage = {};
  Relation.add = function( name, relation ) {
  	Relation.storage[name] = relation;
  	return relation;
  }
  Relation.get = function( name ) {
  	if( Relation.storage[name] == undefined )
  		throw "Unknown relation: " + name;
  	return Relation.storage[name];
  }
  
  return Relation;
});