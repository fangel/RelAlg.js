/**
 * This file contains the main webapp functionality
 */
define(
  ['jquery'
  ,'bootstrap'
  ,'./default-data'
  ,'./components/ui/input'
  ,'./components/ui/relation_list'
  ,'./components/ui/relation_view'
  ,'./components/ui/graph_modal'
  ,'./components/ui/set_selector'
  ,'./components/data/evaluate'
  ,'./components/data/graph'
  ,'./components/data/relations'],
  function(
    jQuery,
    bootstrap,
    defaultData,
    InputUI,
    RelationListUI,
    RelationViewUI,
    GraphModalUI,
    SetSelectorUI,
    EvaluateData,
    GraphData,
    RelationsData
  ) {
    return function() {
      InputUI.attachTo('#input')
      RelationListUI.attachTo('#list')
      RelationViewUI.attachTo('#main')
      GraphModalUI.attachTo('#graph')
      SetSelectorUI.attachTo('#set-selector')
      EvaluateData.attachTo(document)
      GraphData.attachTo('#graph-staging')
      RelationsData.attachTo(document, {sets: defaultData, defaultSet: 'Default data'})
    }
})
