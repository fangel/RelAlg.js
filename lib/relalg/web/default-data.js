/*
 * Very simple data-store (aka, a shared object)
 */
define(['../relation'], function(Relation) {
  return {
    'Default': {
      Foo: new Relation(['A', 'B'],
                       [[1,   2],
                        [3,   4]]),
      Bar: new Relation(['A', 'B'],
                       [[1,   2],
                        [5,   6]]),
      Baz: new Relation(['A', 'B', 'C'],
                       [[1,   2,   3],
                        [5,   6,   7]]),
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
    },
    'Address book': {
      People: new Relation(['pid', 'name',    'age', 'aid'],
                          [[1,     'John',    42,    1],
                           [2,     'Victor',  22,    2],
                           [3,     'Jane',    37,    1],
                           [4,     'Anna',    26,    3],
                           [5,     'Lindsey', 32,    4]]),
      Addresses: new Relation(['aid', 'street',           'number', 'zip', 'country'],
                             [[1,     'Long st.',         1200,     87501, 'USA'],
                              [2,     'Blvd. de Poisson', 86,       65120, 'France'],
                              [3,     'Ave. de Beurre',   100,      65120, 'France'],
                              [4,     'Broad Ave.',       587,      87501, 'USA']])
    },
    'RA-sample': {
      /*
       * The sample-query (beers liked by people who does not frequent James Joyce Pub) can be translated to
       *
       * Project[beer] (
       *   (
       *     Project[name] (Drinker)
       *     -
       *     Rename[drinker/name](
       *       Project[drinker](
       *         Select[bar == 'James Joyce Pub'](Frequents)))
       *   )
       *   Join[drinker == name]
       *   Likes
       * )
       */
      'Bar': new Relation(['name',             'address'],
                         [['Down Under Pub',   '802 W. Main Street'],
                          ['The Edge',         '108 Morris Street'],
                          ['James Joyce Pub',  '912 W. Main Street'],
                          ['Satisfaction',     '905 W. Main Street'],
                          ['Talk of the Town', '108 E. Main Street']]),
      'Beer': new Relation(['name',      'brewer'],
                          [['Amstel',    'Amstel Brewery'],
                           ['Budweiser', 'Anheuser-Busch Inc.'],
                           ['Corona',    'Grupo Modelo'],
                           ['Dixie',     'Dixie Brewing'],
                           ['Erdinger',  'Erdinger Weissbrau'],
                           ['Full Sail', 'Full Sail Brewing']]),
      'Drinker': new Relation(['name', 'address'],
                             [['Amy',  '100 W. Main Street'],
                              ['Ben',  '101 W. Main Street'],
                              ['Coy',  '200 S. Duke Street'],
                              ['Dan',  '300 N. Duke Street'],
                              ['Eve',  '100 W. Main Street']]),
      'Frequents': new Relation(['drinker', 'bar',             'times_a_week'],
                               [['Amy',     'James Joyce Pub',  2],
                                ['Ben',     'James Joyce Pub',  1],
                                ['Ben',     'Satisfaction',     2],
                                ['Ben',     'Talk of the Town', 1],
                                ['Coy',     'Down Under Pub',   1],
                                ['Coy',     'The Edge',         1],
                                ['Dan',     'Down Under Pub',   2],
                                ['Dan',     'The Edge',         1],
                                ['Dan',     'James Joyce Pub',  1],
                                ['Dan',     'Satisfaction',     2],
                                ['Dan',     'Talk of the Town', 2],
                                ['Eve',     'James Joyce Pub',  2]]),
      'Serves': new Relation(['bar',              'beer',     'price'],
                            [['Down Under Pub',   'Amstel',    2.75],
                             ['Down Under Pub',   'Budweiser', 2.25],
                             ['Down Under Pub',   'Corona',    3.00],
                             ['The Edge',         'Amstel',    2.75],
                             ['The Edge',         'Budweiser', 2.50],
                             ['The Edge',         'Corona',    3.00],
                             ['James Joyce Pub',  'Amstel',    3.00],
                             ['James Joyce Pub',  'Corona',    3.25],
                             ['James Joyce Pub',  'Dixie',     3.00],
                             ['James Joyce Pub',  'Erdinger',  3.50],
                             ['Satisfaction',     'Amstel',    2.75],
                             ['Satisfaction',     'Budweiser', 2.25],
                             ['Satisfaction',     'Corona',    2.75],
                             ['Satisfaction',     'Dixie',     2.75],
                             ['Satisfaction',     'Full Sail', 2.75],
                             ['Talk of the Town', 'Amstel',    2.50],
                             ['Talk of the Town', 'Budweiser', 2.20]]),
      'Likes': new Relation(['drinker', 'beer'],
                           [['Amy',     'Amstel'],
                            ['Amy',     'Corona'],
                            ['Ben',     'Amstel'],
                            ['Ben',     'Budweiser'],
                            ['Coy',     'Dixie'],
                            ['Dan',     'Amstel'],
                            ['Dan',     'Budweiser'],
                            ['Dan',     'Corona'],
                            ['Dan',     'Dixie'],
                            ['Dan',     'Erdinger'],
                            ['Eve',     'Amstel'],
                            ['Eve',     'Corona']])
    }
  }
})