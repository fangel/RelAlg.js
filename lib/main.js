require(['parser', 'relation', 'evaluate', 'util/inspect', 'util/htmlify', 'util/stringify'], function(Parser, Relation, evaluate, inspect, htmlify, stringify) {
  var res = Parser.parse("R1 Intersect R2");
  
  Relation.add('R1', new Relation(['foo', 'bar'], [[0, 1], [2, 3], [4, 5]]));
  Relation.add('R2', new Relation(['foo', 'bar'], [[0, 1], [2, 3], [6, 7]]));
  
  console.log("" + evaluate(res));
})