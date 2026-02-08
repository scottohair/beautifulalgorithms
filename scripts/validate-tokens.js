#!/usr/bin/env node

/**
 * Token validation script.
 *
 * Verifies that all generated token files across platforms (CSS, TypeScript,
 * Swift) are structurally correct and contain the expected token categories.
 *
 * Validates:
 *   - web/src/generated/tokens.css  -- CSS custom properties
 *   - web/src/generated/tokens.ts   -- TypeScript token exports
 *   - apple/AestheticAlgorithm/Generated/Tokens+*.swift -- Swift enum/extension declarations
 *
 * Usage:
 *   node scripts/validate-tokens.js
 *
 * Exit code 0 if all pass, 1 if any fail.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..');
const CSS_TOKENS = path.join(ROOT, 'web', 'src', 'generated', 'tokens.css');
const TS_TOKENS = path.join(ROOT, 'web', 'src', 'generated', 'tokens.ts');
const SWIFT_DIR = path.join(ROOT, 'apple', 'AestheticAlgorithm', 'Generated');

// Expected token categories that must be present across platforms
const EXPECTED_CSS_CATEGORIES = [
  'color',
  'spacing',
  'font',      // typography
  'animation',
  'shadow',
];

const EXPECTED_TS_CATEGORIES = [
  'color',
  'spacing',
  'font',
  'animation',
  'shadow',
];

const EXPECTED_SWIFT_FILES = {
  'Tokens+Colors.swift': {
    declarationType: 'extension|enum',
    minDeclarations: 5,
  },
  'Tokens+Spacing.swift': {
    declarationType: 'extension|enum',
    minDeclarations: 5,
  },
  'Tokens+Typography.swift': {
    declarationType: 'extension|enum',
    minDeclarations: 5,
  },
  'Tokens+Animation.swift': {
    declarationType: 'extension|enum',
    minDeclarations: 5,
  },
  'Tokens+Shadows.swift': {
    declarationType: 'extension|enum',
    minDeclarations: 5,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function padRight(str, len) {
  const s = String(str);
  return s.length >= len ? s : s + ' '.repeat(len - s.length);
}

// ---------------------------------------------------------------------------
// CSS Validation
// ---------------------------------------------------------------------------

function validateCSS() {
  const results = [];

  if (!fs.existsSync(CSS_TOKENS)) {
    results.push({
      check: 'CSS file exists',
      passed: false,
      detail: `File not found: ${CSS_TOKENS}`,
    });
    return results;
  }

  results.push({ check: 'CSS file exists', passed: true, detail: '' });

  const content = fs.readFileSync(CSS_TOKENS, 'utf-8');

  // Verify it is valid CSS (has :root block)
  const hasRoot = /:\s*root\s*\{/.test(content);
  results.push({
    check: 'CSS has :root block',
    passed: hasRoot,
    detail: hasRoot ? '' : 'No :root selector found',
  });

  // Extract all custom property names
  const propRegex = /--([a-z0-9-]+)\s*:/g;
  const props = [];
  let match;
  while ((match = propRegex.exec(content)) !== null) {
    props.push(match[1]);
  }

  results.push({
    check: 'CSS has custom properties',
    passed: props.length > 0,
    detail: props.length > 0 ? `${props.length} properties found` : 'No custom properties',
  });

  // Check each expected category
  for (const category of EXPECTED_CSS_CATEGORIES) {
    const categoryProps = props.filter((p) => p.startsWith(category + '-'));
    const found = categoryProps.length > 0;
    results.push({
      check: `CSS category: ${category}`,
      passed: found,
      detail: found
        ? `${categoryProps.length} properties`
        : `No --${category}-* properties found`,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// TypeScript Validation
// ---------------------------------------------------------------------------

function validateTS() {
  const results = [];

  if (!fs.existsSync(TS_TOKENS)) {
    results.push({
      check: 'TS file exists',
      passed: false,
      detail: `File not found: ${TS_TOKENS}`,
    });
    return results;
  }

  results.push({ check: 'TS file exists', passed: true, detail: '' });

  const content = fs.readFileSync(TS_TOKENS, 'utf-8');

  // Check it exports a tokens object
  const hasExport = /export\s+(const|default)\s+tokens/.test(content);
  results.push({
    check: 'TS exports tokens',
    passed: hasExport,
    detail: hasExport ? '' : 'No "export const tokens" or "export default tokens" found',
  });

  // Check for "as const" assertion (ensures type safety)
  const hasAsConst = /as\s+const/.test(content);
  results.push({
    check: 'TS uses "as const"',
    passed: hasAsConst,
    detail: hasAsConst ? '' : 'Missing "as const" assertion',
  });

  // Check for type export
  const hasTypeExport = /export\s+type\s+Tokens/.test(content);
  results.push({
    check: 'TS exports Tokens type',
    passed: hasTypeExport,
    detail: hasTypeExport ? '' : 'No "export type Tokens" found',
  });

  // Check each expected category key in the tokens object
  for (const category of EXPECTED_TS_CATEGORIES) {
    // Look for the category as a top-level key in the object literal
    const categoryRegex = new RegExp(`^\\s*${category}\\s*:\\s*\\{`, 'm');
    const found = categoryRegex.test(content);
    results.push({
      check: `TS category: ${category}`,
      passed: found,
      detail: found ? '' : `Key "${category}" not found in tokens object`,
    });
  }

  // Validate no syntax-breaking issues (balanced braces)
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  const balanced = openBraces === closeBraces;
  results.push({
    check: 'TS balanced braces',
    passed: balanced,
    detail: balanced
      ? `${openBraces} pairs`
      : `Unbalanced: ${openBraces} open, ${closeBraces} close`,
  });

  return results;
}

// ---------------------------------------------------------------------------
// Swift Validation
// ---------------------------------------------------------------------------

function validateSwift() {
  const results = [];

  if (!fs.existsSync(SWIFT_DIR)) {
    results.push({
      check: 'Swift Generated dir exists',
      passed: false,
      detail: `Directory not found: ${SWIFT_DIR}`,
    });
    return results;
  }

  results.push({ check: 'Swift Generated dir exists', passed: true, detail: '' });

  for (const [filename, expectations] of Object.entries(EXPECTED_SWIFT_FILES)) {
    const filePath = path.join(SWIFT_DIR, filename);

    if (!fs.existsSync(filePath)) {
      results.push({
        check: `Swift file: ${filename}`,
        passed: false,
        detail: 'File not found',
      });
      continue;
    }

    results.push({ check: `Swift file: ${filename}`, passed: true, detail: '' });

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for proper enum or extension declarations
    const declTypes = expectations.declarationType.split('|');
    const hasDecl = declTypes.some((dt) => {
      const regex = new RegExp(`(${dt})\\s+\\w+`, 'i');
      return regex.test(content);
    });
    results.push({
      check: `  ${filename}: has enum/extension`,
      passed: hasDecl,
      detail: hasDecl
        ? ''
        : `No ${expectations.declarationType} declaration found`,
    });

    // Check for static let/var declarations
    const staticLetRegex = /static\s+(let|var)\s+\w+/g;
    const staticDecls = content.match(staticLetRegex) || [];
    const enoughDecls = staticDecls.length >= expectations.minDeclarations;
    results.push({
      check: `  ${filename}: static declarations`,
      passed: enoughDecls,
      detail: `${staticDecls.length} static let/var found (min: ${expectations.minDeclarations})`,
    });

    // Check for SwiftUI import
    const hasImport = /import\s+SwiftUI/.test(content);
    results.push({
      check: `  ${filename}: imports SwiftUI`,
      passed: hasImport,
      detail: hasImport ? '' : 'Missing "import SwiftUI"',
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('');
  console.log('='.repeat(72));
  console.log('  Token Validation');
  console.log('='.repeat(72));
  console.log('');

  const sections = [
    { name: 'CSS Tokens', validate: validateCSS },
    { name: 'TypeScript Tokens', validate: validateTS },
    { name: 'Swift Tokens', validate: validateSwift },
  ];

  let totalChecks = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const section of sections) {
    console.log(`--- ${section.name} ---`);
    console.log('');

    const results = section.validate();

    for (const r of results) {
      totalChecks++;
      if (r.passed) {
        totalPassed++;
      } else {
        totalFailed++;
      }

      const status = r.passed ? 'PASS' : 'FAIL';
      const detail = r.detail ? `  (${r.detail})` : '';
      console.log(`  ${padRight(status, 6)} ${r.check}${detail}`);
    }

    console.log('');
  }

  // Summary
  console.log('-'.repeat(72));
  console.log(
    `Summary: ${totalPassed} passed, ${totalFailed} failed out of ${totalChecks} check(s).`
  );
  console.log('');

  if (totalFailed > 0) {
    console.log('TOKEN VALIDATION FAILED');
    process.exit(1);
  } else {
    console.log('ALL TOKEN VALIDATIONS PASSED');
    process.exit(0);
  }
}

main();
