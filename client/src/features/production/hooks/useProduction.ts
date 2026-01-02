import { useState, useEffect } from 'react';
import { productionApi } from '../api';
import { ProductionBatch } from '../types';

export const useProductionBatches = (filters?: { status?: string }) => {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productionApi.getAllBatches(filters);
      setBatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch production batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [filters?.status]);

  return { batches, loading, error, refetch: fetchBatches };
};

export const useProductionBatch = (batchId: string) => {
  const [batch, setBatch] = useState<ProductionBatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productionApi.getBatchById(batchId);
      setBatch(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch production batch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchBatch();
    }
  }, [batchId]);

  return { batch, loading, error, refetch: fetchBatch };
};
