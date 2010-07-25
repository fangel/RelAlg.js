# RelAlg.js - A JavaScript Relational Algebra evaluator

This [Relational Algebra][relalg] evaluator is written by Morten Fangel (fangel@sevengoslings.net, twitter.com/fangel). Feel free to contact me if you have any issues or ideas for further work.

## Usage

Right now there is only a CLI interface for RelAlg.js. It's been developed using [SpiderMonkey][sm],
because of the lexer/parser generator used ([JS/CC][jscc]). I believe the only thing used that's SpiderMonkey specific is
the use of `load` to include multiple files, so porting to different javascript evaluators shouldn't be that
big of a deal..

Relations are currently defined statically, in relalg.js. After you've defined your relations,
you can query them like so

	$> js relalg.js "Project[a,b]( Rename[alpha->a]( Test ) )"

All the available functions takes input like this `Operation[arguments](Relation)`. Binary operations are 
preformed using `Relation1 Operation Relation2`.

### Projection

Projections are done via the `Project` operation. And example where the columns `a` and `b` are projected would be

	Project[a,b]( Relation )
	
### Renaming

Renaming are done with the `Rename` operation. If you want to rename the attribute `alpha` into `a` and the attribute `bravo` into `b`, the command would be

	Rename[alpha->a, bravo->b]( Relation )
	
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

Set differences are calculated using the `-` binary operations. Note that the two relations must have the same attributes, _NOTE:_ in the same order!.  
Example:

	Relation1 - Relation2

## Extending the grammar

The lexer/parse is built using [JS/CC][jscc]. So to extend the grammer, you need to have it installed.
When JS/CC is installed, rebuilding the parser from the grammar-file (`relalg.par`), is as simple as 
running JS/CC on `relalg.par` and replacing `relalg.parser.js` with the output from JS/CC.



[relalg]: http://www.wikipedia.org/wiki/Relational_Algebra
[sm]: http://www.mozilla.org/js/spidermonkey/
[jscc]: http://jscc.jmksf.com/