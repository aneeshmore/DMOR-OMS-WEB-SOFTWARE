import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AvailabilityData {
  productId: number;
  productName: string;
  packageCapacityKg: number;
  direct: {
    availableQuantity: number;
    availableWeightKg: number;
    availablePackages: number;
    percentageFilled: number;
  };
  total: {
    totalQuantity: number;
    totalWeightKg: number;
  };
  reserved: {
    reservedQuantity: number;
    reservedWeightKg: number;
  };
  net: {
    netQuantity: number;
    netWeightKg: number;
  };
}

interface Props {
  availability: AvailabilityData;
  requiredWeightKg?: number;
}

export function InventoryAvailabilityCard({ availability, requiredWeightKg }: Props) {
  const [fulfillmentStatus, setFulfillmentStatus] = useState<{
    type: 'AVAILABLE' | 'PARTIAL' | 'INSUFFICIENT';
    message: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    if (requiredWeightKg) {
      const directAvailable = availability.direct.availableWeightKg;

      if (directAvailable >= requiredWeightKg) {
        setFulfillmentStatus({
          type: 'AVAILABLE',
          message: `Available in exact capacity (Surplus: ${(directAvailable - requiredWeightKg).toFixed(2)}kg)`,
          color: 'bg-green-50 border-green-200',
        });
      } else if (directAvailable > 0) {
        setFulfillmentStatus({
          type: 'PARTIAL',
          message: `Available in different capacities (Shortfall: ${(requiredWeightKg - directAvailable).toFixed(2)}kg)`,
          color: 'bg-yellow-50 border-yellow-200',
        });
      } else {
        setFulfillmentStatus({
          type: 'INSUFFICIENT',
          message: `No direct availability (Required: ${requiredWeightKg.toFixed(2)}kg)`,
          color: 'bg-red-50 border-red-200',
        });
      }
    }
  }, [availability, requiredWeightKg]);

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{availability.productName}</h3>
              <p className="text-xs text-gray-600">
                Capacity: {availability.packageCapacityKg}kg per package
              </p>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Fulfillment Status */}
        {fulfillmentStatus && (
          <div className={`border rounded-lg p-3 ${fulfillmentStatus.color}`}>
            <div className="flex items-start gap-2">
              <AlertTriangle
                className={`w-4 h-4 mt-0.5 ${
                  fulfillmentStatus.type === 'AVAILABLE'
                    ? 'text-green-600'
                    : fulfillmentStatus.type === 'PARTIAL'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              />
              <p
                className={`text-sm ${
                  fulfillmentStatus.type === 'AVAILABLE'
                    ? 'text-green-900'
                    : fulfillmentStatus.type === 'PARTIAL'
                      ? 'text-yellow-900'
                      : 'text-red-900'
                }`}
              >
                {fulfillmentStatus.message}
              </p>
            </div>
          </div>
        )}

        {/* Direct Availability (Exact Capacity) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Direct Availability
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-gray-600 text-xs">Packages Available</p>
              <p className="font-bold text-lg text-green-900">
                {availability.direct.availablePackages}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-gray-600 text-xs">Weight (kg)</p>
              <p className="font-bold text-lg text-green-900">
                {availability.direct.availableWeightKg.toFixed(2)}
              </p>
            </div>
            {availability.direct.percentageFilled > 0 && (
              <div className="bg-green-100 p-3 rounded col-span-2">
                <p className="text-gray-600 text-xs mb-1">Partial Package Filled</p>
                <div className="w-full bg-green-200 rounded h-2">
                  <div
                    className="bg-green-600 h-2 rounded"
                    style={{ width: `${availability.direct.percentageFilled}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-900 mt-1">
                  {availability.direct.percentageFilled.toFixed(1)}% of capacity
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Net Available (Available - Reserved) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Net Available (Unreserved)
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-gray-600 text-xs">Quantity</p>
              <p className="font-bold text-lg text-blue-900">
                {availability.net.netQuantity.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-gray-600 text-xs">Weight (kg)</p>
              <p className="font-bold text-lg text-blue-900">
                {availability.net.netWeightKg.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Breakdown */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Inventory Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Total Quantity:</span>
              <span className="font-medium">{availability.total.totalQuantity.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Total Weight:</span>
              <span className="font-medium">{availability.total.totalWeightKg.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded text-yellow-900">
              <span>Reserved Weight:</span>
              <span className="font-medium">
                {availability.reserved.reservedWeightKg.toFixed(2)} kg
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded text-green-900">
              <span>Unreserved Weight:</span>
              <span className="font-medium">{availability.net.netWeightKg.toFixed(2)} kg</span>
            </div>
          </div>
        </div>

        {/* Capacity Visualization */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Capacity Status</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Overall Utilization</span>
                <span>
                  {(
                    (availability.reserved.reservedWeightKg / availability.total.totalWeightKg) *
                      100 || 0
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${(availability.reserved.reservedWeightKg / availability.total.totalWeightKg) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-center mt-2">
              {availability.reserved.reservedWeightKg.toFixed(2)}kg reserved of{' '}
              {availability.total.totalWeightKg.toFixed(2)}kg total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryAvailabilityCard;
