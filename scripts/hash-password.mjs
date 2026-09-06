// Usage: node scripts/hash-password.mjs "yourPasswordHere"
// Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in .env.local
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs \"yourPassword\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nAdd this to your .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
