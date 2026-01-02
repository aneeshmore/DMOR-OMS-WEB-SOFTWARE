/* eslint-env node */
import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_FILE = path.join(__dirname, '../src/config/routeRegistry.tsx');
const OUTPUT_FILE = path.join(__dirname, '../../server/src/db/seeds/route-permissions.json');

function extractPermissions() {
  console.log(`Reading source file: ${SOURCE_FILE}`);
  const fileContent = fs.readFileSync(SOURCE_FILE, 'utf8');

  const sourceFile = ts.createSourceFile(
    'routeRegistry.tsx',
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  let routeRegistryNode = null;

  // Find 'export const routeRegistry = ...'
  ts.forEachChild(sourceFile, node => {
    if (ts.isVariableStatement(node)) {
      const declarationList = node.declarationList;
      declarationList.declarations.forEach(declaration => {
        if (ts.isIdentifier(declaration.name) && declaration.name.text === 'routeRegistry') {
          routeRegistryNode = declaration.initializer;
        }
      });
    }
  });

  if (!routeRegistryNode || !ts.isArrayLiteralExpression(routeRegistryNode)) {
    console.error('Could not find routeRegistry array in source file.');
    // eslint-disable-next-line no-undef
    process.exit(1);
  }

  const routes = extractArray(routeRegistryNode);
  console.log(`Found ${routes.length} top-level routes.`);

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const newData = JSON.stringify(routes, null, 2);

  if (fs.existsSync(OUTPUT_FILE)) {
    const existingData = fs.readFileSync(OUTPUT_FILE, 'utf8');
    if (existingData === newData) {
      console.log('No changes detected in permissions. Skipping write.');
      return;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, newData);
  console.log(`Successfully wrote permissions to ${OUTPUT_FILE}`);
}

function extractArray(node) {
  return node.elements
    .map(element => {
      if (ts.isObjectLiteralExpression(element)) {
        return extractObject(element);
      }
      return null;
    })
    .filter(Boolean);
}

function extractObject(node) {
  const obj = {};
  node.properties.forEach(prop => {
    if (ts.isPropertyAssignment(prop)) {
      const key = prop.name.text;
      const value = prop.initializer;

      // Skip non-serializable fields
      if (['component', 'icon'].includes(key)) {
        return;
      }

      obj[key] = extractValue(value);
    }
  });
  return obj;
}

function extractValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;

  if (ts.isArrayLiteralExpression(node)) {
    return extractArray(node);
  }
  if (ts.isObjectLiteralExpression(node)) {
    return extractObject(node);
  }

  // Handle identifiers if they are simple values (unlikely for our use case, usually imports)
  // For 'group' property, it might be a string literal, which is handled above.

  return null;
}

extractPermissions();
