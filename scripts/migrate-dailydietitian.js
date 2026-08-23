#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menuItemsPath = path.join(__dirname, '..', 'knowledge', 'menu-items');
const dailydietitianPath = path.join(menuItemsPath, 'dailydietitian');

// Brand to folder mapping (same as before)
const brandMapping = {
  '7-eleven': '7-eleven',
  'familymart': 'familymart',
  '50': '50lagu',
  '8yotea': 'macuteafang',
  'burger-king': 'burgerking',
  'dominos': 'pizza-hut',
  'hilife': 'laifu',
  'mcdonalds': 'mcdonalds',
  'mos-burger': 'mos-burger',
  'marugame': 'marugame-seimen',
  'louisa': 'louisa',
  'milksha': 'macuteafang',
  'pizza-hut': 'pizza-hut',
  'starbucks': 'starbucks',
  'subway': 'subway',
  'kfc': 'kfc',
  'coco': '50lagu',
  'comebuy': '50lagu',
  'sukiya': 'mwd',
  'ug': 'generic-recipes'
};

// Function to migrate dailydietitian items
function migrateDailyDietitian() {
  console.log('Starting migration of DailyDietitian items...');
  
  // Skip brand folders that already exist in main menu-items
  const existingBrands = Object.keys(brandMapping);
  let migratedCount = 0;
  let skippedCount = 0;
  
  // First, migrate from brand folders to main merchant folders
  for (const brand of existingBrands) {
    const sourcePath = path.join(dailydietitianPath, brand);
    const targetFolder = brandMapping[brand];
    const targetPath = path.join(menuItemsPath, targetFolder);
    
    if (!fs.existsSync(sourcePath)) continue;
    if (!fs.existsSync(targetPath)) {
      console.log(`Creating target folder: ${targetFolder}`);
      fs.mkdirSync(targetPath, { recursive: true });
    }
    
    const files = fs.readdirSync(sourcePath)
      .filter(file => file.endsWith('.md') && file !== 'index.md');
    
    for (const file of files) {
      const sourceFile = path.join(sourcePath, file);
      const targetFile = path.join(targetPath, file);
      
      // Check if file already exists in target
      if (fs.existsSync(targetFile)) {
        console.log(`Skipped (duplicate): ${file} in ${targetFolder}`);
        skippedCount++;
        continue;
      }
      
      // Read and update content
      const content = fs.readFileSync(sourceFile, 'utf8');
      const updatedContent = updateFoodId(content, targetFolder, file);
      
      // Write to target
      fs.writeFileSync(targetFile, updatedContent, 'utf8');
      console.log(`Migrated: ${file} -> ${targetFolder}/`);
      migratedCount++;
    }
  }
  
  // Handle item-* folders (keep them as-is for now, they might need manual review)
  console.log(`\nMigration complete:`);
  console.log(`- Migrated: ${migratedCount} files`);
  console.log(`- Skipped: ${skippedCount} files (duplicates)`);
  console.log(`- item-* folders preserved for manual review`);
}

// Function to update food ID
function updateFoodId(content, folder, filename) {
  // Extract item name from filename
  const itemName = filename.replace(/\.md$/, '');
  const itemSlug = itemName
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const newFoodId = `food:tw:menu:${folder}:${itemSlug}`;
  
  return content.replace(
    /id: food:tw:menu:[^\n]+/,
    `id: ${newFoodId}`
  );
}

// Run migration
migrateDailyDietitian();