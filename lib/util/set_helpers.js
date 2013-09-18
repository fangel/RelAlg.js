define(['deep-equal'], function(deepEqual) {
  var SetHelpers = {}

  SetHelpers.Difference = function SetDifference(A, B) {
    return A.filter(function(a) {
      return ! B.some(function(b) {
        return deepEqual(a, b)
      })
    })
  }

  SetHelpers.Intersection = function SetIntersection(A, B) {
    return A.filter(function(a) {
      return B.some(function(b) {
        return deepEqual(a, b)
      })
    })
  }

  SetHelpers.Duplicates = function SetDuplicates(A) {
    var useCount = A.reduce(function(obj, val) {
          obj[val] = obj[val] !== undefined ? obj[val] + 1 : 1
          return obj
        }, {})
      , duplicates = []
    for (var i in useCount)
      if (useCount[i] > 1)
        duplicates.push(i)
    return duplicates
  }

  SetHelpers.Union = function SetUnion(A, B) {
    return A.concat(SetHelpers.Difference(B, A))
  }

  return SetHelpers
})