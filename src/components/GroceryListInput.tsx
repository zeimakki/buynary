import { useState } from 'react';
import { Plus, X, Scale } from 'lucide-react';
import { GroceryItem } from '../types';

interface GroceryListInputProps {
  items: GroceryItem[];
  onItemsChange: (items: GroceryItem[]) => void;
}

export function GroceryListInput({ items, onItemsChange }: GroceryListInputProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [inputMode, setInputMode] = useState<'quantity' | 'weight'>('quantity');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'g'>('kg');

  const addItem = () => {
    if (!newItemName.trim()) return;

    const quantity = parseFloat(newItemQty) || 1;
    const newItem: GroceryItem = {
      name: newItemName.trim(),
      quantity: inputMode === 'quantity' ? Math.round(quantity) : 1,
    };

    if (inputMode === 'weight') {
      newItem.unit = weightUnit;
      newItem.weight = quantity;
    } else {
      newItem.unit = 'pieces';
    }

    onItemsChange([...items, newItem]);
    setNewItemName('');
    setNewItemQty('1');
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const formatItemDisplay = (item: GroceryItem) => {
    if (item.weight && item.unit) {
      return `${item.weight}${item.unit}`;
    }
    return `× ${item.quantity}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setInputMode('quantity')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            inputMode === 'quantity'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Quantity (pieces)
        </button>
        <button
          type="button"
          onClick={() => setInputMode('weight')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            inputMode === 'weight'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          Weight
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Item name (e.g., milk, chicken breast, eggs)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />

        {inputMode === 'weight' && (
          <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'g')}
            className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
          </select>
        )}

        <input
          type="number"
          placeholder={inputMode === 'weight' ? 'Weight' : 'Qty'}
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          onKeyPress={handleKeyPress}
          min="0.1"
          step={inputMode === 'weight' && weightUnit === 'kg' ? '0.1' : '1'}
          className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />

        <button
          onClick={addItem}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="text-gray-500 ml-2">{formatItemDisplay(item)}</span>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
