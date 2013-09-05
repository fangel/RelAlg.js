require.config({
  paths: {
    "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
    "jquery": "../bower_components/jquery/jquery",
    "flight": "../bower_components/flight",
    "d3": "../bower_components/d3/d3"
  },
  shim: {
    'd3': {
      exports: 'd3'
    },
    'bootstrap': {
      deps: ['jquery']
    }
  }
});

define(['web/app', 'relation'], function(initialize, Relation) {
  /*
  var res = Parser.parse("Rename[bar->baz](Project[foo, bar](R1 - R2) Intersect (R2 Union R1))");
  
  Relation.add('R1', new Relation(['foo', 'bar'], [[0, 1], [2, 3], [4, 5]]));
  Relation.add('R2', new Relation(['foo', 'bar'], [[0, 1], [2, 3], [6, 7]]));
  
  console.log("" + evaluate(res));
  document.getElementById('lbl').innerHTML = htmlify(res)
  graph(res, '#graph');
  
  var res2 = Parser.parse("Foo := Rename[foo->alpha,bar->bravo]([['foo', 'bar'] -> [1,2], [3,4]])");
  console.log(inspect(res2));
  console.log("" + evaluate(res2));
  
  var res3 = Parser.parse("Foo");
  console.log("" + evaluate(res3));
  */
  
  Relation.add('Foo', new Relation(
  	['alpha', 'b', 'c'],
  	[[1, 2, 3],
  	 [4, 5, 6],
  	 [7, 8, 99]]
  ));

  Relation.add('Bar', new Relation(
  	['a', 'bravo', 'c'],
  	[[1, 2, 3],
  	 [44, 5, 6],
  	 [7, 8, 9]]
  ));

  Relation.add('Baz', new Relation(
  	['a', 'b', 'charlie'],
  	[[1, 22, 3],
  	 [4, 5, 6],
  	 [7, 8, 9]]
  ));

  Relation.add('A', new Relation(
  	['sno', 'pno'],
  	[['s1', 'p1'],
  	 ['s1', 'p2'],
  	 ['s1', 'p3'],
  	 ['s1', 'p4'],
  	 ['s2', 'p1'],
  	 ['s2', 'p2'],
  	 ['s3', 'p2'],
  	 ['s4', 'p2'],
  	 ['s4', 'p4']]
  ));

  Relation.add('B1', new Relation(
  	['pno'],
  	[['p2']]
  ));

  Relation.add('B2', new Relation(
  	['pno'],
  	[['p2'],
  	 ['p4']]
  ));

  Relation.add('B3', new Relation(
  	['pno'],
  	[['p1'],
  	 ['p2'],
  	 ['p4']]
  ));
  
  initialize()
})