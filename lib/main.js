require.config({
  paths: {
    "vendor": "../vendor"
  },
  shim: {
    'vendor/d3': {
      exports: 'd3'
    }
  }
});

define(['parser', 'relation', 'evaluate', 'web/graph', 'util/htmlify'], function(Parser, Relation, evaluate, graph, htmlify) {
  var res = Parser.parse("Rename[bar->baz](Project[foo, bar](R1 - R2) Intersect (R2 Union R1))");
  
  Relation.add('R1', new Relation(['foo', 'bar'], [[0, 1], [2, 3], [4, 5]]));
  Relation.add('R2', new Relation(['foo', 'bar'], [[0, 1], [2, 3], [6, 7]]));
  
  console.log("" + evaluate(res));
  document.getElementById('lbl').innerHTML = htmlify(res)
  graph(res, '#graph');
  
  var res2 = Parser.parse("Rename[foo->alpha,bar->bravo]([['foo', 'bar'] -> [1,2], [3,4]])");
  console.log(inspect(res2));
  console.log("" + evaluate(res2));
})