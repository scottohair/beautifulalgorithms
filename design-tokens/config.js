import StyleDictionary from 'style-dictionary';

// Custom format: Swift Color extensions
const swiftColorsFormat = {
  name: 'swift/colors',
  format: async ({ dictionary }) => {
    const lines = ['import SwiftUI', '', 'extension Color {'];
    dictionary.allTokens
      .filter(t => t.$type === 'color' || t.type === 'color')
      .filter(t => !String(t.value).startsWith('rgba'))
      .forEach(token => {
        const name = token.path.slice(1).map((p, i) =>
          i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
        ).join('').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const hex = String(token.value).replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        lines.push(`    /// ${token.description || token.path.join('.')}`);
        lines.push(`    static let ${name} = Color(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)})`);
      });
    // Handle rgba colors
    dictionary.allTokens
      .filter(t => t.$type === 'color' || t.type === 'color')
      .filter(t => String(t.value).startsWith('rgba'))
      .forEach(token => {
        const name = token.path.slice(1).map((p, i) =>
          i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
        ).join('').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const match = String(token.value).match(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
        if (match) {
          const [, rv, gv, bv, a] = match;
          const rn = (parseFloat(rv) / 255).toFixed(3);
          const gn = (parseFloat(gv) / 255).toFixed(3);
          const bn = (parseFloat(bv) / 255).toFixed(3);
          lines.push(`    /// ${token.description || token.path.join('.')}`);
          lines.push(`    static let ${name} = Color(red: ${rn}, green: ${gn}, blue: ${bn}, opacity: ${a})`);
        }
      });
    lines.push('}', '');
    return lines.join('\n');
  }
};

const swiftTypographyFormat = {
  name: 'swift/typography',
  format: async ({ dictionary }) => {
    const lines = ['import SwiftUI', '', 'enum Typography {'];
    dictionary.allTokens.forEach(token => {
      const name = token.path.slice(1).map((p, i) =>
        i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
      ).join('').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const type = token.$type || token.type;
      if (type === 'fontSize') {
        lines.push(`    static let ${name}: CGFloat = ${token.value}`);
      } else if (type === 'fontWeight') {
        lines.push(`    static let ${name}: Font.Weight = .init(rawValue: ${token.value})`);
      } else if (type === 'lineHeight') {
        lines.push(`    static let ${name}: CGFloat = ${token.value}`);
      } else {
        lines.push(`    static let ${name} = "${token.value}"`);
      }
    });
    lines.push('}', '');
    return lines.join('\n');
  }
};

const swiftDimensionsFormat = {
  name: 'swift/dimensions',
  format: async ({ dictionary, options }) => {
    const enumName = options.enumName || 'Dimensions';
    const lines = ['import SwiftUI', '', `enum ${enumName} {`];
    dictionary.allTokens.forEach(token => {
      const name = token.path.map((p, i) =>
        i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
      ).join('').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      lines.push(`    static let ${name}: CGFloat = ${token.value}`);
    });
    lines.push('}', '');
    return lines.join('\n');
  }
};

const swiftAnimationFormat = {
  name: 'swift/animation',
  format: async ({ dictionary }) => {
    const lines = ['import SwiftUI', '', 'enum AnimationTokens {'];
    dictionary.allTokens.forEach(token => {
      const name = token.path.slice(1).map((p, i) =>
        i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
      ).join('').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const type = token.$type || token.type;
      if (type === 'duration') {
        const seconds = parseFloat(token.value) / 1000;
        lines.push(`    /// ${token.description || ''}`);
        lines.push(`    static let ${name}: Double = ${seconds}`);
      } else if (type === 'easing') {
        lines.push(`    static let ${name} = "${token.value}"`);
      } else {
        lines.push(`    static let ${name}: Double = ${token.value}`);
      }
    });
    lines.push('}', '');
    return lines.join('\n');
  }
};

const swiftShadowsFormat = {
  name: 'swift/shadows',
  format: async ({ dictionary }) => {
    const lines = ['import SwiftUI', '', 'enum ShadowTokens {'];
    dictionary.allTokens.forEach(token => {
      const name = token.path.slice(1).map((p, i) =>
        i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
      ).join('').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      lines.push(`    static let ${name} = "${token.value}"`);
    });
    lines.push('}', '');
    return lines.join('\n');
  }
};

const tsConstantsFormat = {
  name: 'ts/constants',
  format: async ({ dictionary }) => {
    const lines = ['// Auto-generated by Style Dictionary', '// Do not edit directly', '', 'export const tokens = {'];

    const groups = {};
    dictionary.allTokens.forEach(token => {
      const key = token.path[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(token);
    });

    Object.entries(groups).forEach(([key, groupTokens]) => {
      lines.push(`  ${key}: {`);
      groupTokens.forEach(token => {
        const subPath = token.path.slice(1).join('_').replace(/-/g, '_');
        const strVal = String(token.value).replace(/'/g, "\\'");
        const val = typeof token.value === 'number' ? token.value : `'${strVal}'`;
        const key = /^\d/.test(subPath) ? `'${subPath}'` : subPath;
        lines.push(`    ${key}: ${val},`);
      });
      lines.push(`  },`);
    });

    lines.push('} as const;', '');
    lines.push('export type Tokens = typeof tokens;', '');
    return lines.join('\n');
  }
};

async function build() {
  const sd = new StyleDictionary({
    hooks: {
      formats: {
        'swift/colors': swiftColorsFormat.format,
        'swift/typography': swiftTypographyFormat.format,
        'swift/dimensions': swiftDimensionsFormat.format,
        'swift/animation': swiftAnimationFormat.format,
        'swift/shadows': swiftShadowsFormat.format,
        'ts/constants': tsConstantsFormat.format,
      }
    },
    source: ['src/**/*.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: '../web/src/generated/',
        files: [{
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true }
        }]
      },
      ts: {
        transformGroup: 'js',
        buildPath: '../web/src/generated/',
        files: [{
          destination: 'tokens.ts',
          format: 'ts/constants'
        }]
      },
      'swift-colors': {
        transformGroup: 'js',
        buildPath: '../apple/AestheticAlgorithm/Generated/',
        files: [{
          destination: 'Tokens+Colors.swift',
          format: 'swift/colors',
          filter: (token) => (token.$type || token.type) === 'color'
        }]
      },
      'swift-typography': {
        transformGroup: 'js',
        buildPath: '../apple/AestheticAlgorithm/Generated/',
        files: [{
          destination: 'Tokens+Typography.swift',
          format: 'swift/typography',
          filter: (token) => ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'].includes(token.$type || token.type)
        }]
      },
      'swift-spacing': {
        transformGroup: 'js',
        buildPath: '../apple/AestheticAlgorithm/Generated/',
        files: [{
          destination: 'Tokens+Spacing.swift',
          format: 'swift/dimensions',
          options: { enumName: 'Spacing' },
          filter: (token) => (token.$type || token.type) === 'spacing'
        }]
      },
      'swift-animation': {
        transformGroup: 'js',
        buildPath: '../apple/AestheticAlgorithm/Generated/',
        files: [{
          destination: 'Tokens+Animation.swift',
          format: 'swift/animation',
          filter: (token) => ['duration', 'easing', 'number'].includes(token.$type || token.type)
        }]
      },
      'swift-shadows': {
        transformGroup: 'js',
        buildPath: '../apple/AestheticAlgorithm/Generated/',
        files: [{
          destination: 'Tokens+Shadows.swift',
          format: 'swift/shadows',
          filter: (token) => (token.$type || token.type) === 'boxShadow'
        }]
      }
    }
  });

  await sd.buildAllPlatforms();
  console.log('Design tokens built successfully!');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
