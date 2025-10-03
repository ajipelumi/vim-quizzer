import { NextApiRequest, NextApiResponse } from "next";

interface SecurityHeaders {
  [key: string]: string;
}

export class SecurityManager {
  /**
   * Get client IP address from request headers
   */
  public static getClientIP(req: NextApiRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    const realIP = req.headers["x-real-ip"];
    const remoteAddress =
      req.connection?.remoteAddress || req.socket?.remoteAddress;

    if (Array.isArray(forwarded)) {
      return forwarded[0] || "unknown";
    } else if (forwarded && typeof forwarded === "string") {
      return forwarded.split(",")[0]?.trim() || "unknown";
    } else if (realIP) {
      return Array.isArray(realIP) ? realIP[0] || "unknown" : realIP;
    } else if (remoteAddress && typeof remoteAddress === "string") {
      return remoteAddress;
    }

    return "unknown";
  }

  /**
   * Validate and sanitize input strings
   */
  public static sanitizeInput(input: string): string {
    if (typeof input !== "string") {
      return "";
    }

    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/['"]/g, "") // Remove quotes
      .substring(0, 1000); // Limit length
  }

  /**
   * Check if IP is from a trusted source (localhost, private networks)
   */
  public static isTrustedIP(ip: string): boolean {
    if (ip === "unknown" || ip === "::1" || ip === "127.0.0.1") {
      return true;
    }

    // Check for private network ranges
    const privateRanges = [
      /^10\./, // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./, // 192.168.0.0/16
    ];

    return privateRanges.some((range) => range.test(ip));
  }

  /**
   * Generate security headers for responses
   */
  public static getSecurityHeaders(): SecurityHeaders {
    return {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self';",
    };
  }

  /**
   * Validate request headers for potential attacks
   */
  public static validateRequest(req: NextApiRequest): {
    valid: boolean;
    reason?: string;
  } {
    const userAgent = req.headers["user-agent"];
    const contentType = req.headers["content-type"];

    // Check for suspicious user agents
    if (userAgent) {
      const suspiciousPatterns = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /curl/i,
        /wget/i,
      ];

      // Allow some legitimate bots but block suspicious ones
      if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
        return { valid: false, reason: "Suspicious user agent" };
      }
    }

    // Validate content type for POST requests
    if (req.method === "POST" && contentType) {
      const allowedTypes = [
        "application/json",
        "application/x-www-form-urlencoded",
      ];
      if (!allowedTypes.includes(contentType)) {
        return { valid: false, reason: "Invalid content type" };
      }
    }

    return { valid: true };
  }

  /**
   * Log security events
   */
  public static logSecurityEvent(
    event: string,
    details: Record<string, unknown>,
    req?: NextApiRequest
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      ip: req ? this.getClientIP(req) : "unknown",
      userAgent: req?.headers["user-agent"] || "unknown",
    };

    console.warn("SECURITY_EVENT:", JSON.stringify(logEntry));
  }
}

/**
 * Middleware to add security headers to responses
 */
export function addSecurityHeaders(res: NextApiResponse): void {
  const headers = SecurityManager.getSecurityHeaders();

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

/**
 * Middleware to validate requests
 */
export function validateRequest(req: NextApiRequest): {
  valid: boolean;
  reason?: string;
} {
  return SecurityManager.validateRequest(req);
}
