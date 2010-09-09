function RAWebApp( relation_manager ) {
	this.relationManager = relation_manager;
	
	this.table = new RAWATable( $('.table table'), this );
	$('.table table').bind('cellChange headerChange', (function(app) { return function() {
		Relation.add( app.list.selected, app.table.read() );
	}})(this));
	
	this.list  = new RAWAList( $('.sidebar .list ul'), $('#add'), $('#remove'), this );
	this.list.fill( this.relationManager.storage );
	
	this.lightbox = new RAWALightBox( $('.lightbox'), this );
	
	this.tabs.input = new RAWATabInput( $('.tabcontents .input'), $('.tabs ul'), 'input', this );
	this.tabs.history = new RAWATabHistory( $('.tabcontents .history'), $('.tabs ul'), 'history', this );
	this.tabs.errors = new RAWATabErrors( $('.tabcontents .errors'), $('.tabs ul'), 'errors', this );	
	this.tab('input');
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
		this.list.fill( this.relationManager.storage, this.list.selected );
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
		this.listElem.append( $('<li />').text(i).click( (function(rel, l) { return function() { l.select(rel) }})(i, this) ) );
		if( first && ! select ) this.select( i );
		if( select == i ) this.select( i );
		first = false;
	}
}
RAWAList.prototype.select = function( name ) {
	$('li:contains(' + this.selected + ')', this.listElem).removeClass('active').unbind('click').click( (function(rel, l) { return function() { l.select(rel) }})(this.selected, this));
	$('li:contains(' + name +')', this.listElem).addClass('active').unbind('click').click( (function(l) { return function() { l.startEdit(this) }})(this) );
	this.selected = name;
	this.app.load( name );
}
RAWAList.prototype.startEdit = function( li_elem ) {
	$(li_elem).unbind('click');
	
	$(li_elem).empty().append( $('<input type="text" />').val(this.selected) );
	$('input', $(li_elem)).focus().blur( (function(l, el) { return function() { l.stopEdit(el); }})(this, li_elem));
}
RAWAList.prototype.stopEdit = function( li_elem ) {
	var newName = $('input', $(li_elem)).val();
	$(li_elem).empty().text( newName ).click( (function(l) { return function() { l.startEdit(this) }})(this) );
	this.app.rename( this.selected, newName )
	this.selected = newName;
}
RAWAList.prototype.remove = function() {
	var li = $('li:contains(' + this.selected + ')', this.listElem);
	var next = li.next('li');
	var prev = li.prev('li');
	var select = (next.length) ? next.text() : (prev.length) ? prev.text() : null;
	
	this.app.remove( this.selected, select );
}
RAWAList.prototype.add = function( name ) {
	if( name == undefined ) {
		// Add the li and 
		$('li:contains(' + this.selected + ')', this.listElem).removeClass('active')
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
	$('.canvasContainer', this.elem).click( function(e) { 
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
}
RAWALightBox.prototype.hide = function() {
	$(this.elem).css('display', 'none');
}