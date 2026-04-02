const crypto = require('crypto');

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 32000000 };
const KEY_LEN = 32;

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(password, storedHashAndSalt) {
  try {
    const [saltHex, hashHex] = storedHashAndSalt.split(':');
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, 'hex');
    const storedHash = Buffer.from(hashHex, 'hex');
    const computedHash = crypto.scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS);
    return crypto.timingSafeEqual(storedHash, computedHash);
  } catch {
    return false;
  }
}

const p = "jimeGLORIA";
const h = hashPassword(p);
console.log("Hash format:", h);
console.log("Verify correct:", verifyPassword(p, h));
console.log("Verify incorrect:", verifyPassword(p + "1", h));
