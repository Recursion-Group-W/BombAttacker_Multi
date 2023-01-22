import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBs53kQJAQMjOhndu_tKDHC8-cgrIZxBjk',
  authDomain: 'bombattackermulti.firebaseapp.com',
  projectId: 'bombattackermulti',
  storageBucket: 'bombattackermulti.appspot.com',
  messagingSenderId: '486948311827',
  appId: '1:486948311827:web:8ce6831d2cd03c16b340e6',
};
const app = initializeApp(firebaseConfig)
initializeFirestore(app, {
  ignoreUndefinedProperties: true,
})
const firestore = getFirestore(app)
// const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
