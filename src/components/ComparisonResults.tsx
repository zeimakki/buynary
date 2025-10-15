import { ComparisonResult } from '../types';
import { Clock, Package, ShoppingBag, AlertCircle } from 'lucide-react';

interface ComparisonResultsProps {
  results: ComparisonResult[];
  sortBy: 'price' | 'delivery' | 'availability';
}

export function ComparisonResults({ results, sortBy }: ComparisonResultsProps) {
  if (results.length === 0) {
    return null;
  }

  const getBadge = (index: number) => {
    if (index === 0) {
      if (sortBy === 'price') return <span className="text-xs font-bold text-green-600">CHEAPEST</span>;
      if (sortBy === 'delivery') return <span className="text-xs font-bold text-blue-600">FASTEST</span>;
      if (sortBy === 'availability') return <span className="text-xs font-bold text-purple-600">BEST AVAILABILITY</span>;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div
          key={result.store.id}
          className={`bg-white rounded-xl shadow-md border-2 transition-all hover:shadow-lg ${
            index === 0 ? 'border-green-400' : 'border-gray-200'
          }`}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{result.store.logo}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{result.store.name}</h3>
                  {getBadge(index)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {result.totalPrice.toFixed(2)} AED
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">Subtotal</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {result.subtotal.toFixed(2)} AED
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">Delivery</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {result.deliveryFee.toFixed(2)} AED
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">Delivery Time</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {result.deliveryTime} min
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">Availability</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {result.itemsFound}/{result.itemsFound + result.itemsMissing}
                </div>
              </div>
            </div>

            {result.itemsMissing > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      {result.itemsMissing} item{result.itemsMissing > 1 ? 's' : ''} not available
                    </p>
                    <p className="text-xs text-red-600">
                      {result.missingItems.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                View item breakdown
              </summary>
              <div className="mt-3 space-y-2">
                {result.matchedProducts.map((match, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{match.product.name}</span>
                      <span className="text-gray-500 text-xs ml-2">
                        ({match.product.brand || match.product.unit})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {(match.product.price * match.quantity).toFixed(2)} AED
                      </div>
                      <div className="text-xs text-gray-500">
                        {match.product.price.toFixed(2)} × {match.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      ))}
    </div>
  );
}
