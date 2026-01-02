#!/usr/bin/env node

/**
 * Schema Files Generator
 *
 * Automatically generates tables.js and relations.js by scanning
 * all schema files in subdirectories and extracting exports.
 *
 * Usage: node generate-schema-files.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_DIR = __dirname;
const TABLES_OUTPUT = path.join(SCHEMA_DIR, 'tables.js');
const RELATIONS_OUTPUT = path.join(SCHEMA_DIR, 'relations.js');

// Directories to scan for schema files
const SCHEMA_SUBDIRS = [
  'auth',
  'core',
  'inventory',
  'organization',
  'production',
  'products',
  'sales',
];

// Files to exclude from scanning
const EXCLUDED_FILES = [
  'index.js',
  'tables.js',
  'relations.js',
  'generate-schema-files.js',
  'generate-schema-files-new.js',
  'app-schema.js',
];

/**
 * Recursively get all .js files from a directory
 */
function getJsFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getJsFiles(fullPath, baseDir));
    } else if (item.endsWith('.js') && !EXCLUDED_FILES.includes(item)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract all necessary imports from files
 */
function extractImports(files) {
  const importSet = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    // Extract import statements
    const importMatches = content.matchAll(/^import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/gm);
    for (const match of importMatches) {
      const imports = match[1].split(',').map(i => i.trim());
      const fromPath = match[2];

      // Skip relative imports to other schema files (we'll include them directly)
      if (fromPath.startsWith('./') && fromPath.includes('/')) {
        continue;
      }

      importSet.add('import { ' + imports.join(', ') + " } from '" + fromPath + "';");
    }
  }

  return Array.from(importSet).sort();
}

/**
 * Extract table definition code from a file
 */
function extractTableDefinition(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const result = {
    comments: [],
    code: [],
  };

  let inComment = false;
  let inTable = false;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Capture JSDoc comments before export
    if (line.trim().startsWith('/**')) {
      inComment = true;
      result.comments.push(line);
      continue;
    }

    if (inComment) {
      result.comments.push(line);
      if (line.trim().includes('*/')) {
        inComment = false;
      }
      continue;
    }

    // Find export const ... = appSchema.table(...
    if (line.includes('export const') && line.includes('appSchema.table')) {
      inTable = true;
      result.code.push(line);
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

      if (braceCount === 0) {
        inTable = false;
      }
      continue;
    }

    if (inTable) {
      result.code.push(line);
      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

      if (braceCount === 0) {
        inTable = false;
      }
    }
  }

  return result;
}

/**
 * Extract relation definition code from a file
 */
function extractRelationDefinition(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const result = {
    comments: [],
    code: [],
  };

  let inComment = false;
  let inRelation = false;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Capture JSDoc comments before export
    if (line.trim().startsWith('/**')) {
      inComment = true;
      result.comments.push(line);
      continue;
    }

    if (inComment) {
      result.comments.push(line);
      if (line.trim().includes('*/')) {
        inComment = false;
      }
      continue;
    }

    // Find export const ... = relations(...
    if (line.includes('export const') && line.includes('relations(')) {
      inRelation = true;
      result.code.push(line);
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

      if (braceCount === 0 && line.includes('));')) {
        inRelation = false;
      }
      continue;
    }

    if (inRelation) {
      result.code.push(line);
      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

      if (braceCount === 0 && line.includes('));')) {
        inRelation = false;
      }
    }
  }

  return result;
}

/**
 * Generate tables.js file
 */
function generateTablesFile() {
  const allFiles = [];
  const tableDefinitions = [];

  console.log('🔍 Scanning for table definitions...');

  for (const subdir of SCHEMA_SUBDIRS) {
    const subdirPath = path.join(SCHEMA_DIR, subdir);

    if (!fs.existsSync(subdirPath)) {
      console.log('⚠️  Skipping ' + subdir + ' (directory not found)');
      continue;
    }

    const files = getJsFiles(subdirPath);
    allFiles.push(...files);
  }

  // Extract imports
  const imports = extractImports(allFiles);

  // Add appSchema import
  imports.unshift("import { appSchema } from './core/app-schema.js';");

  // Extract table definitions
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check if file contains table definitions
    if (content.includes('appSchema.table')) {
      const definition = extractTableDefinition(file);

      if (definition.code.length > 0) {
        tableDefinitions.push({
          file: path.relative(SCHEMA_DIR, file),
          comments: definition.comments,
          code: definition.code,
        });
      }
    }
  }

  // Generate file content
  const timestamp = new Date().toISOString();
  let content = '/**\n';
  content += ' * Database Tables\n';
  content += ' * \n';
  content += ' * Auto-generated file - DO NOT EDIT MANUALLY\n';
  content += ' * Generated by: generate-schema-files.js\n';
  content += ' * Generated at: ' + timestamp + '\n';
  content += ' * \n';
  content +=
    ' * This file automatically combines all table definitions from schema subdirectories.\n';
  content +=
    ' * To regenerate: npm run schema:generate (or node src/db/schema/generate-schema-files.js)\n';
  content += ' */\n\n';

  content += imports.join('\n') + '\n\n';

  // Add each table definition
  for (const def of tableDefinitions) {
    content += '// From: ' + def.file + '\n';
    if (def.comments.length > 0) {
      content += def.comments.join('\n') + '\n';
    }
    content += def.code.join('\n') + '\n\n';
  }

  fs.writeFileSync(TABLES_OUTPUT, content);
  console.log('✅ Generated tables.js with ' + tableDefinitions.length + ' tables');
}

/**
 * Generate relations.js file
 */
function generateRelationsFile() {
  const allFiles = [];
  const relationDefinitions = [];

  console.log('\n🔍 Scanning for relation definitions...');

  // Scan subdirectories for relations
  for (const subdir of SCHEMA_SUBDIRS) {
    const subdirPath = path.join(SCHEMA_DIR, subdir);

    if (!fs.existsSync(subdirPath)) {
      continue;
    }

    const files = getJsFiles(subdirPath);
    allFiles.push(...files);
  }

  // Also check cross-domain-relations.js
  const crossDomainFile = path.join(SCHEMA_DIR, 'cross-domain-relations.js');
  if (fs.existsSync(crossDomainFile)) {
    allFiles.push(crossDomainFile);
  }

  // Extract imports (we need relations from drizzle-orm and table imports)
  const imports = [];
  imports.push("import { relations } from 'drizzle-orm';");

  // Collect all table references needed for relations
  const tableRefs = new Set();

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // Find table imports in relation files
    const tableImportMatches = content.matchAll(/import\s+{([^}]+)}\s+from\s+['"]\.\/[^'"]+['"]/gm);
    for (const match of tableImportMatches) {
      const tables = match[1].split(',').map(t => t.trim());
      tables.forEach(t => tableRefs.add(t));
    }
  }

  // Import all tables from tables.js
  if (tableRefs.size > 0) {
    const tableImport =
      'import { ' + Array.from(tableRefs).sort().join(', ') + " } from './tables.js';";
    imports.push(tableImport);
  }

  // Extract relation definitions
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check if file contains relation definitions
    if (content.includes('relations(')) {
      const definition = extractRelationDefinition(file);

      if (definition.code.length > 0) {
        relationDefinitions.push({
          file: path.relative(SCHEMA_DIR, file),
          comments: definition.comments,
          code: definition.code,
        });
      }
    }
  }

  // Generate file content
  const timestamp = new Date().toISOString();
  let content = '/**\n';
  content += ' * Database Relations\n';
  content += ' * \n';
  content += ' * Auto-generated file - DO NOT EDIT MANUALLY\n';
  content += ' * Generated by: generate-schema-files.js\n';
  content += ' * Generated at: ' + timestamp + '\n';
  content += ' * \n';
  content +=
    ' * This file automatically combines all relation definitions from schema subdirectories.\n';
  content +=
    ' * To regenerate: npm run schema:generate (or node src/db/schema/generate-schema-files.js)\n';
  content += ' */\n\n';

  content += imports.join('\n') + '\n\n';

  // Add each relation definition
  for (const def of relationDefinitions) {
    content += '// From: ' + def.file + '\n';
    if (def.comments.length > 0) {
      content += def.comments.join('\n') + '\n';
    }
    content += def.code.join('\n') + '\n\n';
  }

  fs.writeFileSync(RELATIONS_OUTPUT, content);
  console.log('✅ Generated relations.js with ' + relationDefinitions.length + ' relations');
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting schema files generation...\n');

  try {
    generateTablesFile();
    generateRelationsFile();

    console.log('\n✨ Schema files generated successfully!');
    console.log('📁 Generated files:');
    console.log('   - ' + path.relative(process.cwd(), TABLES_OUTPUT));
    console.log('   - ' + path.relative(process.cwd(), RELATIONS_OUTPUT));
  } catch (error) {
    console.error('❌ Error generating schema files:', error);
    process.exit(1);
  }
}

// Run the script
main();

export { generateTablesFile, generateRelationsFile };
