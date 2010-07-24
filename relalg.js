load('relalg.tree.js');
load('relalg.parser.js');
load('relalg.inspect.js');
load('relalg.relation.js');
load('relalg.evaluate.js');

Relation.add('Test', new Relation(
	['alpha', 'b', 'c'],
	[[1, 2, 3],
	 [4, 5, 6],
	 [7, 8, 99]]
));

var str  = arguments[0];
var tree = parser(str);
var res  = evaluate( tree );
print( res );
