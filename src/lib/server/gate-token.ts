import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export interface GateTokenPayload {
    codeDocId: string;
    iat: number;
    exp: number;
}

/**
 * Generate a gate token (JWT) for educator code verification
 * @param codeDocId - The Appwrite document ID of the educator code
 * @returns Signed JWT token
 */
export function generateGateToken(codeDocId: string): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: GateTokenPayload = {
        codeDocId,
        iat: now,
        exp: now + (10 * 60), // 10 minutes
    };

    return jwt.sign(payload, JWT_SECRET);
}

/**
 * Verify and decode a gate token
 * @param token - The JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyGateToken(token: string): GateTokenPayload | null {
    try {
        const payload = jwt.verify(token, JWT_SECRET) as GateTokenPayload;
        return payload;
    } catch (err) {
        return null;
    }
}
