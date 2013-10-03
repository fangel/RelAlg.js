/*
 * This file contains the input-component, responsible for handling the main
 * area for entering expressions into..
 */
define(['flight/lib/component', 'ace/ace', '../../../relation'], function(defineComponent, ace, Relation)  {
  return defineComponent(input)

  function input() {
    var editor

    this.defaultAttrs({
          evaluateSelector: '.evaluate',
          graphSelector: '.graph',
          editorSelector: '#editor',
        })
      
    this.getInput = function() {
      return editor.getValue()
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
      var mode = editor.getSession().getMode()
      if (mode.setEnviroment) mode.setEnviroment(Relation.storage)
    }

    this.after('initialize', function() {
      editor = ace.edit(this.select('editorSelector')[0].id)
      editor.setShowPrintMargin(false)
      editor.getSession().setMode("web/components/ace/mode")
      editor.getSession().once('changeMode', function() {
        var mode = editor.getSession().getMode()
        mode.on('ok', this.ok.bind(this))
        mode.on('parse_error', this.parseError.bind(this))
        mode.on('type_error', this.typeError.bind(this))
        mode.setEnviroment(Relation.storage)
      }.bind(this))

      this.on('click', {
        evaluateSelector: this.evaluate,
        graphSelector: this.graph,
      })
      this.on(document, 'enviromentChange', this.enviromentChange)
    })
  }
})