/*
 * The parse mixin
 */
define(['../../../parse'], function(Parse) {
  function withParser() {
    this.parse = function(expression) {
      try {
        return Parse(expression)
      } catch (e) {
        this.trigger('parseError', e)
      }
    }
  }
  
  return withParser
})