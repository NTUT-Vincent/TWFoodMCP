#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menuItemsPath = path.join(__dirname, '..', 'knowledge', 'menu-items');
const googleSheetPath = path.join(menuItemsPath, 'google-sheet');

// Brand to folder mapping
const brandMapping = {
  '7-ELEVEN': '7-eleven',
  '全家': 'familymart',
  '50嵐': '50lagu',
  '麻古茶坊': 'macuteafang',
  '星巴克': 'starbucks',
  '得正': 'dezheng',
  '八方雲集': 'bafangyunji',
  '萊爾富': 'laifu',
  '摩斯漢堡': 'mos-burger',
  '必勝客': 'pizza-hut',
  'OKmart': 'okmart',
  '丸龜製麵': 'marugame-seimen',
  '台灣麥當勞': 'mcdonalds',
  '21世紀風味館': '21st-century-flavor-factory',
  '早安美芝城': 'morning-michishiki',
  '麥味登': 'mwd',
  '拉亞漢堡': 'laiya-burger',
  '壽司郎': 'sushiro',
  '台灣熱門泡麵': 'instant-noodles',
  '呷尚寶': 'kenshui',
  '弘爺漢堡': 'honger-burger',
  '藏壽司': 'kenshui',
  '爭鮮': 'zazengbao',
  '非品牌食譜': 'generic-recipes',
  '一般壽司估算': 'generic-sushi',
  '路易莎咖啡': 'louisa',
  '肯德基': 'kfc',
  '漢堡王': 'burgerking',
  'SUBWAY': 'subway'
};

// Function to extract brand from filename
function extractBrand(filename) {
  const parts = filename.split('_');
  if (parts.length >= 2) {
    return parts[0];
  }
  return null;
}

// Function to migrate a file
function migrateFile(sourcePath, targetFolder) {
  const filename = path.basename(sourcePath);
  const targetPath = path.join(menuItemsPath, targetFolder, filename);
  
  // Read the file content
  const content = fs.readFileSync(sourcePath, 'utf8');
  
  // Update food ID if needed
  const updatedContent = updateFoodId(content, targetFolder, filename);
  
  // Write to target
  fs.writeFileSync(targetPath, updatedContent, 'utf8');
  
  console.log(`Migrated: ${filename} -> ${targetFolder}/`);
}

// Function to update food ID to match OKF v0.2 format
function updateFoodId(content, folder, filename) {
  const brand = extractBrand(filename);
  if (!brand) return content;
  
  // Extract item name from filename (remove brand prefix and .md)
  const itemName = filename.replace(/^[^_]+_/, '').replace(/\.md$/, '');
  // Create a better slug: replace special chars with hyphens, remove extra hyphens
  const itemSlug = itemName
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-') // Keep Chinese chars, replace others with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // New food ID format: food:tw:menu:<brand-slug>:<item-slug>
  const newFoodId = `food:tw:menu:${folder}:${itemSlug}`;
  
  // Replace old food ID with new one
  return content.replace(
    /id: food:tw:menu:google-sheet:[^\n]+/,
    `id: ${newFoodId}`
  );
}

// Main migration function
function migrateGoogleSheet() {
  console.log('Starting migration of Google Sheet items...');
  
  // Find all markdown files in google-sheet folders
  const folders = fs.readdirSync(googleSheetPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  let migratedCount = 0;
  let skippedCount = 0;
  
  for (const folder of folders) {
    const folderPath = path.join(googleSheetPath, folder);
    const files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.md') && file !== 'index.md');
    
    for (const file of files) {
      const sourcePath = path.join(folderPath, file);
      const brand = extractBrand(file);
      
      if (brand && brandMapping[brand]) {
        const targetFolder = brandMapping[brand];
        migrateFile(sourcePath, targetFolder);
        migratedCount++;
      } else {
        console.log(`Skipped: ${file} (no mapping for brand: ${brand})`);
        skippedCount++;
      }
    }
  }
  
  console.log(`\nMigration complete:`);
  console.log(`- Migrated: ${migratedCount} files`);
  console.log(`- Skipped: ${skippedCount} files`);
}

// Run migration
migrateGoogleSheet();