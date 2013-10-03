/**
 * This file contains the main webapp functionality
 */
define(
  ['jquery'
  ,'bootstrap'
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
    InputUI,
    RelationListUI,
    RelationViewUI,
    GraphModalUI,
    EvaluateData,
    GraphData,
    RelationsData
  ) {
    return function() {
      InputUI.attachTo('#input')
      RelationListUI.attachTo('#list')
      RelationViewUI.attachTo('#main')
      GraphModalUI.attachTo('#graph')
      EvaluateData.attachTo(document)
      GraphData.attachTo('#graph-staging')
      RelationsData.attachTo(document)
    }
})
