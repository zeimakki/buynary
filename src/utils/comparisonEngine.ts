import { Store, Product, GroceryItem, ComparisonResult } from '../types';

function findBestMatch(itemName: string, products: Product[]): Product | null {
  const normalizedItem = itemName.toLowerCase().trim();

  const exactMatch = products.find(p =>
    p.name.toLowerCase() === normalizedItem
  );
  if (exactMatch) return exactMatch;

  const partialMatch = products.find(p =>
    p.name.toLowerCase().includes(normalizedItem) ||
    normalizedItem.includes(p.name.toLowerCase())
  );

  return partialMatch || null;
}

export function compareStores(
  groceryList: GroceryItem[],
  stores: Store[],
  allProducts: Product[]
): ComparisonResult[] {
  const results: ComparisonResult[] = [];

  for (const store of stores) {
    const storeProducts = allProducts.filter(p => p.storeId === store.id && p.inStock);

    let subtotal = 0;
    const matchedProducts: ComparisonResult['matchedProducts'] = [];
    const missingItems: string[] = [];

    for (const item of groceryList) {
      const match = findBestMatch(item.name, storeProducts);

      if (match) {
        let effectiveQuantity = item.quantity;

        if (item.weight && item.unit) {
          const productUnit = match.unit.toLowerCase();
          if (productUnit.includes('kg')) {
            const productWeight = parseFloat(match.unit.match(/[\d.]+/)?.[0] || '1');
            effectiveQuantity = item.unit === 'kg'
              ? item.weight / productWeight
              : item.weight / (productWeight * 1000);
          } else if (productUnit.includes('g')) {
            const productWeight = parseFloat(match.unit.match(/\d+/)?.[0] || '1');
            effectiveQuantity = item.unit === 'g'
              ? item.weight / productWeight
              : (item.weight * 1000) / productWeight;
          }
          effectiveQuantity = Math.ceil(effectiveQuantity);
        }

        const itemTotal = match.price * effectiveQuantity;
        subtotal += itemTotal;
        matchedProducts.push({
          requestedItem: item.name,
          product: match,
          quantity: effectiveQuantity,
        });
      } else {
        missingItems.push(item.name);
      }
    }

    const totalPrice = subtotal + store.deliveryFee;

    results.push({
      store,
      subtotal,
      deliveryFee: store.deliveryFee,
      totalPrice,
      deliveryTime: store.averageDeliveryTime,
      itemsFound: matchedProducts.length,
      itemsMissing: missingItems.length,
      matchedProducts,
      missingItems,
    });
  }

  return results;
}

export function sortByPrice(results: ComparisonResult[]): ComparisonResult[] {
  return [...results].sort((a, b) => a.totalPrice - b.totalPrice);
}

export function sortByDeliveryTime(results: ComparisonResult[]): ComparisonResult[] {
  return [...results].sort((a, b) => a.deliveryTime - b.deliveryTime);
}

export function sortByAvailability(results: ComparisonResult[]): ComparisonResult[] {
  return [...results].sort((a, b) => {
    if (a.itemsFound !== b.itemsFound) {
      return b.itemsFound - a.itemsFound;
    }
    return a.totalPrice - b.totalPrice;
  });
}
