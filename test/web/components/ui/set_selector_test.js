define(['chai', 'relalg/web/components/ui/set_selector'], function(chai, SetSelectorUI) {
  var assert = chai.assert
    , fixture = '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Datasets <b class="caret"></b></a>' + "\n" + 
                '<ul class="dropdown-menu">' + "\n"
                '</ul>'
  
  describeComponent('relalg/web/components/ui/set_selector', function () {
    beforeEach(function() {
      setupComponent(fixture)
    })
    it("Initially starts out empty", function() {
      assert.equal(0, this.component.select('linkSelector').length)
    })
    it("Adds sets on dataSetAdded events", function() {
      this.component.trigger('dataSetAdded', {name: 'Foo'})
      assert.equal(1, this.component.select('linkSelector').length)
      assert.equal("Foo", $(this.component.select('linkSelector')[0]).html())
      assert.equal("Foo", $(this.component.select('linkSelector')[0]).data('set'))

      this.component.trigger('dataSetAdded', {name: 'Bar'})
      assert.equal(2, this.component.select('linkSelector').length)
      assert.equal("Foo", $(this.component.select('linkSelector')[0]).html())
      assert.equal("Foo", $(this.component.select('linkSelector')[0]).data('set'))
      assert.equal("Bar", $(this.component.select('linkSelector')[1]).html())
      assert.equal("Bar", $(this.component.select('linkSelector')[1]).data('set'))
    })

    it("Triggers the uiSetSelected event when sets are clicked", function() {
      this.component.trigger('dataSetAdded', {name: 'Foo'})
      this.component.trigger('dataSetAdded', {name: 'Bar'})

      var spy = sinon.spy(this.component, 'trigger')

      $(this.component.select('linkSelector')[0]).click()
      assert(spy.calledOnce)
      assert(spy.calledWithExactly('uiSetSelected', {name: 'Foo'}))

      $(this.component.select('linkSelector')[1]).click()
      assert(spy.calledTwice)
      assert(spy.calledWithExactly('uiSetSelected', {name: 'Bar'}))

      this.component.trigger.restore()
    })
  })
})