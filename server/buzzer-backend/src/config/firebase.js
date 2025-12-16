import admin from 'firebase-admin';
import { createRequire } from 'module';
import path from 'path';

// Load service account JSON (located at project root: serviceAccountKey.json)
const require = createRequire(import.meta.url);
const serviceAccountPath = path.resolve('serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

