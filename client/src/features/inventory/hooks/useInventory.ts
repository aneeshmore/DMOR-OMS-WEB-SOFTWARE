import { useState, useEffect } from 'react';
import { inventoryApi } from '../api';
import { Product, StockLedger } from '../types';

export const useProducts = (filters?: { productType?: string; isActive?: boolean }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getAllProducts(filters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters?.productType, filters?.isActive]);

  return { products, loading, error, refetch: fetchProducts };
};

export const useProduct = (productId: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error, refetch: fetchProduct };
};

export const useStockLedger = (productId: number, limit = 100) => {
  const [ledger, setLedger] = useState<StockLedger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLedger = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getStockLedger(productId, limit);
      setLedger(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchLedger();
    }
  }, [productId, limit]);

  return { ledger, loading, error, refetch: fetchLedger };
};
