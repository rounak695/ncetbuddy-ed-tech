import crypto from 'crypto';

/**
 * Hash a client code using SHA-256
 * @param code - The plain text client code
 * @returns The SHA-256 hash as a hex string
 */
export function hashCode(code: string): string {
    return crypto.createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
}

/**
 * Generate a random client code
 * Format: NCET-XXXX-YYYY-ZZZZ
 * @returns A random client code
 */
export function generateCode(): string {
    const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const part3 = crypto.randomBytes(2).toString('hex').toUpperCase();

    return `NCET-${part1}-${part2}-${part3}`;
}

/**
 * Get hint (last 4 characters) from a code
 * @param code - The plain text client code
 * @returns Last 4 characters
 */
export function getCodeHint(code: string): string {
    return code.slice(-4);
}
