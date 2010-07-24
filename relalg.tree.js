/*
 * The classes to respresent a tree of the relational algebra expression
 */

Tree = (function() {

	function Relation(name){
		this.name = name;
	}
	Relation.prototype.name = null;


	function Projection( projectionList, relation ) {
		this.projectionList = projectionList;
		this.relation       = relation;
	}
	Projection.prototype.projectionList = null;
	Projection.prototype.relation       = null;


	function Rename( renameList, relation ) {
		this.renameList = renameList;
		this.relation   = relation;
	}
	Rename.prototype.renameList = null;
	Rename.prototype.relation   = null;


	function ProjectionList( initial ) {
		this.list = (initial instanceof Array) ? initial : [initial];
	}
	ProjectionList.prototype.list = null;
	ProjectionList.prototype.add = function( next ) {
		this.list.push(next);
		return this;
	}


	function RenameList( initial ) {
		if( initial instanceof Array && initial[0] instanceof Array ) 
			this.list = initial;
		else
			this.list = [initial];
	}
	RenameList.prototype.list = null;
	RenameList.prototype.add = function( next ) {
		this.list.push(next);
		return this;
	}
	
	
	function Union( left, right ) {
		this.left  = left;
		this.right = right;
	}
	Union.prototype.left  = null;
	Union.prototype.right = null;
	
	return {
		Relation: Relation,
		Projection: Projection,
		Rename: Rename,
		ProjectionList: ProjectionList,
		RenameList: RenameList,
		Union: Union
	}
})();
