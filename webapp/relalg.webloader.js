/*
 * Contains a loader-function for loading RelAlg.js
 */

function relalgLoader( pathPrefix ) {
	return function( file ) {
		var rs = document.createElement('script'); 
		rs.type = 'text/javascript'; 
		rs.src = pathPrefix + '/' + file
		
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.appendChild(rs);
	}
}
