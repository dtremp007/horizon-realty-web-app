// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "horizon-real-estate-30201.firebaseapp.com",
  projectId: "horizon-real-estate-30201",
  storageBucket: "horizon-real-estate-30201.appspot.com",
  messagingSenderId: "250239391190",
  appId: "1:250239391190:web:174d6257035100f5664077",
  measurementId: "G-1S2J4Q75G1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

const EMULATORS_STARTED = "EMULATORS_STARTED";
/**
 * Every time Next reloads, a new instance of the app is create, causing an error. Hopefully this will fix it.
 * @see https://stackoverflow.com/a/68128826/18981949
 */
function startEmulators() {
  if (!global[EMULATORS_STARTED]) {
    global[EMULATORS_STARTED] = true;
    connectFirestoreEmulator(db, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectStorageEmulator(storage, "localhost", 9199);
  }
}

// if (process.env.NODE_ENV === "development") {
//   startEmulators();
// }
