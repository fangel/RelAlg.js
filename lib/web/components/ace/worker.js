define(function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var Mirror = require("ace/worker/mirror").Mirror;
var parse = require("parse")
var typeCheck = require("type_check")
var Relation = require("relation")

var RelAlgWorker = exports.RelAlgWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
    this.setOptions();

    var _self = this
    sender.on("enviroment", function(e) {
      _self.onEnviroment(e.data)
    })
};

oop.inherits(RelAlgWorker, Mirror);

(function() {
    this.setOptions = function(options) {
        this.options = options || {};
        if (this.doc.getValue()) this.deferredUpdate.schedule(100);
    };

    this.changeOptions = function(newOptions) {
        oop.mixin(this.options, newOptions);
        if (this.doc.getValue()) this.deferredUpdate.schedule(100);
    };

    this.onEnviroment = function(newEnviroment) {
      Relation.storage = newEnviroment
      this.onUpdate()
    }

    this.onUpdate = function() {
        var value = this.doc.getValue()
          , errors = []
        try {
          this.sender.callback('getEnvironment', [])
          
          var expr = parse(value)
          // console.log(expr)
          var check = typeCheck(expr)
          if (check[0].length)
            this.sender.emit("type_error", check[0])
          else
            this.sender.emit("ok")
        } catch (e) {
          this.sender.emit("parse_error", e);
        }
    };

}).call(RelAlgWorker.prototype);

});
