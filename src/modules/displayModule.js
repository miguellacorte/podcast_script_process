const { resolveInputs } = require('../utils/inputResolver');

const executeDisplayModule = (moduleDefinition, resolvedInputs, results) => {
    console.log('\n--- Display Output ---');
    console.log('Module Definition:', JSON.stringify(moduleDefinition, null, 2));
    console.log('Resolved Inputs:', JSON.stringify(resolvedInputs, null, 2));
    console.log('Results:', JSON.stringify(results, null, 2));
    
    for (const [key, value] of Object.entries(resolvedInputs)) {
        console.log(`\n${key.toUpperCase()}:`);
        try {
            const resolvedValue = resolveValue(value, results);
            displayValue(resolvedValue, 1);
        } catch (error) {
            console.error(`Error resolving value for ${key}:`, error);
            console.log(`${key}: Unable to resolve value`);
        }
    }
    
    console.log('\n----------------------\n');
    
    return resolvedInputs;
};

const resolveValue = (value, results) => {
    console.log('Resolving value:', value);
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
        const resolvedValue = resolveInputs({ temp: value }, results).temp;
        console.log('Resolved value:', resolvedValue);
        return resolvedValue;
    } else if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, resolveValue(v, results)])
        );
    }
    return value;
};

const displayValue = (value, indent = 0) => {
    const prefix = '  '.repeat(indent);
    
    if (value === undefined || value === null) {
        console.log(`${prefix}No data available`);
    } else if (Array.isArray(value)) {
        if (value.length === 0) {
            console.log(`${prefix}[]`);
        } else {
            value.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    console.log(`${prefix}- Item ${index + 1}:`);
                    displayValue(item, indent + 1);
                } else {
                    console.log(`${prefix}- ${item}`);
                }
            });
        }
    } else if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
            console.log(`${prefix}${subKey}:`);
            displayValue(subValue, indent + 1);
        }
    } else {
        console.log(`${prefix}${value}`);
    }
};

module.exports = { executeDisplayModule };