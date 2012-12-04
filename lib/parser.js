define(['tree'], function(Tree){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Expressions":3,"Stmt":4,"EOF":5,"ID":6,"UNION":7,"INTERSECT":8,"MINUS":9,"CROSS":10,"JOIN":11,"[":12,"Criteria":13,"]":14,"DIV":15,"(":16,")":17,"PROJECT":18,"ProjectionList":19,"RENAME":20,"RenameList":21,"SELECT":22,",":23,"->":24,"INT":25,"Value":26,"COMPARISON":27,"AND":28,"OR":29,"STRING":30,"FLOAT":31,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"ID",7:"UNION",8:"INTERSECT",9:"MINUS",10:"CROSS",11:"JOIN",12:"[",14:"]",15:"DIV",16:"(",17:")",18:"PROJECT",20:"RENAME",22:"SELECT",23:",",24:"->",25:"INT",27:"COMPARISON",28:"AND",29:"OR",30:"STRING",31:"FLOAT"},
productions_: [0,[3,2],[4,1],[4,3],[4,3],[4,3],[4,3],[4,6],[4,3],[4,3],[4,3],[4,7],[4,7],[4,7],[19,1],[19,3],[21,3],[21,3],[21,5],[21,5],[13,3],[13,3],[13,3],[13,3],[26,1],[26,1],[26,1],[26,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]; 
break;
case 2: this.$ = new Tree.RelationReference(yytext); 
break;
case 3: this.$ = new Tree.Union( $$[$0-2], $$[$0] ); 
break;
case 4: this.$ = new Tree.Intersection( $$[$0-2], $$[$0] ); 
break;
case 5: this.$ = new Tree.Difference( $$[$0-2], $$[$0] ); 
break;
case 6: this.$ = new Tree.Cartesian( $$[$0-2], $$[$0] ); 
break;
case 7: this.$ = new Tree.Join( $$[$0-5], $$[$0-2], $$[$0] ); 
break;
case 8: this.$ = new Tree.NaturalJoin( $$[$0-2], $$[$0] ); 
break;
case 9: this.$ = new Tree.Division( $$[$0-2], $$[$0] ); 
break;
case 10: this.$ = $$[$0-1] 
break;
case 11: this.$ = new Tree.Projection( $$[$0-4], $$[$0-1] ); 
break;
case 12: this.$ = new Tree.Rename( $$[$0-4], $$[$0-1] ); 
break;
case 13: this.$ = new Tree.Selection( $$[$0-4], $$[$0-1] ); 
break;
case 14: this.$ = new Tree.ProjectionList( $$[$0] ); 
break;
case 15: this.$ = $$[$0-2].add($$[$0]); 
break;
case 16: this.$ = new Tree.RenameList( [$$[$0-2], $$[$0]] ); 
break;
case 17: this.$ = new Tree.RenameList( [$$[$0-2], $$[$0]] ); 
break;
case 18: this.$ = $$[$0-4].add( [$$[$0-2], $$[$0]] ); 
break;
case 19: this.$ = $$[$0-4].add( [$$[$0-2], $$[$0]] ); 
break;
case 20: this.$ = new Tree.Criteria($$[$0-2], $$[$0-1], $$[$0]); 
break;
case 21: this.$ = new Tree.CriteriaComposition($$[$0-2], 'AND', $$[$0]); 
break;
case 22: this.$ = new Tree.CriteriaComposition($$[$0-2], 'OR', $$[$0]); 
break;
case 23: this.$ = $$[$0-1]; 
break;
case 24: this.$ = new Tree.Attribute(yytext); 
break;
case 25: this.$ = new Tree.Value(yytext.substring(1, yytext.length - 1)); 
break;
case 26: this.$ = new Tree.Value(parseFloat(yytext)); 
break;
case 27: this.$ = new Tree.Value(parseInt(yytext, 10)); 
break;
}
},
table: [{3:1,4:2,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{1:[3]},{5:[1,8],7:[1,9],8:[1,10],9:[1,11],10:[1,12],11:[1,13],15:[1,14]},{5:[2,2],7:[2,2],8:[2,2],9:[2,2],10:[2,2],11:[2,2],15:[2,2],17:[2,2]},{4:15,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{12:[1,16]},{12:[1,17]},{12:[1,18]},{1:[2,1]},{4:19,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{4:20,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{4:21,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{4:22,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{4:24,6:[1,3],12:[1,23],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{4:25,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{7:[1,9],8:[1,10],9:[1,11],10:[1,12],11:[1,13],15:[1,14],17:[1,26]},{6:[1,28],19:27},{6:[1,30],21:29,25:[1,31]},{6:[1,35],13:32,16:[1,34],25:[1,38],26:33,30:[1,36],31:[1,37]},{5:[2,3],7:[1,9],8:[1,10],9:[1,11],10:[2,3],11:[1,13],15:[1,14],17:[2,3]},{5:[2,4],7:[1,9],8:[1,10],9:[1,11],10:[2,4],11:[1,13],15:[1,14],17:[2,4]},{5:[2,5],7:[1,9],8:[1,10],9:[1,11],10:[2,5],11:[1,13],15:[1,14],17:[2,5]},{5:[2,6],7:[1,9],8:[1,10],9:[1,11],10:[2,6],11:[1,13],15:[1,14],17:[2,6]},{6:[1,35],13:39,16:[1,34],25:[1,38],26:33,30:[1,36],31:[1,37]},{5:[2,8],7:[1,9],8:[1,10],9:[1,11],10:[2,8],11:[1,13],15:[1,14],17:[2,8]},{5:[2,9],7:[1,9],8:[1,10],9:[1,11],10:[2,9],11:[1,13],15:[1,14],17:[2,9]},{5:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],15:[2,10],17:[2,10]},{14:[1,40],23:[1,41]},{14:[2,14],23:[2,14]},{14:[1,42],23:[1,43]},{24:[1,44]},{24:[1,45]},{14:[1,46],28:[1,47],29:[1,48]},{27:[1,49]},{6:[1,35],13:50,16:[1,34],25:[1,38],26:33,30:[1,36],31:[1,37]},{14:[2,24],17:[2,24],27:[2,24],28:[2,24],29:[2,24]},{14:[2,25],17:[2,25],27:[2,25],28:[2,25],29:[2,25]},{14:[2,26],17:[2,26],27:[2,26],28:[2,26],29:[2,26]},{14:[2,27],17:[2,27],27:[2,27],28:[2,27],29:[2,27]},{14:[1,51],28:[1,47],29:[1,48]},{16:[1,52]},{6:[1,53]},{16:[1,54]},{6:[1,55],25:[1,56]},{6:[1,57]},{6:[1,58]},{16:[1,59]},{6:[1,35],13:60,16:[1,34],25:[1,38],26:33,30:[1,36],31:[1,37]},{6:[1,35],13:61,16:[1,34],25:[1,38],26:33,30:[1,36],31:[1,37]},{6:[1,35],25:[1,38],26:62,30:[1,36],31:[1,37]},{17:[1,63],28:[1,47],29:[1,48]},{4:64,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{4:65,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{14:[2,15],23:[2,15]},{4:66,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{24:[1,67]},{24:[1,68]},{14:[2,16],23:[2,16]},{14:[2,17],23:[2,17]},{4:69,6:[1,3],16:[1,4],18:[1,5],20:[1,6],22:[1,7]},{14:[2,21],17:[2,21],28:[2,21],29:[2,21]},{14:[2,22],17:[2,22],28:[2,22],29:[2,22]},{14:[2,20],17:[2,20],28:[2,20],29:[2,20]},{14:[2,23],17:[2,23],28:[2,23],29:[2,23]},{5:[2,7],7:[1,9],8:[1,10],9:[1,11],10:[2,7],11:[1,13],15:[1,14],17:[2,7]},{7:[1,9],8:[1,10],9:[1,11],10:[1,12],11:[1,13],15:[1,14],17:[1,70]},{7:[1,9],8:[1,10],9:[1,11],10:[1,12],11:[1,13],15:[1,14],17:[1,71]},{6:[1,72]},{6:[1,73]},{7:[1,9],8:[1,10],9:[1,11],10:[1,12],11:[1,13],15:[1,14],17:[1,74]},{5:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],15:[2,11],17:[2,11]},{5:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],15:[2,12],17:[2,12]},{14:[2,18],23:[2,18]},{14:[2,19],23:[2,19]},{5:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],15:[2,13],17:[2,13]}],
defaultActions: {8:[2,1]},
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
case 1:return 29;
break;
case 2:return 28;
break;
case 3:return 18;
break;
case 4:return 20;
break;
case 5:return 22;
break;
case 6:return 7;
break;
case 7:return 8;
break;
case 8:return 24;
break;
case 9:return 9;
break;
case 10:return 10;
break;
case 11:return 11;
break;
case 12:return 15;
break;
case 13:return 23;
break;
case 14:return 27;
break;
case 15:return 16;
break;
case 16:return 17;
break;
case 17:return 12;
break;
case 18:return 14;
break;
case 19:return 6;
break;
case 20:return 30;
break;
case 21:return 31;
break;
case 22:return 25;
break;
case 23:return 5;
break;
}
};
lexer.rules = [/^(?:\s+)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:Project\b)/,/^(?:Rename\b)/,/^(?:Select\b)/,/^(?:Union\b)/,/^(?:Intersect\b)/,/^(?:->)/,/^(?:-)/,/^(?:X\b)/,/^(?:Join\b)/,/^(?:\/)/,/^(?:,)/,/^(?:==|!=|<=|>=|<|>)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:[A-Za-z_][A-Za-z0-9_]*)/,/^(?:'([^\']|'')*')/,/^(?:[0-9]+\.[0-9]+)/,/^(?:[0-9]+)/,/^(?:$)/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
return parser;
});