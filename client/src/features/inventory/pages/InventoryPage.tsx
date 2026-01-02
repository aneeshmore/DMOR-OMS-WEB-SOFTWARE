import { useState, useEffect } from 'react';
import { BackButton } from '@/components/ui';
import { Package, Weight, AlertCircle, Filter } from 'lucide-react';

interface Product {
  productId: number;
  productName: string;
  sku: string;
  size?: string;
  type: 'FG' | 'RM' | 'PM';
  availableQuantity: number;
  reservedQuantity: number;
  availableWeightKg: number;
  reservedWeightKg: number;
  packageCapacityKg: number;
  unit: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'All' | 'FG' | 'RM' | 'PM'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Mock data for demonstration - replace with API call
  const mockProducts: Product[] = [
    {
      productId: 1,
      productName: 'Premium White Paint',
      sku: 'PWP-001',
      size: '20L',
      type: 'FG',
      availableQuantity: 150,
      reservedQuantity: 25,
      availableWeightKg: 3000,
      reservedWeightKg: 500,
      packageCapacityKg: 20,
      unit: 'buckets',
    },
    {
      productId: 2,
      productName: 'Titanium Dioxide',
      sku: 'TD-102',
      type: 'RM',
      availableQuantity: 500,
      reservedQuantity: 100,
      availableWeightKg: 2500,
      reservedWeightKg: 500,
      packageCapacityKg: 0,
      unit: 'kg',
    },
    {
      productId: 3,
      productName: 'Painted Metal Drums',
      sku: 'PMD-50',
      type: 'PM',
      availableQuantity: 200,
      reservedQuantity: 50,
      availableWeightKg: 1600,
      reservedWeightKg: 400,
      packageCapacityKg: 50,
      unit: 'drums',
    },
    {
      productId: 4,
      productName: 'Industrial Black Paint',
      sku: 'IBP-001',
      size: '200L',
      type: 'FG',
      availableQuantity: 30,
      reservedQuantity: 10,
      availableWeightKg: 4500,
      reservedWeightKg: 1500,
      packageCapacityKg: 200,
      unit: 'barrels',
    },
    {
      productId: 5,
      productName: 'Solvent Base Oil',
      sku: 'SBO-001',
      type: 'RM',
      availableQuantity: 100,
      reservedQuantity: 30,
      availableWeightKg: 1000,
      reservedWeightKg: 300,
      packageCapacityKg: 0,
      unit: 'liters',
    },
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const data = await inventoryApi.getAllProducts();
      // setProducts(data);

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const typeMatch = selectedType === 'All' || product.type === selectedType;
    const searchMatch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const stockMatch =
      !showLowStockOnly || product.availableQuantity - product.reservedQuantity < 50;

    return typeMatch && searchMatch && stockMatch;
  });

  const getStatusColor = (available: number, reserved: number): string => {
    const free = available - reserved;
    if (free > 100) return 'bg-green-50 border-green-200';
    if (free > 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusIcon = (available: number, reserved: number) => {
    const free = available - reserved;
    if (free > 100) return '✓';
    if (free > 50) return '⚠';
    return '✗';
  };

  const typeStats = {
    FG: products.filter(p => p.type === 'FG').length,
    RM: products.filter(p => p.type === 'RM').length,
    PM: products.filter(p => p.type === 'PM').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-blue-600" />
              Inventory Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor inventory levels with weight-based capacity tracking
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Package className="w-4 h-4" />
              Total Products
            </div>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            <p className="text-xs text-gray-500 mt-2">Across all types</p>
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 shadow-sm p-4">
            <div className="text-sm text-blue-900 font-medium mb-1">Finished Goods</div>
            <p className="text-3xl font-bold text-blue-600">{typeStats.FG}</p>
            <p className="text-xs text-blue-600 mt-2">FG Products</p>
          </div>

          <div className="bg-purple-50 rounded-lg border border-purple-200 shadow-sm p-4">
            <div className="text-sm text-purple-900 font-medium mb-1">Raw Materials</div>
            <p className="text-3xl font-bold text-purple-600">{typeStats.RM}</p>
            <p className="text-xs text-purple-600 mt-2">RM Products</p>
          </div>

          <div className="bg-orange-50 rounded-lg border border-orange-200 shadow-sm p-4">
            <div className="text-sm text-orange-900 font-medium mb-1">Packaging Materials</div>
            <p className="text-3xl font-bold text-orange-600">{typeStats.PM}</p>
            <p className="text-xs text-orange-600 mt-2">PM Products</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <div className="flex gap-2 flex-wrap">
                {(['All', 'FG', 'RM', 'PM'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'FG'
                      ? 'Finished Goods'
                      : type === 'RM'
                        ? 'Raw Materials'
                        : type === 'PM'
                          ? 'Packaging'
                          : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Product name or SKU..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>

            {/* Low Stock Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showLowStockOnly
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {showLowStockOnly ? '⚠ Low Stock Only' : 'Show All Stock Levels'}
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Product</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">SKU</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      Quantity (Available/Reserved)
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      <div className="flex items-center justify-end gap-1">
                        <Weight className="w-4 h-4" />
                        Weight (kg)
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">
                      Capacity (kg)
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map(product => {
                    const freeQuantity = product.availableQuantity - product.reservedQuantity;
                    const freeWeight = product.availableWeightKg - product.reservedWeightKg;
                    const statusClass = getStatusColor(
                      product.availableQuantity,
                      product.reservedQuantity
                    );

                    return (
                      <tr
                        key={product.productId}
                        className={`${statusClass} border-b hover:opacity-80 transition-opacity`}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{product.productName}</p>
                            <p className="text-xs text-gray-600">
                              {product.size ? `${product.size} • ` : ''}
                              {product.unit}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{product.sku}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              product.type === 'FG'
                                ? 'bg-blue-100 text-blue-700'
                                : product.type === 'RM'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {product.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-medium text-gray-900">
                            {product.availableQuantity.toFixed(1)}
                            <span className="text-gray-600 text-xs ml-1">
                              ({product.reservedQuantity.toFixed(1)} reserved)
                            </span>
                          </div>
                          <p
                            className={`text-xs font-semibold ${
                              freeQuantity > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            Free: {freeQuantity.toFixed(1)}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-medium text-blue-600">
                            {product.availableWeightKg.toFixed(2)}
                            <span className="text-gray-600 text-xs block">
                              {product.reservedWeightKg.toFixed(2)} reserved
                            </span>
                          </div>
                          <p
                            className={`text-xs font-semibold ${
                              freeWeight > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            Free: {freeWeight.toFixed(2)} kg
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {product.packageCapacityKg > 0 ? (
                            <div className="font-semibold text-purple-600">
                              {product.packageCapacityKg.toFixed(2)} kg
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-2xl ${
                              freeQuantity > 100
                                ? 'text-green-600'
                                : freeQuantity > 50
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {getStatusIcon(product.availableQuantity, product.reservedQuantity)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-gray-50 rounded-lg border p-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-gray-900">Legend:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl text-green-600">✓</span>
                <span>High Stock (Free Qty &gt; 100)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-yellow-600">⚠</span>
                <span>Medium Stock (Free Qty: 50-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-red-600">✗</span>
                <span>Low Stock (Free Qty &lt; 50)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
