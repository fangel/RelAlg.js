# RelAlg.js - A JavaScript Relational Algebra evaluator [![Build Status](https://travis-ci.org/fangel/RelAlg.js.png?branch=master)](https://travis-ci.org/fangel/RelAlg.js)

This [Relational Algebra][relalg] evaluator is written by me, Morten Fangel (fangel@sevengoslings.net, twitter.com/fangel). For their assistance with this project, I'd like to thank Assistant Professor, Ph.D. Henrik Bulskov from Roskilde University and Associate Professor Philippe Bonnet, IT University of Copenhagen.

Feel free to contact me if you have any issues or ideas for further work.

## Usage

Right now I'm in the process of heavily altering everything. So there is no web-app yet. But there is a rudimentary REPL-style command line interface.

All the available functions takes input like this `Operation[arguments](Relation)`. Binary operations are 
preformed using `Relation1 Operation Relation2`.

### Features of the CLI REPL

The REPL is built on top of Node.js, so you can use the special Node.js commands. The two most useful are `.save` and `.load`.   
`.save [filename]` will simply take all the operations you have performed in the current session and save them to a file with the name _filename_.  
`.load [filename]` will read in the file specified by _filename_ and run the commands, one line at a time.

This enables you to have a file that defines a set of operations that you can start all your sessions out by loading them. In the future I will probably add a command-line parameter to a file with initial relations, but till then, the `.save` and `.load` will have to do.

## Operations

### Relations

You can either reference a relation by it's name (if you have previously assigned a relation), or you can create anonymous relations with the syntax

	[['attribute_a', 'attribute_b'] -> [1,2], [2,3], [3,4]]

### Projection

Projections are done via the `Project` operation. And example where the columns `a` and `b` are projected would be

	Project[a,b]( Relation )
	
### Renaming

Renaming are done with the `Rename` operation. If you want to rename the attribute `alpha` into `a` the command would be

	Rename[alpha/a]( Relation )
	
### Selection

Selection are done with the `Select` operation. It takes a boolean expression as its arguments, ie

	Select[a == 2 && b <= 3]( Relation )
	
And and or are expressed with `&&` and `||`. The supported comparison operations are:

 * `==` (equals)
 * `!=` (not equals)
 * `<=` (less than or equals)
 * `<` (less than)
 * `>=` (greater than or equals)
 * `>` (greater than)

Strings are represented quoted in `'`-s, ie `'this is a string'`. If you want to use `'`-s inside your string, escape them by adding an extra `'`, ie `'it''s doubles all the way'`.

### Union

Unions are made using the `Union` binary operation. Note that the two relations must have the same attributes, _NOTE:_ in the same order!.  
Example:

	Relation1 Union Relation2
	
### Intersection

Intersections are calculated with the `Intersect` binary operations. Note that the two relations must have the same attributes, _NOTE:_ in the same order!.  
Example:

	Relation1 Intersection Relation2

### Set difference

Set differences are calculated using the `-` binary operations. Note that the two relations must have the same attributes, _NOTE_: in the same order!.  
Example:

	Relation1 - Relation2
	
### Cartesian product (Cross-product)

The Cartesian product of two relations is created with the `X` binary operator.  
Example:

	Relation1 X Relation2
	
**Warning**: If the two relations both have an attribute with the same name, there is a _naming conflict_. 
This will cause the calculations to fail. You must ensure no duplicate attributes.

### Joins

Joins are created using the `Join` binary operation. 

#### Theta-joins (conditional joins)

If you wish to create a theta-join, you provide the join-condition like this:

	Relation1 Join[attribute1 == attribute2] Relation2
	
**Warning**: If both relations have attributes with the same name, the calculation will fail. If your intention was to join on the attributes, use a Natural Join. If your intent wasn't to join on those conditions, you must rename the attributes for at least one of the relations.

There is no specific notation for creating _Equi-joins_, just create a all-AND, all-equality condition and
your Theta-join will classify as a Equi-join.

#### Natural-join

If you do not give a condition as an argument to the `Join` operator, it will be treated as a natural join. 
In other words, natural joins are created like this:

	Relation1 Join Relation2
	
### Division

The standard operator for divisions (`/`) is used to calculate the division between two relations.
An example would be

	Relation1 / Relation2

## Extending the grammar

The lexer/parse is built using [Jison][jison]. So to extend the grammer, you need to have it installed.
When Jison and [Grunt][grunt] is installed, you can rebuild the parser from the grammar-file (`src/relalg.jison`), using
`grunt build`.

[relalg]: http://www.wikipedia.org/wiki/Relational_Algebra
[jison]: http://zaach.github.com/jison/
[grunt]: http://gruntjs.com