#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menuItemsPath = path.join(__dirname, '..', 'knowledge', 'menu-items');

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

// Function to create proper slug from Chinese and English
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // Remove special chars except word chars, Chinese, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Function to fix food ID in a file
function fixFoodId(filePath, folder) {
  const filename = path.basename(filePath);
  const brand = extractBrand(filename);
  
  if (!brand) {
    console.log(`Skipped: ${filename} (no brand found)`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract item name from filename (remove brand prefix and .md)
  const itemName = filename.replace(/^[^_]+_/, '').replace(/\.md$/, '');
  const itemSlug = createSlug(itemName);
  
  // New food ID format: food:tw:menu:<brand-slug>:<item-slug>
  const newFoodId = `food:tw:menu:${folder}:${itemSlug}`;
  
  // Replace old food ID with new one
  const updatedContent = content.replace(
    /id: food:tw:menu:[^\n]+/,
    `id: ${newFoodId}`
  );
  
  // Write back
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Fixed: ${filename} -> ${newFoodId}`);
}

// Main function to fix all migrated files
function fixAllFoodIds() {
  console.log('Fixing food IDs in migrated files...');
  
  const folders = Object.values(brandMapping);
  let fixedCount = 0;
  
  for (const folder of folders) {
    const folderPath = path.join(menuItemsPath, folder);
    if (!fs.existsSync(folderPath)) continue;
    
    const files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.md') && file !== 'index.md');
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const brand = extractBrand(file);
      
      if (brand && brandMapping[brand] === folder) {
        fixFoodId(filePath, folder);
        fixedCount++;
      }
    }
  }
  
  console.log(`\nFixed ${fixedCount} food IDs.`);
}

// Run the fix
fixAllFoodIds();