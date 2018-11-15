const coverages = process.argv.reduce((results, line, k) => {
  if (line === 'files' && process.argv[k - 1] === 'All') {
    return [];
  }
  if (Array.isArray(results) && results.length < 4 && line.match(/[0-9-]+/)) {
    results.push(+line);
  }

  return results;
}, null);

const total = coverages.reduce((mem, val) => mem + val, 0);
const average = total / coverages.length;

if (average < 75) {
  console.log('insufficient coverage');
  process.exit(1);
}
