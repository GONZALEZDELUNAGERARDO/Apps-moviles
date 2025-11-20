import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwDF7cWezDqslzNzqQscc4XCGOuX3aG-M",
  authDomain: "fir-js-c9eaa.firebaseapp.com",
  projectId: "fir-js-c9eaa",
  storageBucket: "fir-js-c9eaa.firebasestorage.app",
  messagingSenderId: "215051378356",
  appId: "1:215051378356:web:0747fe043f9d64f88081e1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
