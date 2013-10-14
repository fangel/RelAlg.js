define(['chai', 'relalg/web/components/ui/relation_view', 'relalg/relation'], function(chai, RelationViewUI, Relation) {
  var assert = chai.assert
    , fixture = '<h1></h1>' + "\n" +
                '<table class="table table-bordered table-hover">' + "\n" +
                '  <thead>' + "\n" +
                '  </thead>' + "\n" +
                '  <tbody>' + "\n" +
                '  </tbody>' + "\n" +
                '</table>' + "\n" +
                '<button class="btn btn-default btn-sm addRow">Add Row</button>' + "\n" +
                '<button class="btn btn-default btn-sm addColumn">Add Column</button>'
    , Foo = new Relation(['alpha', 'bravo'], [[1,2], [3,4]])

  describeComponent('relalg/web/components/ui/relation_view', function() {
    beforeEach(function() {
      setupComponent(fixture)
    })
    
    it("Initially starts out empty", function() {
      assert.equal("", this.component.select('title').html())
      assert.equal(0, this.component.select('headerCell').length)
      assert.equal(0, this.component.select('bodyCell').length)
    })
    
    it("Will display a relation after it is selected", function() {
      this.component.trigger('relationSelected', {name: 'Foo', relation: Foo})
      assert.equal("Foo", this.component.select('title').html())
      assert.equal(2, this.component.select('headerCell').length)
      assert.equal("alpha", $(this.component.select('headerCell')[0]).html())
      assert.equal("bravo", $(this.component.select('headerCell')[1]).html())

      assert.equal(4, this.component.select('bodyCell').length)
      assert.equal("1", $(this.component.select('bodyCell')[0]).html())
      assert.equal("2", $(this.component.select('bodyCell')[1]).html())
      assert.equal("3", $(this.component.select('bodyCell')[2]).html())
      assert.equal("4", $(this.component.select('bodyCell')[3]).html())      
    })
    
    it("Header cells are editable", function() {
      this.component.trigger('relationSelected', {name: 'Foo', relation: Foo})
      var spy = sinon.spy(this.component, 'trigger')
        , cell = $(this.component.select('headerCell')[0])
      assert.equal("alpha", cell.html())

      // Simulate a click to the cell
      cell.click()
      assert.equal("<input type=\"text\">", cell.html())
      var input = $('input', cell)
      assert.equal("alpha", input.val())

      // Alter the value, and "deselect" the cell
      input.val("able").blur()

      // Check that the uiHeaderChanged event was called
      assert(spy.calledOnce)
      assert(spy.calledWithExactly('uiHeaderChanged', {relation: 'Foo', from: 'alpha', to: 'able'}))

      this.component.trigger.restore()
    })

    it("Body cells are editable", function() {
      this.component.trigger('relationSelected', {name: 'Foo', relation: Foo})
      var spy = sinon.spy(this.component, 'trigger')
        , cell = $(this.component.select('bodyCell')[2])
      assert.equal("3", cell.html())

      // Simulate a click to the cell
      cell.click()
      assert.equal("<input type=\"text\">", cell.html())
      var input = $('input', cell)
      assert.equal("3", input.val())

      // Alter the value, and "deselect" the cell
      input.val("33").blur()

      // Check that the uiCellChanged event was called
      assert(spy.calledOnce)
      assert(spy.calledWithExactly('uiCellChanged', {relation: 'Foo', row: 1, cell: 0, newValue: '33'}))

      this.component.trigger.restore()
    })
    
    it("Adding a column triggers uiAddColumn", function() {
      this.component.trigger('relationSelected', {name: 'Foo', relation: Foo})
      var spy = sinon.spy(this.component, 'trigger')
        , stub = sinon.stub(window, 'prompt').returns('new_column')
      
      this.component.select('addColumn').click();

      assert(spy.calledOnce)
      assert(spy.calledWithExactly('uiAddColumn', {relation: 'Foo', name: 'new_column'}))

      this.component.trigger.restore();
      window.prompt.restore()
    })
  
    it("Adding a row triggers uiAddRow", function() {
      this.component.trigger('relationSelected', {name: 'Foo', relation: Foo})
      var spy = sinon.spy(this.component, 'trigger')
      
      this.component.select('addRow').click();

      assert(spy.calledOnce)
      assert(spy.calledWithExactly('uiAddRow', {relation: 'Foo'}))

      this.component.trigger.restore();
    })
  })
})