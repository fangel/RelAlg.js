define(['chai', 'relalg/web/components/data/relations', 'relalg/relation'], function(chai, Relations, Relation) {
  var assert = chai.assert
  
  describeComponent('relalg/web/components/data/relations', function() {
    var Foo, Bar, sets

    beforeEach(function() {
      Foo = new Relation(['alpha', 'bravo'], [[1,2], [3,4]])
      Bar = new Relation(['able', 'baker'], [[5,6], [7,8]])
      sets = {
        test: {
          Foo: Foo,
          Bar: Bar
        }
      }
      
    })
    describe("Upon initalization", function() {
      it("Calls dataSetAdded and uiRelationSelected", function() {
        this.component = new this.Component()

        var spy = sinon.spy(this.component, 'trigger')
        
        this.component.initialize(document, {sets: sets, defaultSet: 'test'})
        
        assert.equal(6, spy.callCount)
        assert(spy.calledWithExactly('dataSetAdded', {name: 'test'}))
        assert(spy.calledWithExactly('uiSetSelected', {name: 'test'}))
        assert(spy.calledWithExactly('relationAdded', {name: 'Foo'}))
        assert(spy.calledWithExactly('relationAdded', {name: 'Bar'}))
        assert(spy.calledWithExactly('relationSelected', {name: 'Foo', relation: Foo}))
        assert(spy.calledWithExactly('enviromentChange', {ENV: sets.test}))
        
        this.component.trigger.restore();
      })
    })
    
    describe("After initialization", function() {
      var trigger
      beforeEach(function() {
        setupComponent({sets: sets, defaultSet: 'test'})
        trigger = sinon.spy(this.component, 'trigger')
      })
      afterEach(function() {
        this.component.trigger.restore()
      })
      
      it("Selects a relation on uiRelationSelected", function() {
        this.component.trigger('uiRelationSelected', {name: 'Foo'})

        assert.equal(2, trigger.callCount)
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Foo', relation: Foo}))
      })

      it("Selects a set on uiSetSelected", function() {
        this.component.trigger('uiSetSelected', {name: 'test'})

        assert.equal(7, trigger.callCount)
        assert(trigger.calledWithExactly('uiSetSelected', {name: 'test'}))
        assert(trigger.calledWithExactly('relationRemoved', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationRemoved', {name: 'Bar'}))
        assert(trigger.calledWithExactly('relationAdded', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationAdded', {name: 'Bar'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Foo', relation: Foo}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: sets.test}))
      })
      
      it("Updates the content of a relation on uiCellChanged events", function() {
        var newFoo = new Relation(['alpha', 'bravo'], [['TEST', 2], [3,4]])
        this.component.trigger('uiCellChanged', {relation: 'Foo', row: 0, cell: 0, newValue: 'TEST'})

        assert.equal(4, trigger.callCount)
        assert(trigger.calledWithExactly('uiCellChanged', {relation: 'Foo', row: 0, cell: 0, newValue: 'TEST'}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: {Foo: newFoo, Bar: Bar}}))
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Foo', relation: newFoo}))
      })

      it("Updates the schema of a relation on uiHeaderChanged events", function() {
        var newFoo = new Relation(['a', 'bravo'], [[1, 2], [3,4]])
        this.component.trigger('uiHeaderChanged', {relation: 'Foo', from: 'alpha', to: 'a'})
        
        assert.equal(4, trigger.callCount)
        assert(trigger.calledWithExactly('uiHeaderChanged', {relation: 'Foo', from: 'alpha', to: 'a'}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: {Foo: newFoo, Bar: Bar}}))
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Foo', relation: newFoo}))
      })

      it("Adds a relation on uiAddRelation", function() {
        var newBaz = new Relation([''], [['']])
        this.component.trigger('uiAddRelation', {name: 'Baz'})
        
        assert.equal(5, trigger.callCount)
        assert(trigger.calledWithExactly('uiAddRelation', {name: 'Baz'}))
        assert(trigger.calledWithExactly('relationAdded', {name: 'Baz'}))
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Baz'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Baz', relation: newBaz}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: {Foo: Foo, Bar: Bar, Baz: newBaz}}))
      })
      
      it("Suffixes relation-names when they are already taken", function() {
        var newFoo = new Relation([''], [['']])
        this.component.trigger('uiAddRelation', {name: 'Foo'})
        
        assert.equal(5, trigger.callCount)
        assert(trigger.calledWithExactly('uiAddRelation', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationAdded', {name: 'Foo2'}))
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Foo2'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Foo2', relation: newFoo}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: {Foo: Foo, Bar: Bar, Foo2: newFoo}}))
      })
      
      it("Removes a relation on uiRemoveRelation", function() {
        this.component.trigger('uiRemoveRelation', {name: 'Foo'})
        
        assert.equal(5, trigger.callCount)
        assert(trigger.calledWithExactly('uiRemoveRelation', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationRemoved', {name: 'Foo'}))
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Bar'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Bar', relation: Bar}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: {Bar: Bar}}))
      })

      it("Adds a row on uiAddRow events", function() {
        var newFoo = new Relation(['alpha', 'bravo'], [[1, 2], [3,4], ['', '']])
        this.component.trigger('uiAddRow', {relation: 'Foo'})
        
        assert.equal(4, trigger.callCount)
        assert(trigger.calledWithExactly('uiAddRow', {relation: 'Foo'}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: {Foo: newFoo, Bar: Bar}}))
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Foo', relation: newFoo}))
      })

      it("Adds a column on uiAddColumn events", function() {
        var newFoo = new Relation(['alpha', 'bravo', 'charlie'], [[1, 2, ''], [3,4, ''],])
        this.component.trigger('uiAddColumn', {relation: 'Foo', name: 'charlie'})
        
        assert.equal(4, trigger.callCount)
        assert(trigger.calledWithExactly('uiAddColumn', {relation: 'Foo', name: 'charlie'}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: {Foo: newFoo, Bar: Bar}}))
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Foo', relation: newFoo}))
      })
      
      it("Suffixes the column-name when a column of that name exists", function() {
        var newFoo = new Relation(['alpha', 'bravo', 'alpha_2'], [[1, 2, ''], [3,4, ''],])
        this.component.trigger('uiAddColumn', {relation: 'Foo', name: 'alpha'})
        
        assert.equal(4, trigger.callCount)
        assert(trigger.calledWithExactly('uiAddColumn', {relation: 'Foo', name: 'alpha'}))
        assert(trigger.calledWithExactly('enviromentChange', {ENV: {Foo: newFoo, Bar: Bar}}))
        assert(trigger.calledWithExactly('uiRelationSelected', {name: 'Foo'}))
        assert(trigger.calledWithExactly('relationSelected', {name: 'Foo', relation: newFoo}))
      })
    })
  })
})