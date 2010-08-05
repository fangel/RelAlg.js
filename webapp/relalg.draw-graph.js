/*
 * This function will take the ID of a <canvas> element and an expression, then
 * draw a graph of the expression on the <canvas>
 *
 * I know the code in this file isn't the prettiest around, but it works!
 * Most of the clumsiness comes from me not being terribly good at working
 * with <canvas>..
 */

drawGraph = (function() {
	var TEXT_HEIGHT = 15;
	var TEXT_FONT = 'Georgia';
	var LAYER_SPACING = 30;
	var LEAF_SPACING = 30;
	var SUBSCRIPT_FACTOR = 0.7;
	
	function op( item ) {
		switch( true ) {
			case item instanceof Tree.Projection:
				return 'π';
			case item instanceof Tree.Rename:
				return'ρ';
			case item instanceof Tree.Selection:
				return 'σ';
			case item instanceof Tree.Union:
				return '∪';
			case item instanceof Tree.Join:
			case item instanceof Tree.NaturalJoin:			
				return '⋈';
			case item instanceof Tree.Intersection:
				return '∩';
			case item instanceof Tree.Cartesian:
				return '×';
			case item instanceof Tree.Division:
				return '/';
			case item instanceof Tree.Difference:
				return '−';
		}
	}
	
	function subtext( item ) {
		switch( true ) {
			case item instanceof Tree.Projection:
				return htmlify( item.projectionList );
			case item instanceof Tree.Rename:
				return htmlify( item.renameList );
			case item instanceof Tree.Join:
			case item instanceof Tree.Selection:
				return htmlify( item.criteria );
		}	
	}
	
	function size( context, item ) {
		switch( true ) {
			case item instanceof Tree.Relation:
				context.font = TEXT_HEIGHT + 'px ' + TEXT_FONT;
				var tsize = context.measureText( item.name );
				return [tsize.width, TEXT_HEIGHT];
				
			case item instanceof Tree.Projection:
			case item instanceof Tree.Rename:
			case item instanceof Tree.Selection:
				context.font = TEXT_HEIGHT + 'px ' + TEXT_FONT;
				var width = context.measureText( op(item) ).width;
				context.save();
				context.font = Math.round(TEXT_HEIGHT * SUBSCRIPT_FACTOR) + 'px ' + TEXT_FONT;
				width += context.measureText( subtext(item) ).width + 2;
				context.restore();
				
				var subsize = size( context, item.relation );
				width = Math.max(width, subsize[0]);
				
				var height = subsize[1] + LAYER_SPACING + Math.round( TEXT_HEIGHT * (1 + 0.5 * SUBSCRIPT_FACTOR) );
				return [width, height];
				
			case item instanceof Tree.Union:
			case item instanceof Tree.NaturalJoin:
			case item instanceof Tree.Intersection:
			case item instanceof Tree.Difference:
			case item instanceof Tree.Cartesian:
			case item instanceof Tree.Division:
			case item instanceof Tree.Join:
				context.font = TEXT_HEIGHT + 'px ' + TEXT_FONT;
				var width = context.measureText( op(item) ).width;
				var height = TEXT_HEIGHT + LAYER_SPACING;
				
				if( item instanceof Tree.Join ) {
					context.save();
					context.font = Math.round(TEXT_HEIGHT * SUBSCRIPT_FACTOR) + 'px ' + TEXT_FONT;
					width += context.measureText( subtext(item) ).width + 2;
					context.restore();
					height = Math.round( TEXT_HEIGHT * (1 + 0.5 * SUBSCRIPT_FACTOR) ) + LAYER_SPACING;
				}
				
				var left_size  = size( context, item.left );
				var right_size = size( context, item.right );
				
				var width = Math.max( width, left_size[0] + LEAF_SPACING + right_size[0]);
				var height = height + Math.max( left_size[1], right_size[1] );
				return [width, height];
		}
	}
	
	function draw( context, item ) {
		switch( true ) {
			case item instanceof Tree.Relation:
				context.font = TEXT_HEIGHT + 'px ' + TEXT_FONT;
				context.fillText( item.name, 0, TEXT_HEIGHT );
				break;
				
			case item instanceof Tree.Projection:
			case item instanceof Tree.Rename:
			case item instanceof Tree.Selection:
				context.save();
								
				// Recalculate the with of only this nodes width
				context.font = TEXT_HEIGHT + 'px ' + TEXT_FONT;
				var op_width = context.measureText( op(item) ).width;
				context.save();
				context.font = Math.round(TEXT_HEIGHT * SUBSCRIPT_FACTOR) + 'px ' + TEXT_FONT;
				var width = op_width + context.measureText( subtext(item) ).width;
				context.restore();
				
				// Find the size of the full node + subnode
				var full = size( context, item )[0];
				
				// Now we can center this nodes text, and draw it
				var offset = Math.round((full - width) / 2);
				context.font = TEXT_HEIGHT + 'px ' + TEXT_FONT;
				context.fillText( op(item), offset, TEXT_HEIGHT );
				context.save();
				context.font = Math.round(TEXT_HEIGHT * SUBSCRIPT_FACTOR) + 'px ' + TEXT_FONT;
				context.fillText( subtext(item), offset + op_width + 2, Math.round(TEXT_HEIGHT * (1 + 0.5 * SUBSCRIPT_FACTOR)) );
				context.restore();
				
				// Draw a line to the next relation
				context.lineWidth = 1.0;
				context.beginPath();
				context.moveTo( Math.round(full / 2), Math.round(TEXT_HEIGHT * (1 + 0.5 * SUBSCRIPT_FACTOR)) + 8 );
				context.lineTo( Math.round(full / 2), Math.round(TEXT_HEIGHT * (1 + 0.5 * SUBSCRIPT_FACTOR)) + LAYER_SPACING );
				context.stroke();
				
				context.restore();
				
				// Find the size of the subnode
				var subsize = size( context, item.relation );
				
				// Now we can center the subnode and draw it
				var offset = Math.round((full - subsize[0]) / 2);
				context.save();
				context.translate( offset, Math.round(TEXT_HEIGHT * (1 + 0.5 * SUBSCRIPT_FACTOR)) + LAYER_SPACING );
				draw( context, item.relation );
				context.restore();
				
				break;
			
			case item instanceof Tree.Union:
			case item instanceof Tree.NaturalJoin:
			case item instanceof Tree.Intersection:
			case item instanceof Tree.Difference:
			case item instanceof Tree.Cartesian:
			case item instanceof Tree.Division:	
			case item instanceof Tree.Join:
				context.save();
				// Calculate width of this node 
				context.font = TEXT_HEIGHT + 'px ' + TEXT_FONT;
				var width = context.measureText( op(item) ).width;
				var height = TEXT_HEIGHT;
				if( item instanceof Tree.Join ) {
					context.save();
					context.font = Math.round(TEXT_HEIGHT * SUBSCRIPT_FACTOR) + 'px ' + TEXT_FONT;
					width += context.measureText( subtext(item) ).width + 2;
					context.restore();
					height = Math.round( TEXT_HEIGHT * (1 + 0.5 * SUBSCRIPT_FACTOR) );
				}
				
				// Calculate width of node + subnodes
				var full = size( context, item );
				
				// Draw this node centered..
				var offset = Math.round( (full[0] - width) /2);
				context.fillText( op(item), offset, TEXT_HEIGHT );
				if( item instanceof Tree.Join ) {
					var op_width = context.measureText( op(item) ).width;
					context.save();
					context.font = Math.round(TEXT_HEIGHT * SUBSCRIPT_FACTOR) + 'px ' + TEXT_FONT;
					context.fillText( subtext(item), offset + op_width + 2, Math.round(TEXT_HEIGHT * (1 + 0.5 * SUBSCRIPT_FACTOR)) );
					context.restore();
				}
				
				// Calculate size of subnodes
				var left_size = size( context, item.left );
				var right_size = size( context, item.right );
				
				var subwidth = left_size[0] + LEAF_SPACING + right_size[0];
				var offset = Math.round( (full[0] - subwidth) /2);
								
				// Add a line to the left..
				context.lineWidth = 1.0;
				context.beginPath();
				context.moveTo( offset + Math.round(left_size[0] / 2), 	height + LAYER_SPACING );
				context.lineTo( Math.round(full[0] / 2) - 4,	height + 4 );
				context.stroke();
				
				// Add a line to the right..
				context.beginPath();
				context.lineTo( offset + left_size[0] + LEAF_SPACING + Math.round(right_size[0] / 2),	height + LAYER_SPACING );	
				context.lineTo( Math.round(full[0] / 2 + 4), 											height + 4 );
				context.stroke();
				
				context.restore();

				

				// Draw the left subnode
				context.save();
				context.translate(offset, height + LAYER_SPACING);
				draw( context, item.left );
				context.restore();
				
				// Draw the right subnode
				context.save();
				context.translate( offset + left_size[0] + LEAF_SPACING, height + LAYER_SPACING);
				draw( context, item.right );
				context.restore();
				
				break;
		}
	}
	
	return function(id, expr) {
		var tree = parser(expr);
		window.document.getElementById('prettyExpr').innerHTML = htmlify( tree );

		var canvas  = window.document.getElementById(id);
		var context = canvas.getContext('2d');
		
		var canvas_size = size( context, tree );
		
		window.console.log( canvas_size );
		
		canvas.width = canvas_size[0] + 20;
		canvas.height = canvas_size[1] + 20;
		
		context.translate(10, 10);
		draw( context, tree );
	}
})();