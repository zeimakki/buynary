import { GroceryItem } from '../types';

const numberWords: Record<string, number> = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
  'thirty': 30, 'forty': 40, 'fifty': 50,
};

const packagedItems: Record<string, { unitSize: number; unit: string }> = {
  'eggs': { unitSize: 12, unit: 'pieces' },
  'egg': { unitSize: 12, unit: 'pieces' },
  'water bottles': { unitSize: 6, unit: 'pieces' },
  'water': { unitSize: 6, unit: 'pieces' },
  'yogurt': { unitSize: 1, unit: 'pieces' },
};

const weightItems = [
  'chicken', 'meat', 'beef', 'lamb', 'fish', 'salmon', 'shrimp',
  'tomatoes', 'potatoes', 'onions', 'carrots', 'apples', 'bananas',
  'oranges', 'rice', 'flour', 'sugar',
];

function convertNumberWords(text: string): string {
  let result = text.toLowerCase();

  Object.entries(numberWords).forEach(([word, num]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    result = result.replace(regex, num.toString());
  });

  return result;
}

function parseQuantityAndUnit(text: string): { quantity: number; unit?: 'pieces' | 'kg' | 'g'; weight?: number } {
  const kgMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo|kilogram)/i);
  if (kgMatch) {
    return { quantity: 1, unit: 'kg', weight: parseFloat(kgMatch[1]) };
  }

  const gramsMatch = text.match(/(\d+)\s*(?:g|gram|grams)/i);
  if (gramsMatch) {
    return { quantity: 1, unit: 'g', weight: parseInt(gramsMatch[1]) };
  }

  const qtyMatch = text.match(/^(\d+)\s+/);
  if (qtyMatch) {
    return { quantity: parseInt(qtyMatch[1]), unit: 'pieces' };
  }

  return { quantity: 1, unit: 'pieces' };
}

function normalizeItemName(text: string): string {
  return text
    .replace(/\d+(?:\.\d+)?\s*(?:kg|kilo|kilogram|g|gram|grams)/gi, '')
    .replace(/^\d+\s+/, '')
    .trim();
}

function adjustQuantityForPackagedItems(itemName: string, requestedQty: number): number {
  const normalizedName = itemName.toLowerCase();

  for (const [key, config] of Object.entries(packagedItems)) {
    if (normalizedName.includes(key)) {
      if (requestedQty <= config.unitSize) {
        return 1;
      }
      return Math.ceil(requestedQty / config.unitSize);
    }
  }

  return requestedQty;
}

function isWeightItem(itemName: string): boolean {
  const normalized = itemName.toLowerCase();
  return weightItems.some(item => normalized.includes(item));
}

export function parseVoiceTranscript(transcript: string): GroceryItem[] {
  const converted = convertNumberWords(transcript);

  const segments = converted.split(/\bplus\b/i).map(s => s.trim()).filter(s => s.length > 0);

  const items: GroceryItem[] = [];

  for (const segment of segments) {
    const { quantity, unit, weight } = parseQuantityAndUnit(segment);
    const itemName = normalizeItemName(segment);

    if (!itemName) continue;

    if (weight !== undefined) {
      items.push({
        name: itemName,
        quantity: 1,
        unit: unit,
        weight: weight,
      });
    } else {
      const adjustedQty = adjustQuantityForPackagedItems(itemName, quantity);

      if (isWeightItem(itemName) && quantity > 1 && unit === 'pieces') {
        items.push({
          name: itemName,
          quantity: 1,
          unit: 'kg',
          weight: quantity,
        });
      } else {
        items.push({
          name: itemName,
          quantity: adjustedQty,
          unit: unit,
        });
      }
    }
  }

  return items;
}
