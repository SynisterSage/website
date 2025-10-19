// Rate limiting utility for API endpoints
// Prevents abuse and brute force attacks

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (resets on cold start, which is acceptable for serverless)
const store: RateLimitStore = {};

// Cleanup function to remove expired entries (called on-demand instead of setInterval)
function cleanupStore() {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}

export interface RateLimitConfig {
  windowMs?: number;  // Time window in milliseconds (default: 60000 = 1 minute)
  max?: number;        // Max requests per window (default: 5)
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check if request is rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const windowMs = config.windowMs || 60000; // 1 minute default
  const max = config.max || 5; // 5 requests per window default
  const now = Date.now();

  // Cleanup expired entries periodically (every ~10th request)
  if (Math.random() < 0.1) {
    cleanupStore();
  }

  // Get or create rate limit entry
  if (!store[identifier] || store[identifier].resetTime < now) {
    store[identifier] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  const entry = store[identifier];
  entry.count++;

  const remaining = Math.max(0, max - entry.count);
  const allowed = entry.count <= max;
  const retryAfter = allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000);

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
    retryAfter,
  };
}

/**
 * Get client identifier from request
 * Uses IP address as primary identifier
 */
export function getClientIdentifier(req: any): string {
  // Try to get real IP from various headers (Vercel provides these)
  const forwarded = req.headers['x-forwarded-for'];
  const real = req.headers['x-real-ip'];
  const cfIp = req.headers['cf-connecting-ip'];
  
  let ip = cfIp || real || forwarded || req.connection?.remoteAddress || 'unknown';
  
  // If forwarded-for has multiple IPs, use the first one
  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  
  return ip;
}

/**
 * Input validation helpers
 */

export function sanitizeEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.trim().toLowerCase();
  
  if (!emailRegex.test(sanitized) || sanitized.length > 254) {
    return null;
  }
  
  return sanitized;
}

export function sanitizeString(str: string, maxLength = 1000): string | null {
  if (typeof str !== 'string') return null;
  
  const sanitized = str.trim();
  
  if (sanitized.length === 0 || sanitized.length > maxLength) {
    return null;
  }
  
  // Remove potentially dangerous characters
  return sanitized.replace(/[<>]/g, '');
}

export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Security headers helper
 */
export function setSecurityHeaders(res: any): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
}

/**
 * CORS helper for API endpoints
 */
export function setCorsHeaders(res: any, allowedOrigin?: string): void {
  const origin = allowedOrigin || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://aferguson.art';
    
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}
