function RAWebApp( relation_manager ) {
	this.relationManager = relation_manager;
	
	this.table = new RAWATable( $('.table table'), this );
	$('.table table').bind('cellChange headerChange', (function(app) { return function() {
		app.relationManager.add( $(app.list.selected).text(), app.table.read() );
	}})(this));
	
	this.list  = new RAWAList( $('.sidebar .list ul'), $('#add'), $('#remove'), this );
	this.list.fill( this.relationManager.storage );
	
	this.lightbox = new RAWALightBox( $('.lightbox'), this );
	
	this.tabs.input = new RAWATabInput( $('.tabcontents .input'), $('.tabs ul'), 'input', this );
	this.tabs.history = new RAWATabHistory( $('.tabcontents .history'), $('.tabs ul'), 'history', this );
	this.tabs.errors = new RAWATabErrors( $('.tabcontents .errors'), $('.tabs ul'), 'errors', this );	
	this.tab('input');
	
	$('#import').click( (function(app) { return function() {
		app.importRelation();
	}})(this));
}
RAWebApp.prototype.relationManager = null;
RAWebApp.prototype.table = null;
RAWebApp.prototype.list = null;
RAWebApp.prototype.lightbox = null;
RAWebApp.prototype.tabs = {};
RAWebApp.prototype.activeTab = null;
RAWebApp.prototype.load = function( relation ) {
	this.table.fill( this.relationManager.get( relation ) );
}
RAWebApp.prototype.rename = function( from, to ) {
	this.relationManager.storage[to] = this.relationManager.storage[from];
	delete this.relationManager.storage[from];
}
RAWebApp.prototype.remove = function( name, select ) {
	delete this.relationManager.storage[name];
	this.list.fill( this.relationManager.storage, select );
}
RAWebApp.prototype.add = function( name ) {
	if( name && this.relationManager.storage[name] == undefined  ) {
		this.relationManager.add( name, new Relation(['NEW'], [[null]]) );
		this.list.fill( this.relationManager.storage, name );

		setTimeout( (function(tableEdit) { return function() {
			// We want the new table have its first cell to start out as selected
			// so we do two cellClicks (first only selects it) after a 1ms delay
			// - the delay is needed to foil tabs from selected the input textarea
			// instead
			tableEdit.cellClick( $('.table table tbody td:first-child'), null );
			tableEdit.cellClick( $('.table table tbody td:first-child'), null );
		}})(this.table.tableEdit), 1);
	} else {
		// A relation with this name exists - ignore request..
		this.list.fill( this.relationManager.storage, $(this.list.selected).text() );
	}
}
RAWebApp.prototype.tab = function( name ) {
	if( this.activeTab == name ) return;
	if( this.activeTab != undefined ) this.tabs[this.activeTab].inactivate();
	this.tabs[name].activate();
	this.activeTab = name;
}
RAWebApp.prototype.evaluate = function( expr, omitFromHistory ) {
	try {
		var tree = (typeof(expr) == 'string') ? parser( expr ) : expr;
		var rel  = evaluate( tree );
		this.relationManager.add( 'Result', rel );
		this.list.fill( this.relationManager.storage, 'Result' );
		if( ! omitFromHistory ) this.tabs.history.add( 'evaluate', tree );
		this.tabs.errors.clear();
	} catch( e ) {
		switch( true ) {
			case e instanceof RAParseError:
				this.tabs.errors.showParseError( e );
				this.tab('errors');
				break;
			case e instanceof RAEvaluationError:
				this.tabs.errors.showEvaluationError( e );
				this.tab('errors');
				break;
			default:
				throw e;
		}
	}
}
RAWebApp.prototype.graph = function( expr, omitFromHistory ) {
	try {
		var tree = (typeof(expr) == 'string') ? parser( expr ) : expr;
		this.lightbox.graph( tree );
		if( ! omitFromHistory ) this.tabs.history.add( 'graph', tree );
		this.tabs.errors.clear();
	} catch( e ) {
		switch( true ) {
			case e instanceof RAParseError:
				this.tabs.errors.showParseError( e );
				this.tab('errors');
				break;
			default:
				throw e;
		}
	}
}
RAWebApp.prototype.importRelation = function( data ) {
	if( data != undefined ) {
		var name = 'Import';
		if( this.relationManager.storage[name] ) {
			var i = 2;
			while( this.relationManager.storage[name + ' ' + i] )
				i++;
			name = name + ' ' + i;
		}
		this.relationManager.add( name, data );
		this.list.fill( this.relationManager.storage, name );
	} else {
		this.lightbox.importRelation();
	}
}


function RAWATable( table_elem, app ) {
	this.tableElem = $(table_elem);
	this.app = app;
	this.tableEdit = new sgTableEdit( this.tableElem, {});
	
}
RAWATable.prototype.tableElem = null;
RAWATable.prototype.app = null;
RAWATable.prototype.tableEdit = null;
RAWATable.prototype.fill = function( relation ) {
	// Remove old data
	$('thead tr', this.tableElem).empty();
	$('tbody', this.tableElem).empty();
	
	// Add in the new..
	for( var i in relation.header )
		$('thead tr', this.tableElem).append( $('<th />').text(relation.header[i] ) );
	$('thead tr', this.tableElem).append( $('<th />').text(':::') ); // dummy  cell, for sgTableEdit
	
	for( var i in relation.data ) {
		var row = $('<tr />');
		
		for( var j in relation.data[i] ) {
			row.append( $('<td />').text( relation.data[i][j] || '' ) );
		}
		row.append( $('<td />') ); // dummy cell, for sgTableEdit
		
		 $('tbody', this.tableElem).append(row);
	}
}
RAWATable.prototype.read = function() {
	var header = [];
	$('thead th', this.tableElem).not('th:last-child').each(function(i,elem) {
		header.push( $(elem).text() );
	});
	
	var data = [];
	$('tbody tr', this.tableElem).each(function(i, tr) {
		var row = [];
		$('td', tr).not('td:last-child').each(function(j, td) {	
			row.push( $(td).text() );
		});
		data.push( row );
	})
	return new Relation( header, data );
}



RAWAList = function( list_elem, add_elem, remove_elem, app ) {
	this.listElem = $(list_elem);
	this.app = app;
	this.selected = null;
	$(remove_elem).click( (function(l) { return function(){ l.remove();}})(this) );
	$(add_elem).click( (function(l) { return function(){ l.add();}})(this) );
}
RAWAList.prototype.listElem = null;
RAWAList.prototype.app = null;
RAWAList.prototype.selected = null;
RAWAList.prototype.fill = function( list, select ) {
	this.listElem.empty();
	
	var first = true;
	for( var i in list ) {
		var elem = $('<li />').text(i).click( (function(rel, l) { return function() { l.select(this) }})(i, this) );
		this.listElem.append( elem );
		if( first && ! select ) this.select( elem );
		if( select == i ) this.select( elem );
		first = false;
	}
}
RAWAList.prototype.select = function( elem ) {
	$(this.selected).removeClass('active').unbind('click').click( (function(l) { return function() { l.select(this) }})(this));
	$(elem).addClass('active').unbind('click').click( (function(l) { return function() { l.startEdit(this) }})(this) );
	this.selected = elem;
	this.app.load( $(elem).text() );
}
RAWAList.prototype.startEdit = function( li_elem ) {
	$(li_elem).unbind('click');
	var val = $(li_elem).text();
	$(li_elem).empty().append( $('<input type="text" />').val( val ) );
	$('input', $(li_elem)).focus().blur( (function(l, el) { return function() { l.stopEdit(el, val); }})(this, li_elem, val));
}
RAWAList.prototype.stopEdit = function( li_elem, old_name ) {
	var newName = $('input', $(li_elem)).val();
	$(li_elem).empty().text( newName ).click( (function(l) { return function() { l.startEdit(this) }})(this) );
	this.app.rename( old_name, newName )
}
RAWAList.prototype.remove = function() {
	var next = $(this.selected).next('li');
	var prev = $(this.selected).prev('li');
	var select = (next.length) ? next.text() : (prev.length) ? prev.text() : null;
	
	this.app.remove( $(this.selected).text(), select );
}
RAWAList.prototype.add = function( name ) {
	if( name == undefined ) {
		// Add the li and 
		$(this.selected).removeClass('active')
		this.selected = null;
		
		var li = $('<li>').appendTo($(this.listElem)).addClass('active');
		var input = $('<input type="text" />')
			.val('')
			.appendTo(li)
			.focus()
			.blur( (function(l, el) { return function() { 
				l.add( $(this).val() );
			}})(this, li));
	} else {
		this.app.add( name );
	}
}



RAWATabInput = function( elem, tab_elem, name, app ) {
	this.elem = $(elem);
	this.tab = $('<li />').text('Input').click( function() { app.tab(name) });
	$(tab_elem).append( this.tab );
	this.app = app;
	$('#execute').click( (function(t) { return function() { t.execute(); } })(this) );
	$('#graph').click( (function(t) { return function() { t.graph(); } })(this) );
}
RAWATabInput.prototype.elem = null;
RAWATabInput.prototype.tab = null;
RAWATabInput.prototype.app = null;
RAWATabInput.prototype.activate = function() {
	this.tab.addClass('active');
	this.elem.css('display', 'block');
}
RAWATabInput.prototype.inactivate = function() {
	this.tab.removeClass('active');
	this.elem.css('display', 'none');
}
RAWATabInput.prototype.execute = function() {
	var expression =  $('textarea', this.elem).val();
	this.app.evaluate( expression );
}
RAWATabInput.prototype.graph = function() {
	var expression =  $('textarea', this.elem).val();
	this.app.graph( expression );
}

RAWATabHistory = function( elem, tab_elem, name, app ) {
	this.elem = $(elem);
	this.tab = $('<li />').text('History').click( function() { app.tab(name) });
	$(tab_elem).append( this.tab );
	this.app = app;
	this.list = $('ul', this.elem);
}
RAWATabHistory.prototype.elem = null;
RAWATabHistory.prototype.tab = null;
RAWATabHistory.prototype.app = null;
RAWATabHistory.prototype.list = null;
RAWATabHistory.prototype.activate = function() {
	this.tab.addClass('active');
	this.elem.css('display', 'block');
}
RAWATabHistory.prototype.inactivate = function() {
	this.tab.removeClass('active');
	this.elem.css('display', 'none');
}
RAWATabHistory.prototype.add = function( type, tree ) {
	$('.placeholder', this.elem).css('display', 'none');
	$(this.list).css('display', 'block');
	
	var _type = (type == 'evaluate') ? 'Evaluate' : 'Graph';
	var expr = htmlify( tree );
	var repeat = $('<a>').text('Repeat action').click((function(app, type, tree) { return function() {
		app[type](tree, true);
		return false;
	}})(this.app, type, tree));
	
	var li = $('<li>')
		.append( $('<div>').addClass('type').text(_type) )
		.append( $('<div>').addClass('entry')
			.append($('<div>').addClass('expr').html(expr))
			.append($('<div>').addClass('tools')
				.append(repeat)
			) 
		)
		.append( $('<br clear="both" />'));
	$(this.list).append(li);
}


RAWATabErrors = function( elem, tab_elem, name, app ) {
	this.elem = $(elem);
	this.tab = $('<li />').text('Errors').click( function() { app.tab(name) });
	$(tab_elem).append( this.tab );
	this.app = app;
	
	this.type = $('.type', this.elem);
	this.num  = $('.number', this.elem);
	this.list = $('ul', this.elem);
	this.errorContainer = $('.errorcontainer', this.elem);
	this.noErrors = $('.placeholder', this.elem);
}
RAWATabErrors.prototype.elem = null;
RAWATabErrors.prototype.tab = null;
RAWATabErrors.prototype.app = null;
RAWATabErrors.prototype.type = null;
RAWATabErrors.prototype.num = null;
RAWATabErrors.prototype.list = null;
RAWATabErrors.prototype.errorContainer = null;
RAWATabErrors.prototype.noErrors = null;
RAWATabErrors.prototype.activate = function() {
	this.tab.addClass('active');
	this.elem.css('display', 'block');
}
RAWATabErrors.prototype.inactivate = function() {
	this.tab.removeClass('active');
	this.elem.css('display', 'none');
}
RAWATabErrors.prototype.clear = function() {
	this.errorContainer.css('display', 'none');
	this.noErrors.css('display', 'block');
}
RAWATabErrors.prototype.showParseError = function( error ) {
	this.noErrors.css('display', 'none');
	this.errorContainer.css('display', 'block');
	
	this.type.text('Parse Error');
	this.num.text(error.errors.length);
	this.list.empty();
	for( var i in error.errors ) {
		var e = error.errors[i];
		var explanation = 'Unexpected \'<span class="unexpected">' + e.token + '</span>\', expecting one of \'<span class="expected">' + e.lookahead.join('</span>\', \'<span class="expected">') + '</span>\'';
		var context = error.input.substr(0,e.offset) + '<span class="unexpected">' + e.token + '</span>' + error.input.substr(e.offset+e.token.length);

		this.list.append( 
			$('<li>')
				.append( $('<div class="explanation">' + explanation + '</div>') )
				.append( $('<div class="context">' + context + '</div>') )
		);
	}
}
RAWATabErrors.prototype.showEvaluationError = function( error ) {
	this.noErrors.css('display', 'none');
	this.errorContainer.css('display', 'block');
	
	this.type.text('Evaluation Error');
	this.num.text(error.errors.length);
	this.list.empty();
	for( var i in error.errors ) {
		var e = error.errors[i];
		var explanation = e.error;
		var context = stringify( e.item );

		this.list.append( 
			$('<li>')
				.append( $('<div class="explanation">' + explanation + '</div>') )
				.append( $('<div class="context">' + context + '</div>') )
		);
	}	
}

RAWALightBox = function( elem, app ) {
	this.elem = $(elem);
	this.app = app;
	
	// Hide when lightbox is clicked
	$(this.elem).click( (function(lightbox) { return function(e) {
		lightbox.hide();
	}})(this));
	
	// Unless the click is in the contents of the lightbox
	$(this.elem).children().click( function(e) { 
		e.stopImmediatePropagation(); 
		e.stopPropagation(); 
	});
	
	// But hide on ESC key-press
	$(window).keydown( (function(lightbox) { return function(e) {
		if( e.keyCode == 27 ) {
			e.preventDefault();
			lightbox.hide();
		}
	}})(this));
}
RAWALightBox.prototype.elem = null;
RAWALightBox.prototype.app = null;
RAWALightBox.prototype.graph = function( tree ) {
	drawGraph('canvas', tree );
	
	$('.canvasContainer', this.elem).css('width', $('.canvasContainer canvas')[0].width );
	$('.canvasContainer .canvasLabel div', this.elem).html( htmlify( tree ) )
	
	$(this.elem).css('display', 'block');
	$('.canvasContainer').css('display', 'block');
}
RAWALightBox.prototype.importRelation = function() {
	$(this.elem).css('display', 'block');
	$('.relationImport').css('display', 'block');
		
	$('.relationImport textarea').val('').focus().one('paste', (function(lb) { return function(e) {
		setTimeout( function() {
			// We wait a bit for the select to update - some times that's better.. 
			// Then we query the event-target for it's value
			var pasted = e.target.value;
			
			// The data pasted is uuuusually newline-delimited for rows, and tab-delimited for columns
			// if it aint, this wont work.
			var data = pasted.split(/\n/g).map(function(row) { return row.split(/\t/g); });
			
			if( data.length ) {
				// Remove rows that only contains empty cells
				data = data.filter(function(row) { return ! row.every(function(cell) { return cell.length == 0; })});
				
				// Remove columns that only contains empty cells
				for( var col=data[0].length-1;col>=0;col-- ) {
					if( data.map( function(row) { return row[col]}).every( function(cell){ return cell.length == 0; }) )
						// All cells in the column is empty, so remove them..
						for( var row in data )
							data[row].splice(col,1);
				}
				
				if( data.length == 0 || data[0].length == 0 ) 
					return lb.hide();
					
				// Create a header for the Relation
				var header = [];
				if( data[0].every( function(cell) { return cell.length == 0 || cell.match(/\D/); } ) ) {
					// All cells in contains something thats not a number, so we use the first row as a 
					// header - not as a row..
					header = data.shift();
				} else {
					// We cant use the first row as a header, so just create one with all "NEW" labels
					for( var i in data[0] ) header.push('NEW');
				}
				
				var relation = new Relation(header, data);
				
				lb.app.importRelation( relation );
				lb.hide();
				
			} else {
				return lb.hide();
			}
		}, 10);
	}})(this)).blur(function() { setTimeout((function(textarea) { return function() { $(textarea).focus(); }})(this), 1);});
}
RAWALightBox.prototype.hide = function() {
	$(this.elem).children('div').css('display', 'none');
	$(this.elem).css('display', 'none');
	$('.relationImport textarea').unbind('paste');
	
}