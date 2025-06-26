// lib/metrics.ts
import { Counter, Histogram, Registry } from 'prom-client';

export const register = new Registry();

// 1. HTTP Request Metrics
export const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 750, 1000, 2000],
});
register.registerMetric(httpRequestDurationMicroseconds);

// 2. Database Query Metrics
export const dbQueryDurationMicroseconds = new Histogram({
  name: 'db_query_duration_ms',
  help: 'Duration of database queries in ms',
  labelNames: ['query_name'],
  buckets: [10, 25, 50, 100, 200, 300, 500, 1000],
});
register.registerMetric(dbQueryDurationMicroseconds);

// 3. Custom Business Metric
export const fallbackDataUsageCounter = new Counter({
  name: 'fallback_data_usage_total',
  help: 'Total number of times fallback data was used',
  labelNames: ['query_name'],
});
register.registerMetric(fallbackDataUsageCounter);