function resolveInputs(inputs, results) {
  const resolvedInputs = {};

  for (const [key, value] of Object.entries(inputs)) {
    console.log(`Resolving input for key: ${key}, value: ${value}`);
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
      const path = value.slice(2, -1).split('.');
      console.log(`Resolving path: ${path}`);
      let resolvedValue = results;
      for (const segment of path) {
        if (resolvedValue === undefined) {
          console.log(`Resolved value became undefined at segment: ${segment}`);
          break;
        }
        resolvedValue = resolvedValue[segment];
        console.log(`Resolved value after segment ${segment}:`, resolvedValue);
      }
      resolvedInputs[key] = resolvedValue;
    } else {
      resolvedInputs[key] = value;
    }
    console.log(`Resolved input for ${key}:`, resolvedInputs[key]);
  }

  return resolvedInputs;
}

module.exports = { resolveInputs };