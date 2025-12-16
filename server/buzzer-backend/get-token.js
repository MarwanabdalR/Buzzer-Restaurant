
import admin from "firebase-admin";
import axios from "axios";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json"));

console.log("------------------------------------------------");
console.log("📂 Using Service Account for Project ID:", serviceAccount.project_id);
console.log("------------------------------------------------");

const WEB_API_KEY = "AIzaSyCFoGOtaBBjywycYqZP2Q9hl_L_muh-rTk"; 
const uid = "+201090378387"; 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function getIdToken() {
  try {
    console.log("⏳ Generating custom token...");
    const customToken = await admin.auth().createCustomToken(uid);

    console.log("🔄 Exchanging for ID Token...");
    const res = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${WEB_API_KEY}`,
      {
        token: customToken,
        returnSecureToken: true,
      }
    );

    console.log("\n✅ SUCCESS! Token:\n", res.data.idToken);

  } catch (error) {
    console.error("❌ Error Detail:", error.response ? error.response.data.error.message : error.message);
    
    if (error.response && error.response.data.error.message === 'INVALID_CUSTOM_TOKEN') {
        console.log("\n💡 Hint: Your 'serviceAccountKey.json' and 'WEB_API_KEY' belong to different Firebase projects.");
    }
  }
}

getIdToken();