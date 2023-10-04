


async function getInitials(string) {
  string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')
}


module.exports = {
 
  getInitials:getInitials,
 
  
}