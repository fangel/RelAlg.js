define(['chai', 'relalg/web/components/ui/relation_list'], function(chai, RelationListUI) {
  var assert = chai.assert
    , fixture = '<ul class="nav nav-list">' + "\n" + 
                '  <li class="nav-header">Relations</li>' + "\n" + 
                '    <li class="divider"></li>' + "\n" + 
                '    <li style="text-align: center">' + "\n" + 
                '    <div class="btn-group btn-group-sm">' + "\n" + 
                '      <button class="btn btn-default add"><i class="icon-plus"></i>Add</button>' + "\n" + 
                '      <button class="btn btn-default remove"><i class="icon-trash"></i>Remove</button>' + "\n" + 
                '    </div>' + "\n" + 
                '  </li>' + "\n" + 
                '</ul>'
  
  describeComponent('relalg/web/components/ui/relation_list', function () {
    beforeEach(function() {
      setupComponent(fixture)
    })
    describe('The RelationList component', function () {
      it('Should contain 0 relations initially', function () {
        assert.equal(0, this.component.$node.find('.relation').length)
      })
      it('Should contain 1 relation after a relationAdded event', function () {
        this.component.trigger('relationAdded', {name: 'TestRelation'})
        assert.equal(1, this.component.$node.find('.relation').length)
        assert.equal('TestRelation', this.component.$node.find('.relation').data('relation'))
        assert.equal('TestRelation', this.component.$node.find('.relation a').html())
        assert.isFalse(this.component.$node.find('.relation').hasClass('active'))
      })
      it('Should contain 2 relation after two relationAdded events', function () {
        this.component.trigger('relationAdded', {name: 'Foo'})
        this.component.trigger('relationAdded', {name: 'Bar'})
        assert.equal(2, this.component.$node.find('.relation').length)
        this.component.$node.find('.relation').each(function(i, elem) {
          if (i === 0) {
            // The Foo relation
            assert.equal('Foo', $(elem).data('relation'))
            assert.equal('Foo', $('a', elem).html())
          } else {
            // The Bar relation
            assert.equal('Bar', $(elem).data('relation'))
            assert.equal('Bar', $('a', elem).html())
          }
          assert.isFalse($(elem).hasClass('active'))
        })
      })
      it("Can mark relations as active on relationSelected events", function() {
        this.component.trigger('relationAdded', {name: 'Foo'})
        this.component.trigger('relationAdded', {name: 'Bar'})
        assert.equal(0, this.component.$node.find('.relation.active').length)

        this.component.trigger('relationSelected', {name: 'Bar'})
        assert.equal(1, this.component.$node.find('.relation.active').length)
        assert.equal('Bar', this.component.$node.find('.relation.active').data('relation'))
        assert.equal('Bar', this.component.$node.find('.relation.active a').html())

        this.component.trigger('relationSelected', {name: 'Foo'})
        assert.equal(1, this.component.$node.find('.relation.active').length)
        assert.equal('Foo', this.component.$node.find('.relation.active').data('relation'))
        assert.equal('Foo', this.component.$node.find('.relation.active a').html())
      })
      it("Can remove relations on relationRemoved events", function() {
        this.component.trigger('relationAdded', {name: 'Foo'})
        this.component.trigger('relationAdded', {name: 'Bar'})
        assert.equal(2, this.component.$node.find('.relation').length)

        this.component.trigger('relationRemoved', {name: 'Bar'})
        assert.equal(1, this.component.$node.find('.relation').length)

        this.component.trigger('relationRemoved', {name: 'Foo'})
        assert.equal(0, this.component.$node.find('.relation').length)
      })
      it("Triggers relationSelected when you click on events", function() {
        this.component.trigger('relationAdded', {name: 'Foo'})

        var spy = sinon.spy(this.component, 'trigger')
        this.component.$node.find('.relation a').click()
        
        assert(spy.calledOnce)
        assert(spy.calledWithExactly('uiRelationSelected', {name: 'Foo'}))
        
        this.component.trigger.restore();
      })
      it("Triggers uiAddRelation when you add new relations", function() {
        var spy = sinon.spy(this.component, 'trigger')
          , stub = sinon.stub(window, 'prompt').returns('NewRelation')
        this.component.select('addSelector').click()
        
        assert(spy.calledOnce)
        assert(spy.calledWithExactly('uiAddRelation', {name: 'NewRelation'}))
        
        this.component.trigger.restore();
        window.prompt.restore()
      })
      it("Triggers uiRemoveRelation when you confirm deletion of a relation", function() {
        this.component.trigger('relationAdded', {name: 'Foo'})
        this.component.trigger('relationSelected', {name: 'Foo'})

        var spy = sinon.spy(this.component, 'trigger')
          , stub = sinon.stub(window, 'confirm').returns(true)
        this.component.select('removeSelector').click()

        assert(spy.calledOnce)
        assert(spy.calledWithExactly('uiRemoveRelation', {name: 'Foo'}))

        this.component.trigger.restore();
        window.confirm.restore()
      })
      it("Does not triggers uiRemoveRelation when you decline to remove a relation", function() {
        this.component.trigger('relationAdded', {name: 'Foo'})
        this.component.trigger('relationSelected', {name: 'Foo'})

        var spy = sinon.spy(this.component, 'trigger')
          , stub = sinon.stub(window, 'confirm').returns(false)
        this.component.select('removeSelector').click()

        assert.isFalse(spy.called)

        this.component.trigger.restore();
        window.confirm.restore()
      })
    })
  })
})