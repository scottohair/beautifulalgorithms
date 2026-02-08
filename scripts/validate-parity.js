#!/usr/bin/env node

/**
 * Cross-platform parity validation script.
 *
 * Loads all .algo.json spec files, dynamically imports the corresponding
 * TypeScript algorithm implementations (via tsx), runs generateSteps()
 * with each spec's test case inputs, and validates the resulting step
 * sequences for structural correctness.
 *
 * Usage:
 *   npx tsx scripts/validate-parity.js
 *
 * Exit code 0 if all validations pass, 1 if any fail.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..');
const SPECS_DIR = path.join(ROOT, 'algorithm-specs');
const ALGORITHMS_DIR = path.join(ROOT, 'web', 'src', 'algorithms');

/** Recursively find all files matching a pattern in a directory. */
function findFiles(dir, pattern) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(full, pattern));
    } else if (pattern.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Convert a kebab-case id to camelCase export name. */
function idToExportName(id) {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Map the spec category directory name to the web algorithms directory name.
 * The spec files live under algorithm-specs/graphs/ but implementations are
 * under web/src/algorithms/graph/.
 */
function categoryToDirName(category) {
  const mapping = {
    graphs: 'graph',
  };
  return mapping[category] || category;
}

/** Check whether a number array is sorted ascending. */
function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Validation logic
// ---------------------------------------------------------------------------

/**
 * Validate the steps produced by an algorithm against its spec.
 * Returns an object { passed: boolean, errors: string[] }.
 */
function validateSteps(steps, spec, testCase) {
  const errors = [];
  const validStepTypes = spec.stepTypes.map((s) => s.type);
  const isSortingAlgo = spec.category === 'sorting';

  // (a) Steps must be a non-empty array
  if (!Array.isArray(steps) || steps.length === 0) {
    errors.push('Steps array is empty or not an array');
    return { passed: false, errors };
  }

  // (f) Step count must be reasonable
  if (steps.length > 10000) {
    errors.push(`Step count ${steps.length} exceeds maximum of 10000`);
  }

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const prefix = `Step ${i}`;

    // (b) Valid step type
    if (!validStepTypes.includes(step.type)) {
      errors.push(
        `${prefix}: invalid type "${step.type}" (expected one of: ${validStepTypes.join(', ')})`
      );
    }

    // (c) Required arrays exist
    if (!Array.isArray(step.array)) {
      errors.push(`${prefix}: missing or non-array "array" property`);
    }
    if (!Array.isArray(step.highlightedIndices)) {
      errors.push(`${prefix}: missing or non-array "highlightedIndices" property`);
    }
    if (!Array.isArray(step.sortedIndices)) {
      errors.push(`${prefix}: missing or non-array "sortedIndices" property`);
    }

    // (d) Bounds checking – only when array exists
    if (Array.isArray(step.array)) {
      const len = step.array.length;

      if (Array.isArray(step.highlightedIndices)) {
        for (const idx of step.highlightedIndices) {
          if (typeof idx === 'number' && (idx < 0 || idx >= len)) {
            errors.push(
              `${prefix}: highlightedIndices value ${idx} out of bounds (array length ${len})`
            );
          }
        }
      }

      if (Array.isArray(step.sortedIndices)) {
        for (const idx of step.sortedIndices) {
          if (typeof idx === 'number' && (idx < 0 || idx >= len)) {
            errors.push(
              `${prefix}: sortedIndices value ${idx} out of bounds (array length ${len})`
            );
          }
        }
      }
    }
  }

  // (e) For sorting algorithms, the final step's array must be sorted
  if (isSortingAlgo) {
    const finalArray = steps[steps.length - 1].array;
    if (Array.isArray(finalArray) && !isSorted(finalArray)) {
      errors.push(
        `Final step array is not sorted: [${finalArray.join(', ')}]`
      );
    }

    // Also check against expected output if provided
    if (testCase.expected && Array.isArray(finalArray)) {
      const expected = JSON.stringify(testCase.expected);
      const actual = JSON.stringify(finalArray);
      if (expected !== actual) {
        errors.push(
          `Final array mismatch: expected ${expected}, got ${actual}`
        );
      }
    }
  }

  return { passed: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Dynamic import helper
// ---------------------------------------------------------------------------

/**
 * Dynamically import a TypeScript module using tsx register.
 * Falls back to direct require if tsx is not available.
 */
async function importTSModule(filePath) {
  // Try tsx import first (recommended path)
  try {
    // Use dynamic import with tsx loader
    const mod = await import(filePath);
    return mod;
  } catch {
    // Fallback: try require with tsx register
    try {
      require('tsx/cjs');
      return require(filePath);
    } catch {
      // Final fallback: attempt plain require
      return require(filePath);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('');
  console.log('='.repeat(72));
  console.log('  Algorithm Parity Validation');
  console.log('='.repeat(72));
  console.log('');

  // Discover all spec files
  const specFiles = findFiles(SPECS_DIR, /\.algo\.json$/);
  if (specFiles.length === 0) {
    console.error('No .algo.json spec files found.');
    process.exit(1);
  }

  console.log(`Found ${specFiles.length} spec file(s).\n`);

  const results = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const specFile of specFiles.sort()) {
    const spec = JSON.parse(fs.readFileSync(specFile, 'utf-8'));

    // Resolve the implementation file path.
    // Spec category from directory name (e.g. "graphs") maps to impl dir (e.g. "graph").
    const specCategory = path.basename(path.dirname(specFile));
    const implDirName = categoryToDirName(specCategory);
    const implFile = path.join(ALGORITHMS_DIR, implDirName, `${spec.id}.ts`);

    if (!fs.existsSync(implFile)) {
      results.push({
        spec: spec.id,
        category: specCategory,
        status: 'SKIP',
        reason: 'No TS implementation found',
        testResults: [],
      });
      totalSkipped++;
      continue;
    }

    // Import the implementation
    let implementation;
    const exportName = idToExportName(spec.id);

    try {
      const mod = await importTSModule(implFile);
      implementation = mod[exportName] || mod.default;

      if (!implementation) {
        // Try all exports
        const exports = Object.keys(mod);
        for (const key of exports) {
          if (mod[key] && typeof mod[key].generateSteps === 'function') {
            implementation = mod[key];
            break;
          }
        }
      }

      if (!implementation || typeof implementation.generateSteps !== 'function') {
        results.push({
          spec: spec.id,
          category: specCategory,
          status: 'FAIL',
          reason: `Export "${exportName}" not found or missing generateSteps (available: ${Object.keys(mod || {}).join(', ')})`,
          testResults: [],
        });
        totalFailed++;
        continue;
      }
    } catch (err) {
      results.push({
        spec: spec.id,
        category: specCategory,
        status: 'FAIL',
        reason: `Import error: ${err.message}`,
        testResults: [],
      });
      totalFailed++;
      continue;
    }

    // Run test cases
    const testCases = spec.testCases || [];
    if (testCases.length === 0) {
      // Use the default input if no test cases defined
      const defaultInput = spec.inputSchema?.default;
      if (defaultInput) {
        testCases.push({ name: 'Default input', input: defaultInput });
      }
    }

    if (testCases.length === 0) {
      results.push({
        spec: spec.id,
        category: specCategory,
        status: 'SKIP',
        reason: 'No test cases or default input defined',
        testResults: [],
      });
      totalSkipped++;
      continue;
    }

    const testResults = [];
    let specPassed = true;

    for (const testCase of testCases) {
      totalTests++;
      const input = testCase.input;

      try {
        const steps = implementation.generateSteps(input);
        const validation = validateSteps(steps, spec, testCase);

        testResults.push({
          name: testCase.name,
          stepCount: Array.isArray(steps) ? steps.length : 0,
          passed: validation.passed,
          errors: validation.errors,
        });

        if (validation.passed) {
          totalPassed++;
        } else {
          totalFailed++;
          specPassed = false;
        }
      } catch (err) {
        testResults.push({
          name: testCase.name,
          stepCount: 0,
          passed: false,
          errors: [`Runtime error: ${err.message}`],
        });
        totalFailed++;
        specPassed = false;
      }
    }

    results.push({
      spec: spec.id,
      category: specCategory,
      status: specPassed ? 'PASS' : 'FAIL',
      reason: '',
      testResults,
    });
  }

  // ---------------------------------------------------------------------------
  // Output summary table
  // ---------------------------------------------------------------------------

  console.log('-'.repeat(72));
  console.log(
    padRight('Algorithm', 30) +
      padRight('Category', 18) +
      padRight('Status', 8) +
      padRight('Tests', 8) +
      'Details'
  );
  console.log('-'.repeat(72));

  for (const r of results) {
    const testSummary =
      r.testResults.length > 0
        ? `${r.testResults.filter((t) => t.passed).length}/${r.testResults.length}`
        : '-';
    const statusIcon =
      r.status === 'PASS' ? 'PASS' : r.status === 'SKIP' ? 'SKIP' : 'FAIL';
    const details = r.reason || '';

    console.log(
      padRight(r.spec, 30) +
        padRight(r.category, 18) +
        padRight(statusIcon, 8) +
        padRight(testSummary, 8) +
        details
    );

    // Print individual test failures
    for (const tr of r.testResults) {
      if (!tr.passed) {
        for (const err of tr.errors) {
          console.log(`    [${tr.name}] ${err}`);
        }
      }
    }
  }

  console.log('-'.repeat(72));
  console.log('');
  console.log(
    `Summary: ${totalPassed} passed, ${totalFailed} failed, ${totalSkipped} skipped out of ${totalTests} test(s) across ${specFiles.length} spec(s).`
  );
  console.log('');

  if (totalFailed > 0) {
    console.log('VALIDATION FAILED');
    process.exit(1);
  } else {
    console.log('ALL VALIDATIONS PASSED');
    process.exit(0);
  }
}

function padRight(str, len) {
  const s = String(str);
  return s.length >= len ? s : s + ' '.repeat(len - s.length);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
