import { useState, useEffect } from 'react';

interface DateRange {
  from: Date;
  to: Date;
}

interface UseApiDataOptions {
  dateRange?: DateRange;
  endpoint: string;
  params?: Record<string, string>;
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiData<T>({ 
  dateRange, 
  endpoint, 
  params = {} 
}: UseApiDataOptions): UseApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const urlParams = new URLSearchParams();
      
      if (dateRange) {
        urlParams.append('from', dateRange.from.toISOString());
        urlParams.append('to', dateRange.to.toISOString());
      }
      
      Object.entries(params).forEach(([key, value]) => {
        urlParams.append(key, value);
      });

      const response = await fetch(`/api/${endpoint}?${urlParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, endpoint, JSON.stringify(params)]);

  return { data, loading, error, refetch: fetchData };
}