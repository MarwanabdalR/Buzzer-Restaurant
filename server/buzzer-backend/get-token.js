// Quick script to get Firebase ID Token for Postman testing
// Uses Firebase Client SDK with email/password authentication (no Admin SDK needed)

// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyCFoGOtaBBjywycYqZP2Q9hl_L_muh-rTk",
//   authDomain: "buzzer-app-7c135.firebaseapp.com",
//   projectId: "buzzer-app-7c135",
//   storageBucket: "buzzer-app-7c135.firebasestorage.app",
//   messagingSenderId: "222436192124",
//   appId: "1:222436192124:web:48d7af508d26fe54a47ef9",
//   measurementId: "G-TNVHEJL9L9"
// };




// import admin from "firebase-admin";
// import axios from "axios";
// import { readFileSync } from "fs";

// // ⚠️ هام: تأكد أن مسار ملف المفتاح صحيح
// const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json"));

// // 1. ضع الـ Web API Key الخاص بك هنا
// // (تجده في Firebase Console -> Project Settings -> General -> Web API Key)
// const WEB_API_KEY = "AIzaSyCFoGOtaBBjywycYqZP2Q9hl_L_muh-rTk"; 

// // 2. رقم الهاتف الذي أضفته في الـ Console (لأنه هو الـ UID حالياً)
// const uid = "+201090378387"; 

// // تهيئة الفايربيس (لضمان عمل السكريبت بشكل مستقل)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// async function getIdToken() {
//   try {
//     console.log("⏳ Generating custom token for:", uid);
    
//     // أ: نطلب من الأدمن عمل توكن مخصص لهذا الرقم
//     const customToken = await admin.auth().createCustomToken(uid);

//     // ب: نبدل التوكن المخصص بـ ID Token حقيقي يحاكي تسجيل الدخول
//     const res = await axios.post(
//       `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${WEB_API_KEY}`,
//       {
//         token: customToken,
//         returnSecureToken: true,
//       }
//     );

//     console.log("\n✅ SUCCESS! Here is your Firebase ID Token:\n");
//     console.log(res.data.idToken);
//     console.log("\nCopy this token and paste it into Postman (Authorization -> Bearer Token)\n");

//   } catch (error) {
//     console.error("❌ Error:", error.response ? error.response.data : error.message);
//   }
// }

// getIdToken();










import admin from "firebase-admin";
import axios from "axios";
import { readFileSync } from "fs";

// اقرأ الملف
const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json"));

// طباعة للتأكد من هوية المشروع
console.log("------------------------------------------------");
console.log("📂 Using Service Account for Project ID:", serviceAccount.project_id);
console.log("------------------------------------------------");

// ضع المفتاح الصحيح هنا
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