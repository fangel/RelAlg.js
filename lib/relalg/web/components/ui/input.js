/*
 * This file contains the input-component, responsible for handling the main
 * area for entering expressions into..
 */
define(['flight/lib/component', 'ace/ace', '../../../relation'], function(defineComponent, ace, Relation)  {
  return defineComponent(input)

  function input() {
    this.editor = undefined

    this.defaultAttrs({
          evaluateSelector: '.evaluate',
          graphSelector: '.graph',
          editorSelector: '#editor',
          dataStore: undefined
        })
      
    this.getInput = function() {
      return this.editor.getValue()
    }
        
    this.evaluate = function(e) {
      this.trigger('evaluate', {
        expression: this.getInput()
      })
    }
        
    this.graph = function(e) {
      this.trigger('graph', {
        expression: this.getInput()
      })
    }

    this.ok = function() {
      this.select('graphSelector').attr('disabled', null)
      this.select('evaluateSelector').attr('disabled', null)
    }

    this.parseError = function(error) {
      this.select('graphSelector').attr('disabled', 'disabled')
      this.select('evaluateSelector').attr('disabled', 'disabled')
    }

    this.typeError = function(error) {
      this.select('graphSelector').attr('disabled', null)
      this.select('evaluateSelector').attr('disabled', 'disabled')
    }

    this.enviromentChange = function(e, data) {
      var mode = this.editor.getSession().getMode()
      if (mode.setEnviroment) mode.setEnviroment(this.attr.dataStore)
    }

    this.after('initialize', function() {
      this.editor = ace.edit(this.select('editorSelector')[0].id)
      this.editor.setShowPrintMargin(false)
      this.editor.getSession().setMode("web/components/ace/mode")
      this.editor.getSession().on('changeMode', function() {
        var mode = this.editor.getSession().getMode()
        mode.on('ok', this.ok.bind(this))
        mode.on('parse_error', this.parseError.bind(this))
        mode.on('type_error', this.typeError.bind(this))
        mode.setEnviroment(this.attr.dataStore)
      }.bind(this))

      this.on('click', {
        evaluateSelector: this.evaluate,
        graphSelector: this.graph,
      })
      this.on(document, 'enviromentChange', this.enviromentChange)
    })
  }
})