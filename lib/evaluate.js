/*
 * Evaluates a RelAlg expression treee
 */

define(function(require) {
  var Tree = require('tree')
    , Relation = require('relation')
    , stringify = require('util/stringify')
    , project = require('operations/project')
    , cartesian = require('operations/cartesian')
    , difference = require('operations/difference')
    , division = require('operations/division')
    , intersection = require('operations/intersection')
    , join = require('operations/join')
    , naturaljoin = require('operations/naturaljoin')
    , rename = require('operations/rename')
    , selection = require('operations/selection')
    , union = require('operations/union')

  function RAEvaluationError( errors ) {
  	this.errors = errors;
  }
  RAEvaluationError.prototype.errors = [];
  RAEvaluationError.prototype.toString = function() {
  	var error = '';
  	for( var i in this.errors ) {
  		error += 'Evaluation error: ' + this.errors[i].error + "\n";
  		error += '              In: ' + stringify(this.errors[i].item) + "\n\n";
  	}

  	return error.substr(0, error.length-2);
  }

	function _eval( item ) {
		var rel, right, left = null;
		
		// Evaluate lower nodes, and ensure they didn't fail
		switch( true ) {
		  case item instanceof Tree.Assignment:
			case item instanceof Tree.Projection:
			case item instanceof Tree.Rename:
			case item instanceof Tree.Selection:
				var r = _eval(item.relation);
				if( r.errors.length ) return r;
				
				rel = r.rel;
				break;
				
			case item instanceof Tree.Union:
			case item instanceof Tree.Intersection:
			case item instanceof Tree.Difference:
			case item instanceof Tree.Cartesian:
			case item instanceof Tree.Join:
			case item instanceof Tree.NaturalJoin:
			case item instanceof Tree.Division:
				var l = _eval( item.left );
				var r = _eval( item.right );
				var errors = l.errors.concat(r.errors);
				if( errors.length ) return {rel: null, errors: errors};
				
				left = l.rel;
				right = r.rel;
				break;
		}
			
		// Now evaluate this node
		try {
			switch( true ) {
			  case item instanceof Tree.Assignment:
			    return {rel: Relation.add( item.name, rel ), errors: []}
			  case item instanceof Tree.Relation:
					return {rel: item.relation, errors: []}
				case item instanceof Tree.RelationReference:
					return {rel: Relation.get( item.name ), errors: []}
				case item instanceof Tree.Projection:
					return {rel: project( rel, item.projectionList ), errors: []}
				case item instanceof Tree.Rename:
					return {rel: rename( rel, item.renameList ), errors: []}
				case item instanceof Tree.Selection:
					return {rel: selection( item.criteria, rel ), errors: []}
				case item instanceof Tree.Union:
					return {rel: union( left, right ), errors: []}
				case item instanceof Tree.Intersection:
					return {rel: intersection( left, right ), errors: []}
				case item instanceof Tree.Difference:
					return {rel: difference( left, right ), errors: []}
				case item instanceof Tree.Cartesian:
					return {rel: cartesian( left, right ), errors: []}
				case item instanceof Tree.Join:
					return {rel: join( left, item.criteria, right ), errors: []}
				case item instanceof Tree.NaturalJoin:
					return {rel: naturaljoin( left, right ), errors: []}
				case item instanceof Tree.Division:
					return {rel: division( left, right ), errors: []}
				default:
					throw "Unsupported operation!"
			}
		} catch( e ) {
			return {rel: null, errors: [{item: item, error: e}]}
		}
	}

	return function( item ) {
		var ret = _eval( item );
		if( ret.errors.length ) throw new RAEvaluationError(ret.errors);
		else return ret.rel;
	}
});