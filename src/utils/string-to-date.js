String.prototype.toDate = function() {
  var lists = this.split('-')
  var date = new Date(parseInt(lists[0]), parseInt(lists[1]) - 1, parseInt(lists[2]))
  return date
}
