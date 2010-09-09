/*
 * Contains a loader-function for loading RelAlg.js
 */

function relalgLoader( pathPrefix ) {
	return function( file ) {
		$.ajax({
			url: pathPrefix + '/' + file,
			dataType: 'script',
			async: false
		});
	}
}
