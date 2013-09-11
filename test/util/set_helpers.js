var assert = require("assert")
  , requirejs = require("requirejs")

requirejs.config({
  baseUrl: __dirname + "/../../lib",
});

var SetHelper = requirejs("util/set_helpers")

describe("Set Helper Function", function() {
  describe("Union", function() {
    it("Should contain the union of the two sets", function() {
      assert.deepEqual([], SetHelper.Union([], []))
      assert.deepEqual([1], SetHelper.Union([1], []))
      assert.deepEqual([1], SetHelper.Union([], [1]))
      assert.deepEqual([1, 2], SetHelper.Union([1], [2]))
    })
    it("Should not contain duplicates when both sites contains the same item", function() {
      assert.deepEqual([1], SetHelper.Union([1], [1]))
      assert.deepEqual([1, 2], SetHelper.Union([1, 2], [1]))
      assert.deepEqual([1, 2], SetHelper.Union([1, 2], [1, 2]))
      assert.deepEqual([1, 2], SetHelper.Union([1, 2], [2, 1]))
    })
  })
  describe("Difference", function() {
    it("Should return [] when both sets contains the same", function() {
      assert.deepEqual([], SetHelper.Difference([], []))
      assert.deepEqual([], SetHelper.Difference([1], [1]))
      assert.deepEqual([], SetHelper.Difference([1, 2], [1, 2]))
    })
    it("Should return anything that is only on the LHS", function() {
      assert.deepEqual([1], SetHelper.Difference([1], []))
      assert.deepEqual([1], SetHelper.Difference([1, 2], [2]))
      assert.deepEqual([2], SetHelper.Difference([1, 2], [1]))
    })
    it("Should return [] when the LHS is contained in the RHS", function() {
      assert.deepEqual([], SetHelper.Difference([], [1]))
      assert.deepEqual([], SetHelper.Difference([1], [1, 2]))
      assert.deepEqual([], SetHelper.Difference([2], [1, 2]))
    })
  })
  describe("Intersection", function() {
    it("Should return everything when both sets contains the same", function() {
      assert.deepEqual([], SetHelper.Intersection([], []))
      assert.deepEqual([1], SetHelper.Intersection([1], [1]))
      assert.deepEqual([1, 2], SetHelper.Intersection([1, 2], [1, 2]))
    })
    it("Should return [] when both sets contains disjoint sets", function() {
      assert.deepEqual([], SetHelper.Intersection([1], [2]))
      assert.deepEqual([], SetHelper.Intersection([1, 3], [2]))
      assert.deepEqual([], SetHelper.Intersection([1, 2], [3, 4]))
    })
    it("Should return the intersection when both slightly overlap", function() {
      assert.deepEqual([1], SetHelper.Intersection([1], [2, 1]))
      assert.deepEqual([3], SetHelper.Intersection([1, 3], [2, 3]))
      assert.deepEqual([4], SetHelper.Intersection([1, 2, 4], [3, 4]))
    })
  })
  describe("Duplicates", function() {
    it("Should return [] when no duplicates", function() {
      assert.deepEqual([], SetHelper.Duplicates([]))
      assert.deepEqual([], SetHelper.Duplicates([1]))
      assert.deepEqual([], SetHelper.Duplicates([1, 2]))
    })
    it("Should return the duplicates when there are any", function() {
      assert.deepEqual([1], SetHelper.Duplicates([1, 1]))
      assert.deepEqual([1], SetHelper.Duplicates([1, 2, 1]))
      assert.deepEqual([1, 2], SetHelper.Duplicates([1, 2, 1, 2]))
    })
  })
})