/*
 * A helper function to convert a tree into text..
 */
define(['tree'], function(Tree) {
  return function htmlify( item ) {
  	switch( true ) {
  		case item instanceof Tree.RelationReference:
  			return item.name;
		
			
  		case item instanceof Tree.Projection:
  			return 'π' + 
  			       '<sub>' + htmlify( item.projectionList) + '</sub>( ' + 
  			       htmlify( item.relation ) + ' )';
			
  		case item instanceof Tree.Rename:
  			return 'ρ' + 
  			       '<sub>' + htmlify( item.renameList) + '</sub>( ' +  
  			       htmlify( item.relation ) + ' )';

  		case item instanceof Tree.Selection:
  			return 'σ' + 
  			       '<sub>' + htmlify( item.criteria) + '</sub>( ' + 
  			       htmlify( item.relation ) + ' )';
			
  		case item instanceof Tree.ProjectionList:
  		 	return item.list.join(', ');
		
		
  		case item instanceof Tree.RenameList:
  		 	var rtn = '';
  			for( var i = 0; i < item.list.length; i++ ) {
  				rtn += item.list[i][0] + ' → ' + item.list[i][1] + ', ';
  			}
  			return rtn.substr(0, rtn.length -2 );
		
  		case item instanceof Tree.Union:
  			return htmlify( item.left ) +
  			       ' ∪ ' +
  			       htmlify( item.right );

  		case item instanceof Tree.Intersection:
  			return htmlify( item.left ) +
  			       ' ∩ ' +
  			       htmlify( item.right );

  		case item instanceof Tree.Difference:
  			return htmlify( item.left ) +
  			       ' − ' +
  			       htmlify( item.right );

  		case item instanceof Tree.Cartesian:
  			return htmlify( item.left ) +
  			       ' × ' +
  			       htmlify( item.right );
		
  		case item instanceof Tree.Join:
  			return htmlify( item.left ) +
  			       ' ⋈<sub>' + htmlify( item.criteria ) + '</sub> ' + 
  			       htmlify( item.right ); 
		
  		case item instanceof Tree.NaturalJoin:
  			return htmlify( item.left ) +
  			       ' ⋈ ' + 
  			       htmlify( item.right );

  		case item instanceof Tree.Division:
  			return htmlify( item.left ) +
  			       ' / ' + 
  			       htmlify( item.right );
			
  		case item instanceof Tree.Attribute:
  			return item.name;
			
  		case item instanceof Tree.Value:
  			return (typeof(item.value) == 'string') ? '"' + item.value + '"' : item.value;

  		case item instanceof Tree.Criteria:
  			var op;
  			switch( item.op ) {
  				case '==': op = '='; break;
  				case '!=': op = '≠'; break;
  				case '<=': op = '≤'; break; 
  				case '>=': op = '≥'; break;
  				case '>':  op = '>'; break;
  				case '<':  op = '<'; break;
  			}
  			return htmlify( item.left) + ' ' + op + ' ' + htmlify( item.right );
			
  		case item instanceof Tree.CriteriaComposition:
  			var comp;
  			switch( item.comp ) {
  				case 'AND': comp = '∧'; break;
  				case 'OR':  comp = '∨'; break;
  			}
  			return htmlify( item.left ) + ' ' + comp + ' ' + htmlify( item.right );

  		default:
  			return 'Whoa?';
  	}
  }
})
