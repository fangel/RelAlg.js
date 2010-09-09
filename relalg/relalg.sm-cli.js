/*
 * This file is the SpiderMonkey CLI for RelAlg.js
 */

load('relalg.js');
load('relalg.demo-relations.js');

var statement  = arguments[0];

try {
	var tree       = parser( statement );
	var result     = evaluate( tree );
	
	//print( inspect( tree ) + "\n");
	print( result );
} catch( e ) {
	print( e );
}