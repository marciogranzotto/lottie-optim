const traverse = require('traverse');
const REMOVE = ['nm', 'mn', 'ix', 'np', 'cix'];
const REMOVE_K = ['r', 's'];

module.exports = function compress(input, maxPrecision = 2) {
  let nodesDeleted = 0;

  if (typeof input === 'string') input = JSON.parse(input);

  const inputBytes = JSON.stringify(input).length;

  const outputObject = traverse(input).forEach(function(node) {
    if (this.key === 'hd' && node === false) {
      nodesDeleted++;
      return this.delete();
    }

    if (REMOVE.includes(this.key)) {
      nodesDeleted++;
      return this.delete();
    }

    if (this.parent != null && this.parent.key === 'k' && REMOVE_K.includes(this.key)) {
      nodesDeleted++;
      return this.delete();
    }

    if (typeof node === 'number') {
      // Don't round color nodes
      if (
        this.parent != null &&
        this.parent.key === 'k' &&
        this.parent.parent != null &&
        this.parent.parent.key === 'c'
      )
        return;

      return this.update(round(node, maxPrecision));
    }
  });

  const output = JSON.stringify(outputObject);
  const outputBytes = output.length;

  return {output, outputObject, inputBytes, outputBytes, nodesDeleted};
};

function round(value = 0, decimals = 0) {
  multiplier=Math.pow(10, decimals)
  return Math.round(value*multiplier)/multiplier
}
