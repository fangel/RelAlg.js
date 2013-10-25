define(['chai', 'relalg/web/components/ui/input', 'relalg/relation'], function(chai, InputUI, Relation) {
  var assert = chai.assert
    , fixture = '<div class="row">' + "\n" + 
                '  <div class="col-md-8 col-md-offset-2">' + "\n" + 
                '    <div id="editor"></div>' + "\n" + 
                '  </div>' + "\n" + 
                '  <div class="col-md-2">' + "\n" + 
                '    <ul class="list-unstyled actions">' + "\n" + 
                '      <li><button class="btn btn-primary evaluate">Evaluate</button></li>' + "\n" + 
                '      <li><button class="btn btn-default graph">Graph</button></li>' + "\n" + 
                '    </ul>' + "\n" + 
                '  </div>' + "\n" + 
                '</div>'
    , Foo = new Relation(['alpha', 'bravo'], [[1,2], [3,4]])

  describeComponent('relalg/web/components/ui/input', function() {
    beforeEach(function(done) {
      setupComponent(fixture)

      var mode = this.component.editor.getSession().getMode().$id
      if (mode == 'web/components/ace/mode') {
        this.component.trigger('enviromentChange', {ENV: {'Foo': Foo}})
        done()
      } else {
        this.component.editor.getSession().on('changeMode', function() {
          done()
        })
      }
    })
    
    it("Initializes the Ace editor", function() {
      assert.notEqual("", this.component.select('editorSelector').html())
      assert.equal("", this.component.getInput())
      assert.isDefined(this.component.editor)
      assert.equal('web/components/ace/mode', this.component.editor.getSession().getMode().$id)
    })
    
    // Sadly, I haven't found a reliable way to test how the Ace web-worker
    // tests the input
    // This is because the WebWorker works on a deferred schedule, so it wont
    // update immediately, and you are very prone to getting emits from old 
    // values if you just bind to listen to the emitted events from the mode
    
    it("Has both evaluate and graph enabled on valid expressions", function() {
      this.component.ok();
      assert.isUndefined(this.component.select('evaluateSelector').attr('disabled'))
      assert.isUndefined(this.component.select('graphSelector').attr('disabled'))
    })

    it("Has only the graph enabled on expression with type-errors", function() {
      this.component.typeError();
      assert.equal('disabled', this.component.select('evaluateSelector').attr('disabled'))
      assert.isUndefined(this.component.select('graphSelector').attr('disabled'))
    })

    it("Has both evaluate graph disabled on expression with parse-errors", function() {
      this.component.parseError();
      assert.equal('disabled', this.component.select('evaluateSelector').attr('disabled'))
      assert.equal('disabled', this.component.select('graphSelector').attr('disabled'))
    })
    
    it("Calls the evalute event, when the button is clicked", function() {
      this.component.ok()
      this.component.editor.getSession().setValue('TestValue')
      var spy = sinon.spy(this.component, 'trigger')
      this.component.select('evaluateSelector').click()

      assert(spy.calledOnce)
      assert(spy.calledWithExactly('evaluate', {expression: 'TestValue'}))

      this.component.trigger.restore()
    })

    it("Calls the graph event, when the button is clicked", function() {
      this.component.ok()
      this.component.editor.getSession().setValue('TestValue')
      var spy = sinon.spy(this.component, 'trigger')
      this.component.select('graphSelector').click()

      assert(spy.calledOnce)
      assert(spy.calledWithExactly('graph', {expression: 'TestValue'}))

      this.component.trigger.restore()
    })
  })
})