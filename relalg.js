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

Relation.add('A', new Relation(
	['sno', 'pno'],
	[['s1', 'p1'],
	 ['s1', 'p2'],
	 ['s1', 'p3'],
	 ['s1', 'p4'],
	 ['s2', 'p1'],
	 ['s2', 'p2'],
	 ['s3', 'p2'],
	 ['s4', 'p2'],
	 ['s4', 'p4']]
));

Relation.add('B1', new Relation(
	['pno'],
	[['p2']]
));

Relation.add('B2', new Relation(
	['pno'],
	[['p2'],
	 ['p4']]
));

Relation.add('B3', new Relation(
	['pno'],
	[['p1'],
	 ['p2'],
	 ['p4']]
));

var statement  = arguments[0];

var tree       = parser( statement );
var result     = evaluate( tree );

print( result );
