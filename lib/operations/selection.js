/*
 * This function will evaluate a criteria against a relation, returning a new
 * relation with only the rows living up to the criteria present.
 */
define(['relation', 'tree'], function(Relation, Tree) {
	function evaluateRow( item, header, row ) {
		switch( true ) {
			case item instanceof Tree.Value:
				return item.value;

			case item instanceof Tree.Attribute:
				var index = header.indexOf(item.name);
				if( index == -1 ) throw "Selection failed. Unknown attribute: " + item.name;
				return row[index];

			case item instanceof Tree.Criteria:
				switch( item.op ) {
					case '==':
						return evaluateRow( item.left, header, row ) == evaluateRow( item.right, header, row );
					case '!=':
						return evaluateRow( item.left, header, row ) != evaluateRow( item.right, header, row );
					case '<=':
						return evaluateRow( item.left, header, row ) <= evaluateRow( item.right, header, row );
					case '>=':
						return evaluateRow( item.left, header, row ) >= evaluateRow( item.right, header, row );
					case '<':
						return evaluateRow( item.left, header, row ) < evaluateRow( item.right, header, row );
					case '>':
						return evaluateRow( item.left, header, row ) > evaluateRow( item.right, header, row );
					default:
						return false;
				}

			case item instanceof Tree.CriteriaComposition:
				switch( item.comp ) {
					case 'AND':
						return evaluateRow( item.left, header, row ) && evaluateRow( item.right, header, row );
					case 'OR':
						return evaluateRow( item.left, header, row ) || evaluateRow( item.right, header, row );
					default:
						return false;
				}
			default:
				return false;
		}
	}

	return function( criteria, relation ) {
		var dataPrime = relation.data.filter( function(row) { return evaluateRow(criteria, relation.header, row); } );
		return new Relation( relation.header, dataPrime );
	}
});