/**
 * This file contains the main webapp functionality
 */
define(
  ['jquery'
  ,'bootstrap'
  ,'web/components/ui/input'
  ,'web/components/ui/relation_list'
  ,'web/components/ui/relation_view'
  ,'web/components/ui/graph_modal'
  ,'web/components/data/evaluate'
  ,'web/components/data/graph'
  ,'web/components/data/relations'], 
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
