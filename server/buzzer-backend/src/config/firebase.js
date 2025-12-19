import admin from 'firebase-admin';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const serviceAccountPath = path.resolve('serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

