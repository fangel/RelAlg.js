/**
 * This file contains the main webapp functionality
 */
define(
  ['jquery'
  ,'bootstrap'
  ,'./store'
  ,'./components/ui/input'
  ,'./components/ui/relation_list'
  ,'./components/ui/relation_view'
  ,'./components/ui/graph_modal'
  ,'./components/data/evaluate'
  ,'./components/data/graph'
  ,'./components/data/relations'],
  function(
    jQuery,
    bootstrap,
    dataStore,
    InputUI,
    RelationListUI,
    RelationViewUI,
    GraphModalUI,
    EvaluateData,
    GraphData,
    RelationsData
  ) {
    return function() {
      InputUI.attachTo('#input', {dataStore: dataStore})
      RelationListUI.attachTo('#list')
      RelationViewUI.attachTo('#main', {dataStore: dataStore})
      GraphModalUI.attachTo('#graph')
      EvaluateData.attachTo(document, {dataStore: dataStore})
      GraphData.attachTo('#graph-staging')
      RelationsData.attachTo(document, {dataStore: dataStore})
    }
})
