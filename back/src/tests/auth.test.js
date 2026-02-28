import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: '../.env'});
const JWT_SECRET=process.env.JWT_SECRET;

describe('Auth Utilities', () => {
    
    // Hashes a plain password, then checks two things — the hash is different from the original (not stored as plaintext), and bcrypt can correctly verify the original password against that hash.
    test('bcrypt should hash a password', async () => {
        const password = 'testpassword123';
        const hash = await bcrypt.hash(password, 10);
        expect(hash).not.toBe(password);
        expect(await bcrypt.compare(password, hash)).toBe(true);
    });

    // Verifies that a wrong password doesn't match the hash
    test('bcrypt should reject wrong password', async () => {
        const hash = await bcrypt.hash('correctpassword', 10);
        expect(await bcrypt.compare('wrongpassword', hash)).toBe(false);
    });

    // Creates a token with a payload, verifies it, and checks the decoded data matches what was put in. 
    test('jwt should sign and verify a token', () => {
        const payload = { id: '123', username: 'testuser' };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        const decoded = jwt.verify(token, JWT_SECRET);
        expect(decoded.id).toBe('123');
        expect(decoded.username).toBe('testuser');
    });

    test('jwt should reject an invalid token', () => {
        expect(() => jwt.verify('invalidtoken', JWT_SECRET)).toThrow();
    });
});