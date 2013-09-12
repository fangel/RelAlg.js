define(['tree', 'relation'], function(Tree, Relation) {
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Expressions":3,"ID":4,"ASSIGN":5,"Stmt":6,"EOF":7,"Relation":8,"UNION":9,"INTERSECT":10,"MINUS":11,"CROSS":12,"JOIN":13,"[":14,"Criteria":15,"]":16,"DIV":17,"(":18,")":19,"PROJECT":20,"ProjectionList":21,"RENAME":22,"RenameList":23,"SELECT":24,",":25,"->":26,"INT":27,"Value":28,"COMPARISON":29,"AND":30,"OR":31,"STRING":32,"FLOAT":33,"RelCellList":34,"RelRowList":35,"RelCell":36,"$accept":0,"$end":1},
terminals_: {2:"error",4:"ID",5:"ASSIGN",7:"EOF",9:"UNION",10:"INTERSECT",11:"MINUS",12:"CROSS",13:"JOIN",14:"[",16:"]",17:"DIV",18:"(",19:")",20:"PROJECT",22:"RENAME",24:"SELECT",25:",",26:"->",27:"INT",29:"COMPARISON",30:"AND",31:"OR",32:"STRING",33:"FLOAT"},
productions_: [0,[3,4],[3,2],[6,1],[6,1],[6,3],[6,3],[6,3],[6,3],[6,6],[6,3],[6,3],[6,3],[6,7],[6,7],[6,7],[21,1],[21,3],[23,3],[23,3],[23,5],[23,5],[15,3],[15,3],[15,3],[15,3],[28,1],[28,1],[28,1],[28,1],[8,7],[35,3],[35,5],[34,1],[34,3],[36,1],[36,1],[36,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return new Tree.Assignment($$[$0-3], $$[$0-1]); 
break;
case 2: return new Tree.Assignment('it', $$[$0-1]); 
break;
case 3: this.$ = new Tree.RelationReference(yytext); 
break;
case 4: this.$ = $$[$0]; 
break;
case 5: this.$ = new Tree.Union( $$[$0-2], $$[$0] ); 
break;
case 6: this.$ = new Tree.Intersection( $$[$0-2], $$[$0] ); 
break;
case 7: this.$ = new Tree.Difference( $$[$0-2], $$[$0] ); 
break;
case 8: this.$ = new Tree.Cartesian( $$[$0-2], $$[$0] ); 
break;
case 9: this.$ = new Tree.Join( $$[$0-5], $$[$0-2], $$[$0] ); 
break;
case 10: this.$ = new Tree.NaturalJoin( $$[$0-2], $$[$0] ); 
break;
case 11: this.$ = new Tree.Division( $$[$0-2], $$[$0] ); 
break;
case 12: this.$ = $$[$0-1] 
break;
case 13: this.$ = new Tree.Projection( $$[$0-4], $$[$0-1] ); 
break;
case 14: this.$ = new Tree.Rename( $$[$0-4], $$[$0-1] ); 
break;
case 15: this.$ = new Tree.Selection( $$[$0-4], $$[$0-1] ); 
break;
case 16: this.$ = new Tree.ProjectionList( $$[$0] ); 
break;
case 17: this.$ = $$[$0-2].add($$[$0]); 
break;
case 18: this.$ = new Tree.RenameList( [$$[$0-2], $$[$0]] ); 
break;
case 19: this.$ = new Tree.RenameList( [$$[$0-2], $$[$0]] ); 
break;
case 20: this.$ = $$[$0-4].add( [$$[$0-2], $$[$0]] ); 
break;
case 21: this.$ = $$[$0-4].add( [$$[$0-2], $$[$0]] ); 
break;
case 22: this.$ = new Tree.Criteria($$[$0-2], $$[$0-1], $$[$0]); 
break;
case 23: this.$ = new Tree.CriteriaComposition($$[$0-2], 'AND', $$[$0]); 
break;
case 24: this.$ = new Tree.CriteriaComposition($$[$0-2], 'OR', $$[$0]); 
break;
case 25: this.$ = $$[$0-1]; 
break;
case 26: this.$ = new Tree.Attribute(yytext); 
break;
case 27: this.$ = new Tree.Value(yytext.substring(1, yytext.length - 1)); 
break;
case 28: this.$ = new Tree.Value(parseFloat(yytext)); 
break;
case 29: this.$ = new Tree.Value(parseInt(yytext, 10)); 
break;
case 30: this.$ = new Tree.Relation(new Relation($$[$0-4], $$[$0-1])); 
break;
case 31: this.$ = [$$[$0-1]]; 
break;
case 32: this.$ = $$[$0-4]; this.$.push($$[$0-1]); 
break;
case 33: this.$ = [$$[$0]]; 
break;
case 34: this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 35: this.$ = parseFloat(yytext); 
break;
case 36: this.$ = parseInt(yytext, 10); 
break;
case 37: this.$ = yytext.substring(1, yytext.length - 1); 
break;
}
},
table: [{3:1,4:[1,2],6:3,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{1:[3]},{5:[1,10],7:[2,3],9:[2,3],10:[2,3],11:[2,3],12:[2,3],13:[2,3],17:[2,3]},{7:[1,11],9:[1,12],10:[1,13],11:[1,14],12:[1,15],13:[1,16],17:[1,17]},{7:[2,4],9:[2,4],10:[2,4],11:[2,4],12:[2,4],13:[2,4],17:[2,4],19:[2,4]},{4:[1,19],6:18,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{14:[1,20]},{14:[1,21]},{14:[1,22]},{14:[1,23]},{4:[1,19],6:24,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{1:[2,2]},{4:[1,19],6:25,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{4:[1,19],6:26,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{4:[1,19],6:27,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{4:[1,19],6:28,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{4:[1,19],6:30,8:4,14:[1,29],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{4:[1,19],6:31,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{9:[1,12],10:[1,13],11:[1,14],12:[1,15],13:[1,16],17:[1,17],19:[1,32]},{7:[2,3],9:[2,3],10:[2,3],11:[2,3],12:[2,3],13:[2,3],17:[2,3],19:[2,3]},{4:[1,34],21:33},{4:[1,36],23:35,27:[1,37]},{4:[1,41],15:38,18:[1,40],27:[1,44],28:39,32:[1,42],33:[1,43]},{27:[1,48],32:[1,49],33:[1,47],34:45,36:46},{7:[1,50],9:[1,12],10:[1,13],11:[1,14],12:[1,15],13:[1,16],17:[1,17]},{7:[2,5],9:[1,12],10:[1,13],11:[1,14],12:[2,5],13:[1,16],17:[1,17],19:[2,5]},{7:[2,6],9:[1,12],10:[1,13],11:[1,14],12:[2,6],13:[1,16],17:[1,17],19:[2,6]},{7:[2,7],9:[1,12],10:[1,13],11:[1,14],12:[2,7],13:[1,16],17:[1,17],19:[2,7]},{7:[2,8],9:[1,12],10:[1,13],11:[1,14],12:[2,8],13:[1,16],17:[1,17],19:[2,8]},{4:[1,41],14:[1,23],15:51,18:[1,40],27:[1,44],28:39,32:[1,42],33:[1,43]},{7:[2,10],9:[1,12],10:[1,13],11:[1,14],12:[2,10],13:[1,16],17:[1,17],19:[2,10]},{7:[2,11],9:[1,12],10:[1,13],11:[1,14],12:[2,11],13:[1,16],17:[1,17],19:[2,11]},{7:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],17:[2,12],19:[2,12]},{16:[1,52],25:[1,53]},{16:[2,16],25:[2,16]},{16:[1,54],25:[1,55]},{26:[1,56]},{26:[1,57]},{16:[1,58],30:[1,59],31:[1,60]},{29:[1,61]},{4:[1,41],15:62,18:[1,40],27:[1,44],28:39,32:[1,42],33:[1,43]},{16:[2,26],19:[2,26],29:[2,26],30:[2,26],31:[2,26]},{16:[2,27],19:[2,27],29:[2,27],30:[2,27],31:[2,27]},{16:[2,28],19:[2,28],29:[2,28],30:[2,28],31:[2,28]},{16:[2,29],19:[2,29],29:[2,29],30:[2,29],31:[2,29]},{16:[1,63],25:[1,64]},{16:[2,33],25:[2,33]},{16:[2,35],25:[2,35]},{16:[2,36],25:[2,36]},{16:[2,37],25:[2,37]},{1:[2,1]},{16:[1,65],30:[1,59],31:[1,60]},{18:[1,66]},{4:[1,67]},{18:[1,68]},{4:[1,69],27:[1,70]},{4:[1,71]},{4:[1,72]},{18:[1,73]},{4:[1,41],15:74,18:[1,40],27:[1,44],28:39,32:[1,42],33:[1,43]},{4:[1,41],15:75,18:[1,40],27:[1,44],28:39,32:[1,42],33:[1,43]},{4:[1,41],27:[1,44],28:76,32:[1,42],33:[1,43]},{19:[1,77],30:[1,59],31:[1,60]},{26:[1,78]},{27:[1,48],32:[1,49],33:[1,47],36:79},{4:[1,19],6:80,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{4:[1,19],6:81,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{16:[2,17],25:[2,17]},{4:[1,19],6:82,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{26:[1,83]},{26:[1,84]},{16:[2,18],25:[2,18]},{16:[2,19],25:[2,19]},{4:[1,19],6:85,8:4,14:[1,9],18:[1,5],20:[1,6],22:[1,7],24:[1,8]},{16:[2,23],19:[2,23],30:[2,23],31:[2,23]},{16:[2,24],19:[2,24],30:[2,24],31:[2,24]},{16:[2,22],19:[2,22],30:[2,22],31:[2,22]},{16:[2,25],19:[2,25],30:[2,25],31:[2,25]},{14:[1,87],35:86},{16:[2,34],25:[2,34]},{7:[2,9],9:[1,12],10:[1,13],11:[1,14],12:[2,9],13:[1,16],17:[1,17],19:[2,9]},{9:[1,12],10:[1,13],11:[1,14],12:[1,15],13:[1,16],17:[1,17],19:[1,88]},{9:[1,12],10:[1,13],11:[1,14],12:[1,15],13:[1,16],17:[1,17],19:[1,89]},{4:[1,90]},{4:[1,91]},{9:[1,12],10:[1,13],11:[1,14],12:[1,15],13:[1,16],17:[1,17],19:[1,92]},{16:[1,93],25:[1,94]},{27:[1,48],32:[1,49],33:[1,47],34:95,36:46},{7:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],17:[2,13],19:[2,13]},{7:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],17:[2,14],19:[2,14]},{16:[2,20],25:[2,20]},{16:[2,21],25:[2,21]},{7:[2,15],9:[2,15],10:[2,15],11:[2,15],12:[2,15],13:[2,15],17:[2,15],19:[2,15]},{7:[2,30],9:[2,30],10:[2,30],11:[2,30],12:[2,30],13:[2,30],17:[2,30],19:[2,30]},{14:[1,96]},{16:[1,97],25:[1,64]},{27:[1,48],32:[1,49],33:[1,47],34:98,36:46},{16:[2,31],25:[2,31]},{16:[1,99],25:[1,64]},{16:[2,32],25:[2,32]}],
defaultActions: {11:[2,2],50:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 31;
break;
case 2:return 30;
break;
case 3:return 20;
break;
case 4:return 22;
break;
case 5:return 24;
break;
case 6:return 9;
break;
case 7:return 10;
break;
case 8:return 26;
break;
case 9:return 11;
break;
case 10:return 12;
break;
case 11:return 13;
break;
case 12:return 17;
break;
case 13:return 25;
break;
case 14:return 29;
break;
case 15:return 5;
break;
case 16:return 18;
break;
case 17:return 19;
break;
case 18:return 14;
break;
case 19:return 16;
break;
case 20:return 4;
break;
case 21:return 32; /* ' */
break;
case 22:return 33;
break;
case 23:return 27;
break;
case 24:return 7;
break;
}
};
lexer.rules = [/^(?:\s+)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:Project\b)/,/^(?:Rename\b)/,/^(?:Select\b)/,/^(?:Union\b)/,/^(?:Intersect\b)/,/^(?:->)/,/^(?:-)/,/^(?:X\b)/,/^(?:Join\b)/,/^(?:\/)/,/^(?:,)/,/^(?:==|!=|<=|>=|<|>)/,/^(?::=)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:[A-Za-z_][A-Za-z0-9_]*)/,/^(?:'([^\']|'')*')/,/^(?:[0-9]+\.[0-9]+)/,/^(?:[0-9]+)/,/^(?:$)/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
return parser;
});