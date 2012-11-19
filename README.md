# RelAlg.js - A JavaScript Relational Algebra evaluator

This [Relational Algebra][relalg] evaluator is written by me, Morten Fangel (fangel@sevengoslings.net, twitter.com/fangel). Assistant Professer, Ph.D. Henrik Bulskov from Roskilde University has been a tremendous help with his great inputs and thoughts on the project.  
Feel free to contact me if you have any issues or ideas for further work.

## Usage

Right now I'm in the process of heavily altering everything. So yeah, you can't really use it at it's current version right now.

The plan is to have a webapp as well as a Node.js REPL interface.

All the available functions takes input like this `Operation[arguments](Relation)`. Binary operations are 
preformed using `Relation1 Operation Relation2`.

### Projection

Projections are done via the `Project` operation. And example where the columns `a` and `b` are projected would be

	Project[a,b]( Relation )
	
### Renaming

Renaming are done with the `Rename` operation. If you want to rename the attribute `alpha` into `a` and the attribute `bravo` into `b`, the command would be

	Rename[alpha->a, bravo->b]( Relation )
	
You can also rename fields by position. If you have the relation _C(a,b,c)_ and you want to rename the second attribute to _bravo_, you can use

	Rename[2->bravo](C)
	
The resulting schema will then be _C'(a,bravo,c)_.  
_Note_: Positions are not zero indexed - the first attribute is the one on position 1.
	
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
	
**Warning**: If both relations have attributes with the same name, and you do _not_ have a criteria equalling 
both attributes (in other words, a _explicit_ natural-join) to each other, the calculation will fail. If 
your intent wasn't to join on those conditions, you must rename an attribute from, or project the attribute out
of the at least one of the relations.

_Example_: Say you have the schemas R(id, name) and S(id, place), you _must_ have the join-condition _id == id_,
when joining. You can also have a condition on say _name == 'foo'_, so the join-conditions need not the 
only conditions.

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
When JS/CC is installed, you can rebuild the parser from the grammar-file (`src/relalg.jison`), using
`jison src/relalg.jison -o lib/parser.js -m amd`.  
Currently you then need to alter the `define`-call in the top, to be `define(['tree'], function(Tree)) {`.

In the future I will create a Grunt-task to rebuild the grammar.

[relalg]: http://www.wikipedia.org/wiki/Relational_Algebra
[jison]: http://zaach.github.com/jison/