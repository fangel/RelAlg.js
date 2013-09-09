/*
 * The parse mixin
 */
define(['parser'], function(Parser) {
  function withParser() {
    this.parse = function(expression) {
      try {
        return Parser.parse(expression)
      } catch (e) {
        this.trigger('parseError', e)
      }
    }
  }
  
  return withParser
})