import React, { useEffect, useState } from 'react';
import { inventoryApi } from '@/features/inventory/api/inventoryApi';
import { Product } from '@/features/inventory/types';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { showToast } from '@/utils/toast';

interface ProductSelectProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  filter?: {
    isActive?: boolean;
    productType?: 'RM' | 'FG';
  };
}

export const ProductSelect: React.FC<ProductSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select Product',
  disabled = false,
  className = '',
  filter = { isActive: true, productType: 'FG' },
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await inventoryApi.getAllProducts({ isActive: filter.isActive });

        // Filter by product type if specified
        let filteredData = data;
        if (filter.productType) {
          filteredData = data.filter((p: Product) => p.productType === filter.productType);
        }

        setProducts(filteredData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        showToast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter.isActive, filter.productType]);

  const options = products.map(p => ({
    id: p.productId,
    label: p.productName,
    subLabel: `Price: ₹${p.sellingPrice || 0}`,
    value: p.productId,
  }));

  return (
    <SearchableSelect
      options={options}
      value={typeof value === 'number' ? value : undefined}
      onChange={onChange}
      placeholder={loading ? 'Loading...' : placeholder}
      disabled={disabled || loading}
      className={className}
    />
  );
};
