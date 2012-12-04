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
'('                           return '(';
')'                           return ')';
'['                           return '[';
']'                           return ']';
[A-Za-z_][A-Za-z0-9_]*        return 'ID';
\'([^\']|\'\')*\'             return 'STRING';
[0-9]+\.[0-9]+                return 'FLOAT';
[0-9]+                        return 'INT';
<<EOF>>                       return 'EOF';
/lex

/* operator associations and precedence */

%left '+' '-'
%left CROSS DIV
%left AND OR

%right JOIN UNION DIV MINUS INTERSECT

%start Expressions

%% /* language grammar */

Expressions
  : Stmt EOF
    { return $1; }
  ;

Stmt
  : ID
    { $$ = new Tree.RelationReference(yytext); }
  | Stmt UNION Stmt
    { $$ = new Tree.Union( $1, $3 ); }
	| Stmt INTERSECT Stmt
	  { $$ = new Tree.Intersection( $1, $3 ); }
	| Stmt MINUS Stmt
	  { $$ = new Tree.Difference( $1, $3 ); }
	| Stmt CROSS Stmt
	  { $$ = new Tree.Cartesian( $1, $3 ); }
	| Stmt JOIN '[' Criteria ']' Stmt
	  { $$ = new Tree.Join( $1, $4, $6 ); }
	| Stmt JOIN Stmt
    { $$ = new Tree.NaturalJoin( $1, $3 ); }
	| Stmt DIV Stmt
    { $$ = new Tree.Division( $1, $3 ); }
	| '(' Stmt ')'
	  { $$ = $2 }
	| PROJECT '[' ProjectionList ']' '(' Stmt ')'
	  { $$ = new Tree.Projection( $3, $6 ); }
	| RENAME '[' RenameList ']' '(' Stmt ')'
    { $$ = new Tree.Rename( $3, $6 ); }
	| SELECT '[' Criteria ']' '(' Stmt ')'
	  { $$ = new Tree.Selection( $3, $6 ); }
  ;

ProjectionList
  : ID
    { $$ = new Tree.ProjectionList( $1 ); }
  | ProjectionList ',' ID
    { $$ = $1.add($3); }
  ;

RenameList
  : ID '->' ID
    { $$ = new Tree.RenameList( [$1, $3] ); }
  | INT '->' ID
    { $$ = new Tree.RenameList( [$1, $3] ); }
  | RenameList ',' ID '->' ID
    { $$ = $1.add( [$3, $5] ); }
  | RenameList ',' INT '->' ID
    { $$ = $1.add( [$3, $5] ); }
  ;

Criteria
  : Value COMPARISON Value
    { $$ = new Tree.Criteria($1, $2, $3); }
  | Criteria AND Criteria
    { $$ = new Tree.CriteriaComposition($1, 'AND', $3); }
  | Criteria OR Criteria
    { $$ = new Tree.CriteriaComposition($1, 'OR', $3); }
  | '(' Criteria ')'
    { $$ = $2; }
  ;


Value
  : ID
    { $$ = new Tree.Attribute(yytext); }
  | STRING
    { $$ = new Tree.Value(yytext.substring(1, yytext.length - 1)); }
  | FLOAT
    { $$ = new Tree.Value(parseFloat(yytext)); }
  | INT
    { $$ = new Tree.Value(parseInt(yytext, 10)); }
  ;
