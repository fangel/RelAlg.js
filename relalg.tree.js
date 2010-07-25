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

	function Selection( criteria, relation ) {
		this.criteria = criteria;
		this.relation = relation;
	}
	Selection.prototype.criteria = null;
	Selection.prototype.relation = null;

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
	
	function Intersection( left, right ) {
		this.left  = left;
		this.right = right;
	}
	Intersection.prototype.left  = null;
	Intersection.prototype.right = null;
	
	function Difference( left, right ) {
		this.left  = left;
		this.right = right;
	}
	Difference.prototype.left  = null;
	Difference.prototype.right = null;
	
	
	function Attribute( name ) {
		this.name = name;
	}
	Attribute.prototype.name = null;
	
	function Value( value ) {
		this.value = value;
	}
	Value.prototype.value = null;
	
	function Criteria( left, op, right ) {
		this.left  = left;
		this.op    = op;
		this.right = right;
	}
	Criteria.prototype.left  = null;
	Criteria.prototype.op    = null;
	Criteria.prototype.right = null;
	
	function CriteriaComposition( left, comp, right ) {
			this.left  = left;
			this.comp  = comp;
			this.right = right;
	}
	CriteriaComposition.prototype.left  = null;
	CriteriaComposition.prototype.comp  = null;
	CriteriaComposition.prototype.right = null;
	
	return {
		Relation: Relation,
		Projection: Projection,
		Rename: Rename,
		Selection: Selection,
		ProjectionList: ProjectionList,
		RenameList: RenameList,
		Union: Union,
		Intersection: Intersection,
		Difference: Difference,
		Attribute: Attribute,
		Value: Value,
		Criteria: Criteria,
		CriteriaComposition: CriteriaComposition
	}
})();
