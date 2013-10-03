/*
 * Very simple data-store (aka, a shared object)
 */
define(['../relation'], function(Relation) {
  return {
    Foo: new Relation(
      ['alpha', 'b', 'c'],
      [[1, 2, 3],
       [4, 5, 6],
       [7, 8, 99]]
    ),
    Bar: new Relation(
      ['a', 'bravo', 'c'],
      [[1, 2, 3],
       [44, 5, 6],
       [7, 8, 9]]
    ),
    Baz: new Relation(
      ['a', 'b', 'charlie'],
      [[1, 22, 3],
       [4, 5, 6],
       [7, 8, 9]]
    ),
    A: new Relation(
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
    ),
    B1: new Relation(
      ['pno'],
      [['p2']]
    ),
    B2: new Relation(
      ['pno'],
      [['p2'],
       ['p4']]
    ),
    B3: new Relation(
      ['pno'],
      [['p1'],
       ['p2'],
       ['p4']]
    )
  }
})