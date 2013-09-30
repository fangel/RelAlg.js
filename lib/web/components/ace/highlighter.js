define(function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var RelAlgHighlightRules = function() {

    var keywords = (
        "select|project|rename|union|intersect|join"
    );

    var keywordMapper = this.createKeywordMapper({
        "entity.name.function": keywords,
    }, "storage.type", true);

    this.$rules = {
        "start" : [ {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keywords",
            regex : "\\-|\\/"
        }, {
            token : "keyword.operator",
            regex : ":="
        }, {
            token : "paren.lparen",
            regex : "[\\(]"
        }, {
            token : "paren.lparen",
            regex : "[\\[]",
            next  : "subscript"
        }, {
            token : "paren.rparen",
            regex : "[\\)]"
        }, {
            token : "text",
            regex : "\\s+"
        } ],
        "subscript": [ {
            token : "variable.parameter",
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "string",           // ' string
            regex : "'.*?'"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : "paran.rparan",
            regex : "[\\]]",
            next  : "start"
        }, {
            token : "keyword.operator",
            regex : "<|>|<=|=>|==|!=|<>|:=|&&|\\|\\||\\/"
        }, {
            token : "paren.lparen",
            regex : "[\\(]"
        }, {
            token : "paren.rparen",
            regex : "[\\)]"
        } ]
    };
};

oop.inherits(RelAlgHighlightRules, TextHighlightRules);

exports.RelAlgHighlightRules = RelAlgHighlightRules;
});
