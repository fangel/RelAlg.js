function sgTableEdit( table, options ) {
	this.table = $(table);
    this.options =  $.extend(sgTableEdit.defaults, options);

	// Add some extra markup..
	$('thead tr', this.table).append('<th>:::</th>');
	$('tbody tr', this.table).append('<td>&nbsp;</td>');
	
	this.setupEvents();
}
sgTableEdit.defaults = {};
sgTableEdit.prototype.table = null;
sgTableEdit.prototype.options = null;
sgTableEdit.prototype.selected = null;
sgTableEdit.prototype.editing = null;
sgTableEdit.prototype.headerEditing = null;
sgTableEdit.prototype.setupEvents = function() {
	var te = this;
	$('thead th:last-child', this.table).live('mousedown', function(e) {
		te.extenderHandler(e);
	});
	$('thead th', this.table).live('mousedown', function(e) { e.preventDefault();});
	$('thead th', this.table).live('dblclick',function(e) {
		te.headerEdit($(this), e);
	})
	$('tbody td', this.table).live('click', function(e) {
		te.cellClick($(this), e);
		e.stopPropagation();
	});
	$(window).click( function(e) {
		te.otherClick(e);
	});
	$(window).keydown(function(e) {
		te.keydown(e);
	});
	$(window).keypress(function(e) {
		te.keypress(e);
	});
	$(this.table).bind('columnAdd', function() {
		$('thead th:last-child', te.table).before('<th>NEW</th>');
		$('tbody td:last-child', te.table).before('<td></td>');
	});
	$(this.table).bind('columnRemove', function() {
		$('thead th:last-child', te.table).prev().remove();
		if( $('tbody td:last-child', te.table).prev().is('td:has(div.selected)') ) {
			te.editing = false; // makes sure the cellChange event isn't fired..
			te.select(null);
		}
		$('tbody td:last-child', te.table).prev().remove();
	});	
	
}
sgTableEdit.prototype.select = function( cell ) {
	if( this.selected ) {
		var val = ($(this.selected).is('td:has(input)')) ? $('input',this.selected).val() : $(this.selected).text();
		$(this.selected).empty().text( val );
		if( this.editing )
			$(this.table).trigger('cellChange', val);
		this.selected = null;
		this.editing  = false;
	}
	if( cell ) {
		$(cell).wrapInner('<div class="selected" />');
		this.selected = $(cell);
	}
}
sgTableEdit.prototype.extenderHandler = function(e) {
	var te = this;
	e.preventDefault();
	var startX = e.pageX;			
	$(window).mousemove(function(e) {
		var movedX = e.pageX - startX;
		if( movedX < -100 ) {
			startX = e.pageX;
			$(te.table).trigger('columnRemove');
		} else if( movedX > 100 ) {
			startX = e.pageX;
			$(te.table).trigger('columnAdd');
		}
	})

	$(window).one('mouseup', function() {
		$(window).unbind('mousemove');
	})
}
sgTableEdit.prototype.cellClick = function(cell, e) {
	if( $(cell).is('td:last-child') ) return true;
	if( this.selected && this.selected[0] == cell[0] ) {
		if( ! this.editing ) {
			var val = $('div', cell).text();
			$('div', cell).empty().append( $('<input type="text" />').val(val) );
			$('input', cell).focus();
			this.editing = true;
		}
	} else {
		this.select(cell);
	}
}
sgTableEdit.prototype.headerEdit = function(cell, e) {
	if( $(cell).is('th:last-child') ) return true;
	
	this.select(null);
	if( this.headerEditing && this.headerEditing[0] == cell[0] ) return true;
	if( this.headerEditing ) {
		var val = $('input', this.headerEditing).val();
		$(this.headerEditing).empty().text( val );
		$(this.table).trigger('headerChange', val);
		this.headerEditing = null;
	}

	var te = this;
	var input = $('<input type="text" />').val( $(cell).text() ).blur(function(){
		var val = $(this).val();
		$(this).replaceWith( val );
		$(te.table).trigger('headerChange', val);
		te.headerEditing = null;
	});
	$(cell).empty().append( input );
	input.focus();
	this.headerEditing = $(cell);
}
sgTableEdit.prototype.otherClick = function(e) {
	// We can safely just deselect the table, because if a cell
	// was it, it would have stop the propagation of the
	// event so the listener on the window wouldnt have fired.. 
	this.select(null);
}
sgTableEdit.prototype.keydown = function(e) {
	if( this.selected && ! this.editing ) {
		switch( e.keyCode ) {
			case 37: // left arrow
				return this.navLeft();
			case 39: // right arrow
				return this.navRight();
			case 38: // up arrow
				return this.navUp();
			case 40: // down arrow
				return this.navDown();
		}
	}
	if( this.selected ) {
		switch( e.keyCode ) {
			case 9: // tab
				e.preventDefault();
				return this.navNext();
		}
	}
}
sgTableEdit.prototype.keypress = function(e) {
	if( this.selected && ! this.editing ) {
		var val = String.fromCharCode(e.charCode);
		if( e.charCode && val.match(/[^\s\u0008]/) ) {
			$('div', this.selected).empty().append( $('<input type="text" />').val('') );
			$('input', this.selected).focus();
			this.editing = true;
		}
		if( e.charCode == 8 ) { // Backspace - clear cell..
			$('div', this.selected).empty();
			$(this.table).trigger('cellChange', '');
		}
	}
}
sgTableEdit.prototype.navRight = function() {
	var next = $(this.selected).next();
	if( !next.is('td:last-child') ) {
		this.select(next);
		return true;
	}
	return false;
}
sgTableEdit.prototype.navLeft = function() {
	var prev = $(this.selected).prev();
	if( prev[0] ) {
		this.select(prev);
		return true;
	}
	return false;
}
sgTableEdit.prototype.navUp = function() {
	var pos = $(this.selected).prevAll().length;
	var prevRow = $(this.selected).parent().prev();
	if( prevRow[0] ) {
		this.select($('td', prevRow)[pos]);
		return true;
	}
	return false;
}
sgTableEdit.prototype.navDown = function() {
	var pos = $(this.selected).prevAll().length;
	var nextRow = $(this.selected).parent().next();
	if( nextRow[0] ) {
		this.select($('td', nextRow)[pos]);
		return true;
	}
	return false;
}
sgTableEdit.prototype.navNext = function() {	
	if( ! this.navRight() ) {
		var nextRow = $(this.selected).parent().next();
		if( nextRow[0] ) {
			this.select($('td', nextRow)[0]);
			return true;
		}
		var nextRow = $('<tr />').insertAfter($(this.selected).parent());
		for( var i=0; i<$(this.selected).parent().children('td').length; i++ ) {
			nextRow.append('<td></td>');
		}
		$(this.table).trigger('rowAdd', nextRow);
		this.select($('td', nextRow)[0]);
		return true;
	}
	return false;
}