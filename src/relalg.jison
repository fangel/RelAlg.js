/* description: Parses relational algebra into a AST. */

/* lexical grammar */
%lex

%%
\s+                           /* skip whitespace */
"||"                          return 'OR';
"&&"                          return 'AND';
'Project'                     return 'PROJECT';
'Rename'                      return 'RENAME';
'Select'                      return 'SELECT';
'Union'                       return 'UNION';
'Intersect'                   return 'INTERSECT';
'->'                          return '->';
'-'                           return 'MINUS';
'X'                           return 'CROSS';
'Join'                        return 'JOIN';
'/'                           return 'DIV';
','                           return ',';
'=='|'!='|'<='|'>='|'<'|'>'   return 'COMPARISON';
':='                          return 'ASSIGN';
'('                           return '(';
')'                           return ')';
'['                           return '[';
']'                           return ']';
[A-Za-z_][A-Za-z0-9_]*        return 'ID';
\'([^\']|\'\')*\'             return 'STRING'; /*'*/
[0-9]+\.[0-9]+                return 'FLOAT';
[0-9]+                        return 'INT';
<<EOF>>                       return 'EOF';
/lex

/* operator associations and precedence */

%left CROSS JOIN MINUS DIV
%left UNION INTERSECT
%left AND
%left OR

%start Expressions

%% /* language grammar */

Expressions
	: ID ASSIGN Stmt EOF
		{ return yy.AST.call(this, 'Assignment', $1, $3); }
  | Stmt EOF
    { return yy.AST.call(this, 'Assignment', 'it', $1); }
  ;

Stmt
  : ID
    { $$ = yy.AST.call(this, 'RelationReference', yytext); }
	| Relation
		{ $$ = $1; }
  | Stmt UNION Stmt
    { $$ = yy.AST.call(this, 'Union', $1, $3 ); }
	| Stmt INTERSECT Stmt
	  { $$ = yy.AST.call(this, 'Intersection', $1, $3 ); }
	| Stmt MINUS Stmt
	  { $$ = yy.AST.call(this, 'Difference', $1, $3 ); }
	| Stmt CROSS Stmt
	  { $$ = yy.AST.call(this, 'Cartesian', $1, $3 ); }
	| Stmt JOIN '[' Criteria ']' Stmt
	  { $$ = yy.AST.call(this, 'Join', $1, $4, $6 ); }
	| Stmt JOIN Stmt
    { $$ = yy.AST.call(this, 'NaturalJoin', $1, $3 ); }
	| Stmt DIV Stmt
    { $$ = yy.AST.call(this, 'Division', $1, $3 ); }
	| '(' Stmt ')'
	  { $$ = $2 }
	| PROJECT '[' ProjectionList ']' '(' Stmt ')'
	  { $$ = yy.AST.call(this, 'Projection', $3, $6 ); }
	| RENAME '[' ID DIV ID ']' '(' Stmt ')'
    { $$ = yy.AST.call(this, 'Rename', $8, $3, $5 ); }
	| SELECT '[' Criteria ']' '(' Stmt ')'
	  { $$ = yy.AST.call(this, 'Selection', $3, $6 ); }
  ;

ProjectionList
  : ID
    { $$ = yy.AST.call(this, 'ProjectionList', $1 ); }
  | ProjectionList ',' ID
    { $$ = $1.add($3); }
  ;

Criteria
  : Value COMPARISON Value
    { $$ = yy.AST.call(this, 'Criteria', $1, $2, $3); }
  | Criteria AND Criteria
    { $$ = yy.AST.call(this, 'CriteriaComposition', $1, 'AND', $3); }
  | Criteria OR Criteria
    { $$ = yy.AST.call(this, 'CriteriaComposition', $1, 'OR', $3); }
  | '(' Criteria ')'
    { $$ = $2; }
  ;

Value
  : ID
    { $$ = yy.AST.call(this, 'Attribute', yytext); }
  | STRING
    { $$ = yy.AST.call(this, 'Value', yytext.substring(1, yytext.length - 1)); }
  | FLOAT
    { $$ = yy.AST.call(this, 'Value', parseFloat(yytext)); }
  | INT
    { $$ = yy.AST.call(this, 'Value', parseInt(yytext, 10)); }
  ;

Relation
	: '[' '[' RelCellList ']' '->' RelRowList ']'
		{ $$ = yy.AST.call(this, 'Relation', new yy.Relation($3, $6)); }
	;

RelRowList
	: '[' RelCellList ']'
		{ $$ = [$2]; }
	| RelRowList ',' '[' RelCellList ']'
		{ $$ = $1; $$.push($4); }
	;

RelCellList
	: RelCell
		{ $$ = [$1]; }
	| RelCellList ',' RelCell
		{ $$ = $1; $$.push($3); }
	;

RelCell
	: FLOAT
		{ $$ = parseFloat(yytext); }
	| INT
		{ $$ = parseInt(yytext, 10); }
	| STRING
		{ $$ = yytext.substring(1, yytext.length - 1); }
	;
