define(['parser'], function(Parser) {
  var Parse = function Parse(text) {
    return Parser.parse(text)
  }
  
  return Parse
})