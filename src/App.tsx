import { useState } from 'react';
import { ShoppingCart, TrendingDown, Clock, Filter } from 'lucide-react';
import { VoiceInput } from './components/VoiceInput';
import { GroceryListInput } from './components/GroceryListInput';
import { ComparisonResults } from './components/ComparisonResults';
import { GroceryItem } from './types';
import { stores, products } from './mockData';
import {
  compareStores,
  sortByPrice,
  sortByDeliveryTime,
  sortByAvailability,
} from './utils/comparisonEngine';
import { parseVoiceTranscript } from './utils/voiceParser';

type SortMode = 'price' | 'delivery' | 'availability';

function App() {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('price');

  const handleVoiceTranscript = (transcript: string) => {
    const items = parseVoiceTranscript(transcript);
    setGroceryList((prev) => [...prev, ...items]);
  };

  const handleCompare = () => {
    if (groceryList.length === 0) {
      alert('Please add items to your grocery list first.');
      return;
    }
    setShowResults(true);
  };

  const handleReset = () => {
    setGroceryList([]);
    setShowResults(false);
  };

  const comparisonResults = showResults
    ? compareStores(groceryList, stores, products)
    : [];

  const sortedResults =
    sortMode === 'price'
      ? sortByPrice(comparisonResults)
      : sortMode === 'delivery'
      ? sortByDeliveryTime(comparisonResults)
      : sortByAvailability(comparisonResults);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Buynary
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Smart grocery price comparison for the best deals
          </p>
        </header>

        {!showResults ? (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create Your Grocery List
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Option 1: Voice Input
                  </h3>
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Say items like: "milk plus bread plus 15 eggs plus 2 kg chicken"
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Option 2: Manual Input
                  </h3>
                  <GroceryListInput
                    items={groceryList}
                    onItemsChange={setGroceryList}
                  />
                </div>
              </div>
            </div>

            {groceryList.length > 0 && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCompare}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all hover:shadow-xl flex items-center gap-2"
                >
                  <TrendingDown className="w-6 h-6" />
                  Compare Prices Now
                </button>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Clear List
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Comparison Results
                  </h2>
                  <p className="text-gray-600">
                    {groceryList.length} items across {stores.length} stores
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortMode('price')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      sortMode === 'price'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4" />
                    Best Price
                  </button>
                  <button
                    onClick={() => setSortMode('delivery')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      sortMode === 'delivery'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Fastest
                  </button>
                  <button
                    onClick={() => setSortMode('availability')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      sortMode === 'availability'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Best Match
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowResults(false)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add More Items
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  New Search
                </button>
              </div>
            </div>

            <ComparisonResults results={sortedResults} sortBy={sortMode} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
