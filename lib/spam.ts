import { LRUCache } from "lru-cache";

interface SpamCheckInput {
    ip: string;
    userAgent: string;
    origin: string;
    body: any;
    allowedDomains: string[];
    honeypotField?: string; // Name of the honeypot field in the body
}

interface SpamCheckResult {
    isSpam: boolean;
    reason?: string;
}

// Memory-safe rate limiter using LRU Cache
// Fixes critical memory leak from unbounded Map
const rateLimitCache = new LRUCache<string, number>({
    max: 5000, // Max 5000 unique IPs tracked
    ttl: 60 * 1000, // 1 minute TTL per IP
    allowStale: false,
});

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute (avg 12s gap)

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const lastRequestTime = rateLimitCache.get(ip) || 0;

    // Enforce minimum gap between requests (Throttle)
    // 60s / 5 reqs = 12s gap
    const minGap = RATE_LIMIT_WINDOW / MAX_REQUESTS_PER_WINDOW;

    if (now - lastRequestTime < minGap) {
        // Too fast
        return false;
    }

    rateLimitCache.set(ip, now);
    return true;
}

export async function checkSpam(input: SpamCheckInput): Promise<SpamCheckResult> {
    // 1. Allowed Domain / Origin Check
    if (input.allowedDomains && input.allowedDomains.length > 0) {
        const originDomain = input.origin ? new URL(input.origin).hostname : null;

        // Normalize allowed domains to hostnames
        const allowedHostnames = input.allowedDomains.map(d => {
            try {
                // If it contains protocol, parse as URL
                if (d.startsWith("http://") || d.startsWith("https://")) {
                    return new URL(d).hostname;
                }
                return d.trim();
            } catch {
                return d.trim();
            }
        });

        if (!originDomain || !allowedHostnames.includes(originDomain)) {
            // Allow localhost for testing if needed, or strictly enforce
            // We check against the RAW origin domain here
            if (originDomain !== 'localhost' && originDomain !== '127.0.0.1') {
                return { isSpam: true, reason: `Origin not allowed: ${originDomain}` };
            }
        }
    }

    // 2. Honeypot Check
    if (input.honeypotField && input.body[input.honeypotField]) {
        return { isSpam: true, reason: "Honeypot filled" };
    }

    // 3. Rate Limiting
    if (!checkRateLimit(input.ip)) {
        return { isSpam: true, reason: "Rate limit exceeded" };
    }

    return { isSpam: false };
}
