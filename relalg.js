load('relalg.tree.js');
load('relalg.parser.js');
load('relalg.inspect.js');
load('relalg.relation.js');
load('relalg.evaluate.js');

Relation.add('Foo', new Relation(
	['alpha', 'b', 'c'],
	[[1, 2, 3],
	 [4, 5, 6],
	 [7, 8, 99]]
));

Relation.add('Bar', new Relation(
	['a', 'bravo', 'c'],
	[[1, 2, 3],
	 [44, 5, 6],
	 [7, 8, 9]]
));

Relation.add('Baz', new Relation(
	['a', 'b', 'charlie'],
	[[1, 22, 3],
	 [4, 5, 6],
	 [7, 8, 9]]
));


var statement  = arguments[0];

var tree       = parser( statement );
var result     = evaluate( tree );

print( result );
