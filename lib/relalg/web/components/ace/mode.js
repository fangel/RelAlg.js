define(function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var WorkerClient = require("ace/worker/worker_client").WorkerClient;
var Range = require("ace/range").Range;
var EventEmitter = require("ace/lib/event_emitter").EventEmitter;
var RelAlgHighlightRules = require("./highlighter").RelAlgHighlightRules;
var Parse = require("../../../parse")
var TypeCheck = require("../../../type_check")

var Mode = function() {
    this.$tokenizer = new Tokenizer(new RelAlgHighlightRules().getRules());
};
oop.inherits(Mode, TextMode);

(function() {
    oop.implement(this, EventEmitter);

    this.lineCommentStart = "--";

    this.worker = null;

    this.clearMarkings = function(session) {
        session.clearAnnotations();

        var markers = session.getMarkers();
        // console.log(markers)
        for (var i in markers) {
          if (markers[i].clazz == 'relalg_error') {
            session.removeMarker(markers[i].id)
          }
        }
    }

    this.setEnviroment = function(enviroment) {
      this.worker.emit("enviroment", {data: enviroment});
    }

    this.createWorker = function(session) {
        this.worker = new WorkerClient(["ace", "relalg", "deep-equal"], "relalg/web/components/ace/worker", "RelAlgWorker");
        this.worker.attachToDocument(session.getDocument());

        this.worker.on("parse_error", function(results) {
            this.clearMarkings(session);

            // Convert error to the correct type
            var error = new Parse.Error(
              results.data.scanned,
              results.data.full,
              results.data.text,
              results.data.token,
              results.data.line,
              results.data.position,
              results.data.expected
            );
            this._emit("parse_error", error);

            // Mark out the error
            var pos = error.getPosition()
            var annotation = {
                row: pos.startRow - 1,
                column: pos.startColumn,
                text: error.toString(),
                type: 'error'
            };
            session.setAnnotations([annotation]);

            var range = new Range(pos.startRow - 1, pos.startColumn, pos.endRow - 1, pos.endColumn);
            session.addMarker(range, 'relalg_error', 'text');
        }.bind(this))

        this.worker.on("type_error", function(results) {
            this.clearMarkings(session);
          
            // Convert errors to the correct type
            var errors = results.data.map(function(error) {
                return new TypeCheck.Error(error.AST, error.error)
            })
            this._emit("type_error", new TypeCheck.Errors(errors));
          
            // Mark out errors
            var annotations = []
              , pos
            for (var i=0; i < errors.length; i++) {
                pos = errors[i].getPosition()
                annotations.push({
                    row: pos.startRow - 1,
                    column: pos.startColumn,
                    text: errors[i].toString(),
                    type: 'error'
                });
                
                var range = new Range(pos.startRow - 1, pos.startColumn, pos.endRow - 1, pos.endColumn);
                session.addMarker(range, 'relalg_error', 'text');
            }
            session.setAnnotations(annotations);
        }.bind(this))

        this.worker.on("ok", function() {
            this.clearMarkings(session);
            this._emit("ok");
        }.bind(this))

        this.worker.on("terminate", function() {
            this.clearMarkings(session);
        }.bind(this));

        return this.worker;
    };

}).call(Mode.prototype);

exports.Mode = Mode;

});
