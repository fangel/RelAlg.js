RelAlg.js - A JavaScript Relational Algebra evaluator
=====================================================

Usage
-----

Right now there is only a CLI interface for RelAlg.js. It's been developed using [SpiderMonkey][sm],
because of the lexer/parser generator used ([JS/CC][jscc]). I believe the only thing used that's SpiderMonkey specific is
the use of `load` to include multiple files, so porting to different javascript evaluators shouldn't be that
big of a deal..

Relations are currently defined statically, in relalg.js. After you've defined your relations,
you can query them like so

	$> js relalg.js "Project[a,b]( Rename[alpha->a]( Test ) )"


Extending the grammar
---------------------

The lexer/parse is built using [JS/CC][jscc]. So to extend the grammer, you need to have it installed.
When JS/CC is installed, rebuilding the parser from the grammar-file (`relalg.par`), is as simple as 
running JS/CC on `relalg.par` and replacing `relalg.parser.js` with the output from JS/CC.



[sm]: http://www.mozilla.org/js/spidermonkey/
[jscc]: http://jscc.jmksf.com/